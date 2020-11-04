const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
var { countTypeOfQuestions } = require('../helpers/functions')

async function getHomepage(req, res) {
    let subjects = await db.get('subjects').value();
    let questions = await db.get('questions').value();
    subjects = subjects.map(item => {
        let _questions = questions.filter(itemQuestion => itemQuestion.idSubject == item.id)
        let { easy, medium, hard } = countTypeOfQuestions(_questions)

        return {
            ...item,
            questions: _questions,
            easy,
            medium,
            hard
        }
    })
    console.log('subjectssss', subjects);
    res.render('index', { title: 'Express', subjects });
}

module.exports = {
    getHomepage
}