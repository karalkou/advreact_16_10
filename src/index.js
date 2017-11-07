import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import Root from './components/Root'
import './config'

// import {saveEventsToFB} from './mocks'
// saveEventsToFB()

ReactDOM.render(<Root />, document.getElementById('root'))
registerServiceWorker()
