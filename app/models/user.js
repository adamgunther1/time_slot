var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  google : {
    id: String,
    token: String,
    email: String,
    name: String
  },
  freeTime : Object,
  projects : [
    {
      title : String,
      description : String,
      client : String,
      color : String,
      jobId : String,
      hours : Number,
      startTime : Date,
      endTime : Date,
      schedulePreference : String,
      events : [
        {
          id : String,
          title : String,
          color: String,
          startsAt: Date,
          endsAt: Date,
          draggable: Boolean,
          resizable: Boolean,
          actions: Array
        }
      ] 
    }
  ],
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