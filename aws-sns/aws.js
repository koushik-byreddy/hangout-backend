const AWS = require("aws-sdk");
require("dotenv").config();
// Set region
AWS.config.update({ region: "ap-south-1" });

sendSms = (otp, num) => {
  var params = {
    Message: "Your hangout verification code is " + otp /* required */,
    PhoneNumber: "+91" + num,
  };

  console.log(params.Message + " $$ " + params.PhoneNumber);

  // Create promise and SNS service object
  var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  publishTextPromise
    .then(function (data) {
      console.log(data);
      console.log("MessageID is " + data.MessageId);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
};

module.exports = sendSms;
