import express from 'express';
import bodyParser from 'body-parser';

require('dotenv').config();

require('@/config/db').connect();

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
