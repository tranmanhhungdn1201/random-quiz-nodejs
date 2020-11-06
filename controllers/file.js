var docx4js = require('docx4js');
var fs = require("fs");
var { Document, Packer, Paragraph, TextRun } = require("docx");
var WordExtractor = require("word-extractor");
var extractor = new WordExtractor();
var { splitQuestion, checkQuestionExistInDb } = require('../helpers/functions')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
var { cleanFileUploaded } = require('../helpers/clean')

async function upload(req, res) {
    let file = req.file;
    let filename = file.filename
    let subjects = await db.get('subjects').value();
    if (filename) {
        let questions = [];
        var extracted = extractor.extract(`files/uploads/${filename}`);
        extracted.then(async function(doc) {
            let data = doc.getBody().split(/\r?\n/);
            const dataFormat = splitQuestion(data, 5);
            const questionsDB = await db.get('questions').value()
            let countDuplicate = checkQuestionExistInDb(dataFormat, questionsDB)
                // await db.get('questions').push(...dataFormat).write()

            res.send({
                data: dataFormat,
                countDuplicate,
                subjects
            })
            cleanFileUploaded();
        }).catch(err => {
            console.log('err', err);
            return res.send({
                msg: "Xử lý thất bại",
                err
            })
        });
    } else {
        res.send({
            msg: "Chọn file thất bại"
        })
    }

}

function getView(req, res) {
    res.send({
        a: 222
    })
}

async function exportExam(req, res) {
    console.log('exportExam');
    // Create document
    const doc = new Document();
    const data = JSON.parse(req.body.data);
    // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
    // This simple example will only contain one section
    const children = data.reduce((content, quiz, i) => {
        return [...content,
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Câu ${i + 1}. `,
                        bold: true,
                    }),
                    new TextRun({
                        text: quiz.content,
                        style: "size:13"
                    }),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  A. ",
                        bold: true,
                    }),
                    new TextRun(quiz.answers[0].content),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  B. ",
                        bold: true,
                    }),
                    new TextRun(quiz.answers[1].content),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  C. ",
                        bold: true,
                    }),
                    new TextRun(quiz.answers[2].content),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  D. ",
                        bold: true,
                    }),
                    new TextRun(quiz.answers[3].content),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun(" "),
                ],
            })
        ];
    }, []);
    doc.addSection({
        properties: {},
        children: children
    });
    // Used to export the file into a .docx file
    let buffer = await Packer.toBuffer(doc);
    console.log('fileee', typeof buffer);
    return res.send(buffer)
    // res.download(file);
}

module.exports = {
    getView,
    exportExam,
    upload
}