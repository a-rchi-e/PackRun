'use strict';

import express, { Application } from 'express';
import sequelize from './models/model';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import router from './controllers/routers';
import bodyParser from 'body-parser';

const app: Application = express();

const port = 3000;

const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true
}

// TODO: Discuss if a locale storage for the pictures is okay

// creating a folder for the image uploads
const uploadDirectory = path.join(__dirname, 'uploads');

// checking if directory alreay exists, if not creating a new one:
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory)
}
export default uploadDirectory;

app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/', router);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // using created image directory


(async () => {
  try {
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`The server is now running at http://localhost${port}!`);
    })
  } catch (error) {
    console.log(error);
  }
})();


