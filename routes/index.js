var express = require('express');
var router = express.Router();
var fileController = require('../controllers/file')
var quizController = require('../controllers/QuizController')
var homeController = require('../controllers/home')
var subjectController = require('../controllers/subject')
var upload = require('../middlewares/upload')

router.get('/', homeController.getHomepage);
router.get('/mon-hoc/{slug}', subjectController.getSubject)
router.post('/upload', upload.single("file"), fileController.upload)
router.post('/update-load-file', subjectController.updateLoadedFile)
router.get('/de', fileController.getView);
router.post('/export-exam', fileController.exportExam);
router.get('/create-exam', quizController.getCreateExam);
router.post('/create-exam', quizController.postCreateExam);
router.get('/subjects/get-num/:subjectId', quizController.getNumQuestionInSubject);
router.post('/subjects/:slug/create', quizController.createNewQuestion);
router.post('/subjects/:slug/update', quizController.updateQuestion);
router.post('/subjects/:slug/destroy', quizController.destroyQuestion);
router.get('/subjects/:slug', quizController.list);
module.exports = router;