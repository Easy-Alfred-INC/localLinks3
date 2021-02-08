import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import AppBar from '@material-ui/core/AppBar';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
// import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
// import IconButton from '@material-ui/core/IconButton';
// import Input from '@material-ui/core/Input';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import axios from 'axios';
import React from 'react';
// import { useSelector } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import moment from 'moment';

import * as Actions from 'app/auth/store/actions';
// // import React from 'react';
// import { useDispatch } from 'react-redux';

// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';

function TimelineTab() {
	const dispatch = useDispatch();
	const user = useSelector(({ auth }) => auth.user);
	const userData = user.data
	const tripData = user.trip.data
	const isCartLocked = user.trip.isCartLocked
	
	if (!tripData) {
		return null;
	}

	const {
		locationImage,
		locationAddress,
		locationName,
		tid,
		tripEndDate,
		tripStartDate
	} = tripData
	console.log('tripData', tripData);

	function openDialog () {
		dispatch(Actions.openUpdateUserDataDialog());
	}
	
	return (
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
				>

				<Card key={tid} className="mb-32 overflow-hidden">
					<CardHeader
						avatar={<Icon>local_hotel</Icon>}
						action={
							<Button 
							component={Link} 
							to="/pages/pricing/style-1" 
							variant="contained" 
							color="secondary" 
							// className="w-128"
							>
								View Services
							</Button>
						}
						title={
							<span className="flex">
								<Typography className="font-medium" color="primary" paragraph={false}>
									{locationName}
								</Typography>
							</span>
						}
							subheader={isCartLocked ? locationAddress : ''}
					/>

					<CardContent className="py-0">
						<Typography component="p" className="mb-16">
							{moment(tripStartDate).format('MM/DD/YYYY') + ' - ' + moment(tripEndDate).format('MM/DD/YYYY')}
						</Typography>

						<img src={locationImage} alt="post" />
			
					</CardContent>
				</Card>
					
				</FuseAnimateGroup>
			</div>

			<div className="flex flex-col md:w-320">
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
				>
					<Card className="w-full mb-16">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									Personal Information
								</Typography>
								<Button onClick={openDialog} className="normal-case" color="inherit" size="small">
									<Icon>edit</Icon>
								</Button>
							</Toolbar>
						</AppBar>

						<CardContent>
							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Name</Typography>
								<Typography>{userData.displayName}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Email</Typography>
								<Typography>{userData.email}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Phone</Typography>
								<Typography>{userData.phone}</Typography>
							</div>
							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Bio</Typography>
								<Typography>{userData.bio}</Typography>
							</div>
						</CardContent>
					</Card>
					
					{/* <Card className="w-full mb-16">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									Travel Information
								</Typography>
								<Button className="normal-case" color="inherit" size="small">
									edit
								</Button>
							</Toolbar>
						</AppBar>

						<CardContent>
							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Party Size</Typography>
								<Typography>general.gender</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Budget</Typography>
								<Typography>general.birthday</Typography>
							</div>

						</CardContent>
					</Card> */}




				</FuseAnimateGroup>
			</div>
		</div>
	);
}

export default TimelineTab;
