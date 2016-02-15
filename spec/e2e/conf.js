exports.config = {
  framework: 'jasmine',
  chromeDriver: '../../node_modules/protractor/selenium/chromedriver',
  specs: ['spec.js'],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      args: ['--no-proxy-server'],
    }
  }
};

