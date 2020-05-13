const rp = require('request-promise');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const lastFM = require('./lastFMData');
const db = require('./database');
const url = 'https://docs.google.com/spreadsheets/u/0/d/1AxdZWBLQxVGNP9jtF1P-wqUcrcrJ8dQo9a9uTbLg8fY/htmlview?fbclid=IwAR3umexd0zhLyHXJqDc_5-f1j5FY_bBZ6nQDH2XCgImoglCEz_B0rH15zs8';

function parseDate(date) {
    let year = new Date().getFullYear();
    date = new Date(date + ' ' + year);
    let hour = date.getHours();
    date.setHours(hour + 3);
    return date;
}

function formatJson(data, row) {
    let start = parseDate(data[0][row]);
    let artist = data[2][row].replace(/ *\([^)]*\) */g, "");
    let streamData = {
        start: start,
        event: data[1][row],
        artist: artist,
        platform: (data[3][row] === '') ? null : data[3][row],
        link: data[4][row],
        tags: [],
        img: null,
        festival: null,
        listeners: null
    };
    lastFM.getArtistInfo(streamData)
        .then(updatedData => {
            db.insertOne("current-streams", updatedData);
        });
}

function scrape($) {
    cheerioTableparser($);
    let data = $(".waffle").first().parsetable(false, false, true);
    return data
}

db.deleteAll();
rp(url)
    .then(function(html) {
        const $ = cheerio.load(html);
        let data = scrape($);
        data = data.slice(1, 6);
        let i = 3;
        while (data[0][i] !== "") {
            formatJson(data, i);
            i++;
        }
    })
    .catch(function(err) {
        //handle error
    });