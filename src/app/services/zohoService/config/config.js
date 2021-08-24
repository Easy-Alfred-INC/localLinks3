import firebaseService from 'app/services/firebaseService';
import axios from 'axios';
export default class Config {
	constructor() {
		this.redirect_uri = 'http://localhost/callback&grant_type';
		this.clientId = '1000.7IG3MM1UVJLAIUCISKGJ8FMC45JELW'; // sandbox 1000.7IG3MM1UVJLAIUCISKGJ8FMC45JELW
		this.clientSecret = '92e562bfb1ccb78a43417787a3ef012c3ee008b71b'; // sandbox 92e562bfb1ccb78a43417787a3ef012c3ee008b71b
		this.grantType = 'authorization_code' | 'refresh_token';
	}

	async fetchNewToken(refresh_token) {
		return axios
			.post(
				`/oauth/v2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&redirect_uri=http://localhost/callback&grant_type=refresh_token&refresh_token=${refresh_token}`
			)
			.then(response => {
				if (response.status === 200) {
					return firebaseService.setZohoValue('token', response.data.access_token).then(resp => {
						console.log('new token on db resp');
						return response.data.access_token;
					});
				}
			})
			.catch(error => {
				// handle error
				console.warn(error);
			});
	}

	async getToken() {
		return firebaseService.getZohoCredentials().then(zoho => {
			if (new Date(zoho.expiresIn) < new Date()) {
				let date = new Date();
				date.setMinutes(date.getMinutes() + 60);
				firebaseService.setZohoValue('expiresIn', date.toString()).then(response => {
					return this.fetchNewToken(zoho.refreshToken);
				});
			} else {
				return zoho.token;
			}
		});
	}
}
