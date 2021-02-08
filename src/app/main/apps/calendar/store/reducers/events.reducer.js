import * as Actions from '../actions';

const initialState = {
	entities: [],
	eventDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	}
};

const eventsReducer = (state = initialState, action) => {
	console.log('state',state)
	console.log('action.payload',action.payload)
	switch (action.type) {
		
		case Actions.SET_USER_DATA: {
			return {
				...state,
				...action.payload
			};
		}




		case Actions.GET_EVENTS: {
			const entities = action.payload.map(event => ({
				...event,
				start: new Date(event.start),
				end: new Date(event.end)
			}));

			return {
				...state,
				entities
			};
		}
		case Actions.OPEN_NEW_EVENT_DIALOG: {
			console.log('found it1')
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
			return {
				...state,
				eventDialog: {
					type: 'edit',
					props: {
						open: true
					},
					data: {
						...action.data,
						start: new Date(action.data.start),
						end: new Date(action.data.end)
					}
				}
			};
		}
		case Actions.CLOSE_EDIT_EVENT_DIALOG: {
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
		default: {
			return state;
		}
	}
};

export default eventsReducer;
