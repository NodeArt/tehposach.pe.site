'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const gmailEmail = functions.config().gmail.email || "email";
const gmailPassword = functions.config().gmail.password || "password";
const Busboy = require('busboy');
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

exports.sendMail = functions.https.onRequest((req, res) => {

    const body = req.body;

    const busboy = new Busboy({ headers: req.headers });

    const results = [];

    busboy.on('file', function (fieldname, stream, filename, encoding, mimeType) {

        let docSize = 0;
        let bufs = [];
        stream
            .on('data', function (d) {
                bufs[bufs.length] = d;
                docSize += d.length;
            })
            .on('end', function () {
                bufs = Buffer.concat(bufs, docSize);
                let info = [
                    'file',
                    fieldname,
                    bufs,
                    0,
                    filename,
                    encoding,
                    mimeType
                ];

                results.push(info);
            })
            .on('error', err => {
                console.error(err);
                res.status(400).end();
            });
    });

    busboy.on('field', function (key, val) {
        results.push(['field', key, val]);
    });

    busboy.on('finish', function () {

        const files = results
            .filter(arr => arr[0] === 'file')
            .map(arr => ({filename: arr[4], content: arr[2]}));

        const fields = [];
        for (let i = 0; i < results.length; i++) {
            if (results[i][0] === "field") {
                fields.push(results[i].slice(1));
            }
        }
        let fieldsReady = '';
        for (let i = 0; i < fields.length; i++) {
            fieldsReady += `<p>${fields[i].slice(',').join(': ')}</p>`
        }

        const mailOptions = {
            from: `Tehpostach <${gmailEmail}>`,
            to: `office@tehpostach.com`,
            subject: 'Tehpostach form',
            attachments: files,
            html: fieldsReady
        };

        mailTransport.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.send(JSON.stringify({error: error.message}));
                return res.status(500);
            } else {
                console.log('Message sent to:', info.envelope.to);
                res.send({data: "ok"});
                res.status(200).end();
            }
        });
    });

    busboy.on('error', function (err) {
        console.error(err);
        res.status(400).end();
    });

    busboy.write(body, function () {
    });

    busboy.end();
});