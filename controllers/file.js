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

async function upload(req, res) {
    console.log('fileee', req.file);
    let file = req.file;
    let filename = file.filename
    let subjects = await db.get('subjects').value();
    if (filename) {
        let questions = [];
        var extracted = extractor.extract("files/de11.doc");
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
        }).catch(err => {
            console.log('eeee', err);
            return res.send({
                msg: "Xử lý thất bại",
                err
            })
        });
    } else {
        console.log('@3333');
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

function createTest(req, res) {

    // Create document
    const doc = new Document();

    // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
    // This simple example will only contain one section
    doc.addSection({
        properties: {},
        children: [
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Câu 1. ",
                        bold: true,
                    }),
                    new TextRun({
                        text: "Chúng ta vẫn biết rằng,(D) làm việc với một văn bản dễ đọc và rõ nghĩa dễ gây rối trí và cản trở việc tập trung vào yếu tố trình bày văn bản. Lorem Ipsum có ưu điểm hơn so với đoạn văn bản chỉ gồm nội dung kiểutrên mạng thì sẽ khám phá ra nhiều trang web hiện vẫn đang trong quá trình xây dựng. Có nhiều phiên bản khác nhau đã xuất hiện, đôi khi do vô tình, nhiều khi do cố ý (xen thêm vào những câu hài hước hay thông tục).",
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
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  B. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  C. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  D. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun(" "),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Câu 2. ",
                        bold: true,
                    }),
                    new TextRun({
                        text: "Chúng ta vẫn biết rằng,(D) làm việc với một văn bản dễ đọc và rõ nghĩa dễ gây rối trí và cản trở việc tập trung vào yếu tố trình bày văn bản. Lorem Ipsum có ưu điểm hơn so với đoạn văn bản chỉ gồm nội dung kiểutrên mạng thì sẽ khám phá ra nhiều trang web hiện vẫn đang trong quá trình xây dựng. Có nhiều phiên bản khác nhau đã xuất hiện, đôi khi do vô tình, nhiều khi do cố ý (xen thêm vào những câu hài hước hay thông tục).",
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
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  B. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  C. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  D. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun(" "),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Câu 3. ",
                        bold: true,
                    }),
                    new TextRun({
                        text: "Chúng ta vẫn biết rằng,(D) làm việc với một văn bản dễ đọc và rõ nghĩa dễ gây rối trí và cản trở việc tập trung vào yếu tố trình bày văn bản. Lorem Ipsum có ưu điểm hơn so với đoạn văn bản chỉ gồm nội dung kiểutrên mạng thì sẽ khám phá ra nhiều trang web hiện vẫn đang trong quá trình xây dựng. Có nhiều phiên bản khác nhau đã xuất hiện, đôi khi do vô tình, nhiều khi do cố ý (xen thêm vào những câu hài hước hay thông tục).",
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
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  B. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  C. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  D. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun(" "),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Câu 4. ",
                        bold: true,
                    }),
                    new TextRun({
                        text: "Chúng ta vẫn biết rằng,(D) làm việc với một văn bản dễ đọc và rõ nghĩa dễ gây rối trí và cản trở việc tập trung vào yếu tố trình bày văn bản. Lorem Ipsum có ưu điểm hơn so với đoạn văn bản chỉ gồm nội dung kiểutrên mạng thì sẽ khám phá ra nhiều trang web hiện vẫn đang trong quá trình xây dựng. Có nhiều phiên bản khác nhau đã xuất hiện, đôi khi do vô tình, nhiều khi do cố ý (xen thêm vào những câu hài hước hay thông tục).",
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
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  B. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  C. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  D. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun(" "),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Câu 5. ",
                        bold: true,
                    }),
                    new TextRun({
                        text: "Chúng ta vẫn biết rằng,(D) làm việc với một văn bản dễ đọc và rõ nghĩa dễ gây rối trí và cản trở việc tập trung vào yếu tố trình bày văn bản. Lorem Ipsum có ưu điểm hơn so với đoạn văn bản chỉ gồm nội dung kiểutrên mạng thì sẽ khám phá ra nhiều trang web hiện vẫn đang trong quá trình xây dựng. Có nhiều phiên bản khác nhau đã xuất hiện, đôi khi do vô tình, nhiều khi do cố ý (xen thêm vào những câu hài hước hay thông tục).",
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
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  B. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  C. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  D. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun(" "),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Câu 6. ",
                        bold: true,
                    }),
                    new TextRun({
                        text: "Chúng ta vẫn biết rằng,(D) làm việc với một văn bản dễ đọc và rõ nghĩa dễ gây rối trí và cản trở việc tập trung vào yếu tố trình bày văn bản. Lorem Ipsum có ưu điểm hơn so với đoạn văn bản chỉ gồm nội dung kiểutrên mạng thì sẽ khám phá ra nhiều trang web hiện vẫn đang trong quá trình xây dựng. Có nhiều phiên bản khác nhau đã xuất hiện, đôi khi do vô tình, nhiều khi do cố ý (xen thêm vào những câu hài hước hay thông tục).",
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
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  B. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  C. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  D. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun(" "),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Câu 7. ",
                        bold: true,
                    }),
                    new TextRun({
                        text: "Chúng ta vẫn biết rằng,(D) làm việc với một văn bản dễ đọc và rõ nghĩa dễ gây rối trí và cản trở việc tập trung vào yếu tố trình bày văn bản. Lorem Ipsum có ưu điểm hơn so với đoạn văn bản chỉ gồm nội dung kiểutrên mạng thì sẽ khám phá ra nhiều trang web hiện vẫn đang trong quá trình xây dựng. Có nhiều phiên bản khác nhau đã xuất hiện, đôi khi do vô tình, nhiều khi do cố ý (xen thêm vào những câu hài hước hay thông tục).",
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
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  B. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  C. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  D. ",
                        bold: true,
                    }),
                    new TextRun("Chúng ta vẫn biết rằng"),
                ],
            }),
        ],
    });

    // Used to export the file into a .docx file
    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("files/result.docx", buffer);
    });

}

module.exports = {
    getView,
    createTest,
    upload
}