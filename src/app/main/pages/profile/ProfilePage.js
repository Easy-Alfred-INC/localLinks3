import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Avatar from '@material-ui/core/Avatar';
// import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
// import AboutTab from './tabs/AboutTab';
import TimelineTab from './tabs/TimelineTab';

import { useSelector } from 'react-redux';

import ActivateTripDialog from 'app/main/dialogs/ActivateTripDialog';
import GetUserDataDialog from 'app/main/dialogs/GetUserDataDialog';
// // import OverlayBackdrop from 'app/main/dialogs/OverlayBackdrop';

const useStyles = makeStyles(theme => ({
	layoutHeader: {
		background: "url(assets/images/easyAlfred/video-banner-screen-shot.jpg)",
		backgroundSize: "cover",
		backgroundPosition: 'center',
		height: 320,
		minHeight: 320,
		[theme.breakpoints.down('md')]: {
			height: 240,
			minHeight: 240
		}
	}
}));

function ProfilePage() {
	const user = useSelector(({ auth }) => auth.user);
	const openActivateTripDialog = user.trip.openDialog
	const tid = user.trip.data ? user.trip.data.tid : ''
	const openGetUserDataDialog = user.data.openDialog
	const { displayName } = user.data
	console.log('user.data', user);

	const classes = useStyles();
	const [selectedTab, setSelectedTab] = useState(0);

	function handleTabChange(event, value) {
		setSelectedTab(value);
	}


	return (
		<>
			<FusePageSimple
				classes={{
					header: classes.layoutHeader,
					toolbar: 'px-16 sm:px-24'
				}}
				header={
					<div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
						<div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
							<FuseAnimate animation="transition.expandIn" delay={300}>
								<Avatar className="w-96 h-96" src={'assets/images/avatars/profile.jpg'} />
							</FuseAnimate>
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Typography className="md:mx-24" variant="h4" color="inherit">
									{displayName}
								</Typography>
							</FuseAnimate>
						</div>

						{/* <div className="flex items-center justify-end">
							<Button className="mx-8 normal-case" variant="contained" color="secondary" aria-label="Follow">
								Follow
							</Button>
							<Button className="normal-case" variant="contained" color="primary" aria-label="Send Message">
								Send Message
							</Button>
						</div> */}
					</div>
				}
				contentToolbar={
					<Tabs
						value={selectedTab}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="off"
						classes={{
							root: 'h-64 w-full border-b-1'
						}}
					>
						<Tab
							classes={{
								root: 'h-64'
							}}
							label={"Market Id: " + tid}
						/>
						{/* <Tab
							classes={{
								root: 'h-64'
							}}
							label="About"
						/> */}
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24">
						<TimelineTab />
					</div>
				}
			/>
			{/* {isCartLocked && <OverlayBackdrop />} */}
			{openActivateTripDialog && <ActivateTripDialog />}
			{openGetUserDataDialog && !openActivateTripDialog && <GetUserDataDialog />}
		</>
	);
}

export default ProfilePage;
