import Framework from './Framework'
import State from './State'
import App from './components/App'

// render into the div with id='app'
(new Framework('app', State, App)).render()