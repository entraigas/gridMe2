import { CHANGE_PAYER_PROPS } from "./actionsTypes"

const initialState = {
    data: [],
    isLoading: false,
    errors: ''
}

export default function playersReducer(state = initialState, action){
	switch (action.type) {
		case CHANGE_PAYER_PROPS:
			return Object.assign({}, state, action.props);
		default:
			return state;
	}

}
