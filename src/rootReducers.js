import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { combineReducers } from "redux";

// custom reducers
import playersReducer from "./players/reducers"

const rootReducer = combineReducers({
    players: playersReducer
})

// end custom reducers

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

export default function configureStore(initialState, persistedState) {
	const store = createStoreWithMiddleware(
		rootReducer,
		initialState,
		persistedState
	);
	return store;
}
