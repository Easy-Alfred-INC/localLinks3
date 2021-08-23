
import firebaseService from 'app/services/firebaseService';
import axios from 'axios';
export default class Config {
	constructor() {
		this.clientId = '1000.7IG3MM1UVJLAIUCISKGJ8FMC45JELW'; // sandbox 1000.7IG3MM1UVJLAIUCISKGJ8FMC45JELW
		this.clientSecret = '92e562bfb1ccb78a43417787a3ef012c3ee008b71b'; // sandbox 92e562bfb1ccb78a43417787a3ef012c3ee008b71b
		this.grantType = 'authorization_code' | 'refresh_token';
		this.token = '1000.c7f7a77586d4d526868b4a0d8dd9bc8b.f9acdce8a36d7c89c6d393e93441416b';

	}


	async getToken() {
		return firebaseService.getZohoCredentials().then(zoho => {
			if (new Date(zoho.expiresIn) < new Date()) {
				let date = new Date();
				date.setMinutes(date.getMinutes() + 60);
				firebaseService.setZohoValue('expiresIn', date.toString()).then(response => {
					return zoho.token;
				});
			} else {
				return zoho.token;
			}
		});
	}


	fetchNewToken(refreshToken){
		/*
		axios
			.post('https://accounts.zoho.com/oauth/v2/token', {
				headers: {
					//Authorization: this.authorizationHeader,
					client_id: '1000.95943L7FQX0FGN25WWSPPMJTVXOXMZ',
					client_secret: '64c28a499af777bf9d400156fb41ce9ff575e67e21',
					redirect_uri: this.redirect_uri,
					grant_type: 'authorization_code'
					//refresh_token: refreshToken
				}
			})
			.then(response => {
				console.log(response);
			})
			.catch(error => {
				// handle error
				console.warn('Cannot retrieve user data', error);
			});
		*/
	}
}
