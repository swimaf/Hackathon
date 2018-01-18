var Vimeo = require('vimeo').Vimeo;
var request = require('request');
const fs = require('fs')
const https = require('https')

function makeRequest(lib, q, callback) {
    // Make an API request
    lib.request({
        // This returns the first page of videos containing the term "myquery".
	// These videos will be sorted by most relevant to least relevant
        path : '/videos',
        query : {
            page : 1,
            per_page : 10,
            query : q,
            sort : 'relevant',
            direction : 'asc'
        }
    }, function (error, body, status_code, headers) {
        if (error) {
            /*console.log('error');
            console.log(error);*/
        } else {
            /*console.log('body');
            console.log(body);*/
            callback(body)
        }

        /*console.log('status code');
        console.log(status_code);
        console.log('headers');
        console.log(headers);*/
    });
}

var lib = new Vimeo("a4770ac9782e7ddfd4b39d69eaf6bd346098e1ae", "96TAr5tP+xtxTfXkKB87dM1I1LlwMcya8vJtVjA3+4pgyZhVQk5q/WwyZ6PcAFZpgnuiQdzKt0+G2ARsHGGNllyhF9P3FEkagFaC1gfZyZOX6WfCSD+E+x+NXIYSx243");


lib.generateClientCredentials('public', function (err, access_token) {
    if (err) {
        throw err;
    }

    // Assign the access token to the library
    lib.access_token = access_token.access_token;
   // makeRequest(lib);
});

function getURL(url, name, callback) {
    request(url, function (error, response, body) {
        var re = /\"config_url\":\"(.*)\"/i;
        var t = body.match(re);
        var config = t[1].split("\"")[0].replace(/\\/g, "");
        //console.log(config);
        getMP4(config, name, callback);
    });
}

function getMP4(url, name, callback) {
    request(url, function (error, response, body) {
        //console.log(body)
        var json = JSON.parse(body);
        //console.log(json.request.files.progressive[0].url);
        var file = fs.createWriteStream(__dirname + '/vim-dls/' + name + '.mp4');
        var request = https.get(json.request.files.progressive[0].url, function(response) {
          response.pipe(file).on('finish', () => {callback()})
        });
    });
}

exports.lib = lib
exports.makeRequest = makeRequest
exports.getURL = getURL
/*
makeRequest(lib, 'casablanca', (res) => {
  //console.log(res)
  let r = eval(res)
  for (let result of r.data) {
    console.log('-----')
    console.log(result.name)
    console.log(result.description)
    console.log(result.link)
    console.log('-----')
  }
})*/
