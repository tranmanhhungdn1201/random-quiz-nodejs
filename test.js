// let questions = [];
// for(let index=0; index<100; index++){
//   console.log('index', index)
//   questions.push({
//     id: index,
//     content: index,
//     level: ["d", "v", "k"][Math.floor(Math.random() * ["d", "v", "k"].length)]
//   })
// }

const { json } = require("express");

let question = [{"id":0,"content":0,"level":"k"},{"id":1,"content":1,"level":"v"},{"id":2,"content":2,"level":"v"},{"id":3,"content":3,"level":"k"},{"id":4,"content":4,"level":"k"},{"id":5,"content":5,"level":"v"},{"id":6,"content":6,"level":"v"},{"id":7,"content":7,"level":"v"},{"id":8,"content":8,"level":"v"},{"id":9,"content":9,"level":"k"},{"id":10,"content":10,"level":"d"},{"id":11,"content":11,"level":"v"},{"id":12,"content":12,"level":"v"},{"id":13,"content":13,"level":"k"},{"id":14,"content":14,"level":"v"},{"id":15,"content":15,"level":"d"},{"id":16,"content":16,"level":"k"},{"id":17,"content":17,"level":"k"},{"id":18,"content":18,"level":"v"},{"id":19,"content":19,"level":"v"},{"id":20,"content":20,"level":"v"},{"id":21,"content":21,"level":"k"},{"id":22,"content":22,"level":"v"},{"id":23,"content":23,"level":"v"},{"id":24,"content":24,"level":"v"},{"id":25,"content":25,"level":"k"},{"id":26,"content":26,"level":"d"},{"id":27,"content":27,"level":"d"},{"id":28,"content":28,"level":"d"},{"id":29,"content":29,"level":"k"},{"id":30,"content":30,"level":"d"},{"id":31,"content":31,"level":"d"},{"id":32,"content":32,"level":"k"},{"id":33,"content":33,"level":"k"},{"id":34,"content":34,"level":"v"},{"id":35,"content":35,"level":"k"},{"id":36,"content":36,"level":"d"},{"id":37,"content":37,"level":"d"},{"id":38,"content":38,"level":"v"},{"id":39,"content":39,"level":"k"},{"id":40,"content":40,"level":"k"},{"id":41,"content":41,"level":"d"},{"id":42,"content":42,"level":"d"},{"id":43,"content":43,"level":"k"},{"id":44,"content":44,"level":"d"},{"id":45,"content":45,"level":"k"},{"id":46,"content":46,"level":"k"},{"id":47,"content":47,"level":"v"},{"id":48,"content":48,"level":"v"},{"id":49,"content":49,"level":"v"},{"id":50,"content":50,"level":"k"},{"id":51,"content":51,"level":"v"},{"id":52,"content":52,"level":"v"},{"id":53,"content":53,"level":"v"},{"id":54,"content":54,"level":"d"},{"id":55,"content":55,"level":"k"},{"id":56,"content":56,"level":"d"},{"id":57,"content":57,"level":"d"},{"id":58,"content":58,"level":"d"},{"id":59,"content":59,"level":"k"},{"id":60,"content":60,"level":"k"},{"id":61,"content":61,"level":"k"},{"id":62,"content":62,"level":"k"},{"id":63,"content":63,"level":"d"},{"id":64,"content":64,"level":"k"},{"id":65,"content":65,"level":"v"},{"id":66,"content":66,"level":"v"},{"id":67,"content":67,"level":"d"},{"id":68,"content":68,"level":"v"},{"id":69,"content":69,"level":"v"},{"id":70,"content":70,"level":"k"},{"id":71,"content":71,"level":"d"},{"id":72,"content":72,"level":"d"},{"id":73,"content":73,"level":"d"},{"id":74,"content":74,"level":"k"},{"id":75,"content":75,"level":"v"},{"id":76,"content":76,"level":"d"},{"id":77,"content":77,"level":"k"},{"id":78,"content":78,"level":"k"},{"id":79,"content":79,"level":"d"},{"id":80,"content":80,"level":"d"},{"id":81,"content":81,"level":"k"},{"id":82,"content":82,"level":"v"},{"id":83,"content":83,"level":"k"},{"id":84,"content":84,"level":"k"},{"id":85,"content":85,"level":"k"},{"id":86,"content":86,"level":"k"},{"id":87,"content":87,"level":"k"},{"id":88,"content":88,"level":"k"},{"id":89,"content":89,"level":"v"},{"id":90,"content":90,"level":"v"},{"id":91,"content":91,"level":"d"},{"id":92,"content":92,"level":"k"},{"id":93,"content":93,"level":"v"},{"id":94,"content":94,"level":"v"},{"id":95,"content":95,"level":"v"},{"id":96,"content":96,"level":"d"},{"id":97,"content":97,"level":"d"},{"id":98,"content":98,"level":"v"},{"id":99,"content":99,"level":"v"}]
let easies = question.filter(item=>item.level==="d")
let mediums = question.filter(item=>item.level==="v")
let hards = question.filter(item=>item.level==="k")
console.log('#easies', easies.length);
console.log('#mediums', mediums.length);
console.log('#hards', hards.length);

function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

function getNQuestionsInArray(arrayQuestion, n){
  if(arrayQuestion[0] && arrayQuestion[0]['level'] === 'd'){
    console.log('easy', arrayQuestion);
  }
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
  ];
}

let sode = 0;
function makeTest(numOfTest, numOfEasy, numOfMedium, numOfHard, easies, mediums, hards, full, percent){
  let _easy = [];
  let _mediums = [];
  let _hards = [];
  if(easies.length > numOfEasy){
    _easy = getNQuestionsInArray(easies, numOfEasy)
  }
  else {
    console.log('d out')
    return full;
  }
  console.log(_mediums.length, numOfMedium)
  if(mediums.length > numOfMedium){
    _mediums = getNQuestionsInArray(mediums, numOfMedium)
  }
  else {
    console.log('tb out')
    return full;
  }
  if(hards.length > numOfHard){
    _hards = getNQuestionsInArray(hards, numOfHard)
  }
  else {
    console.log('k out')
    return full;
  }
  let result = [
    ..._easy,
    ..._mediums,
    ..._hards,
  ];
  let numInExam = numOfEasy + numOfMedium + numOfHard;
  if(result.length === numInExam){
      sode++;
  } else {
      console.log('so de chuan', sode);
      return full;
  }
  full = [...full, result];
  if(numOfTest === 0){
    return full;
  } else {
    let checkE = true;
    let checkM = true;
    let checkH = true;
    let easy = makeExceptChosen(easies, _easy, percent)
    let medium = makeExceptChosen(mediums, _mediums, percent)
    let hard = makeExceptChosen(hards, _hards, percent)
    if(easy.length < numOfEasy){
      easy = easies;
      checkE = false;
    }
    if(medium.length < numOfMedium){
      medium = mediums;
      checkM = false;
    }
    if(easy.length < numOfHard){
      easy = hards;
      checkH = false;
    }
    return makeTest(numOfTest - 1, numOfEasy, numOfMedium, numOfHard, easy, medium, hard, full);
  }
}
let tests = makeTest(5, 10, 5, 5, easies, mediums, hards, [], 30)
console.log(tests);
// console.log('Deee', tests);
// let arr = [{"name":"subject","value":"5953400309730983"},{"name":"numOfExam","value":""},{"name":"numInExam","value":""},{"name":"numEasy","value":""},{"name":"numMedium","value":""},{"name":"numHard","value":""}];
// let arrF = arr.reduce((obj, item) => {
//   let name = item['name'];
//   obj[name] = item['value'];
//   return obj;
// }, {});
// console.log(arrF)

// cách 2
// function makeQuestion(numOfTest, numOfQuestionInTest, arr){
//     let step = Math.floor(arr.length/numOfTest);
//     let test = [];
//     let start = 0
//     for(let i = 0; i < numOfTest; i++){
//         if(i !== 0) start += step
//         test.push(arr.filter((item, index) => {
//             if((start + numOfQuestionInTest) > arr.length){
//                 return (index >= start && index<arr.length) || index < ((start + numOfQuestionInTest - arr.length))
//             }else{
//                 return index >= start && index < (start+numOfQuestionInTest)
//             }
//         }))
//     }
//     return test;
// }

// function makeExams(numOfTest, numE, numM, numH, easies, mediums, hards){
//   let exams = [];
//   let es = make(numOfTest, numE, easies);
//   let md = make(numOfTest, numM, mediums);
//   let hd = make(numOfTest, numH, hards);
//   if(es.length !== md.length || es.length !== hd.length || md.length !== hd.length)
//     return []
//   for(let i = 0; i < numOfTest; i++){
//     exams = [...exams, [...es[i], ...md[i], ...hd[i]]];
//   }
//   return exams;
// }

// makeExam(4, 20, 10, 10, easies, mediums, hards);
