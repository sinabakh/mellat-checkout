'use strict';

var _soap = require('soap');

var _soap2 = _interopRequireDefault(_soap);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mellat = function Mellat(userConfig) {
  var _this = this;

  _classCallCheck(this, Mellat);

  this.config = Object.assign(_config2.default, userConfig);
  _soap2.default.createClient(this.config.apiUrl, {
    envelopeKey: 'x',
    overrideRootElement: {
      namespace: 'ns1'
    }
  }, function (error, client) {
    if (error) {
      console.error(error);
    }
    _this.client = client;
  });
};

module.exports = Mellat;