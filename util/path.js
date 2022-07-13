const path = require('path');
const fs = require('fs');

exports.path = path.dirname(process.mainModule.filename);

exports.deleteFile = (filePath) => {
    fs.unlink(filePath, err => {
        if (err)
            throw err;
    })
}