import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BasicExample from './Quick';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(<BasicExample />, document.getElementById('root'));
registerServiceWorker();
