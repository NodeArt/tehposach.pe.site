'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
var multiparty = require('multiparty');

const gmailEmail = functions.config().email || "atlassian@nodeart.io";
const gmailPassword = functions.config().password || "272645Ew";

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});


exports.sendMail = functions.https.onRequest((req, res) => {
    const form = new multiparty.Form();
    console.log("started");

    form.parse(req, function (err, fields, files) {
        console.log(req.body);
        console.log("parsed");
        console.log(err);
        if (err) return res.status(500).json({error: err});
        const message = Object.keys(fields).reduce(function (previous, key) {
            return previous + "<p>" + key + ": " + fields[key] + "</p>";
        }, "<h1>Content:</h1>\n");
        console.log(files);

        const mailOptions = {
            from: `Tehpostach <${gmailEmail}>`,
            // to: `Nosov <nosovk@gmail.com>, Roman <romanpadlyak@gmail.com>`,
            to: `d.nesterenko27@gmail.com`,
            subject: 'Tehpostach request',
            attachments: [{
                filename: files.attachment[0].originalFilename,
                content: files.attachment[0]
            }],
            html: message
        };
        mailTransport.sendMail(mailOptions, function (error, info) {
            console.log("mailed");
            if (error) {
                console.log(error);
                res.status(500).json({error: error});
            } else {
                console.log('Message sent to:', info.envelope.to);
                res.status(200).json({data: "ok"})
            }
        });
    });
});