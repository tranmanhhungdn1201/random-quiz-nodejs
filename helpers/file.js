const PERCENT_AVAILABLE = 30;

function getNQuestionsInArray(arrayQuestion, n){
    let questionShuffled = shuffle(JSON.parse(JSON.stringify(arrayQuestion)));
    let arrayQuizDup = [];
    let arrayQuiz = [];
    for(let i = 0; i < questionShuffled.length; i++){
        if(questionShuffled[i].isDup){
            arrayQuizDup = [...arrayQuizDup, questionShuffled[i]];
            continue;
        }
        arrayQuiz = [...arrayQuiz, questionShuffled[i]];
    }
    let lengthQuizDup = arrayQuizDup.length;
    return shuffle([...arrayQuizDup, ...arrayQuiz.filter((item, i) => i < (n - lengthQuizDup))]);
}

function include(item, array){
    return array.some(_item =>_item.id === item.id);
}

function makeExceptChosen(arrayQuestions, chosen, percent){
    let numOfPercent = Math.floor(percent/100*chosen.length);
    //clear isDup
    chosen.map(item => {
        let iTemp = Object.assign(item);
        delete iTemp['isDup'];
        return iTemp;
    });
    return [
        ...arrayQuestions.filter(item => !include(item, chosen)),
        ...chosen.filter((item, i) => i < numOfPercent).map(x => Object.assign(x, {isDup: true}))
    ]
}

function makeTest(numOfTest, numOfEasy, numOfMedium, numOfHard, easies, mediums, hards, full){
    let _easy = getNQuestionsInArray(easies, numOfEasy)
    let _mediums = getNQuestionsInArray(mediums, numOfMedium)
    let _hards = getNQuestionsInArray(hards, numOfHard)
    let numInTest = numOfEasy + numOfMedium + numOfHard;
    //create exam and shuffle anwser
    let result = [
        ..._easy,
        ..._mediums,
        ..._hards,
    ].map(quiz => {
        let arr = Object.assign(quiz);
        shuffle(arr.answers);
        return arr;
    });

    if(result.length !== numInTest){
        return full;
    }
    full = [...full, result];
    if(numOfTest === 0){
        return full;
    }else{
        let easy =  makeExceptChosen(easies, _easy, PERCENT_AVAILABLE)
        let medium =  makeExceptChosen(mediums, _mediums, PERCENT_AVAILABLE)
        let hard = makeExceptChosen(hards, _hards, PERCENT_AVAILABLE)
        return makeTest(numOfTest - 1, numOfEasy, numOfMedium, numOfHard, easy, medium, hard, full);
    }
}

function makeQuestion(numOfTest, numOfQuestionInTest, arr){
    let step = Math.floor(arr.length/numOfTest);
    let test = [];
    let start = 0
    for(let i = 0; i < numOfTest; i++){
        if(i !== 0) start += step
        test.push(arr.filter((item, index) => {
            if((start + numOfQuestionInTest) > arr.length){
                return (index >= start && index<arr.length) || index < ((start + numOfQuestionInTest - arr.length))
            }else{
                return index >= start && index < (start+numOfQuestionInTest)
            }
        }))
    }
    return test;
}

function makeExams(numOfTest, numE, numM, numH, easies, mediums, hards){
    let exams = [];
    let es = makeQuestion(numOfTest, numE, easies);
    let md = makeQuestion(numOfTest, numM, mediums);
    let hd = makeQuestion(numOfTest, numH, hards);
    if(es.length !== md.length || es.length !== hd.length || md.length !== hd.length)
        return []
    for(let i = 0; i < numOfTest; i++){
        exams = [...exams, shuffle([...es[i], ...md[i], ...hd[i]])];
    }
    return exams;
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


const createArrFromLittleToMany = (easies, mediums, hards, easiesInTest1, mediumsInTest1, hardsInTest1) => {
    let obj = {
        easyPercent: easiesInTest1.length/easies.length*100,
        mediumPercent: mediumsInTest1.length/mediums.length*100,
        hardPercent: hardsInTest1.length/hards.length*100,
    }
        
    const maxArr = (easyPercent, mediumPercent, hardPercent, easiesInTest1, mediumsInTest1, hardsInTest1) => {
        let arrMax = [easyPercent]
        let arrQuestion = [easiesInTest1];
        if(easyPercent<mediumPercent) {
            arrQuestion.unshift(mediumsInTest1)
            arrMax.unshift(mediumPercent)
        }
        else {
            arrQuestion.push(mediumsInTest1)
            arrMax.push(mediumPercent)
        }
        if(hardPercent<arrMax[1]) arrQuestion.push(hardsInTest1)
        else if(hardPercent>arrMax[0]) arrQuestion.unshift(hardsInTest1)
        else {
            const insertAt = (array, index, ...elementsArray) => {
                array.splice(index, 0, ...elementsArray);
            }
            insertAt(arrQuestion, 1, hardsInTest1)
        }
        return [...arrQuestion[0], ...arrQuestion[1], ...arrQuestion[2]]
    }
    // max(9,7,4, [1,2,3,4,5,6,7,8,9], [3,4,8,7,6,0,9], [5,7,8,9])
    // => [[5,7,8,9], [3,4,8,7,6,0,9], [1,2,3,4,5,6,7,8,9]]
    let arr = maxArr(obj.easyPercent, obj.mediumPercent, obj.hardPercent, easiesInTest1, mediumsInTest1, hardsInTest1)
    return arr

}

function makeExamsByPercent(percent, numEasy, numMedium, numHard, easies, mediums, hards) {

    // this function is creating tests that part of them is same by percent
    // 1. make a test1 with e, m, h
    // 2. sort e, m, h in the test1 with percent e/easies, m/mediums,... 
    // ex: e: 5, m: 3, h: 1 in the test1, but in data, has 8 easies, 10 mediums, 10 hards
    // => e/easies = 5/8,  m/mediums = 3/10 = 33%, h/hards = 1/10 = 10%
    // => sort: [e, m, h]
    // test1 is: [[1,2,3,4,5], [6,7,8], [9]] 
    // after sort: [[9], [6,7,8], [1,2,3,4,5]] same [1,2,3,4,5,6,7,8,9]
    // get p percent in test1 from start to end
    // using while in order to get test2, test3,... in eRemain,mRemain,...
    // eRemain includes easy question that is not in test1, not in same part
    // in means all tests has the same part
    // while during eRemain,mRemain,... empty

    let shuffle = (array) => {
        let j, x, i;
        for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = array[i];
            array[i] = array[j];
            array[j] = x;
        }
        return array;
    }
    let createArr = (s, e, level) => {
        let arr = [];
        for (let i = s; i <= e; i++) {
            arr.push({
                level: level,
                id: i
            })
        }
        return arr;
    }
    let getNQuestionInArr = (arrTmp, n) => {
        let arr = shuffle(arrTmp)
        return {
            got: [...arr].splice(0, n),
            remain: [...arr].splice(n, arr.length - n)
        }
    }
    let getNQuestionInArrByPercent = (arr, percent) => {
        let n = Math.floor(arr.length * percent / 100)
        return getNQuestionInArr(arr, n)
    }

    let isInArray = (item, arr) => {
        return arr.filter(i => item.id === i.id)[0] ? true : false
    }
    let subArray = (arrBig, arrSmall) => {
        let result = [];
        arrBig.forEach(item => {
            if (!isInArray(item, arrSmall)) result.push(item)
        })
        return result;
    }
    let countNumberOfType = (arr) => {
        let numOfEasy = 0;
        let numOfHard = 0;
        let numOfMedium = 0;
        let easies = [];
        let hards = [];
        let mediums = [];

        arr.forEach(item => {
            if (item.level === 'D') {
                numOfEasy += 1;
                easies.push(item)
            }
            if (item.level === 'V') {
                numOfMedium += 1;
                mediums.push(item)
            }
            if (item.level === 'K') {
                numOfHard += 1;
                hards.push(item)
            }
        })
        return { numOfEasy, numOfMedium, numOfHard, easies, hards, mediums }
    }

    // let dataSample = {
    //     e: createArr(1, 55, 'e'),
    //     m: createArr(56, 80, 'm'),
    //     h: createArr(81, 120, 'h')
    // }

    let dataSample = {
        e: easies,
        m: mediums,
        h: hards
    }

    class Origin {
        constructor(dataSample) {
            this.easies = dataSample.e
            this.mediums = dataSample.m
            this.hards = dataSample.h
            this.total = shuffle([...this.easies, ...this.mediums, ...this.hards])
        }
        setEasiesRemain = (remain) => this.easiesRemain = remain
        setHardsRemain = (remain) => this.hardsRemain = remain
        setMediumsRemain = (remain) => this.mediumsRemain = remain
    }

    let p = percent; // percent
    let E = numEasy,
        M = numMedium;
    let H = numHard;
    let m = E + M + H;

    let createTest = (dataSample) => {
        let origin = new Origin(dataSample)

        let eSame = getNQuestionInArr(origin.easies, E)
        let mSame = getNQuestionInArr(origin.mediums, M)
        let hSame = getNQuestionInArr(origin.hards, H)

        let Test1 = {
                e: eSame.got,
                m: mSame.got,
                h: hSame.got,
            }
        origin.setEasiesRemain(eSame.remain)
        origin.setHardsRemain(hSame.remain)
        origin.setMediumsRemain(mSame.remain)
        Test1.full = shuffle([...Test1.e, ...Test1.m, ...Test1.h])
        let Test1TmpNoShuffle = createArrFromLittleToMany(origin.easies, origin.mediums, origin.hards, Test1.e, Test1.m, Test1.h)
        let sameInTest = getNQuestionInArrByPercent(Test1TmpNoShuffle, p)
        let objNumber = {
                same: {
                    numOfSameQuestions: sameInTest.got.length,
                    ...countNumberOfType(sameInTest.got)
                }
            }
        
        let Result = [[...Test1.e, ...Test1.h, ...Test1.m]]
        let count = 0
        while (
            origin.easiesRemain.length !== 0 &&
            origin.mediumsRemain.length !== 0 &&
            origin.hardsRemain.length !== 0 && count < 10
        ) {
            count++;
            let eGet = getNQuestionInArr(origin.easiesRemain, E - objNumber.same.numOfEasy)
            let mGet = getNQuestionInArr(origin.mediumsRemain, M - objNumber.same.numOfMedium)
            let hGet = getNQuestionInArr(origin.hardsRemain, H - objNumber.same.numOfHard)
            let Test = {
                    e: [...eGet.got, ...objNumber.same.easies],
                    m: [...mGet.got, ...objNumber.same.mediums],
                    h: [...hGet.got, ...objNumber.same.hards],
                }
            origin.setEasiesRemain(eGet.remain)
            origin.setHardsRemain(hGet.remain)
            origin.setMediumsRemain(mGet.remain)

            let same = '';
            objNumber.same.easies.forEach(item => { same += item.id + ',' })
            objNumber.same.mediums.forEach(item => { same += item.id + ',' })
            objNumber.same.hards.forEach(item => { same += item.id + ',' })

            let s = '';
            Test.e.forEach(item => { s += item.id + ',' })
            Test.h.forEach(item => { s += item.id + ',' })
            Test.m.forEach(item => { s += item.id + ',' })
            
            let tmp = [...Test.e, ...Test.h, ...Test.m]
            if(tmp.length == m) Result.push(tmp)
        }

        return Result;
    }
    let _result = []
    for (let i = 0; i < 50; i++) {
        let Result = createTest(dataSample)
        if (Result.length > _result.length) _result = Result
    }
    console.log('_result', _result.length);
    return _result
}

module.exports = {
    makeTest,
    makeExams,
    makeExamsByPercent,
    shuffle
}