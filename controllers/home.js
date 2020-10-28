function getHomepage(req, res){
  res.render('index', { title: 'Express' });
}

module.exports = {
    getHomepage
}