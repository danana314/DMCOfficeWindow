var _ = require('underscore');

exports.authenticator = {
  checkIn: function (req, res) {
      res.render('login', {layout: 'login'});
  }
};