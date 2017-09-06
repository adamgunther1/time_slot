// connect to mongoDB database
module.exports = {
  name : 'mongodb://localhost/timeslot'
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  db: {
      uri: 'mongodb://heroku_mzb7zzrt:gg91gpi6sd9rgah2dpa81kmp05@ds119044.mlab.com:19044/heroku_mzb7zzrt'
  }
}