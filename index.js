const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser')
const session = require('express-session')
// const compression = require('compression')
// const fs = require('fs');
// const cors = require('cors')
const uppy = require('@uppy/companion')

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT;


// app.use(compression())
// app.use(cors())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const DOMAIN = process.env.DOMAIN;
const host = DOMAIN.split('://')[1]
const protocol = DOMAIN.split('://')[0]

// if (!fs.existsSync('/tmp')) fs.mkdirSync('/tmp');
// if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

const options = {
  providerOptions: {
    s3: {
      getKey: (req, filename) => Date.now() + '_' + filename,
      bucket: process.env.BUCKET_NAME,
      region: process.env.BUCKET_REGION,
      key: process.env.USER_ACCESS_KEY,
      secret: process.env.USER_SECRET_KEY
    },
    // instagram: {
    //   key: process.env.INSTAGRAM_KEY,
    //   secret: process.env.INSTAGRAM_SECRET
    // },
    // drive: {
    //   key: process.env.GOOGLE_KEY,
    //   secret: process.env.GOOGLE_SECRET
    // },
    // dropbox: {
    //   key: process.env.DROPBOX_KEY,
    //   secret: process.env.DROPBOX_SECRET
    // },
    searchProviders: {
      unsplash: {
        key: process.env.UNSPLASH_API_KEY,
        secret: process.env.UNSPLASH_API_SECRET,
      },
    }
  },
  server: {
    host: host,
    protocol: protocol
  },
  filePath: '/tmp',
  secret: process.env.UPPY_SECRET
}

app.use(uppy.app(options))



app.get('/', (req, res) => res.send('Lambda'));
app.get('/tt', (req, res) => res.send('fef'));

if (process.env.ENVIRONMENT === 'production') {
  exports.handler = serverless(app);
} else {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
}