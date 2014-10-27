offices = require('../offices.json');

exports.index = function(req, res) {
	res.render('login', { officeid: 'Boston', offices: offices});
};

//offices: ['Chicago', 'Boston', 'Denver']