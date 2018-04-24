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
    let cLength = req.headers["content-length"];
    const body = req.body;

    const busboy = new Busboy({
        headers: {
            'content-type': cType,
            'content-length': cLength
        }
    });

    const results = [];
    busboy.on('file', function (fieldname, stream, filename, encoding, mimeType) {

        // let data = '';
        let docSize = 0;
        let bufs = [];
        stream
            .on('data', function (d) {
                bufs[bufs.length] = d;
                docSize += d.length;
                console.log(encoding);
                // console.log(`N1 ${d}`);
                // data += d.toString();
            })
            .on('end', function () {
                bufs = Buffer.concat(bufs, docSize);
                console.log(`Buffer, ${typeof bufs}, ${bufs}`);
                let info = [
                    'file',
                    fieldname,
                    bufs,
                    0,
                    filename,
                    encoding,
                    mimeType
                ];

                console.log(`Downloaded file ${mimeType}`);
                console.log(info);
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

        console.log('Here is onFinish');

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
            fieldsReady += `<p>${fields[i]}</p>`
        }

        console.log(files);
        console.log(fields);

        const mailOptions = {
            from: `Tehpostach <${gmailEmail}>`,
            // to: `Nosov <nosovk@gmail.com>, Roman <romanpadlyak@gmail.com>`,
            to: `d.nesterenko27@gmail.com`,
            subject: 'Tehpostach request',
            attachments: files,
            html: fieldsReady
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

        console.log('finish after MAIL IS SENT', results);
        res.status(200).end();
    });

    busboy.on('error', function (err) {
        console.error(err);
        res.status(400).end();
    });

    busboy.write(body, function () {
        console.log("These are args", arguments)
    });

    busboy.end();
});