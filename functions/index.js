'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const formidable = require('formidable');


const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});


exports.sendMail = functions.https.onRequest( (req, res) => {

    console.log('TEST', req.body, res);
    // const form = new formidable.IncomingForm();
    // console.log(form);
    //
    // form.parse(req, function (err, fields, files) {
    //     console.log('start 2', err, fields, files);
    //     if (err) {
    //         console.log('start 3');
    //         res.status(500).json({
    //             error: err
    //         });
    //     }
    //     return {fields, files};
    // });
    const parsed = JSON.parse(req.body);
    const mailOptions = {
        from: `Tehpostach <${gmailEmail}>`,
        // to: `Nosov <nosovk@gmail.com>, Roman <romanpadlyak@gmail.com>`,
        to: `d.nesterenko27@gmail.com`,
        subject: 'Tehpostach request',
        // attachments: [{
        //                 filename: req.body.attachment.name,
        //                 // content: files._writeStream,
        //     content: req.body.attachment,
        //             }],
        html: `email: ${parsed.email } 
                   subject: ${parsed.subject } 
                   name: ${parsed.name} 
                   message: ${parsed.message || parsed.motivation || "nothing"}
                   referrer: ${parsed.referrer}`,

    };

    // if (files.attachment) {
    //     Object.assign(mailOptions, {
    //         attachments: [{
    //             filename: files.attachment.name,
    //             content: files._writeStream,
    //         }]
    //     })
    // }
    console.log('start 5', mailOptions);

    mailTransport.sendMail(mailOptions, function (error, info) {
        console.log('start 6');
        if (error) {
            console.log(error);
            res.status(500).json({
                error: error
            });
        } else {
            console.log('Message sent to:', info.envelope.to);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.status(200).json({
                    data: info
                }
            )
        }
    });
});
