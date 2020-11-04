const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const uuid = require('uuid')
const slugify = require('slugify')

function getSubject(req, res) {
    // let subjects = db.get('subjects')
    //     .value()
    // res.send(subjects)

    res.send({
        mon: req.params.slug
    })
}
async function updateLoadedFile(req, res) {
    // conssole.log('qqqq', req.body);
    let body = req.body;
    if (body.subjectId == 0) {
        let subject = {
            id: uuid.v4(),
            name: body.subjectName,
            slug: slugify(body.subjectName)
        }
        await db.get('subjects')
            .push(subject)
            .write()
        let questions = body.questions.map(item => {
            return {
                answers: item.answers,
                content: item.content,
                id: item.id,
                idSubject: subject.id,
                level: item.level
            }
        })
        await db.get('questions')
            .push(...questions)
            .write()
        console.log(subject);
    } else {

    }
    res.send(req.body)
}
async function editUpload(req, res) {
    // let questions = await db.get('questions').filter({ idSubject: "0" }).value()
    // console.log('questions', questions);
    // res.send({
    //     questions
    // })

    res.render('editUpload', { title: "Xem lại" })
}

module.exports = {
    getSubject,
    editUpload,
    updateLoadedFile
}