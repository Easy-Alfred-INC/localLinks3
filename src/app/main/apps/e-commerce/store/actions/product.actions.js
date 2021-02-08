import FuseUtils from '@fuse/utils';
import { showMessage } from 'app/store/actions/fuse';
// import axios from 'axios';
import firebaseService from 'app/services/firebaseService';

export const GET_PRODUCT = '[E-COMMERCE APP] GET PRODUCT';
export const SAVE_PRODUCT = '[E-COMMERCE APP] SAVE PRODUCT';

export function getProduct(house) {
	return (dispatch, getState) => {
		// console.log("houseId", houseId)
		firebaseService
		.getHouse(house.productId)
		.then((item) => {
			const hasSidMatch = item.hasSidMatch
			console.log('hhii44 ==============>>>>', item)
			let newHouse = {
				hasSidMatch, 
				id: item.tid,
				priceTaxIncl: item.tid,
				quantity: item.sid,
				name: item.locationName,
				sku: item.locationAddress,
				description: item.locationImage,
				handle: item.hasSidMatch,

				categories: ['cats'],
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
						url: 'assets/images/ecommerce/braies-lake.jpg',
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
				taxRate: 10,
				comparedPrice: 29.9,
				width: '22cm',
				height: '24cm',
				depth: '15cm',
				weight: '3kg',
				extraShippingFee: 3.0,
				active: true
			}

			dispatch({
				type: GET_PRODUCT,
				payload: newHouse
			})
		})
		.catch(error => {
			console.log('its an error yo', error.message);
		});
	};
}

export function saveProduct(data) {
	return (dispatch, getState) => {
		const house = {
			tid: data.priceTaxIncl,
			sid: data.quantity,
			locationName: data.name,
			locationAddress: data.sku,
			locationImage: data.description,
		}
		console.log('house1', house)
		firebaseService
		.updateHouse(house)
		.then((item) => {
			console.log('house3', item)
			let newHouse = {
				id: house.tid,
				priceTaxIncl: house.tid,
				quantity: house.sid,
				name: house.locationName,
				sku: house.locationAddress,
				description: house.locationImage,
				
				categories: ['cats'],
				handle: 'braies-lake-canvas-print',
				tags: ['canvas-print', 'nature'],
				featuredImageId: 1,
				images: [
					{
						id: 0,
						url: house.locationImage,
						type: 'image'
					},
					{
						id: 1,
						url: 'assets/images/ecommerce/braies-lake.jpg',
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
				taxRate: 10,
				comparedPrice: 29.9,
				width: '22cm',
				height: '24cm',
				depth: '15cm',
				weight: '3kg',
				extraShippingFee: 3.0,
				active: true
			}

			dispatch({
				type: SAVE_PRODUCT,
				payload: newHouse
			})
			return dispatch(showMessage({ message: 'House Saved' }));
		})
		.catch(error => {
			console.log('its an error yo', error.message);
		});
	}
}

export function removeProduct(data) {
	return (dispatch, getState) => {
		console.log('remove', data);
		firebaseService
		.removeHouse(data)
		.then((item) => {
			console.log('house3', item)
			
			// dispatch({
			// 	type: SAVE_PRODUCT,
			// 	payload: newHouse
			// })
			return window.location.reload(false);
			// return dispatch(showMessage({ message: 'House Removed' }));
		})
		.catch(error => {
			console.log('its an error yo', error.message);
		});
	}
}

export function saveNewProduct(data) {
	return (dispatch, getState) => {
		const house = {
			tid: data.priceTaxIncl,
			sid: data.quantity,
			locationName: data.name,
			locationAddress: data.sku,
			locationImage: data.description,
		}
		console.log('house331', house)
		firebaseService
		.saveNewHouse(house)
		.then((item) => {
			console.log('12341234', item)
			if(item === false){
				return dispatch(showMessage({ message: 'House Id Already Exists' }));
			}
			console.log('house333', item)
			let newHouse = {
				id: house.tid,
				priceTaxIncl: house.tid,
				quantity: house.sid,
				name: house.locationName,
				sku: house.locationAddress,
				description: house.locationImage,
				
				categories: ['cats'],
				handle: 'braies-lake-canvas-print',
				tags: ['canvas-print', 'nature'],
				featuredImageId: 1,
				images: [
					{
						id: 0,
						url: house.locationImage,
						type: 'image'
					},
					{
						id: 1,
						url: 'assets/images/ecommerce/braies-lake.jpg',
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
				taxRate: 10,
				comparedPrice: 29.9,
				width: '22cm',
				height: '24cm',
				depth: '15cm',
				weight: '3kg',
				extraShippingFee: 3.0,
				active: true
			}

			dispatch({
				type: SAVE_PRODUCT,
				payload: newHouse
			})
			return dispatch(showMessage({ message: 'House Saved' }));
		})
		.catch(error => {
			console.log('its an error yo', error.message);
		});
	}
}

export function newProduct() {
	const data = {
		id: FuseUtils.generateGUID(),
		isNewHouse: true,
		name: '',
		handle: '',
		description: '',
		categories: [],
		tags: [],
		images: [],
		priceTaxExcl: '',
		priceTaxIncl: '',
		taxRate: '',
		comparedPrice: '',
		quantity: '',
		sku: '',
		width: '',
		height: '',
		depth: '',
		weight: '',
		extraShippingFee: 0,
		active: true
	};

	return {
		type: GET_PRODUCT,
		payload: data
	};
}
