import ZService from '../config/service';

export default class ZContacts {
	constructor() {
		this.zService = new ZService();
	}

	getContacts() {
		return this.zService.getRecord('Contacts');
	}

	updateContacts(data, id) {
		return this.zService.putRecord('Contacts', data, id);
	}

	getContactByEmail(email) {
		return this.zService.getRecordByCriteria('Contacts', 'email', email);
	}

	createContacts(data) {
		return this.zService.postRedord('Contacts', data);
	}
}
