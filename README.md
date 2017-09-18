# Time Slot

## Table of Contents

+ [Demo](#demo)
+ [About](#about)
+ [Technology](#technology)
+ [Usage](#usage)

## Demo

https://time-slot.herokuapp.com

## About

This application is a project management scheduling assistant. Time Slot can serve as a tool to communicate what work is coming down the pipeline, when there are openings, and how much more work can be taken on. This could help freelancers manage workload or provide a better view for business development, sales, project managers when bidding on new jobs or managing multiple project.

Projects can be created on Time Slot which require the estimate hours to complete the project, the start date, and the project due date. A user can select how they want to schedule the project. Currently you can choose the option 'ASAP' to book the soonest available openings in the calendar. The option to 'Spread Out' the work evenly throughout the project timeline is in development. The next iteration will allow users to add milestones to projects to distribute work hours more closely aligned with a scheule of performance. 

Time Slot uses Google OAuth to sign in and connect to the Google Calendar API. The Calendar API lets you integrate your project calendar with Google Calendar to import, create, update, and delete events.


## Technology

- MEAN Stack (MongoDB, Express, AngularJS, and Node)
- Passport for Google OAuth Authentication
- Google Calendar API


## Usage

### Demo
https://time-slot.herokuapp.com

### Installation

```
git clone git@github.com:adamgunther1/time_slot.git
cd time_slot
npm install
touch .env
```

#### Environment Variables

In your .env file, add the following environment variables:
```
CLIENTID
CLIENTSECRET
CALLBACKURL
```
Visit https://console.developers.google.com/projectselector/apis/library to setup a project on Google's Developers Console and get your client ID, client secret, and callback url.