exports.index = function(req, res) {
	res.render('index', { peerid: 'Boston', offices: ['Chicago', 'Boston', 'Denver'] });
};