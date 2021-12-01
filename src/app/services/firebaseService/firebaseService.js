import firebase from 'firebase/app';
import FuseUtils from '@fuse/utils/FuseUtils';
import 'firebase/auth';
import 'firebase/database';
import config from './firebaseServiceConfig';
import moment from 'moment';



class FirebaseService {
	init(success) {
		if (Object.entries(config).length === 0 && config.constructor === Object) {
			if (process.env.NODE_ENV === 'development') {
				console.warn(
					'Missing Firebase Configuration at src/app/services/firebaseService/firebaseServiceConfig.js'
				);
			}
			success(false);
			return;
		}

		if (firebase.apps.length) {
			return;
		}
		firebase.initializeApp(config);
		this.db = firebase.database();
		this.auth = firebase.auth();
		success(true);
	}

	saveNewService = service => {
		const LAST_UPDATED = moment().format();
		if (!firebase.apps.length) {
			return false;
		}
		let serviceId = Object.keys(service)[0];
		console.log('serviceId', serviceId);
		return new Promise((resolve, reject) => {
			this.db
				.ref(`services/${serviceId}`)
				.once('value')
				.then(snapshot => {
					if (snapshot.val()) return resolve(false);
					service[serviceId]['lastUpdated'] = LAST_UPDATED;
					return resolve(this.db.ref(`services/${serviceId}`).set(service[serviceId]));
				});
		});
	};

	updateServices = service => {
		const LAST_UPDATED = moment().format();
		if (!firebase.apps.length) {
			return false;
		}
		let serviceId = Object.keys(service)[0];
		let newService = service[serviceId];
		newService['lastUpdated'] = LAST_UPDATED;
		console.log('zzz newService', newService);
		return this.db.ref(`services/${serviceId}`).set(newService);
	};

	updateService = service => {
		const LAST_UPDATED = moment().format();
		if (!firebase.apps.length) {
			return false;
		}
		const { name: serviceId, lastName: region, nickname: subRegion, notes } = service;
		this.db.ref(`services/${serviceId}/notes`).set(notes);
		this.db.ref(`services/${serviceId}/region`).set(region);
		this.db.ref(`services/${serviceId}/lastUpdated`).set(LAST_UPDATED);
		return this.db.ref(`services/${serviceId}/subRegion`).set(subRegion);
	};

	removeService = sid => {
		if (!firebase.apps.length) {
			return false;
		}
		return new Promise((resolve, reject) => {
			this.db
				.ref(`services/${sid}`)
				.once('value', function(snapshot) {
					if (!snapshot.exists()) return reject('record not found');

					snapshot.forEach(function(itemSnapshot) {
						itemSnapshot.ref.remove();
					});
				})
				.then(() => {
					resolve();
				});
		})
			.then(user => {
				return user;
			})
			.catch(err => {
				console.log('error', err);
				return null;
			});
	};

	getAllServices = userId => {
		if (!firebase.apps.length) {
			return false;
		}
		return new Promise((resolve, reject) => {
			this.db
				.ref(`services`)
				.once('value')
				.then(snapshot => {
					const service = snapshot.val();
					resolve(service);
				});
		});
	};

	rehydrateUserServices = form => {
		if (!firebase.apps.length) {
			return false;
		}

		let { id: uid, tid } = form;
		console.log('form', form);
		console.log('uid', uid, tid);

		return new Promise((resolve, reject) => {
			this.db
				.ref(`trips/${tid}`)
				.once('value')
				.then(snapshot => {
					const user = snapshot.val();
					resolve(user);
				});
		}).then(trip => {
			if (!trip) return null;
			return new Promise((resolve, reject) => {
				this.db
					.ref(`services/${trip.sid}`)
					.once('value')
					.then(snapshot => {
						const services = snapshot.val();
						if (!services) {
							console.log('Services not found');
							return resolve();
						}
						resolve(services);
					});
			}).then(services => {
				console.log('===>', uid, services);
				this.db.ref(`users/${uid}/trip/data/services`).set(services);
				return true;
			});
		});
	};

	rehydrateAllTripServices = form => {
		if (!firebase.apps.length) {
			return false;
		}
		console.log('yoo');
	};

	confirmUserServices = uid => {
		return new Promise((resolve, reject) => {
			console.log('uid', uid);
			let oldRef = this.db.ref(`users/${uid}/trip/data/events/data`);
			oldRef
				.once('value')
				.then(snap => {
					let oldVal = snap.val();
					Object.keys(snap.val()).forEach(i => {
						oldVal[i].isConfirmed = true;
					});
					return oldVal;
				})
				.then(oldVal => {
					return oldRef.set(oldVal);
				})
				.then(data => {
					console.log('Done!', data);
					resolve(true);
				})
				.catch(err => {
					console.log(err.message);
					reject();
				});
		});
	};

	getHouse = houseId => {
		if (!firebase.apps.length) {
			return false;
		}
		return new Promise((resolve, reject) => {
			this.db
				.ref(`trips/${houseId}`)
				.once('value')
				.then(snapshot => {
					const house = snapshot.val();
					console.log('house', house);
					resolve(house);
				});
		});
	};

	getAllHouses = userId => {
		if (!firebase.apps.length) {
			return false;
		}
		let p1 = new Promise((resolve, reject) => {
			this.db
				.ref(`trips`)
				.once('value')
				.then(snapshot => {
					const houses = snapshot.val();
					resolve(houses);
				});
		});
		let p2 = new Promise((resolve, reject) => {
			this.db
				.ref(`services`)
				.once('value')
				.then(snapshot => {
					let services = Object.keys(snapshot.val());
					resolve(services);
				});
		});

		return Promise.all([p1, p2]).then(values => {
			console.log('//', values); // [3, 1337, "foo"]
			return values;
		});
	};

	matchSids = houses => {
		if (!firebase.apps.length) {
			return false;
		}
		return new Promise((resolve, reject) => {
			this.db
				.ref(`services`)
				.once('value')
				.then(snapshot => {
					let services = Object.keys(snapshot.val());
					resolve({ services, houses });
				});
		});
	};

	updateHouse = house => {
		if (!firebase.apps.length) {
			return false;
		}
		console.log('house2', house);
		return this.db.ref(`trips/${house.tid}`).set(house);
	};

	saveNewHouse = house => {
		if (!firebase.apps.length) {
			return false;
		}

		return new Promise((resolve, reject) => {
			this.db
				.ref(`trips/${house.tid}`)
				.once('value')
				.then(snapshot => {
					if (snapshot.val()) return resolve(false);
					return resolve(this.db.ref(`trips/${house.tid}`).set(house));
				});
		});
	};

	removeHouse = hid => {
		if (!firebase.apps.length) {
			return false;
		}
		console.log('hid', hid);
		return new Promise((resolve, reject) => {
			this.db
				.ref(`trips/${hid}`)
				.once('value', function(snapshot) {
					if (!snapshot.exists()) return reject('record not found');

					snapshot.forEach(function(itemSnapshot) {
						itemSnapshot.ref.remove();
					});
				})
				.then(() => {
					resolve();
				});
		})
			.then(user => {
				return user;
			})
			.catch(err => {
				console.log('error', err);
				return null;
			});
	};

	getUserData = userId => {
		if (!firebase.apps.length) {
			return false;
		}
		// console.log('1) getUserData id =', userId);

		return new Promise((resolve, reject) => {
			this.db
				.ref(`users/${userId}`)
				.once('value')
				.then(snapshot => {
					const user = snapshot.val();
					// console.log('2) user snap', user);
					resolve(user);
				});
		});
	};

	getAllUsers = userId => {
		if (!firebase.apps.length) {
			return false;
		}
		return new Promise((resolve, reject) => {
			this.db
				.ref(`users`)
				.once('value')
				.then(snapshot => {
					const user = snapshot.val();
					resolve(user);
				});
		});
	};

	getTripData = (tripId, form) => {
		if (!firebase.apps.length) {
			return false;
		}

		return new Promise((resolve, reject) => {
			this.db
				.ref(`trips/${tripId}`)
				.once('value')
				.then(snapshot => {
					const user = snapshot.val();
					resolve(user);
				});
		}).then(trip => {
			if (!trip) return null;
			return new Promise((resolve, reject) => {
				this.db
					.ref(`services/${trip.sid}`)
					.once('value')
					.then(snapshot => {
						const services = snapshot.val();
						if (!services) {
							console.log('Services not found');
							return resolve();
						}

						let newEventWithUpdatedDates = {};
						newEventWithUpdatedDates[FuseUtils.generateGUID()] = {
							allDay: true,
							isConfirmed: false,
							id: FuseUtils.generateGUID(),
							title: `Stay at: ${trip.locationName}`,
							start: form.tripStartDate.format(),
							end: form.tripEndDate.format(),
							isLocked: true
						};

						const newTrip = {
							...trip,
							services,
							events: {
								openDialog: false,
								data: {
									...newEventWithUpdatedDates
								}
							}
						};
						resolve(newTrip);
					});
			});
		});
	};

	removeEvent = (uid, eid) => {
		if (!firebase.apps.length) {
			return false;
		}

		return new Promise((resolve, reject) => {
			this.db
				.ref(`users/${uid}/trip/data/events/data`)
				.orderByChild('id')
				.equalTo(eid)
				.once('value', function(snapshot) {
					if (!snapshot.exists()) return reject('record not found');

					snapshot.forEach(function(itemSnapshot) {
						itemSnapshot.ref.remove();
					});
				})
				.then(() => {
					resolve(this.getUserData(uid));
				});
		})
			.then(user => {
				return user;
			})
			.catch(err => {
				console.log('error', err);
				return null;
			});
	};

	archiveUserTrip = uid => {
		return new Promise((resolve, reject) => {
			let oldRef = this.db.ref(`users/${uid}/trip`);
			let newRef = this.db.ref(`users/${uid}/tripArchive`);
			oldRef
				.once('value')
				.then(snap => {
					console.log(snap.val());
					return newRef.push(snap.val());
				})
				.then(() => {
					return oldRef.set({
						active: false,
						isCartLocked: false,
						lastUpdated: Date.now(),
						openDialog: true
					});
				})
				.then(data => {
					console.log('Done!', data);
					resolve(true);
				})
				.catch(err => {
					console.log(err.message);
					reject();
				});
		});
	};

	updateUserData = user => {
		if (!firebase.apps.length) {
			return false;
		}
		return this.db.ref(`users/${user.uid}`).set(user);
	};

	updateIsCartLocked = (id, isCartLocked) => {
		if (!firebase.apps.length) {
			return false;
		}
		return this.db.ref(`users/${id}/trip/isCartLocked`).set(isCartLocked);
	};

	updateInvoiceLink = (id, invoiceLink) => {
		if (!firebase.apps.length) {
			return false;
		}
		return this.db.ref(`users/${id}/trip/invoiceLink`).set(invoiceLink);
	};

	updateIsAdmin = (id, isAdmin) => {
		if (!firebase.apps.length) {
			return false;
		}
		const isAdminText = isAdmin ? ['admin'] : ['user'];
		return this.db.ref(`users/${id}/role`).set(isAdminText);
	};

	onAuthStateChanged = callback => {
		if (!this.auth) {
			return;
		}
		this.auth.onAuthStateChanged(callback);
	};

	getZohoCredentials() {
		if (!firebase.apps.length) {
			return false;
		}
		return new Promise((resolve, reject) => {
			this.db
				.ref(`zoho`)
				.once('value')
				.then(snapshot => {
					console.log(snapshot);
					const service = snapshot.val();
					resolve(service);
				});
		});
	}

	setZohoValue(module, value) {
		if (!firebase.apps.length) {
			return false;
		}
		return this.db.ref(`zoho/${module}`).set(value);
	}

	signOut = () => {
		if (!this.auth) {
			return;
		}
		this.auth.signOut();
	};
	yarn;
}

const instance = new FirebaseService();

export default instance;
