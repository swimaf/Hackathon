var ID_CLIENT = "UytiOw5CoZz7YuKteRrXYZQcGjwGohXl";
var request = require('request');
var https = require('https');
var fs = require('fs');


function getList(q, callback) {
    var urlBase = "https://api.soundcloud.com/tracks?q="+q+"&format=json&client_id="+ID_CLIENT;
    request(urlBase, function (error, response, body) {
        //var tracks = JSON.parse(body);
        //var url = "https://api.soundcloud.com/i1/tracks/"+tracks[0].id+"/streams?client_id="+ID_CLIENT;
        //getURLStream(url);
        callback(body)
    });
}

function getURLStream(url, name, callback) {
    request(url, function (error, response, body) {
        var res = JSON.parse(body);
        //console.log(res.http_mp3_128_url);
        //dl la musique
        downloadFile(res.http_mp3_128_url, name, callback);
    });
}


function downloadFile(url, name, callback) {
    var file = fs.createWriteStream(__dirname + '/scloud-dls/' + name + '.mp3');
    var request = https.get(url, function(response) {
      response.pipe(file).on('finish', () => {callback()})
    });
}

exports.getList = getList
exports.getURLStream = getURLStream
