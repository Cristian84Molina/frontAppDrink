import {createStore, combineReducers, applyMiddleware, compose} from "redux";
//import thunkMiddleware from "redux-thunk";
//import { composeWithDevTools } from "redux-devtools-extension";

import rutaReducer from "./reducer";

const rootReducer = combineReducers({
   rutaReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
    rootReducer,

);
//composeEnhancers(applyMiddleware(thunkMiddleware))

export default store;