// import { authRoles } from 'app/auth';
import React from 'react';

const FaqPageConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	// auth: authRoles.staff,
	routes: [
		{
			path: '/pages/faq',
			component: React.lazy(() => import('./FaqPage'))
		}
	]
};

export default FaqPageConfig;
