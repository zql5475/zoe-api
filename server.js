const express = require('express');
const https = require('https');
const http = require('http');
const cors = require('cors');
const corsOptions = require('./cors.js');

const app = express();
const port = 5000;
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', require('./app.js'));

const server = http.createServer(app);
server.listen(port, '0.0.0.0');