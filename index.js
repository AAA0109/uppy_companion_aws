const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser')
const session = require('express-session')
const compression = require('compression')
const uppy = require('@uppy/companion')

const port = process.env.PORT || 3111;
const app = express();


app.use(compression())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const host = process.env.DOMAIN.split('://')[1]
const protocol = process.env.DOMAIN.split('://')[0]

const options = {
  providerOptions: {
    s3: {
      getKey: (req, filename) => filename,
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION
    },
    instagram: {
      key: process.env.INSTAGRAM_KEY,
      secret: process.env.INSTAGRAM_SECRET
    },
    google: {
      key: process.env.GOOGLE_KEY,
      secret: process.env.GOOGLE_SECRET
    },
    dropbox: {
      key: process.env.DROPBOX_KEY,
      secret: process.env.DROPBOX_SECRET
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