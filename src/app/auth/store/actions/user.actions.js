import history from '@history';
import _ from '@lodash';
import auth0Service from 'app/services/auth0Service';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import * as FuseActions from 'app/store/actions/fuse';
import firebase from 'firebase/app';
import moment from 'moment';

import * as OrderActions from 'app/main/apps/e-commerce/store/actions/order.actions';
// src/app/main/apps/e-commerce/store/actions/order.actions.js

export const SET_ALL_USER_DATA = '[USER] SET ALL DATA';

export const SET_USER_DATA = '[USER] SET DATA';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';

export const CLOSE_TRIP_DIALOG = '[TRIP] CLOSE TRIP DIALOG';
export const CLOSE_UPDATE_USER_DATA_DIALOG = '[TRIP] CLOSE UPDATE USER DATA DIALOG';
export const OPEN_UPDATE_USER_DATA_DIALOG = '[TRIP] OPEN UPDATE USER DATA DIALOG';
export const LOCK_CART = '[TRIP] LOCK CART';

export const OPEN_EDIT_EVENT_DIALOG = '[CALENDAR] OPEN EDIT EVENT DIALOG';
export const OPEN_EDIT_EVENT_DIALOG_ADMIN = '[CALENDAR] OPEN EDIT EVENT DIALOG ADMIN';
export const CLOSE_EDIT_EVENT_DIALOG = '[CALENDAR] CLOSE EDIT EVENT DIALOG';
export const OPEN_NEW_EVENT_DIALOG = '[CALENDAR] OPEN NEW EVENT DIALOG';
export const CLOSE_NEW_EVENT_DIALOG = '[CALENDAR] CLOSE NEW EVENT DIALOG';
export const ADD_EVENT = '[CALENDAR] ADD EVENT';
export const REMOVE_EVENT = '[CALENDAR APP] REMOVE EVENT';

export const GET_EVENTS = '[CALENDAR] GET EVENTS';

export function createUserSettingsFirebase(authUser, utmLink = '') {
	return (dispatch, getState) => {
		const guestUser = getState().auth.user;
		const fuseDefaultSettings = getState().fuse.settings.defaults;
		const { currentUser } = firebase.auth();

		// console.log('createUserSettingsFirebase=>authUser', authUser);
		// console.log('createUserSettingsFirebase=>guestUser', guestUser);
		// console.log('createUserSettingsFirebase=>currentUser', currentUser);
		/**
		 * Merge with current Settings
		 */
		console.log('utml linkkkkk', utmLink === '');
		if (utmLink === '') {
			const user = _.merge({}, guestUser, {
				uid: authUser.uid,
				from: 'firebase',
				role: ['user'],
				data: {
					displayName: authUser.displayName,
					email: authUser.email,
					settings: { ...fuseDefaultSettings }
				}
			});
			currentUser.updateProfile(user.data);

			updateUserData(user, dispatch);
			return dispatch(setUserData(user));
		} else {
			const tripStartDate = moment();
			const tripEndDate = moment().add(2000, 'days');

			const defaultFormState = {
				tid: utmLink,
				tripStartDate: tripStartDate,
				tripEndDate: tripEndDate
			};

			firebaseService.getTripData(utmLink, defaultFormState).then(trip => {
				if (!trip) {
					return dispatch(MessageActions.showMessage({ message: 'Trip not found, please try again' }));
				}

				const user = _.merge({}, guestUser, {
					uid: authUser.uid,
					from: 'firebase',
					role: ['user'],
					trip: {
						active: true,
						isCartLocked: false,
						lastUpdated: moment().format(),
						openDialog: false,
						invoiceLink: '',
						data: {
							...trip,
							// phone: user.data.phone ,
							displayName: authUser.displayName,
							email: authUser.email
						}
					},
					data: {
						displayName: authUser.displayName,
						email: authUser.email,
						settings: { ...fuseDefaultSettings },
						tid: utmLink
					}
				});

				currentUser.updateProfile(user.data);

				updateUserData(user, dispatch);
				return dispatch(setUserData(user));
			});
		}

		// console.log('createUserSettingsFirebase=>user', user);
	};
}

export function getAllUserData() {
	return (dispatch, getState) => {
		// const { user } = getState().auth;

		// console.log('in getAllUserData', user);

		firebaseService
			.getAllUsers()
			.then(users => {
				console.log('users in actions', users);

				if (!users) {
					return dispatch(MessageActions.showMessage({ message: 'No users found' }));
				}

				dispatch(MessageActions.showMessage({ message: 'users FOUND!' }));

				dispatch({
					type: SET_ALL_USER_DATA,
					payload: users
				});
				// const newUser = {
				// 	...user,
				// 	trip: {
				// 		active: true,
				// 		// openDialog: true,
				// 		openDialog: false,
				// 		data: {...trip}
				// 	}
				// };

				// const newUser = {
				// 	...user,
				// 	trip: {
				// 		active: true,
				// 		openDialog: false,
				// 		...trip
				// 	}
				// };

				// updateUserData(newUser, dispatch);

				// return dispatch(setUserData(newUser));
			})
			.catch(error => {
				dispatch(MessageActions.showMessage({ message: error.message }));
			});
	};
}

export function addTrip(form) {
	return (dispatch, getState) => {
		const { tid, tripStartDate, tripEndDate } = form;
		const { user } = getState().auth;

		firebaseService
			.getTripData(tid, form)
			.then(trip => {
				if (!trip) {
					return dispatch(MessageActions.showMessage({ message: 'Trip not found, please try again' }));
				}

				dispatch(MessageActions.showMessage({ message: 'trip has been found' }));

				trip.tripEndDate = tripEndDate.format();
				trip.tripStartDate = tripStartDate.format();
				console.log('user==>', user);

				const newUser = {
					...user,
					trip: {
						active: true,
						isCartLocked: false,
						lastUpdated: moment().format(),
						openDialog: false,
						invoiceLink: '',
						data: {
							...trip,
							// phone: user.data.phone ,
							email: user.data.email,
							displayName: user.data.displayName
						}
					}
				};

				updateUserData(newUser, dispatch);

				return dispatch(setUserData(newUser));
			})
			.catch(error => {
				dispatch(MessageActions.showMessage({ message: error.message }));
			});
	};
}

export function updateUserDataWithModal(userData) {
	return (dispatch, getState) => {
		// console.log('action updateUserDataWithModal', userData);

		const { user } = getState().auth;

		const newUser = {
			...user,
			data: {
				...user.data,
				...userData,
				openDialog: false
			}
		};

		updateUserData(newUser, dispatch);

		return dispatch(setUserData(newUser));
	};
}

export function closeTripDialog() {
	// console.log('action closeTripDialog');
	return {
		type: CLOSE_TRIP_DIALOG
	};
}

export function closeUpdateUserDataDialog() {
	return {
		type: CLOSE_UPDATE_USER_DATA_DIALOG
	};
}

export function openUpdateUserDataDialog() {
	return {
		type: OPEN_UPDATE_USER_DATA_DIALOG
	};
}

export function setUserData(user) {
	return dispatch => {
		/*
        You can redirect the logged-in user to a specific route depending on his role
         */

		// history.location.state = {
		//     redirectUrl: user.redirectUrl // for example 'apps/academy'
		// }

		/*
        Set User Settings
         */
		dispatch(FuseActions.setDefaultSettings(user.data.settings));

		/*
        Set User Data
         */
		dispatch({
			type: SET_USER_DATA,
			payload: user
		});
	};
}

export function updateUsers(users) {
	return (dispatch, getState) => {
		let { id, isCartLocked, invoiceLink, isAdmin } = users;
		firebaseService
			.getAllUsers()
			.then(users => {
				const { uid } = getState().auth.user;
				const isAdminText = isAdmin ? 'admin' : 'user';
				if (uid === id) {
					console.log('ppp', users[id].role[0]);
					users[id].trip.isCartLocked = isCartLocked;
					users[id].trip.invoiceLink = invoiceLink;
					users[id].role[0] = isAdminText;

					updateUserData(users[id], dispatch);
					return dispatch(setUserData(users[id]));
				}
			})
			.catch(error => {
				dispatch(MessageActions.showMessage({ message: error.message }));
			});
	};
}

function updateUserData(user, dispatch, isNewService = false) {
	if (!user.role || user.role.length === 0) {
		// is guest
		return;
	}

	switch (user.from) {
		case 'firebase': {
			firebaseService
				.updateUserData(user)
				.then(() => {
					if (isNewService) {
						dispatch(MessageActions.showMessage({ message: 'or', autoHideDuration: 5000, isNewService }));
					} else {
						dispatch(MessageActions.showMessage({ message: 'Success!' }));
					}
				})
				.catch(error => {
					dispatch(MessageActions.showMessage({ message: error.message }));
				});
			break;
		}
		case 'auth0': {
			auth0Service
				.updateUserData({
					settings: user.data.settings,
					shortcuts: user.data.shortcuts
				})
				.then(() => {
					dispatch(MessageActions.showMessage({ message: 'User data saved to auth0' }));
				})
				.catch(error => {
					dispatch(MessageActions.showMessage({ message: error.message }));
				});
			break;
		}
		default: {
			jwtService
				.updateUserData(user)
				.then(() => {
					dispatch(MessageActions.showMessage({ message: 'User data saved with api' }));
				})
				.catch(error => {
					dispatch(MessageActions.showMessage({ message: error.message }));
				});
			break;
		}
	}
}

export function setUserDataAuth0(tokenData) {
	const user = {
		role: ['user'],
		from: 'auth0',
		data: {
			displayName: tokenData.username,
			photoURL: tokenData.picture,
			email: tokenData.email,
			settings:
				tokenData.user_metadata && tokenData.user_metadata.settings ? tokenData.user_metadata.settings : {},
			shortcuts:
				tokenData.user_metadata && tokenData.user_metadata.shortcuts ? tokenData.user_metadata.shortcuts : []
		}
	};

	return setUserData(user);
}

/**
 * Set user data from Firebase data
 */
export function setUserDataFirebase(user, authUser) {
	if (
		user &&
		user.data &&
		user.data.settings &&
		user.data.settings.theme &&
		user.data.settings.layout &&
		user.data.settings.layout.style
	) {
		// Set user data but do not update
		return setUserData(user);
	}

	// Create missing user settings
	return createUserSettingsFirebase(authUser);
}

/**
 * Create User Settings with Firebase data
 */

/**
 * Set User Data
 */

/**
 * Update User Settings
 */
export function updateUserSettings(settings) {
	return (dispatch, getState) => {
		const oldUser = getState().auth.user;
		const user = _.merge({}, oldUser, { data: { settings } });

		updateUserData(user, dispatch);

		return dispatch(setUserData(user));
	};
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts) {
	return (dispatch, getState) => {
		const { user } = getState().auth;
		const newUser = {
			...user,
			data: {
				...user.data,
				shortcuts
			}
		};

		updateUserData(newUser, dispatch);

		return dispatch(setUserData(newUser));
	};
}

export function removeUserData() {
	return {
		type: REMOVE_USER_DATA
	};
}

export function logoutUser() {
	return (dispatch, getState) => {
		const { user } = getState().auth;

		if (!user.role || user.role.length === 0) {
			// is guest
			return null;
		}

		history.push({
			pathname: '/'
		});

		switch (user.from) {
			case 'firebase': {
				firebaseService.signOut();
				break;
			}
			case 'auth0': {
				auth0Service.logout();
				break;
			}
			default: {
				jwtService.logout();
			}
		}

		dispatch(FuseActions.setInitialSettings());

		return dispatch({
			type: USER_LOGGED_OUT
		});
	};
}

export function lockCart() {
	return (dispatch, getState) => {
		console.log('in herre ypooo');
		const oldUser = getState().auth.user;
		const user = _.merge({}, oldUser, { trip: { isCartLocked: true, lastUpdated: moment().format() } });

		updateUserData(user, dispatch);

		return dispatch(setUserData(user));
	};
}

// [][][][][][]
// below is for calendar
// [][][][][][]
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
export function openEditEventDialogFromAdmin(data) {
	return {
		type: OPEN_EDIT_EVENT_DIALOG_ADMIN,
		data
	};
}

export function closeEditEventDialog() {
	console.log('-=closeEditEventDialog');
	return {
		type: CLOSE_EDIT_EVENT_DIALOG
	};
}

export function removeEventFromAdmin(uid, eid) {
	return (dispatch, getState) => {
		console.log(uid, eid);

		firebaseService
			.removeEvent(uid, eid)
			.then(newUser => {
				if (!newUser) {
					return dispatch(MessageActions.showMessage({ message: 'Error service event not found' }));
				}
				return dispatch(OrderActions.getOrder({ orderId: uid }));
			})
			.catch(error => {
				dispatch(MessageActions.showMessage({ message: error.message }));
			});
	};
}

export function addEventFromAdmin(newEvent) {
	return (dispatch, getState) => {
		const user = newEvent.user;
		const newEvent2 = Object.assign({}, newEvent);
		delete newEvent2.user;
		const { id } = newEvent2;

		console.log('zzz', user.uid);
		let newEventWithUpdatedDates = {};
		newEventWithUpdatedDates[id] = {
			...newEvent2,
			start: newEvent2.start.format(),
			end: newEvent2.start.format(),
			uid: user.uid
		};

		const newUser = {
			...user,
			trip: {
				...user.trip,
				data: {
					...user.trip.data,
					events: {
						...user.trip.data.events,
						data: {
							...user.trip.data.events.data,
							...newEventWithUpdatedDates
						}
					}
				}
			},
			eventDialog: {
				type: 'new',
				props: {
					open: false
				},
				data: null
			}
		};

		console.log("['orderId']>>", user.uid);
		updateUserData(newUser, dispatch, false);
		return dispatch(OrderActions.getOrder({ orderId: user.uid }));
		// return window.location.reload(true);
		// return dispatch(setUserData(newUser));
	};
}
export function addEvent(newEvent) {
	return (dispatch, getState) => {
		const { user } = getState().auth;
		const { id } = newEvent;
		console.log('date33', newEvent.start);
		let newEventWithUpdatedDates = {};
		newEventWithUpdatedDates[id] = {
			...newEvent,
			start: newEvent.start.format(),
			end: newEvent.start.format(),
			uid: user.uid
		};
		console.log('newEventWithUpdatedDates1', user.trip.data.events.data);

		const newUser = {
			...user,
			trip: {
				...user.trip,
				data: {
					...user.trip.data,
					events: {
						...user.trip.data.events,
						data: {
							...user.trip.data.events.data,
							...newEventWithUpdatedDates
						}
					}
				}
			},
			eventDialog: {
				type: 'new',
				props: {
					open: false
				},
				data: null
			}
		};

		updateUserData(newUser, dispatch, true);
		return dispatch(setUserData(newUser));
	};
}

export function removeEvent(eid) {
	return (dispatch, getState) => {
		const { user } = getState().auth;

		firebaseService
			.removeEvent(user.uid, eid)
			.then(newUser => {
				if (!newUser) {
					return dispatch(MessageActions.showMessage({ message: 'Error service event not found' }));
				}

				dispatch(MessageActions.showMessage({ message: 'Service Removed' }));
				return dispatch(setUserData(newUser));
			})
			.catch(error => {
				dispatch(MessageActions.showMessage({ message: error.message }));
			});
	};
}

// export function addEventFromAdmin(newEvent) {
// 	return (dispatch, getState) => {
// 		console.log('newEvent', newEvent)

// 		// const newEventWithUpdatedDates = {
// 		// 	...newEvent,
// 		// 	start: newEvent.start.format(),
// 		// 	end: newEvent.end.format()
// 		// }

// 		// const newUser = {
// 		// 	...user,
// 		// 	trip: {
// 		// 		...user.trip,
// 		// 		data: {
// 		// 			...user.trip.data,
// 		// 			events: {
// 		// 				...user.trip.data.events,
// 		// 				data: [
// 		// 					...user.trip.data.events.data,
// 		// 					newEventWithUpdatedDates
// 		// 				]
// 		// 			}
// 		// 		}
// 		// 	}
// 		// }

// 		// updateUserData(newUser, dispatch);
// 		// return dispatch(setUserData(newUser));
// 	};
// }

export function updateEvent(event) {
	return (dispatch, getState) => {
		const { user } = getState().auth;
		console.log('updateEvent user', user);
		// console.log('updateEvent event', event);
	};
}

export function getEvents() {
	return (dispatch, getState) => {
		const { user } = getState().auth;
		// console.log('yooo in actions getEvents 0', user);

		//hack to get calendar header to render properly, also a hack to show the correct trip dates on calendar
		if (user.trip.data) {
			for (let i in user.trip.data.events.data) {
				// console.log('yooo12233', user.trip.data.events.data)
				if (user.trip.data.events.data[i].isLocked) {
					user.trip.data.events.data[i].start = user.trip.data.tripStartDate;
					user.trip.data.events.data[i].end = user.trip.data.tripEndDate;
				}
			}
		}
		// console.log('yooo in actions getEvents 1', user);
		// console.log('yooo in actions getEvents 2', user.trip.data);
		// console.log('yooo in actions getEvents 3', user.trip.data.events);
		// console.log('yooo in actions getEvents 4', user.trip.data.events.data);
		// const events = Object.values(user.trip.data.events.data).map((event)=>{
		// 	return {
		// 		...event,
		// 		start: new Date(event.start),
		// 		end: new Date(event.end),
		// 	}
		// })
		dispatch({
			type: GET_EVENTS,
			payload: user
		});
	};
}
