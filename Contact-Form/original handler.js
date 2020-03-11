'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();
var nodemailer = require('nodemailer');

const busboy = require('busboy');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function sendContactFormEmail(formData, callback) {
  
  var mailOptions = {
    from: 'dawidburdun@gmail.com',
    subject: 'New message from premierlounge.com',
    html: `<h1>${formData.message}</h1>\n\n` + 
      `Name: ${formData.name}\n` + 
      `Date Of Visit: ${formData.date}\n` + 
      `Number of Persons: ${formData.persons}\n` + 
      `Phone Number: ${formData.mobileNumber}\n` + 
      `Package Requested: ${formData.package}\n` + 
      `Email: ${formData.email}\n`,
    to: 'dawidburdun@gmail.com',
    // bcc: Any BCC address you want here in an array,
    attachments: [
        {
            filename: "An Attachment.pdf",
            content: 'fileData.Body'
        }
    ]
  };
  
    console.log('Creating SES transporter');
    // create Nodemailer SES transporter
    var transporter = nodemailer.createTransport({
      SES: SES
    });
    
    // send email
    transporter.sendMail(mailOptions, callback);
    



  // const emailParams = {
  //   Source: 'dawidburdun@gmail.com',
  //   ReplyToAddresses: [formData.email],
  //   Destination: {
  //     ToAddresses: ['dawidburdun@gmail.com'],
  //   },
  //   Message: {
  //     Body: {
  //       Text: {
  //         Charset: 'UTF-8',
  //         Data: `${formData.message}\n\n` + 
  //               `Name: ${formData.name}\n` + 
  //               `Date Of Visit: ${formData.date}\n` + 
  //               `Number of Persons: ${formData.persons}\n` + 
  //               `Phone Number: ${formData.mobileNumber}\n` + 
  //               `Package Requested: ${formData.package}\n` + 
  //               `Email: ${formData.email}\n`,
  //       },
  //     },
  //     Subject: {
  //       Charset: 'UTF-8',
  //       Data: 'New message from premierlounge.com',
  //     },
  //   },
  // };

  // SES.sendEmail(emailParams, callback);
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














function sendCareerFormEmail(message, callback) {

  var arrFields = message.fields.map(function(item) {
    return `<h2>${item.name}: ${item.value}</h2>`;
  })
  console.log(message.file.data);
  
  var mailOptions = {
    from: 'dawidburdun@gmail.com',
    subject: 'New message from premierlounge.com',
    html: arrFields.join(' '),
    to: 'dawidburdun@gmail.com',
    attachments: [
        {
            filename: message.file.name,
            content: message.file.data
        }
    ]
  };
  
    // create Nodemailer SES transporter
    var transporter = nodemailer.createTransport({
      SES: SES
    });
    
    // send email
    transporter.sendMail(mailOptions, callback);
}


module.exports.careerForm = (event, context, callback) => {
  var contentType = event.headers['Content-Type'] || event.headers['content-type'];
  var bb = new busboy({ headers: { 'content-type': contentType }});



  var arrFields = [];
  var objFile = {};
  bb.on('file', function (fieldname, file, filename, encoding, mimetype) {
    
    var filen = filename;
    file.on('data', function(data) {
      objFile = {
        name: filen,
        data: data
      };

      console.log(data);
    });
  })
  .on('field', (fieldname, val) => 
    arrFields.push({name: fieldname, value: val})
  )
  .on('finish', () => {
  })
  .on('error', err => {
  });

  bb.end(event.body);

  console.log(objFile);

  var objMessage = {
    fields: arrFields,
    file: objFile
  };

  sendCareerFormEmail(objMessage, function(err, data) {
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


