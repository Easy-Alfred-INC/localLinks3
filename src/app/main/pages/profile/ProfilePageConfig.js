import { authRoles } from 'app/auth';
import React from 'react';

const ProfilePageConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.user,
	routes: [
		{
			path: '/pages/profile',
			component: React.lazy(() => import('./ProfilePage'))
		}
	]
};

export default ProfilePageConfig;
