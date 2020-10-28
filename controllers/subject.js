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

async function editUpload(req, res) {
    let questions = await db.get('questions').filter({ idSubject: "0" }).value()
    console.log('questions', questions);
    res.send({
        questions
    })
}

module.exports = {
    getSubject,
    editUpload
}