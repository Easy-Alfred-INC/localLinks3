import * as Actions from '../actions';

const initialState = {
	role: [], // guest
	data: {
		openDialog: true,
		displayName: 'User Name',
		photoURL: '',
		email: '',
		shortcuts: ['calendar', 'mail', 'contacts', 'todo']
	},
	trip: {
		active: false,
		isCartLocked: false,
		openDialog: true,
		invoiceLink: '',
		lastUpdated: Date.now(),
		// data: {},
		// events: [],
	}, 
	// tripArchive: [],
	eventDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	},
	allUsers: [],
};

const user = (state = initialState, action) => {
	// console.log('action.data=', action.data);
	switch (action.type) {

			
		case Actions.GET_EVENTS: {
			// console.log('yooo in reducer getEvents 2', action.payload);
			// console.log('yooo in reducer getEvents 3',state )
			return {...action.payload}
			// return {
			// 	...state,
			// 	trip: {
			// 		data: {
			// 			events: {
			// 				data: {...action.payload}
			// 			}
			// 		}
			// 	}
			// };
		}
		case Actions.OPEN_NEW_EVENT_DIALOG: {
			// console.log('found it 2')
			return {
				...state,
				eventDialog: {
					type: 'new',
					props: {
						open: true
					},
					data: {
						...action.data
					}
				}
			};
		}
		case Actions.CLOSE_NEW_EVENT_DIALOG: {
			console.log('in CLOSE_NEW_EVENT_DIALOG');
			return {
				...state,
				eventDialog: {
					type: 'new',
					props: {
						open: false
					},
					data: null
				}
			};
		}
		case Actions.OPEN_EDIT_EVENT_DIALOG: {
			console.log('event3333 OPEN_EDIT_EVENT_DIALOG', action.data);
			// break
			return {
				...state,
				eventDialog: {
					type: 'edit',
					props: {
						open: true
					},
					data: {
						...action.data,
						// start: new Date(action.data.start),
						// end: new Date(action.data.end)
					}
				}
			};
		}
		case Actions.OPEN_EDIT_EVENT_DIALOG_ADMIN: {
			console.log('event444', action.data);
			// break
			return {
				...state,
				eventDialog: {
					type: 'edit',
					fromAdmin: true,
					props: {
						open: true
					},
					data: {
						...action.data,
						// start: new Date(action.data.start),
						// end: new Date(action.data.end)
					}
				}
			};
		}
		case Actions.CLOSE_EDIT_EVENT_DIALOG: {
			console.log('in CLOSE_EDIT_EVENT_DIALOG');
			
			return {
				...state,
				eventDialog: {
					type: 'edit',
					props: {
						open: false
					},
					data: null
				}
			};
		}


		// trip
		case Actions.CLOSE_TRIP_DIALOG: {
			return {
				...state,
			};
		}
		case Actions.CLOSE_UPDATE_USER_DATA_DIALOG: {
			return {
				...state,
			};
		}
		case Actions.OPEN_UPDATE_USER_DATA_DIALOG: {
			return {
				...state,
				data: {
					...state.data,
					openDialog: true
				}
			};
		}


		//from templatte
		case Actions.SET_USER_DATA: {
			return {
				...initialState,
				...action.payload
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
	
	
		// case Actions.SET_ALL_USER_DATA: {
		// 	console.log('state22-', state);
		// 	console.log('action.payload', action.payload);
			
		// 	// return {
		// 	// 	...state,
		// 	// 	allUsers: [
		// 	// 		action.payload
		// 	// 	]
		// 	// };
		// }


		default: {
			return state;
		}
	}
};

export default user;
