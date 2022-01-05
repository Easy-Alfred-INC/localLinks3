import ZService from '../config/service';

export default class ZProducts {
	constructor() {
		this.zService = new ZService();
	}

	getProducts() {
		return this.zService.getRecord('Products');
	}

	getProductsByName(name) {
		return this.zService.getRecordByCriteria('Products', 'criteria', `Product_Name:equals:${name}`);
	}
}
