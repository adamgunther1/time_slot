var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define model =================
var Todo = mongoose.model('Todo', {
  text : String,
  done: Boolean
});

// make this available to our users in our Node applications
module.exports = Todo;