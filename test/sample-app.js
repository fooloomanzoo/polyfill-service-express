'use strict';

const express = require('express');
const app = express();
const PORT = 3000;
const polyfills = require('../lib/index.js')();

app.use(express.static(__dirname + '/public'));
app.get(/^\/polyfill(\.\w+)(\.\w+)?/, polyfills);

app.listen(PORT, function () {
  console.log(`app listening on port ${3000}!`);
});
