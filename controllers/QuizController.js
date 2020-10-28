const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

function list(req, res){
    const slugSubject = req.params.slug;
    const subject = db.get('subjects')
                    .find({ slug: slugSubject })
                    .value();
    if (!slugSubject || !subject) {
        return;
    }
                   
    const questions = db.get('questions')
                    .find({idSubject: subject.id})
                    .value();
    res.render('listQuiz', {
        title: 'List Quiz',
        questions,
        subject
    });
}

module.exports = {
    list,
}