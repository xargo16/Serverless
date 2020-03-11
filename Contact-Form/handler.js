'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();
var nodemailer = require('nodemailer');

function sendContactFormEmail(formData, callback) {
  /**
   * Build email object
   */
  var mailOptions = {
    from: 'lina@linekersgroup.com',
    subject: 'New message from premierlounge.com',
    html: `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Message:</h3> <h3 style="display:inline;">${formData.message}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Name:</h3> <h3 style="display:inline;">${formData.name}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Date Of Visit:</h3> <h3 style="display:inline;">${formData.date}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Number of Persons:</h3> <h3 style="display:inline;">${formData.persons}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Phone Number:</h3> <h3 style="display:inline;">${formData.mobileNumber}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Package Requested:</h3> <h3 style="display:inline;">${formData.package}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Email:</h3> <h3 style="display:inline;">${formData.email}</h3><br>`,
    to: 'lina@linekersgroup.com',
    replyTo: formData.email
  };
  
  /**
   * create Nodemailer SES transporter
   */
  var transporter = nodemailer.createTransport({
    SES: SES
  });
  
  /**
   * send email
   */
  transporter.sendMail(mailOptions, callback);
}

function sendCareerFormEmail(message, callback) {
  /**
   * Build email object
   */
  var attachments = [];
  if (message.file) {
    attachments.push({
      filename: 'photo.jpg',
      content: message.file.split('base64,')[1],
      encoding: 'base64'
    });
  }


  var mailOptions = {
    from: 'lina@linekersgroup.com',
    subject: 'New career enquiry from premierlounge.com',
    html: `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Message:</h3> <h3 style="display:inline;">${message.message}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Name:</h3> <h3 style="display:inline;">${message.name}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Contact Number:</h3> <h3 style="display:inline;">${message.mobileNumber}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Email Address:</h3> <h3 style="display:inline;">${message.email}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Nationality:</h3> <h3 style="display:inline;">${message.nationality}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Date of birth:</h3> <h3 style="display:inline;">${message.dob}</h3><br>` + 
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Available to work from:</h3> <h3 style="display:inline;">${message.dateWorkFrom}</h3><br>` +
          `<h3 style="color:#E42A85; display:inline; margin-right:5px;">Available to work to:</h3> <h3 style="display:inline;">${message.dateWorkTo}</h3><br>`,
    to: 'lina@linekersgroup.com',
    replyTo: message.email,
    attachments: attachments
  };
  
  /**
   * create Nodemailer SES transporter
   */
  var transporter = nodemailer.createTransport({
    SES: SES
  });
  
  /**
   * send email
   */
  transporter.sendMail(mailOptions, callback);
}


module.exports.contactForm = (event, context, callback) => {
  const formData = JSON.parse(event.body);
  sendContactFormEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);
  });
};

module.exports.careerForm = (event, context, callback) => {
  const formData = JSON.parse(event.body);
  sendCareerFormEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);
  });
};


