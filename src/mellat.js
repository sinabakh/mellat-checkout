import Soap from 'soap';

import BaseConfig from './config';

class Mellat {
  constructor(userConfig) {
    this.config = Object.assign(BaseConfig, userConfig);
    Soap.createClient(this.config.apiUrl, {
      envelopeKey: 'x',
      overrideRootElement: {
        namespace: 'ns1',
      },
    }, (error, client) => {
      if (error) {
        console.error(error);
      }
      this.client = client;
    });
  }
}

module.exports = Mellat;
