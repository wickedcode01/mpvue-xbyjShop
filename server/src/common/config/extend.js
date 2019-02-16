const model = require('think-model');
const cache = require('think-cache');
const session = require('think-session');
const view = require('think-view');
module.exports = [
  model(think.app),
  cache,
  session,
  view
];

