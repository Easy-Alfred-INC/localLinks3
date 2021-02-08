import { combineReducers } from 'redux';
import login from './login.reducer';
import register from './register.reducer';
import user from './user.reducer';
// import tripData from './contacts.reducer';

const authReducers = combineReducers({
	// tripData,
	user,
	login,
	register
});

export default authReducers;
