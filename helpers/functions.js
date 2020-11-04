const uuid = require('uuid')
const { LEVEL_EASY, LEVEL_MEDIUM, LEVEL_HARD } = require('../lib/constants');

function splitQuestion(data, num) {
    let arr = [];
    console.log('length', data.length);
    let id = "0"; //uuid.v4();
    while (data.length > num) {
        let questionArr = data.splice(0, 5);

        let regexExtract = /(^[DKV])*\(([DKV])\)(.*)/s.exec(questionArr[0])

        let questionObj = {
            idSubject: id,
            id: uuid.v4(),
            content: regexExtract[3].trim(),
            answers: [{
                    content: questionArr[1],
                    isTrue: true
                },
                {
                    content: questionArr[2],
                    isTrue: false
                },
                {
                    content: questionArr[3],
                    isTrue: false
                },
                {
                    content: questionArr[4],
                    isTrue: false
                }
            ],
            result: questionArr[1],
            level: regexExtract[2]
        };
        arr = [...arr, questionObj];
    }
    return arr;
}

function shuffle(array) {
    let j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}

function arr2Obj(arr) {
    return arr.reduce((obj, item) => {
        return {
            ...obj,
            [item.content]: item
        }
    }, {})
}

function checkQuestionExistInDb(questions, questionsDB) {
    let questionsObj = arr2Obj(questions)
    let countDuplicateQuestion = 0;
    questionsDB.forEach(item => {
        if (questionsObj[item.content]) {
            countDuplicateQuestion++;
        }
    })
    return countDuplicateQuestion;
}

function getNumTypeQuestion(data){
    if(data.length === 0) return {};
    const num = data.length;
    const numE = data.filter(quiz => quiz.level === LEVEL_EASY).length;
    const numM = data.filter(quiz => quiz.level === LEVEL_MEDIUM).length;
    const numH = data.filter(quiz => quiz.level === LEVEL_HARD).length;
    return {
        num,
        numE,
        numM,
        numH,
    }
}

module.exports = {
    splitQuestion,
    shuffle,
    arr2Obj,
    checkQuestionExistInDb,
    getNumTypeQuestion,
}