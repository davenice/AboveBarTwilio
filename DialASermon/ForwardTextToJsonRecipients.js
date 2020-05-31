const TWILIO_MOBILE_NUMBER = '+44xxxxxxx';
let URL_TO_JSON_LIST_OF_NUMBERS = "URL_IN_HERE";

/* Format of JSON file containing numbers is like this:

{
	"numbers":[
		{ "number": "+447xxxxxxxxx" },
		{ "number": "+447xxxxxxxxx" }
	]
}

*/

// Variables specific to this instance go above here - code below
exports.handler = function(context, event, callback) {
    console.log("Received text message from "+event.From);
    const fetch = require('node-fetch');
    client = context.getTwilioClient();

let twilioMobileNumber = TWILIO_MOBILE_NUMBER;
let jsonURL = URL_TO_JSON_LIST_OF_NUMBERS;

    let messages = [];
    fetch(jsonURL)
        .then(res => res.json())
        .then((json) => {
            let forwardedBody = event.From+": "+event.Body

            // for every number in the  list, create a promise to send the message
            json.numbers.forEach((item, i) => {
              console.log("Attempting to forward to "+item.number);
              var promise = client.messages.create({
                from: twilioMobileNumber,
                to: item.number,
                body: forwardedBody
              });
              messages.push(promise);
            });

            // fulfil all promises
            Promise.all(messages).then(function() {
              console.log("Sent all messages");
              callback();
            }).catch(err => callback(err));
        });

};