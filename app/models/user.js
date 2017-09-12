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
        creator : {
          email : String,
          displayName : String
        },
        organizer : {
          email : String
        },
        start : {
          dateTime : Date
        },
        end : {
          dateTime : Date
        },
        iCalUID : String,
        sequence : Number,
        attendees : [
          {
            email : String,
            displayName : String,
            optional : Boolean,
            responseStatus : String
          }
        ],
        hangoutLink : String,
        reminders : {
          useDefault : Boolean
        }
      }
    ]
  }
})

module.exports = mongoose.model('User', userSchema);