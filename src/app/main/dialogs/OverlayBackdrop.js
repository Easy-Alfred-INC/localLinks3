import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	backdrop: {
	  zIndex: theme.zIndex.drawer + 1,
	  color: '#fff',
	}
}));


function OverlayBackdrop(props) {
	const user = useSelector(({ auth }) => auth.user);
	const tripDialog = user.trip
	const classes = useStyles();

	console.log('in backdrop1', tripDialog);
	
	return (
		<Backdrop className={classes.backdrop} open={true} onClick={()=>console.log('in backdrop')}>
			<Typography variant="h3" className="text-center mb-16">
				Talk to you soon!
			</Typography>
		</Backdrop>
	);
	
}

export default OverlayBackdrop;
