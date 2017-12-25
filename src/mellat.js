import Soap from 'soap';

import BaseConfig from './config';

class Mellat {
  constructor(userConfig) {
    this.config = Object.assign(BaseConfig, userConfig);
  }

  initialize(callback) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.initialize((error, res) => {
          if (error) {
            return reject(error);
          }
          return resolve(res);
        });
      });
    }
    return Soap.createClient(this.config.apiUrl, {
      envelopeKey: 'x',
      overrideRootElement: {
        namespace: 'ns1',
      },
      wsdl_options: {
        timeout: this.config.timeout,
      },
    }, (error, client) => {
      if (error) {
        return callback(error);
      }
      this.client = client;
      return callback(null);
    });
  }

  paymentRequest({ amount, orderId, callbackUrl, additionalData, payerId }, callback) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.paymentRequest({ amount, orderId, callbackUrl, additionalData, payerId },
          (error, res) => {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          });
      });
    }
    const now = new Date();
    const args = {
      orderId,
      amount,
      terminalId: this.config.terminalId,
      userName: this.config.username,
      userPassword: this.config.password,
      localDate: now.toISOString().slice(0, 10).replace(/-/g, ''),
      localTime: `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`,
      callBackUrl: callbackUrl,
      payerId: payerId || 0,
      additionalData,
    };
    return this.client.bpPayRequest(args, (error, result) => {
      if (error) {
        return callback(error);
      }
      const parsed = result.return.split(',');
      if (parsed.length < 2) {
        return callback(null, {
          resCode: parsed[0],
          refId: null,
        });
      }
      const refId = parsed[1];
      return callback(null, {
        resCode: 0,
        refId,
      });
    });
  }

  verifyPayment({ orderId, saleOrderId, saleReferenceId }, callback) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.verifyPayment({ orderId, saleOrderId, saleReferenceId },
          (error, res) => {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          });
      });
    }
    const args = {
      orderId,
      saleOrderId,
      saleReferenceId,
      terminalId: this.config.terminalId,
      userName: this.config.username,
      userPassword: this.config.password,
    };
    return this.client.bpVerifyRequest(args, (error, result) => {
      if (error) {
        return callback(error);
      }
      return callback(null, { resCode: result.return });
    });
  }

  settlePayment({ orderId, saleOrderId, saleReferenceId }, callback) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.settlePayment({ orderId, saleOrderId, saleReferenceId },
          (error, res) => {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          });
      });
    }
    const args = {
      orderId,
      saleOrderId,
      saleReferenceId,
      terminalId: this.config.terminalId,
      userName: this.config.username,
      userPassword: this.config.password,
    };
    return this.client.bpSettleRequest(args, (error, result) => {
      if (error) {
        return callback(error);
      }
      return callback(null, { resCode: result.return });
    });
  }
}

module.exports = Mellat;
