const express = require('express');
const app = express();
const http = require('http').Server(app);
const config = require('./config');

const io = require('socket.io')(http, {
  cors: {
    origin: `http://${config[process.env['ENV']].host}`,
    methods: ["GET", "POST"]
  }  
});
const mpd = require('mpd2');
const path = require('path');
const cors = require('cors')

const mpd_config = {
    host: '192.168.0.126',
    port: 6600
}

let client;

app.use(cors())

app.use('/', express.static('webapp/build'));

app.get('/api/database', async (req, res) => {
  const files = await lsDirs();
  res.json(files);
});

app.get('/api/stats', async (req, res) => {
  const stats = await client.sendCommand('stats').then(mpd.parseObject);
  res.json(stats);
});

app.get('/socket.io.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules/socket.io/client-dist/socket.io.min.js'));
});

io.on('connection', async (socket) => {
    const currentsong = await client.sendCommand('currentsong').then(mpd.parseObject);
    socket.emit('change', currentsong);

    client.on('system-player', async () => {
        const currentsong = await client.sendCommand('currentsong').then(mpd.parseObject);
        socket.emit('change', currentsong);
    });

    socket.on('queueSong', async (file) => {
      client.sendCommand(`add "${file}"`).then(mpd.parseObject);   
    });

    socket.on('queueAlbum', async (album) => {
      client.sendCommand(`add "${album}"`).then(mpd.parseObject);   
    });
});

http.listen(3001, async () => {
  console.log('listening on *:3001');
  client = await mpd.connect(mpd_config);
});

async function lsDirs() {
  var files = [];

  async function lsDir(directory) {  
    let lsinfo = []
    try {
      lsinfo = await client.sendCommand(`lsinfo "${directory}"`).then(mpd.parseList);
    } catch(e) {
      console.log(directory)
    }
    
    for(const item of lsinfo) {
      if (item.directory) {
        await lsDir(item.directory);
      }
      else {
        files.push(item);
      }
    }
  }

  await lsDir('');

  return files;

}