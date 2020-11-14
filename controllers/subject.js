const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const uuid = require('uuid')
const slugify = require('slugify')
var { checkQuestionExistInDb, dateToString } = require('../helpers/functions')

function getSubject(req, res) {
    res.send({
        mon: req.params.slug
    })
}
async function updateLoadedFile(req, res) {
    let body = req.body;
    let questions = body.questions;
    let questionsInDB = await db.get('questions').value();
    let date = new Date()
    let [countDuplicate, arrayQuestionDuplicate] = checkQuestionExistInDb(questions, questionsInDB)
    try {
        if (body.subjectId == 0) {
            let subject = {
                id: uuid.v4(),
                name: body.subjectName,
                slug: slugify(body.subjectName),
                teacherName: body.teacherName,
                createdAt: date,
                createdAtString: dateToString(date)
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
        } else {
            await arrayQuestionDuplicate.forEach(async item => {
                if (item.idSubject == body.subjectId) {
                    await db.get('questions').remove({ id: item.idQuestion }).write()
                }
            })
            await db.get('subjects').find({ id: body.subjectId }).assign({
                teacherName: body.teacherName,
                createdAt: date,
                createdAtString: dateToString(date)
            }).write();
            let questions = body.questions.map(item => {
                return {
                    answers: item.answers,
                    content: item.content,
                    id: item.id,
                    idSubject: body.subjectId,
                    level: item.level
                }
            })
            await db.get('questions')
                .push(...questions)
                .write()
        }
        res.send({
            status: 'OK'
        })
    } catch (error) {
        res.send({
            status: 'FAIL'
        })
    }
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