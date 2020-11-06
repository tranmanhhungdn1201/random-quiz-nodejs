var express = require('express');
var router = express.Router();
var fileController = require('../controllers/file')
var quizController = require('../controllers/QuizController')
var homeController = require('../controllers/home')
var subjectController = require('../controllers/subject')
var upload = require('../middlewares/upload')
var docx4js = require('docx4js');
var parseString = require('xml2js').parseString;
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

var WordExtractor = require("word-extractor");
var extractor = new WordExtractor();

function formatXml(xml, tab) { // tab = optional indent value, default is tab (\t)
    var formatted = '',
        indent = '';
    tab = tab || '\t';
    xml.split(/>\s*</).forEach(function(node) {
        if (node.match(/^\/\w/)) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';
        if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab; // increase indent
    });
    return formatted.substring(1, formatted.length - 3);
}

/* GET home page. */
router.get('/', homeController.getHomepage);
router.get('/mon-hoc/{slug}', subjectController.getSubject)
router.post('/upload', upload.single("file"), fileController.upload)
router.post('/update-load-file', subjectController.updateLoadedFile)

router.get('/questions', async function(req, res) {
    let questions = db.get('questions')
        .value()
    res.send(questions)
})


function splitQuestion(data, num) {
    let arr = [];
    console.log('length', data.length);
    let id = (Math.random() + "").split('.')[1];
    while (data.length > num) {
        let questionArr = data.splice(0, 5);

        let regexExtract = /(^[DKV])*\(([DKV])\)(.*)/s.exec(questionArr[0])

        let questionObj = {
            idSubject: id,
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

router.get('/file', function(req, res, next) {
    // console.log('111', docx4js);
    let questions = [];
    var extracted = extractor.extract("files/de11.doc");
    extracted.then(async function(doc) {
        let data = doc.getBody().split(/\r?\n/);
        console.log(doc.getBody().split(/\r?\n/));
        const dataFormat = splitQuestion(data, 5);

        await db.get('questions').push(...dataFormat).write()

        // dataFormat.forEach(async item=>{
        //   console.log('qqqqqq');
        //   await db.get('questions').push(item).write()
        // })

        console.log('dataF', dataFormat);
    });
    // });

    /*
    let processFileWord = () => new Promise((resolve, reject)=>{
      docx4js.docx.load("files/de1.docx").then(async docx=>{
        docx.render(function createElement(type,props,children){
          console.log(children)
        })
        // console.log('docx', docx.raw.files["[Content_Types].xml"]._data.getContent());
        // console.log('keyyyy', Object.keys(docx.raw.files));
        // let doc = docx.raw.files["[Content_Types].xml"]._data.getContent()
        // var uint8array = new TextEncoder("utf-8").encode( docx.raw.files["[Content_Types].xml"]._data.getContent());
        // var string = new TextDecoder("utf-8").decode(doc);
        // console.log('1111word/_rels/document.xml.rels', (new TextDecoder("utf-8").decode(docx.raw.files["word/_rels/document.xml.rels"]._data.getContent())));
        let questions = [];
        
        let reg = /<w:t.*>(.*)<\/w:t>/g;
        let str = (new TextDecoder("utf-8").decode(docx.raw.files["word/document.xml"]._data.getContent())).toString();
        console.log('ttt', typeof str);
        // console.log('ssss', "sfsdfdsaff".replaceAll(/(s)/g, "\n$1"));
        // str = await str.replaceAll(/(<[a-zA-Z])/g, '\n$1')
        parseString(str, function (err, result) {
          let body = result['w:document']['w:body']
          let paragraph = body[0]['w:p']
          console.dir(paragraph);
          let itemQuestion = [];
          paragraph.forEach((item, index)=>{
            itemQuestion.push(item)
            if((index+1)%5 === 0){
              questions.push(itemQuestion);
              itemQuestion = []
            }
          });
        // console.log("question", questions);
  
        });
        str = formatXml(str)
        // console.log('strrrrrrrrrr', str);
        
        let data = reg.exec(str)
        let string = "";
        while (data != null) {
          // matched text: match[0]
          // match start: match.index
          // capturing group n: match[n]
          string += data[1]
          data = reg.exec(str)
        }
        // console.log('str', string)
        resolve(questions)
  
        //111
      }).catch((err)=> reject(err))
  
      
  
    })

    let data = await processFileWord()
    let questionsProcessed = [];
    console.log("length", JSON.stringify(data));
    data.forEach((item, index)=>{
      let questionProcessed = {};
      let arrQuestion = item[0]['w:r']
      console.log(arrQuestion);
      let arrAnswer1 = item[1]['w:r']
      let arrAnswer2 = item[2]['w:r']
      let arrAnswer3 = item[3]['w:r']
      let arrAnswer4 = item[4]['w:r']
      let content = arrQuestion[arrQuestion.length-1]['w:t'];
      // console.log(content);
      questionProcessed.content = arrQuestion[arrQuestion.length-1]['w:t'][0];
      questionProcessed.answers = [
        arrAnswer1[arrAnswer1.length-1]['w:t'][0],
        arrAnswer2[arrAnswer2.length-1]['w:t'][0],
        arrAnswer3[arrAnswer3.length-1]['w:t'][0],
        arrAnswer4[arrAnswer4.length-1]['w:t'][0],
      ];
      questionProcessed.level = 1;
      questionsProcessed.push(questionProcessed)
    })
    */
    //merge array
    // db
    // .get('questions')
    // .push(...[
    //   {
    //     idSubject: "199",
    //     content: "test1",
    //     answers: [
    //       "aaa",
    //       "bbb",
    //       "ccc",
    //       "ddd"
    //     ],
    //     result: "aaa",
    //     level: 1
    //   },
    //   {
    //     idSubject: "1999",
    //     content: "test2",
    //     answers: [
    //       "aaa",
    //       "bbb",
    //       "ccc",
    //       "ddd"
    //     ],
    //     result: "aaa",
    //     level: 1
    //   }
    // ])
    // .write();
    // res.send(JSON.stringify(questionsProcessed))
    // res.send(db.get('questions'));
});

router.post('/', (req, res) => {

})

module.exports = router;

///111
// do {
// console.log('dataaaaa', data);

//   // console.log(`${data[0]}`);
// } while((data = reg.exec(str)) !== null);

// console.log('dataaaaa', data);
// console.log('2222word/document.xml', (new TextDecoder("utf-8").decode(docx.raw.files["word/document.xml"]._data.getContent())));
// console.log('3333word/theme/theme1.xml', (new TextDecoder("utf-8").decode(docx.raw.files["word/theme/theme1.xml"]._data.getContent())));
// console.log('4444word/settings.xml', (new TextDecoder("utf-8").decode(docx.raw.files["word/settings.xml"]._data.getContent())));
// console.log('5555word/styles.xml', (new TextDecoder("utf-8").decode(docx.raw.files["word/styles.xml"]._data.getContent())));
// console.log('6666word/stylesWithEffects.xml', (new TextDecoder("utf-8").decode(docx.raw.files["word/stylesWithEffects.xml"]._data.getContent())));
// console.log('7777docProps/app.xml', (new TextDecoder("utf-8").decode(docx.raw.files["docProps/app.xml"]._data.getContent())));
// console.log('8888docProps/core.xml', (new TextDecoder("utf-8").decode(docx.raw.files["docProps/core.xml"]._data.getContent())));
// console.log('9999word/fontTable.xml', (new TextDecoder("utf-8").decode(docx.raw.files["word/fontTable.xml"]._data.getContent())));
// console.log('0000word/webSettings.xml', (new TextDecoder("utf-8").decode(docx.raw.files["word/webSettings.xml"]._data.getContent())));
// console.log('1111word/numbering.xml', (new TextDecoder("utf-8").decode(docx.raw.files["word/numbering.xml"]._data.getContent())));


//you can render docx to anything (react elements, tree, dom, and etc) by giving a function
// docx.render(function createElement(type,props,children){
//   let file = {type,props,children};
//   console.log('aaaa', file.children);
//   // console.log('aaaa11', file.type);
//   // console.log('aaaa222', file.props);
//   // file.children.map(a=>{
//   //   console.log('bb', a.props.node);
//   // })
//   // return {type,props,children}
// })



// /(^[DKV])*\(([DKV])\)(.*)/s.exec(`Câu 1. (D) Chúng ta vẫn biết rằng,(D) làm việc với một đoạn
// văn bản dễ đọc và rõ nghĩa dễ gây rối trí và cản trở việc tập trung vào yếu tố trình bày văn bản. Lorem Ipsum có ưu điểm hơn so với đoạn văn bản chỉ gồm nội dung kiểu "Nội dung, nội dung, nội dung" là nó khiến văn bản giống thật hơn, bình thường hơn. Nhiều phần mềm thiết kế giao diện web và dàn trang ngày nay đã sử dụng Lorem Ipsum làm đoạn văn bản giả, và nếu bạn thử tìm các đoạn "Lorem ipsum" trên mạng thì sẽ khám phá ra nhiều trang web hiện vẫn đang trong quá trình xây dựng. Có nhiều phiên bản khác nhau đã xuất hiện, đôi khi do vô tình, nhiều khi do cố ý (xen thêm vào những câu hài hước hay thông tục).`)


router.get('/de', fileController.getView);
router.post('/export-exam', fileController.exportExam);
router.get('/create-exam', quizController.getCreateExam);
router.post('/create-exam', quizController.postCreateExam);
router.get('/subjects/get-num/:subjectId', quizController.getNumQuestionInSubject);
router.post('/subjects/:slug/create', quizController.createNewQuestion);
router.get('/subjects/:slug', quizController.list);