const { google } = require("googleapis");
require("dotenv").config();

$('#remform').submit(function (e) {
    console.log("hiiiii")
    e.preventDefault();
    var name = $('#name').val();
    var amount = $('#amt').val();
    var number = $('#num').val();
    var date = $('#date').val();

    var ele = document.getElementsByName('bill');
              
    for(i = 0; i < ele.length; i++) {
        if(ele[i].checked)
            period = ele[i].value;
    }
    console.log(name, amount, number, date, period)
    // const settings = {
    //     "async": true,
    //     "crossDomain": true,
    //     "url": "https://google-translate1.p.rapidapi.com/language/translate/v2",
    //     "method": "POST",
    //     "headers": {
    //         "content-type": "application/x-www-form-urlencoded",
    //         "Accept-Encoding": "application/gzip",
    //         "X-RapidAPI-Key": "af60f20a74msh60f3ff836106b88p1e643ejsnf88b8b559d64",
    //         "X-RapidAPI-Host": "google-translate1.p.rapidapi.com"
    //     },
    //     "data": {
    //         "q": "hello world",
    //         "target": "hi",
    //         "source": "en"
    //     }
    // };

    // $.ajax(settings).done(function (response) {
    //     console.log(response);
    // });
    $.ajax({
        type: "POST",
        url: "/ask",
        data: $(this).serialize(),
        success: function (response) {
            $('#messageText').val('');
        },
        error: function (error) {
            console.log(error);
        }
    });
});

const GOOGLE_PRIVATE_KEY = process.env.private_key;
const GOOGLE_CLIENT_EMAIL = process.env.client_email;
const GOOGLE_PROJECT_NUMBER = process.env.project_number;
const GOOGLE_CALENDAR_ID = process.env.calendar_id;

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

const auth = new google.auth.GoogleAuth({
  keyFile: "./keys.json",
  scopes: SCOPES,
});

var calendarEvent = {
  summary: "Test Event added by Node.js",
  description: "This event was created by Node.js",
  start: {
    dateTime: "2022-06-03T09:00:00-02:00",
    timeZone: "Asia/Kolkata",
  },
  end: {
    dateTime: "2022-06-04T17:00:00-02:00",
    timeZone: "Asia/Kolkata",
  },
  attendees: [],
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 24 * 60 },
      { method: "popup", minutes: 10 },
    ],
  },
};

const addCalendarEvent = async () => {
  auth.getClient().then((auth) => {
    calendar.events.insert(
      {
        auth: auth,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: calendarEvent,
      },
      function (error, response) {
        if (error) {
          console.log("Something went wrong: " + err); // If there is an error, log it to the console
          return;
        }
		console.log("Event created successfully.")
        console.log("Event details: ", response.data); // Log the event details
      }
    );
  });
};

addCalendarEvent();