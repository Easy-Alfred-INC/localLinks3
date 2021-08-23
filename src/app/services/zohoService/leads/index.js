import ZService from '../config/service';

export default class ZDeals {
	constructor() {
		this.zService = new ZService();
	}

	getDeals() {
		return this.zService.getRecord('Deals');
	}

	createDeal(data) {
		return this.zService.postRedord('Deals', data);
	}
}
