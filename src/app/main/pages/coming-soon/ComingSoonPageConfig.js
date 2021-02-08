import { authRoles } from 'app/auth';
import React from 'react';

const ComingSoonPageConfig = {
	settings: {
		layout: {
			config: {
                // navbar        : {
                //     display: false
                // },
                // toolbar       : {
                //     display: false
                // },
                // footer        : {
                //     display: false
                // },
                // leftSidePanel : {
                //     display: false
                // },
                // rightSidePanel: {
                //     display: false
                // }
            }
		}
	},
	auth: authRoles.user,
	routes: [
		{
			path: '/pages/coming-soon',
			component: React.lazy(() => import('./ComingSoonPage'))
		}
	]
};

export default ComingSoonPageConfig;
