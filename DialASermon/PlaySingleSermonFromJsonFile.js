const SERMON_DATA_JSON_URL = "URL_IN_HERE";

/* Format of JSON file containing sermon data is like this. Note that the files need to be under 40 mins in length.

{
	"header": "Hi and welcome to Above Bar Church's service for Sunday the 30th May 2020",
	"files":[
		{ "url": "https://www.dropbox.com/s/uadfjkl234/Sunday%2031st%20May-01.wav?dl=0&raw=1&t=.wav" },
		{ "url": "https://www.dropbox.com/s/uadsdfl274/Sunday%2031st%20May-02.wav?dl=0&raw=1&t=.wav" }
	]
}

*/

// Variables specific to this instance go above here - code below
exports.handler = function(context, event, callback) {
let twiml = new Twilio.twiml.VoiceResponse();

const fetch = require('node-fetch');

console.log("Answering call")
let url = SERMON_DATA_JSON_URL;
fetch(url)
    .then(res => res.json())
    .then((json) => {
        // first of all say a header using text to speech
        twiml.say(json.header);

        // next play every wav file in turn
        json.files.forEach((item, i) => {
          console.log("Playing "+item.url);
          twiml.play(item.url);
        });
        twiml.say("Thank you for listening to this service.");
        console.log("Finishing with successful completion");
        twiml.hangup();
        callback(null, twiml);
    })
    .catch(err => {
        console.log("Finishing with error "+err);
        twiml.say("Sorry, We couldn't play the service.")
        twiml.hangup();
        callback(err, twiml);
    });
};