import { authRoles } from 'app/auth';
import React from 'react';

const ForgotPassword2PageConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: '/pages/auth/forgot-password-2',
			component: React.lazy(() => import('./ForgotPassword2Page'))
		}
	]
};

export default ForgotPassword2PageConfig;
