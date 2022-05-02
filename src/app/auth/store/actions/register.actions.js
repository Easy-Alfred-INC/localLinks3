import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import * as Actions from 'app/store/actions';
import * as UserActions from './user.actions';
import ZContacts from '../../../services/zohoService/contacts/index';

export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

export function submitRegister({ displayName, password, email }) {
	return dispatch =>
		jwtService
			.createUser({
				displayName,
				password,
				email
			})
			.then(user => {
				dispatch(UserActions.setUserData(user));
				return dispatch({
					type: REGISTER_SUCCESS
				});
			})
			.catch(error => {
				return dispatch({
					type: REGISTER_ERROR,
					payload: error
				});
			});
}

export function registerWithFirebase(model) {
	console.log('in register');
	const queryParams = new URLSearchParams(window.location.search);
	const pathWitParamether = queryParams.get('utm_id') ? queryParams.get('utm_id') : 'default';
	if (!firebaseService.auth) {
		console.warn("Firebase Service didn't initialize, check your configuration");
		return () => false;
	}

	const { email, password, displayName } = model;

	const fullname = model.displayName.split(' ');
	const zPayload = {
		Email: model.email,
		First_Name: fullname[0],
		Last_Name: fullname.length > 1 ? fullname[1] : ''
	};

	const zoho = new ZContacts();
	const dataCriteria = zoho.getContactByEmail(zPayload.Email).then(response => {
		if (response) {
			zoho.updateContacts(zPayload, response.data[0].id);
		} else {
			zoho.createContacts(zPayload);
		}
	});

	return dispatch =>
		firebaseService.auth
			.createUserWithEmailAndPassword(email, password)
			.then(response => {
				dispatch(
					UserActions.createUserSettingsFirebase(
						{
							...response.user,
							displayName,
							email
						},
						pathWitParamether
					)
				);
				return dispatch({
					type: REGISTER_SUCCESS
				});
			})
			.catch(error => {
				const usernameErrorCodes = ['auth/operation-not-allowed', 'auth/user-not-found', 'auth/user-disabled'];

				const emailErrorCodes = ['auth/email-already-in-use', 'auth/invalid-email'];

				const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];

				const response = {
					email: emailErrorCodes.includes(error.code) ? error.message : null,
					displayName: usernameErrorCodes.includes(error.code) ? error.message : null,
					password: passwordErrorCodes.includes(error.code) ? error.message : null
				};

				if (error.code === 'auth/invalid-api-key') {
					dispatch(Actions.showMessage({ message: error.message }));
				}

				return dispatch({
					type: REGISTER_ERROR,
					payload: response
				});
			});
}

export function resetWithFirebase(model) {
	if (!firebaseService.auth) {
		console.warn("Firebase Service didn't initialize, check your configuration");

		return () => false;
	}

	const { email } = model;

	return dispatch =>
		firebaseService.auth
			.sendPasswordResetEmail(email)
			.then(function() {
				return dispatch(Actions.showMessage({ message: 'Check Your Email' }));
			})
			.catch(function(error) {
				return dispatch(Actions.showMessage({ message: error }));
			});
}
