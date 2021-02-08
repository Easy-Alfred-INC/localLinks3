import { getUserData } from 'app/main/apps/contacts/store/actions/user.actions';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import { showMessage } from 'app/store/actions/fuse';

export const GET_CONTACTS = '[CONTACTS APP] GET CONTACTS';
export const SET_SEARCH_TEXT = '[CONTACTS APP] SET SEARCH TEXT';
export const TOGGLE_IN_SELECTED_CONTACTS = '[CONTACTS APP] TOGGLE IN SELECTED CONTACTS';
export const SELECT_ALL_CONTACTS = '[CONTACTS APP] SELECT ALL CONTACTS';
export const DESELECT_ALL_CONTACTS = '[CONTACTS APP] DESELECT ALL CONTACTS';
export const OPEN_NEW_CONTACT_DIALOG = '[CONTACTS APP] OPEN NEW CONTACT DIALOG';
export const CLOSE_NEW_CONTACT_DIALOG = '[CONTACTS APP] CLOSE NEW CONTACT DIALOG';
export const OPEN_EDIT_CONTACT_DIALOG = '[CONTACTS APP] OPEN EDIT CONTACT DIALOG';
export const CLOSE_EDIT_CONTACT_DIALOG = '[CONTACTS APP] CLOSE EDIT CONTACT DIALOG';
export const ADD_CONTACT = '[CONTACTS APP] ADD CONTACT';
export const UPDATE_CONTACT = '[CONTACTS APP] UPDATE CONTACT';
export const REMOVE_CONTACT = '[CONTACTS APP] REMOVE CONTACT';
export const REMOVE_CONTACTS = '[CONTACTS APP] REMOVE CONTACTS';
export const TOGGLE_STARRED_CONTACT = '[CONTACTS APP] TOGGLE STARRED CONTACT';
export const TOGGLE_STARRED_CONTACTS = '[CONTACTS APP] TOGGLE STARRED CONTACTS';
export const SET_CONTACTS_STARRED = '[CONTACTS APP] SET CONTACTS STARRED ';

export function getContacts(routeParams) {
	return (dispatch, getState) => {

		firebaseService
			.getAllServices()
			.then((services) => {
				console.log('sevices11', services)
				let allServices = Object.values(services).map((item) => {
					console.log('=>',item)
					const {serviceId, region, subRegion, notes, data} = item;
					const serviceCategories = Object.keys(data).join(', ')
					return {
						data,
						id: serviceId,
						name: serviceId,
						lastName: region,
						company: subRegion,
						nickname: subRegion,
						email: notes,
						notes: notes,
						phone: serviceCategories,
						jobTitle: 'Digital Archivist',
						avatar: 'assets/images/avatars/Abbott.jpg',
						address: '933 8th Street Stamford, CT 06902',
						birthday: undefined,
					}
				})
				dispatch({
					type: GET_CONTACTS,
					payload: allServices,
					routeParams
				})
			})
			.catch(error => {
				console.log(error.message);
			});
	};
}

export function addContact(serviceObj) {
	return (dispatch, getState) => {
		const { routeParams } = getState().contactsApp.contacts;

		firebaseService
		.saveNewService(serviceObj)
		.then((item) => {
			console.log('service3', item)
			if (item === false) {
				return dispatch(showMessage({ message: 'Serice Id Already Exists, Try Again' }));
			}
	
			dispatch(getContacts(routeParams))
			return window.location.reload(true);
			// return dispatch(showMessage({ message: 'Service Saved' }));
		})
		.catch(error => {
			console.log('its an error yo', error.message);
		});
	};
}

export function updateServices(serviceObj) {
	return (dispatch, getState) => {
		
		const { routeParams } = getState().contactsApp.contacts;
		console.log('serviceObj', serviceObj);
		firebaseService
		.updateServices(serviceObj)
		.then(() => {
			dispatch(getContacts(routeParams))
			return window.location.reload(true);
			// return dispatch(showMessage({ message: 'Service Updated' }));
		})
		.catch(error => {
			console.log('its an error yo', error.message);
		});
	};
}

export function rehydrateServices() {
	return (dispatch, getState) => {
		// const { routeParams } = getState().contactsApp.contacts;
		console.log('yooo1');
		// firebaseService
		// .rehydrateAllTripServices()
		// .then(() => {
		// 	dispatch(getContacts(routeParams))
		// 	return dispatch(showMessage({ message: 'Service Updated' }));
		// })
		// .catch(error => {
		// 	console.log('its an error yo', error.message);
		// });
	};
}

export function removeContact(contactId) {
	return (dispatch, getState) => {
		const { routeParams } = getState().contactsApp.contacts;
		firebaseService
			.removeService(contactId)
			.then(() => {
				return dispatch(getContacts(routeParams))
			})
			.catch(error => {
				console.log('its an error yo', error.message);
			});
	};
}


export function updateContact(contact) {
	
	return (dispatch, getState) => {
		const { routeParams } = getState().contactsApp.contacts;
		console.log('contact', contact);

		firebaseService
			.updateService(contact)
			.then(() => {
				return dispatch(getContacts(routeParams))
			})
			.catch(error => {
				console.log('its an error yo', error.message);
			});

		// const { routeParams } = getState().contactsApp.contacts;

		// const request = axios.post('/api/contacts-app/update-contact', {
		// 	contact
		// });

		// return request.then(response =>
		// 	Promise.all([
		// 		dispatch({
		// 			type: UPDATE_CONTACT
		// 		})
		// 	]).then(() => dispatch(getContacts(routeParams)))
		// );
	};
}

export function removeContacts(contactIds) {
	return (dispatch, getState) => {
		const { routeParams } = getState().contactsApp.contacts;

		const request = axios.post('/api/contacts-app/remove-contacts', {
			contactIds
		});

		return request.then(response =>
			Promise.all([
				dispatch({
					type: REMOVE_CONTACTS
				}),
				dispatch({
					type: DESELECT_ALL_CONTACTS
				})
			]).then(() => dispatch(getContacts(routeParams)))
		);
	};
}

export function toggleStarredContact(contactId) {
	return (dispatch, getState) => {
		const { routeParams } = getState().contactsApp.contacts;

		const request = axios.post('/api/contacts-app/toggle-starred-contact', {
			contactId
		});

		return request.then(response =>
			Promise.all([
				dispatch({
					type: TOGGLE_STARRED_CONTACT
				}),
				dispatch(getUserData())
			]).then(() => dispatch(getContacts(routeParams)))
		);
	};
}

export function toggleStarredContacts(contactIds) {
	return (dispatch, getState) => {
		const { routeParams } = getState().contactsApp.contacts;

		const request = axios.post('/api/contacts-app/toggle-starred-contacts', {
			contactIds
		});

		return request.then(response =>
			Promise.all([
				dispatch({
					type: TOGGLE_STARRED_CONTACTS
				}),
				dispatch({
					type: DESELECT_ALL_CONTACTS
				}),
				dispatch(getUserData())
			]).then(() => dispatch(getContacts(routeParams)))
		);
	};
}

export function setContactsStarred(contactIds) {
	return (dispatch, getState) => {
		const { routeParams } = getState().contactsApp.contacts;

		const request = axios.post('/api/contacts-app/set-contacts-starred', {
			contactIds
		});

		return request.then(response =>
			Promise.all([
				dispatch({
					type: SET_CONTACTS_STARRED
				}),
				dispatch({
					type: DESELECT_ALL_CONTACTS
				}),
				dispatch(getUserData())
			]).then(() => dispatch(getContacts(routeParams)))
		);
	};
}

export function setContactsUnstarred(contactIds) {
	return (dispatch, getState) => {
		const { routeParams } = getState().contactsApp.contacts;

		const request = axios.post('/api/contacts-app/set-contacts-unstarred', {
			contactIds
		});

		return request.then(response =>
			Promise.all([
				dispatch({
					type: SET_CONTACTS_STARRED
				}),
				dispatch({
					type: DESELECT_ALL_CONTACTS
				}),
				dispatch(getUserData())
			]).then(() => dispatch(getContacts(routeParams)))
		);
	};
}



export function setSearchText(event) {
	return {
		type: SET_SEARCH_TEXT,
		searchText: event.target.value
	};
}

export function toggleInSelectedContacts(contactId) {
	return {
		type: TOGGLE_IN_SELECTED_CONTACTS,
		contactId
	};
}

export function selectAllContacts() {
	return {
		type: SELECT_ALL_CONTACTS
	};
}

export function deSelectAllContacts() {
	return {
		type: DESELECT_ALL_CONTACTS
	};
}

export function openNewContactDialog() {
	return {
		type: OPEN_NEW_CONTACT_DIALOG
	};
}

export function closeNewContactDialog() {
	return {
		type: CLOSE_NEW_CONTACT_DIALOG
	};
}

export function openEditContactDialog(data) {
	return {
		type: OPEN_EDIT_CONTACT_DIALOG,
		data
	};
}

export function closeEditContactDialog() {
	return {
		type: CLOSE_EDIT_CONTACT_DIALOG
	};
}