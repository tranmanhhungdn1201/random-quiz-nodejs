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
let quizes = [{"id":0,"content":0,"level":"k"},{"id":1,"content":1,"level":"v"},{"id":2,"content":2,"level":"v"},{"id":3,"content":3,"level":"k"},{"id":4,"content":4,"level":"k"},{"id":5,"content":5,"level":"v"},{"id":6,"content":6,"level":"v"},{"id":7,"content":7,"level":"v"},{"id":8,"content":8,"level":"v"},{"id":9,"content":9,"level":"k"},{"id":10,"content":10,"level":"d"}, {"id":11,"content":11,"level":"k"}, {"id":12,"content":12,"level":"k"}, {"id":13,"content":13,"level":"k"}];
let quizes1 = [{"id":0,"":0,"level":"k"},{"id":1,"content":1,"level":"v"},{"id":2,"content":2,"level":"v"}];

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

function splitArray(arr, n, size){
  let arrN = [];
  console.log('arr.length', arr.length)
  console.log('n', n)
  console.log('size', size)
  for(let i = 0; i < size; i++){
    if(n === 0){
      arrN = [...arrN, []];
      continue;
    }
    if(arr.length < size){
      arrN = [...arrN, ...arr];
    } else {
      let indexEnd = i === 0 ? n : (i + 1)*n;
      arrN = [...arrN, arr.slice(i*n, indexEnd)];
    }
  }
  arrN = [...arrN, arr.slice(size*n)];
  return arrN;
}

function joinArray(arr, n, numExam){
  let numItem = Math.floor(arr.length/numExam) > n ? n : Math.floor(arr.length/numExam);
  let numRest = n - numItem;
  let arrSplit = splitArray(arr, numItem, numExam);
  console.log('arrSplit', arrSplit)
  console.log('numItem', numItem)
  // let arrRest = arrSplit.pop();
  let arrRest = arrSplit.pop().map(item => Object.assign({isDup: true}, item))
  console.log('rest', arrSplit)
  let arrJoin = [...arrSplit];
  let lenArrJoin = arrJoin.length;
  if(numItem === 0){
    for(let i = 0, j = 0; i < numExam; j++, i++){
      if(arrRest.length > 1){
        let idx = j === arrRest.length - 1 ? 0 : j + 1;
        if(j === arrRest.length){
          j = 0;
          idx = 1;
        }
        arrJoin[i] = [Object.assign({}, arrRest[j]), Object.assign({}, arrRest[idx])];
      } else {
        arrJoin[i] = [Object.assign({}, arrRest[0])];
      }
    }
  }
  
  if(arrSplit[0].length !== n  && numItem > 0) {
    for(let i = 0; i < arrJoin.length; i++){
      let index = 0
      if(arrRest.length > 1){
        index = arrRest[i] ? i : Math.floor(i/arrRest.length - 1);
      }
      let num = numRest;
      if(numRest === arrRest.length){
        arrJoin[i] = [...arrJoin[i], ...arrRest]
        num--
        continue;
      }else if(arrRest[index]) {
        arrJoin[i] = [...arrJoin[i], arrRest[index]]
        num--
      }
      let idx = i;
      while(num > 0 && idx < lenArrJoin){
        console.log('idx', idx);
        console.log('numStart',  num);
        if(idx === 0){
          let itemLast = [...[...arrJoin[lenArrJoin - 1].filter(item => !item.isDup)].slice(-num)];
          if(itemLast.length === 0 || calPercent(itemLast, arrJoin[idx]) === 100){
            itemLast = [selectItemAnotherDiffArr(arrJoin[idx], arr)];
            num--;
          }else{
            num = num - itemLast.length;
          }
          itemLast = itemLast.map(item => Object.assign({isDup: true}, item));
          arrJoin[idx] = [...arrJoin[idx], ...itemLast];
        } else {
          let itemLast1 = [...[...arrJoin[idx - 1].filter(item => !item.isDup)].slice(-num)];
          if(itemLast1.length === 0 || calPercent(itemLast1, arrJoin[idx]) === 100){
            itemLast1 = [selectItemAnotherDiffArr(arrJoin[idx], arr)];
            num--;
          }else{
            num = num - itemLast1.length;
          }
          itemLast1 = itemLast1.map(item => Object.assign({isDup: true}, item));
          arrJoin[idx] = [...arrJoin[idx], ...itemLast1];
        }
        console.log('numEnd',  num);
      }
    }
  }
  console.log('arrJoin', arrJoin);
  return arrJoin;
}

function selectItemAnotherDiffArr(arr, arrOrigin){
  let arrDiff = [];
  for(let i = 0; i < arrOrigin.length; i++){
    let item = arr.some(item => item.id === arrOrigin[i].id);
    console.log(item)
    if(!item){
      arrDiff = [...arrDiff, arrOrigin[i]];
    }
  }
  console.log('getItemRandomArr', arr, arrOrigin);
  console.log('arrDiff', arrDiff);
  return getItemRandomArr(arrDiff);
}

function getItemRandomArr(arr){
  let idxR = Math.floor(Math.random() * arr.length);
  
  return arr[idxR];
}

const test = joinArray(quizes, 10, 3)
const a1 = [
  { id: 0, content: 0, level: 'k' },
  { id: 1, content: 1, level: 'v' },
  { id: 2, content: 2, level: 'v' },
  { id: 9, content: 9, level: 'k' },
  { id: 10, content: 10, level: 'd' }
]
const a2 = [
  { id: 3, content: 3, level: 'k' },
  { id: 4, content: 4, level: 'k' },
  { id: 5, content: 5, level: 'v' },
  { id: 9, content: 9, level: 'k' },
  { id: 10, content: 10, level: 'd' }
]
// console.log(calPercent(a1, a2))
// console.log(calPercent(test[0], test[1]))
// console.log(calPercent(test[1], test[2]))
// console.log(calPercent(test[0], test[2]))

function calPercent(arr1, arr2){
  let count = 0;
  arr1.forEach((item1, index)=>{
      if(arr2.some(item2 => item1.id === item2.id) ) count += 1;
  })
  // console.log('count', count, count/arr1.length);
  return count/arr1.length*100;
}