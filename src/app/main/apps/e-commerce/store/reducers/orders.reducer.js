import * as Actions from '../actions';

const initialState = {
	data: [],
	searchText: '',
	
	tripDialog: {
		type: 'new',
		props: {
			open: false
		},
		data: null
	},
};

const ordersReducer = (state = initialState, action) => {
	switch (action.type) {
		case Actions.GET_ORDERS: {
			return {
				...state,
				data: action.payload
			};
		}
		case Actions.SET_ORDERS_SEARCH_TEXT: {
			return {
				...state,
				searchText: action.searchText
			};
		}

		//fixme
		case Actions.UPDATE_ORDERS_DATA: {
			let {id, isCartLocked, isAdmin, invoiceLink, displayName} = action.payload
			let roleName = ''
			if (isAdmin){
				roleName = ` [admin]`
			}
			
			console.log('jojo4', action.payload)
			let cartLockedName = isCartLocked ? "Cart Locked" : 'Cart Unlocked'

			state.data.map((item)=>{
				if (item.id === id) {
						// console.log('jojo5', item)
						item.status[0].name = cartLockedName
						item.isCartLocked = isCartLocked
						item.invoiceLink = invoiceLink
						item.customer.firstName = displayName + roleName
						item.isAdmin = isAdmin
					}
					return item
			})
			return {
				...state,
			};
		}


		case Actions.OPEN_EDIT_TRIP_DIALOG: {
			return {
				...state,
				tripDialog: {
					type: 'edit',
					props: {
						open: true
					},
					data: {
						...action.data,
					}
				}
			};
		}
		case Actions.CLOSE_EDIT_TRIP_DIALOG: {
			// console.log('in CLOSE_EDIT_TRIP_DIALOG');
			
			return {
				...state,
				tripDialog: {
					type: 'edit',
					props: {
						open: false
					},
					data: null
				}
			};
		}


		default: {
			return state;
		}
	}
};

export default ordersReducer;
