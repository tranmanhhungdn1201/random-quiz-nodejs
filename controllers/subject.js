const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

function getSubject(req, res) {
    // let subjects = db.get('subjects')
    //     .value()
    // res.send(subjects)

    res.send({
        mon: req.params.slug
    })
}

module.exports = {
    getSubject
}