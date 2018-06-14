#!/usr/bin/env node

const chickpea = require('chickpea');
const program = require('./index.js');

const configuration = {
  dir: 'Directory to Shape and Monitor'
};
const options = chickpea(configuration);

program(options)
