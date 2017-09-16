var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  google : {
    id: String,
    token: String,
    email: String,
    name: String
  },
  calendar : {
    kind : String,
    etag : String,
    summary : String,
    timeZone : String,
    accessRole : String,
    nextSyncToken : String,
    items : [
      { kind : String,
        etag : String,
        id : String,
        htmlLink : String,
        created : Date,
        updated : Date,
        summary : String,
        description : String,
        location : String,
        creatorEmail :  String,
        organizerEmail : String,
        startTime : Date,
        endTime : Date,
        iCalUID : String,
        sequence : Number,
        hangoutLink : String
      }
    ]
  }
})

module.exports = mongoose.model('User', userSchema);