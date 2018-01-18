const express = require('express')
const serveur = express()
const http = require('http').Server(serveur);
const cp = require('child_process')
const fs = require('fs')
const soundcloud_dl = require(__dirname + '/soundcloud-dl.js')
const vimeo_dl = require(__dirname + '/vimeo-dl.js')
const ID_CLIENT = "UytiOw5CoZz7YuKteRrXYZQcGjwGohXl"

const io = require('socket.io')(http);
let SOCKET = null;

serveur.set('view engine', 'ejs')
serveur.set('views', __dirname + '/views')

serveur.use('/img', express.static(__dirname + '/img'))

serveur.get('/', (req, res) => {
  res.render('accueil', {})
})



io.on('connection', function(socket){
    SOCKET = socket;
});

//http://127.0.0.1:3000/download?platform=youtube&v=B7bqAsxee4I&name=coco
serveur.get('/download', (req, res) => {
  //console.log(req.query)
  if (req.query.platform == 'youtube') {
    if (req.query.v != undefined && req.query.name != undefined && req.query.name.length >= 1 && req.query.v.length >= 1) {
      let cmd = 'ytdl --filter audioonly https://www.youtube.com/watch?v='+req.query.v+' > '+req.query.v+'.mp4'
      //console.log(cmd)
      fs.readdir(__dirname + '/dls', (err, files) => {
        if (err) throw err
        let exists = false
        let mp4name = req.query.v+'.mp4'
        for (let file of files) {
          if (file == mp4name) exists = true
        }
        if (!exists) {
          cp.exec(cmd, {cwd: __dirname+'/dls'}, (error, stdout, stderr) => {
            if (error) throw error
            cp.exec('ffmpeg -i '+req.query.v+'.mp4 '+req.query.v+'.wav', {cwd: __dirname+'/dls'}, (error, stdout, stderr) => {
              if (error) throw error
              SOCKET.emit("download_done");
              res.download(__dirname + '/dls/'+req.query.v+'.wav', req.query.name+'.wav')
            })
          })
        } else {
          SOCKET.emit("download_done");
          res.download(__dirname + '/dls/'+req.query.v+'.wav', req.query.name+'.wav')
        }
      })
    }
    else res.sendStatus(404)
  } else if (req.query.platform == 'soundcloud') {
    if (req.query.tid != undefined && req.query.name != undefined && req.query.name.length >= 1 && req.query.tid.length >= 1) {
      fs.readdir(__dirname + '/scloud-dls', (err, files) => {
        if (err) throw err
        let exists = false
        let mp3name = req.query.tid+'.mp3'
        for (let file of files) {
          if (file == mp3name) exists = true
        }
        if (!exists) {
          let url = 'https://api.soundcloud.com/i1/tracks/'+req.query.tid+'/streams?client_id='+ID_CLIENT
          soundcloud_dl.getURLStream(url, req.query.tid, () => {
            cp.exec('ffmpeg -i '+req.query.tid+'.mp3 '+req.query.tid+'.wav', {cwd: __dirname+'/scloud-dls'}, (error, stdout, stderr) => {
              if (error) throw error
                SOCKET.emit("download_done");
                res.download(__dirname + '/scloud-dls/'+req.query.tid+'.wav', req.query.name+'.wav')
            })
          })
        } else {
          SOCKET.emit("download_done");
          res.download(__dirname + '/scloud-dls/'+req.query.tid+'.wav', req.query.name+'.wav')
        }
      })
    }
    else res.sendStatus(404)
  } else if (req.query.platform == 'vimeo') {
    if (req.query.link != undefined && req.query.name != undefined && req.query.name.length >= 1 && req.query.link.length >= 1) {
      let id = req.query.link.split('/')
      id = id[id.length - 1]
      let url = 'https://vimeo.com/'+id
      fs.readdir(__dirname + '/vim-dls', (err, files) => {
        if (err) throw err
        let exists = false
        let mp4name = id+'.mp4'
        for (let file of files) {
          if (file == mp4name) exists = true
        }
        if (!exists) {
          vimeo_dl.getURL(url, id, () => {
            cp.exec('ffmpeg -i '+id+'.mp4 '+id+'.wav', {cwd: __dirname+'/vim-dls'}, (error, stdout, stderr) => {
              if (error) throw error
              SOCKET.emit("download_done");
              res.download(__dirname + '/vim-dls/'+id+'.wav', req.query.name+'.wav')
            })
          })
        } else {
          SOCKET.emit("download_done");
          res.download(__dirname + '/vim-dls/'+id+'.wav', req.query.name+'.wav')
        }
      })
    }
    else res.sendStatus(404)
  }
  else res.sendStatus(404)
})



serveur.get('/sc_search', (req, res) => {
  let q
  if (req.query.q == undefined) q = ''
  else q = req.query.q
  soundcloud_dl.getList(q, (resu) => {
    res.send(resu)
  })
})

serveur.get('/vim_search', (req, res) => {
  let q
  if (req.query.q == undefined) q = ''
  else q = req.query.q
  vimeo_dl.makeRequest(vimeo_dl.lib, q, (resu) => {
    res.send(resu)
  })
})


serveur.get('*', (req, res) => {
  res.sendStatus(404)
})

http.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000')
})
