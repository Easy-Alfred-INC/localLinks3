import Config from './config';

const routes = {
	getRecord: (module, id) => `${module}${id ? '/' + id : ''}`,
	searchByCriteria: (module, criteria, value) => `${module}/search?${criteria}=${value}`,
	postRecord: module => `${module}`,
	putRecord: (module, id) => `${module}/${id}`
};

export default class ZService {
	constructor() {
		this.zConfig = new Config();
		this.baseApi = 'https://www.zohoapis.com/crm/v2/';
		this.baseAPIGateway = ' https://4t1m6bslik.execute-api.us-east-1.amazonaws.com/default';
	}

	async getRecord(module) {
		const actualToken = await this.zConfig.getToken();

		fetch(`${this.baseApi}${routes.getRecord(module)}`, {
			headers: {
				Authorization: `Zoho-oauthtoken ${actualToken}`
			}
		})
			.then(response => {
				response
					.json()
					.then(data => {
						return data;
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	}

	async getSpecificRecord(module, id) {
		const actualToken = await this.zConfig.getToken();
		fetch(`${this.baseApi}${routes.getRecord(module, id)}`, {
			headers: {
				Authorization: `Zoho-oauthtoken ${actualToken}`
			}
		})
			.then(response => {
				response
					.json()
					.then(data => {
						return data;
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	}

	async getRecordByCriteria(module, criteria, value) {
		const urlGetRecord = '/get-record';
		const actualToken = await this.zConfig.getToken();
		const payload = {
			url: `${this.baseApi}${routes.searchByCriteria(module, criteria, value)}`,
			token: actualToken
		};
		return await fetch(this.baseAPIGateway + urlGetRecord, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then(response => {
				return response
					.json()
					.then(data => {
						if (data['errorType']) {
							return undefined;
						}
						return JSON.parse(data.body);
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	}

	async putRecord(module, body, id) {
		const urlPUTRecord = '/test';
		const actualToken = await this.zConfig.getToken();

		let requestBody = {};
		requestBody['data'] = [body];

		const payload = {
			url: `${this.baseApi}${routes.putRecord(module, id)}`,
			token: actualToken,
			data: requestBody
		};

		fetch(this.baseAPIGateway + urlPUTRecord, {
			method: 'PUT',
			body: JSON.stringify(payload),
			headers: {
				'Content-type': 'application/json'
			}
		})
			.then(response => {
				response
					.json()
					.then(data => {
						return data;
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	}

	async postRedord(module, body) {
		const urlPOSTRecord = '/test';
		const actualToken = await this.zConfig.getToken();

		let requestBody = {};
		requestBody['data'] = [body];

		const payload = {
			url: `${this.baseApi}${routes.postRecord(module)}`,
			token: actualToken,
			data: requestBody
		};
		fetch(this.baseAPIGateway + urlPOSTRecord, {
			body: JSON.stringify(payload),
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			}
		})
			.then(response => {
				response
					.json()
					.then(data => {
						return data;
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	}
}
