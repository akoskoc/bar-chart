import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './styles/main.css';
import { Provider } from "react-redux"

/* Reducer */
import reducer from "./reducers/reducer"

/* Store */
import { createStore } from "redux"

/* Components */
import ChartComponent from "./components/chart"


const store = createStore(reducer)


class App extends React.Component {
    render() {
        return(
            <ChartComponent />
        )
    }
}


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
