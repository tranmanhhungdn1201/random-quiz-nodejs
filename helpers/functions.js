const uuid = require('uuid')
const { LEVEL_EASY, LEVEL_MEDIUM, LEVEL_HARD } = require('../lib/constants');

function splitQuestion(dataArr, num) {
    let data = dataArr.filter(item => item != '')
    let arr = [];
    console.log('length', data.length);
    let id = "0"; //uuid.v4();
    while (data.length > num) {
        let questionArr = data.splice(0, 5);
        let regexExtract = /(^[KV])*\(([KV])\)(.*)/s.exec(questionArr[0])
        let regexExtract2 = /Câu\ \d+.(.*)/s.exec(questionArr[0])

        let ABCD = (content) => {
            let exec = /[ABCD].(.*)/.exec(content)
            return exec ? exec[1].trim() : content.trim()
        }

        let A = ABCD(questionArr[1])
        let B = ABCD(questionArr[2])
        let C = ABCD(questionArr[3])
        let D = ABCD(questionArr[4])


        if (regexExtract) {
            let questionObj = {
                idSubject: id,
                id: uuid.v4(),
                content: regexExtract[3].trim(),
                answers: [{
                        content: A,
                        isTrue: true
                    },
                    {
                        content: B,
                        isTrue: false
                    },
                    {
                        content: C,
                        isTrue: false
                    },
                    {
                        content: D,
                        isTrue: false
                    }
                ],
                result: A,
                level: regexExtract[2]
            };
            arr = [...arr, questionObj];
        } else if (regexExtract2) {
            let questionObj = {
                idSubject: id,
                id: uuid.v4(),
                content: regexExtract2[1].trim(),
                answers: [{
                        content: A,
                        isTrue: true
                    },
                    {
                        content: B,
                        isTrue: false
                    },
                    {
                        content: C,
                        isTrue: false
                    },
                    {
                        content: D,
                        isTrue: false
                    }
                ],
                result: A,
                level: 'D'
            };
            arr = [...arr, questionObj];
        }

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
    let arrayQuestionDuplicate = []
    questionsDB.forEach(item => {
        if (questionsObj[item.content]) {
            countDuplicateQuestion++;
            arrayQuestionDuplicate.push({
                idQuestion: item.id,
                idSubject: item.idSubject
            })
        }
    })
    return [countDuplicateQuestion, arrayQuestionDuplicate];
}

function getNumTypeQuestion(data) {
    if (data.length === 0) return {};
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

function countTypeOfQuestions(questions) {
    let easy = 0,
        medium = 0,
        hard = 0;
    questions.forEach(item => {
        if (item.level == 'D') easy += 1;
        if (item.level == 'V') medium += 1;
        if (item.level == 'K') hard += 1;
    })
    return {
        easy,
        medium,
        hard
    }
}

// xoa dau trong tieng viet
function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .split('')
        .map(letter => letter.toLowerCase())
        .join('');
}

function dateToString(date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}

module.exports = {
    splitQuestion,
    shuffle,
    arr2Obj,
    checkQuestionExistInDb,
    getNumTypeQuestion,
    countTypeOfQuestions,
    removeAccents,
    dateToString
}