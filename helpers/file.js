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

module.exports = {
    makeTest,
    makeExams,
    shuffle
}