import { showMessage } from 'app/store/actions/fuse';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import moment from 'moment';



export const GET_ORDER = '[E-COMMERCE APP] GET ORDER';
export const SAVE_ORDER = '[E-COMMERCE APP] SAVE ORDER';

// export function getOrder(params) {
// 	const request = axios.get('/api/e-commerce-app/order', { params });

// 	return dispatch =>
// 		request.then(response =>
// 			{
// 				console.log('response.data', response.data);
				
// 				dispatch({
// 				type: GET_ORDER,
// 				payload: response.data
// 			})}
// 		);
// }

export function saveOrder(data) {
	const request = axios.post('/api/e-commerce-app/order/save', data);

	return dispatch =>
		request.then(response => {
			dispatch(showMessage({ message: 'Order Saved' }));

			return dispatch({
				type: SAVE_ORDER,
				payload: response.data
			});
		});
}

//fixme
export function toggleIsCartLocked(data) {
	console.log('in toggleIsCartLocked', data);
	
	// const request = axios.post('/api/e-commerce-app/order/save', data);

	// return dispatch =>
	// 	request.then(response => {
	// 		dispatch(showMessage({ message: 'Order Saved' }));

	// 		return dispatch({
	// 			type: SAVE_ORDER,
	// 			payload: response.data
	// 		});
	// 	});
}




export function getOrder(uid) {
	return (dispatch, getState) => {
		console.log("uid['orderId']", uid)
		firebaseService
		.getUserData(uid['orderId'])
		.then((user) => {
			console.log('hhii3 ==============>>>>', user)
			let {uid, tripArchive} = user
			let {displayName, email, phone, bio} = user.data
			let {isCartLocked, lastUpdated, invoiceLink} = user.trip
			let {
				locationAddress,
				locationName,
				locationImage,
				tid,
				sid,
				events,
				tripStartDate,
				tripEndDate
			} = user.trip.data || {
				locationAddress: null,
				locationName: null,
				locationImage: null,
				tid: null,
				// lastUpdated: null,
				sid: null,
				events: {data:[]},
				tripStartDate: null, 
				tripEndDate: null
			}
			let arrOfEvents = Object.values(events.data)
			const date = tripStartDate ? `${moment(tripStartDate).format('MM/DD')} - ${moment(tripEndDate).format('MM/DD')}` : null
			const role = user.role[0]
	
			let order = {
				user, 
				id: uid,
				sid,
				tid,
				isCartLocked,
				invoiceLink,
				lastUpdated,
				reference: lastUpdated,
				subtotal: '39.97',
				tax: '77.44',
				discount: '-10.17',
				total: '73.31',
				date,
				tripArchive, 
				customer: {
					id: 1,
					firstName: displayName,
					locationImage,
					locationName,
					lastName: 'Bullock',
					avatar: 'assets/images/avatars/Abbott.jpg',
					company: 'Saois',
					bio,
					role,
					jobTitle: 'Digital Archivist',
					email: email,
					phone: phone,
					invoiceAddress: {
						address: locationAddress,
						lat: 40.7424739,
						lng: -73.99283919999999
					},
					shippingAddress: {
						address: locationAddress,
						lat: 41.2183223,
						lng: -95.8420876
					}
				},
				products: [
					...arrOfEvents
				],
				status: [
					{
						id: 13,
						name: 'cart closed',
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

			dispatch({
				type: GET_ORDER,
				payload: order
			})
		})
		.catch(error => {
			console.log('its an error yo', error.message);
		});
	};
}
