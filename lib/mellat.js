'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _soap = require('soap');

var _soap2 = _interopRequireDefault(_soap);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mellat = function () {
  function Mellat(userConfig) {
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
  }

  _createClass(Mellat, [{
    key: 'paymentRequest',
    value: function paymentRequest(_ref, callback) {
      var _this2 = this;

      var amount = _ref.amount,
          orderId = _ref.orderId,
          callbackUrl = _ref.callbackUrl,
          additionalData = _ref.additionalData,
          payerId = _ref.payerId;

      if (!callback) {
        return new Promise(function (resolve, reject) {
          _this2.paymentRequest({ amount: amount, orderId: orderId, callbackUrl: callbackUrl, additionalData: additionalData, payerId: payerId }, function (error, res) {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          });
        });
      }
      var now = new Date();
      var args = {
        orderId: orderId,
        amount: amount,
        terminalId: this.config.terminalId,
        userName: this.config.username,
        userPassword: this.config.password,
        localDate: now.toISOString().slice(0, 10).replace(/-/g, ''),
        localTime: '' + now.getHours() + now.getMinutes() + now.getSeconds(),
        callBackUrl: callbackUrl,
        payerId: payerId || 0,
        additionalData: additionalData
      };
      return this.client.bpPayRequest(args, function (error, result) {
        if (error) {
          return callback(error);
        }
        var parsed = result.return.split(',');
        if (parsed.length < 2) {
          return callback(null, {
            resCode: parsed[0],
            refId: null
          });
        }
        var refId = parsed[1];
        return callback(null, {
          resCode: 0,
          refId: refId
        });
      });
    }
  }, {
    key: 'verifyPayment',
    value: function verifyPayment(_ref2, callback) {
      var _this3 = this;

      var orderId = _ref2.orderId,
          saleOrderId = _ref2.saleOrderId,
          saleReferenceId = _ref2.saleReferenceId;

      if (!callback) {
        return new Promise(function (resolve, reject) {
          _this3.verifyPayment({ orderId: orderId, saleOrderId: saleOrderId, saleReferenceId: saleReferenceId }, function (error, res) {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          });
        });
      }
      var args = {
        orderId: orderId,
        saleOrderId: saleOrderId,
        saleReferenceId: saleReferenceId,
        terminalId: this.config.terminalId,
        userName: this.config.username,
        userPassword: this.config.password
      };
      return this.client.bpVerifyRequest(args, function (error, result) {
        if (error) {
          return callback(error);
        }
        var parsed = result.return.split(',');
        if (parsed.length < 2) {
          return callback(null, {
            resCode: parsed[0],
            refId: null
          });
        }
        var refId = parsed[1];
        return callback(null, {
          resCode: 0,
          refId: refId
        });
      });
    }
  }, {
    key: 'settlePayment',
    value: function settlePayment(_ref3, callback) {
      var _this4 = this;

      var orderId = _ref3.orderId,
          saleOrderId = _ref3.saleOrderId,
          saleReferenceId = _ref3.saleReferenceId;

      if (!callback) {
        return new Promise(function (resolve, reject) {
          _this4.settlePayment({ orderId: orderId, saleOrderId: saleOrderId, saleReferenceId: saleReferenceId }, function (error, res) {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          });
        });
      }
      var args = {
        orderId: orderId,
        saleOrderId: saleOrderId,
        saleReferenceId: saleReferenceId,
        terminalId: this.config.terminalId,
        userName: this.config.username,
        userPassword: this.config.password
      };
      return this.client.bpSettleRequest(args, function (error, result) {
        if (error) {
          return callback(error);
        }
        var parsed = result.return.split(',');
        if (parsed.length < 2) {
          return callback(null, {
            resCode: parsed[0],
            refId: null
          });
        }
        var refId = parsed[1];
        return callback(null, {
          resCode: 0,
          refId: refId
        });
      });
    }
  }]);

  return Mellat;
}();

module.exports = Mellat;