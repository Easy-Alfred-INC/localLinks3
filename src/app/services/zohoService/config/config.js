import firebaseService from 'app/services/firebaseService';
import axios from 'axios';
export default class Config {
	constructor() {
		this.baseAPIGateway = ' https://4t1m6bslik.execute-api.us-east-1.amazonaws.com/default';
	}

	async fetchNewToken() {
		const urlGetToken = '/refresh-token';
		return await fetch(this.baseAPIGateway + urlGetToken, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json'
			}
		})
			.then(response => {
				return response
					.json()
					.then(data => {
						return data.body.access_token;
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	}

	async getToken() {
		return firebaseService.getZohoCredentials().then(async zoho => {
			if (new Date(zoho.expiresIn) < new Date()) {
				let date = new Date();
				date.setMinutes(date.getMinutes() + 60);
				const newToken = await this.fetchNewToken();
				await firebaseService.setZohoValue('expiresIn', date.toString());
				await firebaseService.setZohoValue('token', newToken);
				return newToken;
			} else {
				return zoho.token;
			}
		});
	}
}
