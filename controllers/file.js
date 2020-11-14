var docx4js = require('docx4js');
var fs = require("fs");
var { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableCell, TableRow, WidthType, BorderStyle} = require("docx");
let a = require('docx')
var WordExtractor = require("word-extractor");
var extractor = new WordExtractor();
var { splitQuestion, checkQuestionExistInDb } = require('../helpers/functions')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
var { cleanFileUploaded } = require('../helpers/clean');
const { type } = require('process');

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
            let [countDuplicate, arrayQuestionDuplicate] = checkQuestionExistInDb(dataFormat, questionsDB)

            res.send({
                data: dataFormat,
                countDuplicate,
                subjects,
                arrayQuestionDuplicate
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
    const index = req.body.index;
    const subject = db.get('subjects').find({id: req.body.subjectId}).value();
    const data = JSON.parse(req.body.data);
    const string = await createFileExam(data, index, subject);
    const stringA = await createFileAnswer(data, index);

    return res.json({
        string,
        stringA
    })
}

function findResult(answers){
    let Answer = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D'
    }
    let index = answers.findIndex(item=>item.isTrue);
    return Answer[index]
}

function createTableHeader(subject){
    let table = [
        new TableRow({
            children: [
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.DOUBLE,
                            size: 3,
                            color: "black",
                        },
                        bottom: {
                            style: BorderStyle.DOUBLE,
                            size: 3,
                            color: "black",
                        },
                        left: {
                            style: BorderStyle.DOUBLE,
                            size: 3,
                            color: "black",
                        },
                        right: {
                            style: BorderStyle.DOUBLE,
                            size: 3,
                            color: "black",
                        },
                    },
                    width: {
                        type: WidthType.PERCENTAGE,
                        size: 50
                    },
                    alignment: AlignmentType.CENTER,
                    children: [
                        new Paragraph('\n'),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: 'TRƯỜNG QUÂN SỰ QUÂN KHU 5\n',
                                    size: 28
                                })
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: 'KHOA ......\n',
                                    size: 28
                                })
                            ]
                        }),
                        new Paragraph('\n')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.DOUBLE,
                            size: 3,
                            color: "black",
                        },
                        bottom: {
                            style: BorderStyle.DOUBLE,
                            size: 3,
                            color: "black",
                        },
                        left: {
                            style: BorderStyle.DOUBLE,
                            size: 3,
                            color: "black",
                        },
                        right: {
                            style: BorderStyle.DOUBLE,
                            size: 3,
                            color: "black",
                        },
                    },
                    width: {
                        type: WidthType.PERCENTAGE,
                        size: 50
                    },
                    alignment: AlignmentType.CENTER,
                    children: [
                        new Paragraph('\n'),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: `Thi kết thúc môn: ${subject.name}\n`,
                                    size: 28
                                })
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: 'Thời gian:.....\n',
                                    size: 28
                                })
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: 'Lớp:........\n',
                                    size: 28
                                })
                            ]
                        }),
                        new Paragraph('\n')
                    ]
                })
            ],
        })
    ]
    return table
}

function createTableAnswer(dataArr){
    let cells = []
    let rows = []
    dataArr.forEach((item, index)=>{
        cells.push(
            new TableCell({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `  ${index+1}${findResult(item.answers)}\t`,
                                bold: true,
                                size: 28
                            })
                        ]
                    }),
                ], 
            })
        )
        if((index === (dataArr.length-1)) && (cells.length !== 10)){
            rows.push(new TableRow({
                children: cells
            }))
            cells = []
        }
        if((index+1) % 10 === 0){
            rows.push(new TableRow({
                children: cells
            }))
            cells = []
        }
    })
    return rows
}

function createFileAnswer(data, index){
    const table = new Table({
        rows: createTableAnswer(data)
    });

    // Create document
    const doc = new Document();
    // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
    // This simple example will only contain one section
    const children = data.reduce((content, quiz, i) => {
        return [...content,
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Câu ${i + 1}. `,
                        bold: true,
                        size: 28
                    }),
                    new TextRun({
                        text: quiz.content,
                        size: 28
                    }),
                ],
                alignment: AlignmentType.JUSTIFIED,
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  A. ",
                        bold: true,
                        size: 28
                    }),
                    new TextRun({
                        text: quiz.answers[0].content,
                        color: quiz.answers[0].isTrue ? "FF0000" : "000000",
                        size: 28
                    }),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        size: 28,
                        text: "  B. ",
                        bold: true,
                    }),
                    new TextRun({
                        size: 28,
                        text: quiz.answers[1].content,
                        color: quiz.answers[1].isTrue ? "FF0000" : "000000"
                    }),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        size: 28,
                        text: "  C. ",
                        bold: true,
                    }),
                    new TextRun({
                        size: 28,
                        text: quiz.answers[2].content,
                        color: quiz.answers[2].isTrue ? "FF0000" : "000000"
                    }),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        size: 28,
                        text: "  D. ",
                        bold: true,
                    }),
                    new TextRun({
                        size: 28,
                        text: quiz.answers[3].content,
                        color: quiz.answers[3].isTrue ? "FF0000" : "000000"
                    }),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun(" "),
                ],
            })
        ];
    }, [
        new Paragraph({
            style: "size:20",
            children: [
                new TextRun({
                    text: `Đề ${+index + 1}`,
                    bold: true,
                    size: 28
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
                after: 200,
            },
        }) ,
        table ,
        new Paragraph({
            children: [
                new TextRun({
                    text: '\n'
                })
            ]
        })
    ]);
    doc.addSection({
        properties: {},
        children: [
            new Paragraph({
                style: "size:20",
                children: [
                    new TextRun({
                        text: `Đề ${+index + 1}`,
                        bold: true,
                        size: 28
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: {
                    after: 200,
                },
            }) ,
            table ,
            new Paragraph({
                children: [
                    new TextRun({
                        text: '\n'
                    })
                ]
            })
        ]
    });

    // Used to export the file into a .docx file
    return Packer.toBase64String(doc).then((string) => {
        return string;
    });
}

function createFileExam(data, index, subject = '.......'){
    // Create document
    const doc = new Document();
    // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
    // This simple example will only contain one section
    const children = data.reduce((content, quiz, i) => {
        return [...content,
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Câu ${i + 1}. `,
                        bold: true,
                        size: 28
                    }),
                    new TextRun({
                        text: quiz.content,
                        size: 28
                    }),
                ],
                alignment: AlignmentType.JUSTIFIED
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  A. ",
                        bold: true,
                        size: 28
                    }),
                    new TextRun({
                        text: quiz.answers[0].content,
                        size: 28
                    }),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  B. ",
                        bold: true,
                        size: 28
                    }),
                    new TextRun({
                        text: quiz.answers[1].content,
                        size: 28
                    }),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  C. ",
                        bold: true,
                        size: 28
                    }),
                    new TextRun({
                        text: quiz.answers[2].content,
                        size: 28
                    }),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "  D. ",
                        bold: true,
                        size: 28
                    }),
                    new TextRun({
                        text: quiz.answers[3].content,
                        size: 28
                    }),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun(" "),
                ],
            })
        ];
    }, [
        new Table({
            rows: createTableHeader(subject)
        }),
        new Paragraph('\n'),
        new Paragraph({
            children: [
                new TextRun({
                    text: `ĐỀ 0${+index + 1}`,
                    bold: true,
                    size: 30
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
                after: 200,
            },
        })
    ]);
    doc.addSection({
        properties: {},
        children: children
    });
    // Used to export the file into a .docx file
    return Packer.toBase64String(doc).then((string) => {
        return string;
    });
}

function createPage(req, res){

    // Create document
    const doc = new Document();

    
    const table = new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph("Hello")],
                    }),
                    new TableCell({
                        children: [],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [],
                    }),
                    new TableCell({
                        children: [new Paragraph("World")],
                    }),
                ],
            }),
        ],
    });

    doc.addSection({
        children: [table],
    });
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

    const file = `files/result.docx`;
    res.download(file); // Set disposition and send it.

}

module.exports = {
    getView,
    exportExam,
    upload,
    createPage
}