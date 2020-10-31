const uuid = require('uuid')

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
            content: regexExtract[3],
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

module.exports = {
    splitQuestion,
    shuffle
}