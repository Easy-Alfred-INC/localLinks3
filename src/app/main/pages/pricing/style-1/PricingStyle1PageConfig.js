import { authRoles } from 'app/auth';
import React from 'react';

const PricingStyle1PageConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.user,
	routes: [
		{
			path: '/pages/pricing/style-1',
			component: React.lazy(() => import('./PricingStyle1Page'))
		}
	]
};

export default PricingStyle1PageConfig;
