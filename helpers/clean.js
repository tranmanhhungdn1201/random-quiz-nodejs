function cleanFileUploaded(){
    const testFolder = './files/uploads/';
    const fs = require('fs');
    const path = require('path')
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            let link = path.join(__dirname, '../files/uploads/', file)
            fs.unlink(link, function(err) {
                if (err) {
                  throw err
                } else {
                  console.log("Successfully deleted the file.")
                }
              })
        });
    });
}

module.exports = {
    cleanFileUploaded
}