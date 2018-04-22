'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const gmailEmail = functions.config().email || "atlassian@nodeart.io";
const gmailPassword = functions.config().password || "272645Ew";
const Busboy = require('busboy');
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

exports.sendMail = functions.https.onRequest((req, res) => {
    let cType = req.headers["content-type"];
    const body = req.body;

    const busboy = new Busboy({
        headers: {
            'content-type': cType
        }
    });

    const results = [];

    busboy.on('file', function(fieldname, stream, filename, encoding, mimeType) {
        let data = '';
        stream.on('data', function(d) {
            console.log(d);
            data += d.toString();
        }).on('end', function() {
            var info = [
                'file',
                fieldname,
                data,
                0,
                filename,
                encoding,
                mimeType
            ];
            results.push(info);
        }).on('error', err => {
            console.error(err);
            res.status(400).end();
        });
    });

    busboy.on('field', function (key, val, keyTrunc, valTrunc, encoding, contype) {
        results.push(['field', key, val, keyTrunc, valTrunc, encoding, contype]);
    });

    busboy.on('finish', function() {

        console.log('finish');

        const files = results
            .filter(arr => arr[0] === 'file')
            .map(arr => ({filename: arr[1], content: Buffer.from(arr[2])}));

        console.log(files);

        const mailOptions = {
            from: `Tehpostach <${gmailEmail}>`,
            // to: `Nosov <nosovk@gmail.com>, Roman <romanpadlyak@gmail.com>`,
            to: `d.nesterenko27@gmail.com`,
            subject: 'Tehpostach request',
            attachments: [files],
            html: `<p>${body}</p>`
        };

        mailTransport.sendMail(mailOptions, function (error, info) {
            console.log("mailed it");
            if (error) {
                console.log(error);
                res.send(JSON.stringify({error: error.message}))
            } else {
                console.log('Message sent to:', info.envelope.to);
                res.send({data: "ok"})
            }
        });

        console.log('finish', results);
        res.status(200).end();
    });

    busboy.on('error', function(err) {
        console.error(err);
        res.status(400).end();
    });

    busboy.write(body, function() {
        console.log(arguments)
    });

    busboy.end();
});