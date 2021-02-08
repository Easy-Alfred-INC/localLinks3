// import history from '@history';
// import _ from '@lodash';
import auth0Service from 'app/services/auth0Service';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import * as FuseActions from 'app/store/actions/fuse';
// import firebase from 'firebase/app';

export const SET_USER_DATA = '[USER] SET DATA';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';

export const CLOSE_TRIP_DIALOG = '[TRIP] CLOSE TRIP DIALOG';
// export const CLOSE_NEW_CONTACT_DIALOG = '[CONTACTS APP] CLOSE NEW CONTACT DIALOG';


export function addTrip(propertyCode) {
	return (dispatch, getState) => {
		console.log('in addTrip', propertyCode);
		
		const { user } = getState().auth;
		const newUser = {
			...user,
			trip: {
				active: true
			} 
		};

		updateUserData(newUser, dispatch);

		return dispatch(setUserData(newUser));
	};
}


export function closeTripDialog() {
	console.log('in closeTripDialog');
	
	return {
		type: CLOSE_TRIP_DIALOG
	};
}

function updateUserData(user, dispatch) {
	if (!user.role || user.role.length === 0) {
		// is guest
		return;
	}

	switch (user.from) {
		case 'firebase': {
			firebaseService
				.updateUserData(user)
				.then(() => {
					dispatch(MessageActions.showMessage({ message: 'User data saved to firebase' }));
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