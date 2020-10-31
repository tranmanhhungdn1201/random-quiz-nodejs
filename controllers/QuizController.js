const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const { shuffle} = require('../helpers/functions');
const { makeTest} = require('../helpers/file');
const LEVEL_EASY = 'D';
const LEVEL_MEDIUM = 'V';
const LEVEL_HARD = 'K';
const question = [{"id":0,"content":0,"level":"k"},{"id":1,"content":1,"level":"v"},{"id":2,"content":2,"level":"v"},{"id":3,"content":3,"level":"k"},{"id":4,"content":4,"level":"k"},{"id":5,"content":5,"level":"v"},{"id":6,"content":6,"level":"v"},{"id":7,"content":7,"level":"v"},{"id":8,"content":8,"level":"v"},{"id":9,"content":9,"level":"k"},{"id":10,"content":10,"level":"d"},{"id":11,"content":11,"level":"v"},{"id":12,"content":12,"level":"v"},{"id":13,"content":13,"level":"k"},{"id":14,"content":14,"level":"v"},{"id":15,"content":15,"level":"d"},{"id":16,"content":16,"level":"k"},{"id":17,"content":17,"level":"k"},{"id":18,"content":18,"level":"v"},{"id":19,"content":19,"level":"v"},{"id":20,"content":20,"level":"v"},{"id":21,"content":21,"level":"k"},{"id":22,"content":22,"level":"v"},{"id":23,"content":23,"level":"v"},{"id":24,"content":24,"level":"v"},{"id":25,"content":25,"level":"k"},{"id":26,"content":26,"level":"d"},{"id":27,"content":27,"level":"d"},{"id":28,"content":28,"level":"d"},{"id":29,"content":29,"level":"k"},{"id":30,"content":30,"level":"d"},{"id":31,"content":31,"level":"d"},{"id":32,"content":32,"level":"k"},{"id":33,"content":33,"level":"k"},{"id":34,"content":34,"level":"v"},{"id":35,"content":35,"level":"k"},{"id":36,"content":36,"level":"d"},{"id":37,"content":37,"level":"d"},{"id":38,"content":38,"level":"v"},{"id":39,"content":39,"level":"k"},{"id":40,"content":40,"level":"k"},{"id":41,"content":41,"level":"d"},{"id":42,"content":42,"level":"d"},{"id":43,"content":43,"level":"k"},{"id":44,"content":44,"level":"d"},{"id":45,"content":45,"level":"k"},{"id":46,"content":46,"level":"k"},{"id":47,"content":47,"level":"v"},{"id":48,"content":48,"level":"v"},{"id":49,"content":49,"level":"v"},{"id":50,"content":50,"level":"k"},{"id":51,"content":51,"level":"v"},{"id":52,"content":52,"level":"v"},{"id":53,"content":53,"level":"v"},{"id":54,"content":54,"level":"d"},{"id":55,"content":55,"level":"k"},{"id":56,"content":56,"level":"d"},{"id":57,"content":57,"level":"d"},{"id":58,"content":58,"level":"d"},{"id":59,"content":59,"level":"k"},{"id":60,"content":60,"level":"k"},{"id":61,"content":61,"level":"k"},{"id":62,"content":62,"level":"k"},{"id":63,"content":63,"level":"d"},{"id":64,"content":64,"level":"k"},{"id":65,"content":65,"level":"v"},{"id":66,"content":66,"level":"v"},{"id":67,"content":67,"level":"d"},{"id":68,"content":68,"level":"v"},{"id":69,"content":69,"level":"v"},{"id":70,"content":70,"level":"k"},{"id":71,"content":71,"level":"d"},{"id":72,"content":72,"level":"d"},{"id":73,"content":73,"level":"d"},{"id":74,"content":74,"level":"k"},{"id":75,"content":75,"level":"v"},{"id":76,"content":76,"level":"d"},{"id":77,"content":77,"level":"k"},{"id":78,"content":78,"level":"k"},{"id":79,"content":79,"level":"d"},{"id":80,"content":80,"level":"d"},{"id":81,"content":81,"level":"k"},{"id":82,"content":82,"level":"v"},{"id":83,"content":83,"level":"k"},{"id":84,"content":84,"level":"k"},{"id":85,"content":85,"level":"k"},{"id":86,"content":86,"level":"k"},{"id":87,"content":87,"level":"k"},{"id":88,"content":88,"level":"k"},{"id":89,"content":89,"level":"v"},{"id":90,"content":90,"level":"v"},{"id":91,"content":91,"level":"d"},{"id":92,"content":92,"level":"k"},{"id":93,"content":93,"level":"v"},{"id":94,"content":94,"level":"v"},{"id":95,"content":95,"level":"v"},{"id":96,"content":96,"level":"d"},{"id":97,"content":97,"level":"d"},{"id":98,"content":98,"level":"v"},{"id":99,"content":99,"level":"v"}];

async function list(req, res){
    const slugSubject = req.params.slug;
    const subject = await db.get('subjects')
                    .find({ slug: slugSubject })
                    .value();
    if (!slugSubject || !subject) {
        return;
    }
                   
    const questions = await db.get('questions')
                    .filter({idSubject: subject.id})
                    .value();

    const questionsShuffle = questions.map(quiz => {
        let arr = Object.assign(quiz);
        shuffle(arr.answers);
        return arr;
    });
    res.render('listQuiz', {
        title: 'List Quiz',
        questions: questionsShuffle,
        subject
    });
}

function getCreateExam(req, res){
    const subjects = db.get('subjects').value();
    res.render('createExam', {title: 'Create Exam', subjects});
}

function postCreateExam(req, res){
    const errors = validateCreateExam(req.body);
    if(errors.length !== 0) {
        return res.json({
            success: false,
            errors
        });
    }
    // const questionsInSub = db.get('questions').filter('subjectId', data.subjectId).value();
    const questionsInSub = db.get('questions').value();
    // const questionsInSub = question;
    const easies = questionsInSub.filter(quiz => quiz.level === LEVEL_EASY);
    const mediums = questionsInSub.filter(quiz => quiz.level === LEVEL_MEDIUM);
    const hards = questionsInSub.filter(quiz => quiz.level === LEVEL_HARD);
    const { subjectId, numOfExam, numInExam, numEasy, numMedium, numHard} = req.body;
    const exams = makeTest(+numOfExam, +numEasy, +numMedium, +numHard, easies, mediums, hards, []);
    // const numOfExamAvai = exams.length;
    console.log('exams', exams);
    return res.json({
        success: true,
        exams
    });
}

function validateCreateExam(data){
    // const questionsInSub = db.get('questions').filter('subjectId', data.subjectId).value();
    const questionsInSub = db.get('questions').value();
    // const questionsInSub = question;
    const lengthQuestionInSub = questionsInSub.length;
    let errors = [];
    if(lengthQuestionInSub < data.numOfExam) {
        errors = [...errors, {
            message: 'Số câu không đủ!'
        }];
    }
    let numEasyInSub = 0;
    let numMedInSub = 0;
    let numHardInSub = 0;
    for(let i = 0; i < questionsInSub.length; i++){
        switch(questionsInSub[i].level){
            case LEVEL_EASY:
                numEasyInSub++;
                break;
            case LEVEL_MEDIUM:
                numMedInSub++;
                break;
            case LEVEL_HARD:
                numHardInSub++;
                break;
            default:
                break;
        }
    }
    if(numEasyInSub < data.numEasy ) {
        errors = [...errors, {
            message: 'Số câu dễ không đủ!'
        }];
    }
    if(numMedInSub < data.numMedium ) {
        errors = [...errors, {
            message: 'Số câu trung bình không đủ!'
        }];
    }
    if(numHardInSub < data.numHard ) {
        errors = [...errors, {
            message: 'Số câu khó không đủ!'
        }];
    }
    return errors;
}

module.exports = {
    list,
    getCreateExam,
    postCreateExam,
}