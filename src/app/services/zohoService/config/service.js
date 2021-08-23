import Config from './config'

const routes = {
	getRecord: (module, id) => `${module}${id ? '/' + id : ''}`,
	searchByCriteria: (module, criteria, value) => `${module}/search?${criteria}=${value}`,
	postRecord: module => `${module}`,
	putRecord: (module, id) => `${module}/${id}`
};

export default class ZService {

    constructor() {
        this.zConfig = new Config();
        this.baseApi = '/crm/v2/';
    }

     async getRecord(module){
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

    async getSpecificRecord(module,id){
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


    async getRecordByCriteria(module,criteria,value){
	   const actualToken = await this.zConfig.getToken();

       return await fetch(`${this.baseApi}${routes.searchByCriteria(module, criteria, value)}`, {
			headers: {
				Authorization: `Zoho-oauthtoken ${actualToken}`
			}
		})
			.then(response => {
				return response
					.json()
					.then(data => {
						return data;
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
    }

	async putRecord(module, body, id){

		const actualToken = await this.zConfig.getToken();
		let requestBody = {};
		requestBody['data'] = [body];
		fetch(`${this.baseApi}${routes.putRecord(module, id)}`, {
			method: 'PUT',
			body: JSON.stringify(requestBody),
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

    async postRedord(module,body){

		const actualToken = await this.zConfig.getToken();
        let requestBody = {};
        requestBody['data'] = [body];
        fetch(`${this.baseApi}${routes.postRecord(module)}`, {
			method: 'POST',
			body: JSON.stringify(requestBody),
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

}