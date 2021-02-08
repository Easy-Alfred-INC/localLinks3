import firebaseService from 'app/services/firebaseService';
import moment from 'moment';
// import * as UserActions from 'app/auth/store/actions/user.actions';
import * as MessageActions from 'app/store/actions/fuse/message.actions';

export const GET_ORDERS = '[E-COMMERCE APP] GET ORDERS';
export const SET_ORDERS_SEARCH_TEXT = '[E-COMMERCE APP] SET ORDERS SEARCH TEXT';
export const OPEN_EDIT_TRIP_DIALOG = '[E-COMMERCE APP] OPEN EDIT TRIP DIALOG';
export const CLOSE_EDIT_TRIP_DIALOG = '[E-COMMERCE APP] CLOSE EDIT TRIP DIALOG';
export const UPDATE_ORDERS_DATA = '[E-COMMERCE APP] UPDATE ORDERS DATA';
export const UPDATE_ARCHIVE_DATA = '[E-COMMERCE APP] ARCHIVE ORDERS DATA';

export function openEditTripDialog(data) {
	// console.log('-=1234openEditTripDialog', data);
	return {
		type: OPEN_EDIT_TRIP_DIALOG,
		data
	};
}

export function closeEditTripDialog() {
	// console.log('two -=closeEditTripDialog');
	return {
		type: CLOSE_EDIT_TRIP_DIALOG
	};
}
//fixme
export function updateTrip(form) {
	return (dispatch, getState) => {
		let {id,isCartLocked, invoiceLink, isAdmin } = form
		// console.log('form', form);

		firebaseService
		.updateIsCartLocked(id, isCartLocked)

		firebaseService
		.updateInvoiceLink(id, invoiceLink)

		firebaseService
		.updateIsAdmin(id, isAdmin)
		
		dispatch({
			type: UPDATE_ORDERS_DATA,
			payload: form
		});
		
		// return dispatch(UserActions.updateUsers(form));
		return window.location.reload(true);

	};
}

export function setOrdersSearchText(event) {
	return {
		type: SET_ORDERS_SEARCH_TEXT,
		searchText: event.target.value
	};
}

export function archiveTrip(uid, tid) {
	return (dispatch, getState) => {
		firebaseService
		.archiveUserTrip(uid, tid)
		.then((success)=>{
			// console.log('in archiveTrip success', success);
			if (success){
				// dispatch(MessageActions.showMessage({ message: 'Success! Refresh your browser for new data.' }));
				return window.location.reload(true);
			}
			return dispatch(MessageActions.showMessage({ message: 'archiveTrip error' }));
		})
	};
}

export function confirmServices(uid) {
	return (dispatch, getState) => {
		firebaseService
		.confirmUserServices(uid)
		.then((success)=>{
			// console.log('in confirmServices success', success);
			if (success){
				// dispatch(MessageActions.showMessage({ message: 'Success! Refresh your browser for new data.' }));
				return window.location.reload(true);
			}
			return dispatch(MessageActions.showMessage({ message: 'archiveTrip error' }));
		})
	};
}
// dispatch(Actions.updateTrip(form));
export function rehydrateServices(trip) {
	return (dispatch, getState) => {
		// console.log(trip, 'trip');
		firebaseService
		.rehydrateUserServices(trip)
		.then((success)=>{
			console.log('in rehydrateServices success', success);
			if (success){
				// dispatch(MessageActions.showMessage({ message: 'Hydrate Success!' }));
				return window.location.reload(true);
			}
			return dispatch(MessageActions.showMessage({ message: 'Hydrate error' }));
		})
	};
}

export function getOrders() {
	return (dispatch, getState) => {

		firebaseService
		.getAllUsers()
		.then((users) => {
			firebaseService
			.getAllServices()
			.then((services)=>{
				firebaseService
					.getAllHouses()
					.then((houses) => {
						console.log('lll users', users);
						console.log('lll services', services);
						let allHouses = Object.keys(houses[0])
						console.log('lll houses', allHouses);

						const orders = Object.keys(users).map((key, value) => {

							const role = users[key]['role'][0]
							let roleName = ''
							let isAdmin = false
							let user = users[key]
							const { displayName, email, phone } = users[key]['data']
							let { invoiceLink, isCartLocked, lastUpdated, active } = users[key]['trip']
							const { sid, tid, tripStartDate, tripEndDate } = users[key]['trip']['data'] || { sid: null, tid: null, tripStartDate: null, tripEndDate: null }
							const date = tripStartDate ? `${moment(tripStartDate).format('MM/DD')} - ${moment(tripEndDate).format('MM/DD')}` : null
							if (role === 'admin') {
								roleName = ` [${role}]`
								isAdmin = true
							}

							let tripStatus = 'No Status'
							if (!tid) {
								tripStatus = 'No Active Trip'
							} else if (!allHouses.includes(tid)) {
								tripStatus = 'House Id Removed From Admin'
							} else if (!services[sid]) {
								tripStatus = 'Service Id Removed From Admin'
							} else {
								const servicesServicesLastUpdated = services[sid].lastUpdated
								const tripServicesLastUpdated = users[key]['trip']['data']['services']['lastUpdated']
								console.log('==>', servicesServicesLastUpdated, tripServicesLastUpdated);
								if (servicesServicesLastUpdated === tripServicesLastUpdated) {
									tripStatus = 'Trip Has Current Service Data'
								} else {
									tripStatus = 'Trip Has Old Service Data'
								}
							}


							let order =
							{
								user,
								id: key,
								isCartLocked,
								invoiceLink,
								isAdmin,
								lastUpdated,
								active,
								tid,
								sid,
								displayName,
								reference: lastUpdated,
								subtotal: '39.97',
								tax: '77.44',
								discount: '-10.17',
								total: '73.31',
								date: date,
								customer: {
									id: 1,
									firstName: displayName + roleName,
									lastName: 'Bullock',
									avatar: 'assets/images/avatars/Abbott.jpg',
									company: 'Saois',
									jobTitle: 'Digital Archivist',
									email: email,
									phone: phone,
									invoiceAddress: {
										address: '704 6th Ave, New York, NY 10010, USA',
										lat: 40.7424739,
										lng: -73.99283919999999
									},
									shippingAddress: {
										address: '377 E South Omaha Bridge Rd, Council Bluffs, IA 51501, USA',
										lat: 41.2183223,
										lng: -95.8420876
									}
								},
								products: [
									{
										id: 1,
										name: 'A Walk Amongst Friends - Canvas Print',
										price: '10.24',
										quantity: 1,
										total: '10.24',
										image: 'assets/images/ecommerce/a-walk-amongst-friends.jpg'
									},
									{
										id: 2,
										name: 'Lago di Braies - Canvas Print',
										price: '24.62',
										quantity: 1,
										total: '24.62',
										image: 'assets/images/ecommerce/lago-di-braies.jpg'
									},
									{
										id: 3,
										name: 'Never Stop Changing - Canvas Print',
										price: '49.29',
										quantity: 1,
										total: '49.29',
										image: 'assets/images/ecommerce/never-stop-changing.jpg'
									}
								],
								status: [
									{
										id: 13,
										name: tripStatus,
										// name: 'No Status',
										color: 'purple-300',
										date: '2016/04/03 10:06:18'
									},
									{
										id: 1,
										name: 'Awaiting check payment',
										color: 'blue-500',
										date: '2015/03/17 18:28:37'
									}
								],
								payment: {
									transactionId: '2a894b9e',
									amount: '73.31',
									method: 'Credit Card',
									date: '2016/02/23 15:50:23'
								},
								shippingDetails: [
									{
										tracking: '',
										carrier: 'TNT',
										weight: '10.44',
										fee: '7.00',
										date: '2015/04/10 07:03:52'
									}
								]
							}

							return order
						})
						dispatch({
							type: GET_ORDERS,
							payload: orders
						})

					})
				// console.log('lll users', users);
				// console.log('lll services', services);

				
				// })
				// dispatch({
				// 	type: GET_ORDERS,
				// 	payload: orders
				// })

			})
		
		})
		.catch(error => {
			console.log(error.message);
		});
	};
}