const multipart = require('parse-multipart');

const txt =  [
    '------WebKitFormBoundaryTB2MiQ36fnSJlrhY',
    'Content-Disposition: form-data; name="cont"',
    '',
    'some random content',
    '------WebKitFormBoundaryTB2MiQ36fnSJlrhY',
    'Content-Disposition: form-data; name="pass"',
    '',
    'some random pass',
    '------WebKitFormBoundaryTB2MiQ36fnSJlrhY',
    'Content-Disposition: form-data; name="bit"',
    '',
    '2',
    '------WebKitFormBoundary9xkgMBS4PToVtYVt',
    'Content-Disposition: form-data; name="attachment"; filename="Новый текстовый документ.txt"',
    'Content-Type: text/plain',
    '------WebKitFormBoundaryTB2MiQ36fnSJlrhY--',
].join('\r\n');

const Busboy = require('busboy');

const busboy = new Busboy({
    headers: {
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryTB2MiQ36fnSJlrhY'
    }
});

const results = [];

busboy.on('file', function(fieldname, stream, filename, encoding, mimeType) {
    var nb = 0,
        info = ['file',
            fieldname,
            nb,
            0,
            filename,
            encoding,
            mimeType];
    stream.on('data', function(d) {
        nb += d.length;
    }).on('limit', function() {
        ++info[3];
    }).on('end', function() {
        info[2] = nb;
        if (stream.truncated)
            ++info[3];
        results.push(info);
    });
});

busboy.on('field', function (key, val, keyTrunc, valTrunc, encoding, contype) {
    results.push(['field', key, val, keyTrunc, valTrunc, encoding, contype]);
});

busboy.on('finish', function() {
    console.log('finish', results)
});

busboy.on('error', function(err) {
    console.error(err);
});

busboy.write(Buffer.from(txt), function() {
    console.log(arguments)
});

busboy.end();