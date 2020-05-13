require('dotenv').config();
const axios = require('axios');

function checkArtist(fmName, streamName) {
    if (fmName.toLowerCase() === streamName.toLowerCase()) {
        return fmName;
    } else {
        return streamName;
    }
}

function getTags(tags) {
    let tagNames = [];
    tags.forEach(tag => {
        tagNames.push(tag.name);
    });
    return tagNames;
}

function getImage(images) {
    let imgLink = null;
    images.forEach(image => {
        if (image.size === 'large') {
            imgLink = image["#text"];
        }
    });
    return imgLink;
}

function addData(data, streamData) {
    if (typeof data !== 'undefined') {
        streamData.artist = checkArtist(streamData.artist, data.name);
        streamData.tags = getTags(data.tags.tag);
        streamData.listeners = data.stats.listeners;
        streamData.img = getImage(data.image);
    }
    return streamData;
}


module.exports = {
    getArtistInfo: function(streamData) {
        let lastFMKey = process.env.LFM_KEY;
        let url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${streamData.artist}&api_key=${lastFMKey}&format=json`;
        return axios.get(url)
            .then(response => {
                let data = response.data.artist;
                return addData(data, streamData);
            })
            .catch(error => {
                console.log(error);
            });
    }
};