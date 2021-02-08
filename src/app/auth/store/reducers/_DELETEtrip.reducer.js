import * as Actions from '../actions';

const initialState = {
	role: [], // guest
	modal: true,
	data: {
		displayName: 'John Doe',
		photoURL: 'assets/images/avatars/Velazquez.jpg',
		email: 'johndoe@withinpixels.com',
		shortcuts: ['calendar', 'mail', 'contacts', 'todo']
	},
	tripData: {
		type: 'new',
		props: {
			open: true
		},
		data: null
	},
	//new 
	trip: {
		active: false,
		openDialog: true,
	} 
};

const user = (state = initialState, action) => {
	switch (action.type) {
		case Actions.SET_USER_DATA: {
			return {
				...initialState,
				...action.payload
			};
		}
		case Actions.CLOSE_TRIP_DIALOG: {
			return {
				...initialState,
				trip: {
					...initialState.trip,
					openDialog: false,
				} 
			};
		}
		case Actions.REMOVE_USER_DATA: {
			return {
				...initialState
			};
		}
		case Actions.USER_LOGGED_OUT: {
			return initialState;
		}
		default: {
			return state;
		}
	}
};

export default user;
