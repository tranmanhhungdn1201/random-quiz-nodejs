//Test by function
function makeTest(numOfTest, numOfQuestionInTest, arrayQuestion){
    let result = [];
    for(let i=0; i<numOfTest; i++){
        result.push(arrayQuestion.splice(0, numOfQuestionInTest))
    }
    return result;
}
function makeOneTypeTest(numOfTest, numOfQuestionInTest, arrayQuestion){
    if(arrayQuestion.length > numOfTest*numOfQuestionInTest){
        makeTest(numOfTest, numOfQuestionInTest, arrayQuestion);
    }else if(arrayQuestion.length > numOfQuestionInTest){
        let numOfTestOk = Math.floor(arrayQuestion.length/n)
    }else{

    }
}
function makeTest(numOfTest, numOfEasy, numOfMedium, numOfHard, easies, mediums, hards, full){
    


}