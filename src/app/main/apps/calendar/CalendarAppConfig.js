import { authRoles } from 'app/auth';
import React from 'react';

const CalendarAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.user,
	routes: [
		{
			path: '/apps/calendar',
			component: React.lazy(() => import('./CalendarApp'))
		}
	]
};

export default CalendarAppConfig;