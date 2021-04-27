import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Amplify from 'aws-amplify';

// Amplify init

let config = { aws_project_region: undefined };
async function fetchConfig(url = 'aws-export.json') {
  if (!config.aws_project_region) {
    try {
      const response = await fetch(url);
      config = await response.json();
      console.debug('(Loading config.json) config.json content = ', config);
      return config;
    } catch (e) {
      console.error(`error loading json ${e}`);
    }
  } else {
    return config;
  }
}

console.log(`getConfig`);

fetchConfig().then((config) => {
  Amplify.configure(config);
  ReactDOM.render(<App />, document.getElementById('root'));
});
registerServiceWorker();
