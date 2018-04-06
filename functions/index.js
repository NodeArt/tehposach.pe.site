'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const gmailEmail = functions.config().gmail.email || "test@gmail.com";
const gmailPassword = functions.config().gmail.password || "password";

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

// admin.initializeApp(functions.config().firebase);


exports.sendMail = functions.https.onRequest(function (req, res) {
    console.log('this is our req', req);
    const mailOptions = {
        from: `Tehpostach <${gmailEmail}>`,
        to: `Nosov <nosovk@gmail.com>, Roman <romanpadlyak@gmail.com>`,
        subject: 'Tehpostach request',
        html: req.body || 'LOL'
    };

    mailTransport.sendMail(mailOptions, function (error, info) {
        if (error) {
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
