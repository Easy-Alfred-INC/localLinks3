import { authRoles } from 'app/auth';
import GuestRoleExample from './GuestRoleExample';

const GuestRoleExampleConfig = {
	settings: {
		layout: {
			// config: {
            //     navbar        : {
            //         display: false
            //     },
            //     toolbar       : {
            //         display: false
            //     },
            //     footer        : {
            //         display: false
            //     },
            //     leftSidePanel : {
            //         display: false
            //     },
            //     rightSidePanel: {
            //         display: false
            //     }
            // }
		}
	},
	auth: authRoles.user, // ['guest']
	routes: [
		{
			path: '/auth/guest-role-example',
			component: GuestRoleExample
		}
	]
};

export default GuestRoleExampleConfig;
