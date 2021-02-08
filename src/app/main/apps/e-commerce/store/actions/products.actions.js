// import axios from 'axios';
import firebaseService from 'app/services/firebaseService';

export const GET_PRODUCTS = '[E-COMMERCE APP] GET PRODUCTS';
export const SET_PRODUCTS_SEARCH_TEXT = '[E-COMMERCE APP] SET PRODUCTS SEARCH TEXT';

// export function getProducts() {
// 	const request = axios.get('/api/e-commerce-app/products');

// 	return dispatch =>
// 		request.then(response =>{
// 			// console.log('response.data', response.data)
// 			dispatch({
// 				type: GET_PRODUCTS,
// 				payload: response.data
// 			})}
// 		);
// }

export function getProducts() {
	return (dispatch, getState) => {
		firebaseService
		.getAllHouses()
		// .matchSids(houses)
		// .then(houses => {
		// 	return firebaseService.matchSids(houses)
		// })
		.then((houses) => {
			console.log('houses==>', houses);
			const houses2 = houses[0]
			const services = houses[1]
			let products = Object.values(houses2).map((item)=>{
				console.log('services', services, item.sid)
				const hasSidMatch = services.includes(item.sid)
				// [].contains(item.sid)
				// console.log('hasSidMatch', hasSidMatch);
				// console.log('item==>', item.locationAddress);
				// console.log('item==>', item.test);
				// console.log('item', item['hasSidMatch']);
				return {
					hasSidMatch, 
					id: item.tid,
					name: item.locationName,
					description: hasSidMatch,
					categories: [item.locationAddress],
					handle: 'ddd',
					tags: ['canvas-print', 'nature'],
					featuredImageId: 1,
					images: [
						{
							id: 0,
							url: item.locationImage,
							type: 'image'
						},
						{
							id: 1,
							url: item.locationImage,
							type: 'image'
						},
						{
							id: 2,
							url: 'assets/images/ecommerce/fall-glow.jpg',
							type: 'image'
						},
						{
							id: 3,
							url: 'assets/images/ecommerce/first-snow.jpg',
							type: 'image'
						},
						{
							id: 4,
							url: 'assets/images/ecommerce/lago-di-braies.jpg',
							type: 'image'
						},
						{
							id: 5,
							url: 'assets/images/ecommerce/lago-di-sorapis.jpg',
							type: 'image'
						},
						{
							id: 6,
							url: 'assets/images/ecommerce/never-stop-changing.jpg',
							type: 'image'
						},
						{
							id: 7,
							url: 'assets/images/ecommerce/reaching.jpg',
							type: 'image'
						},
						{
							id: 8,
							url: 'assets/images/ecommerce/morain-lake.jpg',
							type: 'image'
						},
						{
							id: 9,
							url: 'assets/images/ecommerce/yosemite.jpg',
							type: 'image'
						}
					],
					priceTaxExcl: 22.381,
					priceTaxIncl: item.tid,
					taxRate: 10,
					comparedPrice: 29.9,
					quantity: item.sid,
					sku: 'A445BV',
					width: '22cm',
					height: '24cm',
					depth: '15cm',
					weight: '3kg',
					extraShippingFee: 3.0,
					active: true
				}
			})
			dispatch({
				type: GET_PRODUCTS,
				payload: products
			})
		})
		.catch(error => {
			console.log(error.message);
		});
	};
}

export function setProductsSearchText(event) {
	return {
		type: SET_PRODUCTS_SEARCH_TEXT,
		searchText: event.target.value
	};
}
