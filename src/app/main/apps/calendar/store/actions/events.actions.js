import axios from 'axios';
import firebaseService from 'app/services/firebaseService';

export const GET_EVENTS = '[CALENDAR APP] GET EVENTS';
export const OPEN_NEW_EVENT_DIALOG = '[CALENDAR APP] OPEN NEW EVENT DIALOG';
export const CLOSE_NEW_EVENT_DIALOG = '[CALENDAR APP] CLOSE NEW EVENT DIALOG';
export const OPEN_EDIT_EVENT_DIALOG = '[CALENDAR APP] OPEN EDIT EVENT DIALOG';
export const CLOSE_EDIT_EVENT_DIALOG = '[CALENDAR APP] CLOSE EDIT EVENT DIALOG';
export const ADD_EVENT = '[CALENDAR APP] ADD EVENT';
export const UPDATE_EVENT = '[CALENDAR APP] UPDATE EVENT';
export const REMOVE_EVENT = '[CALENDAR APP] REMOVE EVENT';

export const SET_USER_DATA = '[CALENDAR APP] SET USER DATA';

export function getEvents() {
	const request = axios.get('/api/calendar-app/events');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_EVENTS,
				payload: response.data
			})
		);
}

export function openNewEventDialog(data) {
	return {
		type: OPEN_NEW_EVENT_DIALOG,
		data
	};
}

export function closeNewEventDialog() {
	console.log('-=closeNewEventDialog');
	
	return {
		type: CLOSE_NEW_EVENT_DIALOG
	};
}

export function openEditEventDialog(data) {
	return {
		type: OPEN_EDIT_EVENT_DIALOG,
		data
	};
}

export function closeEditEventDialog() {
	console.log('-=closeEditEventDialog');
	return {
		type: CLOSE_EDIT_EVENT_DIALOG
	};
}

export function addEvent(newEvent) {
	return (dispatch, getState) => {
		const { user } = getState().auth;

		const newEventWithUpdatedDates = {
			...newEvent,
			start: newEvent.start.format(),
			end: newEvent.end.format()
		}
		// console.log('newEventWithUpdatedDates', user.trip.data.events.data)
		const newUser = {
			...user,
			trip: {
				...user.trip,
				data: {
					...user.trip.data,
					events: {
						...user.trip.data.events,
						data: [
							...user.trip.data.events.data,
							newEventWithUpdatedDates
						]
					}
				}
			}
		}
		updateUserData(newUser, dispatch);
		return dispatch(setUserData(newUser));
	};
}

// export function addEventFromAdmin(newEvent) {
// 	return (dispatch, getState) => {
// 		const user  = newEvent.user
// 		delete newEvent["user"];

// 		// console.log('newEvent22', newEvent)
		
// 		const newEventWithUpdatedDates = {
// 			...newEvent,
// 			start: newEvent.start.format(),
// 			end: newEvent.end.format()
// 		}
// 		// console.log('newEvent23', newEventWithUpdatedDates)
// 		console.log('newEventWithUpdatedDates2', user.trip.data.events.data)
// 		// console.log('newEvent2zzz', user.trip.data.events.data)

// 		const newUser = {
// 			...user,
// 			trip: {
// 				// test: 'test',
// 				...user.trip,
// 				data: {
// 					// test: 'test',
// 					...user.trip.data,
// 					events: {
// 						// test: 'test',
// 						...user.trip.data.events,
// 						data: [
// 							// 'test',
// 							...user.trip.data.events.data,
// 							...newEventWithUpdatedDates
// 						]
// 					}
// 				}
// 			}
// 		}
// 		console.log(newUser)
// 		// updateUserData(newUser, dispatch);
// 		// return dispatch(setUserData(newUser));
// 	};
// }

function updateUserData(user, dispatch) {
	if (!user.role || user.role.length === 0) {
		return;
	}

	firebaseService
	.updateUserData(user)
	.then(() => {
		console.log('Event Added! from updateUserData');
		// dispatch(MessageActions.showMessage({ message: 'Event Added!' }));
	})
	.catch(error => {
		console.log(error.message);
		// dispatch(MessageActions.showMessage({ message: error.message }));
	});
}

export function setUserData(user) {
	console.log('in setUserData***', user);
	
	return dispatch => {
		// dispatch(FuseActions.setDefaultSettings(user.data.settings));
		dispatch({
			type: SET_USER_DATA,
			payload: user
		});
	};
}


export function updateEvent(event) {
	return (dispatch, getState) => {
		// const { user } = getState().auth;

		// console.log('user->', user);
		console.log('updateEvent', event);

		// const newUser = {
		// 	...user,
		// 	trip{
		// 		data{
		// 			events
		// 		}
		// 	}
		// }
		// const request = axios.post('/api/calendar-app/update-event', {
		// 	event
		// });

		// return request.then(response =>
		// 	Promise.all([
		// 		dispatch({
		// 			type: UPDATE_EVENT
		// 		})
		// 	]).then(() => dispatch(getEvents()))
		// );
	};
}

export function removeEvent(eventId) {
	return (dispatch, getState) => {
		const request = axios.post('/api/calendar-app/remove-event', {
			eventId
		});

		return request.then(response =>
			Promise.all([
				dispatch({
					type: REMOVE_EVENT
				})
			]).then(() => dispatch(getEvents()))
		);
	};
}
