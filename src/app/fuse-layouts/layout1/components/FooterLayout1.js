import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import ScheduleButton from 'app/fuse-layouts/shared-components/ScheduleButton';
import CallButton from 'app/fuse-layouts/shared-components/CallButton';
import React from 'react';
import { useSelector } from 'react-redux';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	text: {
	  padding: theme.spacing(2, 2, 0),
	},
	paper: {
	  paddingBottom: 50,
	},
	list: {
	  marginBottom: theme.spacing(2),
	},
	subheader: {
	  backgroundColor: theme.palette.background.paper,
	},
	appBar: {
	  top: 'auto',
	  bottom: 0,
	},
	grow: {
	  flexGrow: 1,
	},
	fabButton: {
	  position: 'absolute',
	  zIndex: 1,
	  top: -30,
	  left: 0,
	  right: 0,
	  margin: '0 auto',
	},
  }));


function FooterLayout1(props) {
	const classes = useStyles();
	const footerTheme = useSelector(({ fuse }) => fuse.settings.footerTheme);
	const user = useSelector(({ auth }) => auth.user);
	const showShoppingCart = user.trip.data && user.trip.data.events.data.length > 1
	
	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar
				id="fuse-footer"
				className="relative z-10"
				color="default"
				style={{ backgroundColor: footerTheme.palette.background.default }}
			>
				<Toolbar className="px-16 py-0 flex items-center">
					<div className="flex flex-1">
						<ScheduleButton />
					</div>


					{showShoppingCart && <Fab color="secondary" aria-label="add" component={Link} to="/pages/coming-soon" className={classes.fabButton}>
						<ShoppingCartIcon />
					</Fab>}

					<div>
						<CallButton />
					</div>

				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default FooterLayout1;
