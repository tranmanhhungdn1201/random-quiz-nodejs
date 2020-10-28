function list(req, res){
    res.render('listQuiz', { title: 'List Quiz' });
}

module.exports = {
    list,
}