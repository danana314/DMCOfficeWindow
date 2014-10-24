exports.index = function(req, res) {
	res.render('index', { officeid: 'Boston', offices: ['Chicago', 'Boston', 'Denver'] });
};