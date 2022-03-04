import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import React from 'react';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function ScheduleButton() {
	// const user = useSelector(({ auth }) => auth.user);
	// const isCartLocked = user.trip.isCartLocked
	// const {email, displayName } = user.data

	function handleClick() {
		console.log('click');
		// window.close();
	}

	return (
		<Button
			// component="a"
			// href={`https://calendly.com/ringyouralfred/ring-your-alfred?name=${displayName}&email=${email}`}
			component={Link}
			to="/pages/knowledge-base"
			onClick={handleClick}
			rel="noreferrer noopener"
			role="button"
			className="normal-case px-4"
			variant="contained"
			color="secondary"
			style={{ whiteSpace: 'nowrap' }}
			// disabled={isCartLocked}
		>
			<Icon className="text-16">perm_contact_calendar</Icon>
			<span className="mx-2 text-xs">Schedule Local Guide!</span>
			{/* <span className="mx-4">{isCartLocked ? 'Meeting Scheduled' : 'Ring Alfred Later'}</span> */}
		</Button>
	);
}

export default ScheduleButton;
