import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
// import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AccessibilityNew from '@material-ui/icons/AccessibilityNew';
import TapAndPlay from '@material-ui/icons/TapAndPlay';
import Tab from '@material-ui/icons/Tab';
import BatteryChargingFull from '@material-ui/icons/BatteryChargingFull';
import Movie from '@material-ui/icons/Movie';
import SettingsApplications from '@material-ui/icons/SettingsApplications';
import Assignment from '@material-ui/icons/Assignment';
import AccountBalance from '@material-ui/icons/AccountBalance';
import Home from '@material-ui/icons/Home';
import LocalAtm from '@material-ui/icons/LocalAtm';
import AspectRatio from '@material-ui/icons/AspectRatio';

import SpaIcon from '@material-ui/icons/Spa';
import Fastfood from '@material-ui/icons/Fastfood';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import LocalLaundryService from '@material-ui/icons/LocalLaundryService';
import CardMembership from '@material-ui/icons/CardMembership';
import Pets from '@material-ui/icons/Pets';

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import React from 'react';
import moment from 'moment';

import * as Actions from 'app/auth/store/actions';
// import OverlayBackdrop from 'app/main/dialogs/OverlayBackdrop';
import ActivateTripDialog from 'app/main/dialogs/ActivateTripDialog';
import GetUserDataDialog from 'app/main/dialogs/GetUserDataDialog';
import EventDialog from 'app/main/apps/calendar/EventDialog';



const useStyles = makeStyles(theme => ({
	header: {
		// height: 500,
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
		color: theme.palette.primary.contrastText
	},
	cardHeader: {
		backgroundColor: theme.palette.primary[800],
		color: theme.palette.getContrastText(theme.palette.primary[800])
	}
}));

function PricingStyle1Page() {
	const dispatch = useDispatch();
	const user = useSelector(({ auth }) => auth.user);
	const openActivateTripDialog = user.trip.openDialog
	// // const isCartLocked = user.trip.isCartLocked
	const openGetUserDataDialog = user.data.openDialog
	const services = user.trip.data ? user.trip.data.services.data : {}

	let tripEndDate = 0
	let tripStartDate = 0
	let tripData = useSelector(({ auth }) => auth.user.trip.data);
	if (tripData){
		tripEndDate = tripData.tripEndDate
		tripStartDate = tripData.tripStartDate
	}
	// const {tripEndDate, tripStartDate} = useSelector(({ auth }) => auth.user.trip.data);
	// const {tripEndDate, tripStartDate} = useSelector(({ auth }) => auth.user.trip.data);
	const minDate = moment(tripStartDate).format('MM/DD/YYYY');
	const maxDate = moment(tripEndDate).format('MM/DD/YYYY');

	const classes = useStyles();
	const [open, setOpen] = React.useState(true);

	const handleClick = () => {
	  setOpen(!open);
	};

	function generate(services, dispatch) {
		let arr = []
		let length = 0;
		console.log('services', services);
		for (let i in services){
	
			let icon = <ArrowRightIcon />
			if (services[i].icon === 'spa'){
				icon = <SpaIcon />
			} else if (services[i].icon === 'accessibility_new'){
				icon = <AccessibilityNew />
			} else if (services[i].icon === 'fastfood'){
				icon = <Fastfood />
			} else if (services[i].icon === 'local_laundry_service'){
				icon = <LocalLaundryService />
			} else if (services[i].icon === 'card_membership'){
				icon = <CardMembership />
			} else if (services[i].icon === 'pets'){
				icon = <Pets />
			} else if (services[i].icon === 'tap_and_play') {
				icon = <TapAndPlay />
			} 
			else if (services[i].icon === 'tab') {
				icon = <Tab />
			}
			else if (services[i].icon === 'battery_charging_full') {
				icon = <BatteryChargingFull />
			}
			else if (services[i].icon === 'movie') {
				icon = <Movie />
			}
			else if (services[i].icon === 'settings_applications') {
				icon = <SettingsApplications />
			}
			else if (services[i].icon === 'assignment') {
				icon = <Assignment />
			}
			else if (services[i].icon === 'account_balance') {
				icon = <AccountBalance />
			}
			else if (services[i].icon === 'home') {
				icon = <Home />
			}
			else if (services[i].icon === 'local_atm') {
				icon = <LocalAtm />
			}
			else if (services[i].icon === 'aspect_ratio') {
				icon = <AspectRatio />
			}
			// else if (services[i].icon === 'aspect_ratio') {
			// 	icon = <AspectAatio />
			// }

			// 
			// 
			// 
			// 
			// 
			// 
			// home
			// 
	
			console.log('services[i]', services[i]);
			let serviceOptions = services[i].serviceOptions
			let listItem = []
			for (let j in serviceOptions){
				
				let {
					
					priceQuantifier1Label,
					serviceLabel, 
					requestsLabel,
					priceLabel,
					subServiceLabel,
					priceQuantifier2Label,

					
					priceQuantifier1,priceQuantifier2,serviceTitle, serviceId, priceMax, priceMin, price, priceType, subServiceOptions = ''} = serviceOptions[j]
				let budget = ''
				if (priceType.includes("exact")){
					budget = price
				}
				listItem.push(
					<ListItem 
					button
						key={serviceId} 
						onClick={() =>{
							let obj = {
								...services[i],
								budget,
								price,
								priceType,
								priceMax,
								priceMin,
								priceQuantifier1,
								priceQuantifier2,

								priceQuantifier1Label,
								serviceLabel,
								requestsLabel,
								priceLabel,
								subServiceLabel,
								priceQuantifier2Label,

								serviceTitle,
								subServiceOptions,
								serviceId,
								start: minDate,
								end: maxDate,
							}
							dispatch(Actions.openNewEventDialog(obj))
						}
					}
					>
	
						<ListItemAvatar>
							<Avatar>
								{icon}
							</Avatar>
						</ListItemAvatar>
	
						<ListItemText primary={serviceTitle} />
						
							<Button 
							size="small"
							variant="outlined"
							className="w-128">
							<Icon className="text-16">launch</Icon>
							<span className="mx-4">CHOOSE SERVICE</span>
							</Button>
	
					</ListItem>
				)
			}
			

			const serviceOptionLength = Object.keys(services[i].serviceOptions).length 
			console.log('serviceOptionLength', serviceOptionLength, length);
			if (serviceOptionLength > length) {
				length = serviceOptionLength
				arr.unshift(
					<div className="w-full sm:w-1/2 p-24" key={services[i].title}>
						<Typography className="text-20 mb-8">{services[i].title}</Typography>
						<Typography className="text-16" color="textSecondary">
						</Typography>
						{listItem}
					</div>
				)
			} else {
				arr.push(
					<div className="w-full sm:w-1/2 p-24" key={services[i].title}>
							<Typography className="text-20 mb-8">{services[i].title}</Typography>
							<Typography className="text-16" color="textSecondary">
							</Typography>
								{listItem}
						</div>
				)
				console.log('here');
			}
	
		}
		return arr
	  }

	// function handleDescirptionLength(length) {
	// 	console.log('length', length)
	// 	if (length > 130) return 10
	// 	if (length > 90) return 14
	// 	return 17
	// }

	function handleOpenEventDialoge(n){
		console.log('stop', n)
		dispatch(
			Actions.openNewEventDialog({
				...n,
				start: new Date(),
				end: new Date(),
			})
		)
	}
	
	if (!user) return null

	if (openActivateTripDialog){
		return (
			<>
			{openActivateTripDialog && <ActivateTripDialog />}
			</>
		)
	}

	return (
		<>
			<div>
				<div
					className={clsx(
						classes.header,
						'flex flex-col flex-shrink-0 items-center justify-center text-center p-16 sm:p-24 h-200 sm:h-360'
					)}
				>
					<FuseAnimate animation="transition.slideUpIn" duration={400} delay={100}>
						<Typography color="inherit" variant="h4" className="text-36 sm:text-56 font-light">
							Your Concierge Connector to Local Business Success
						</Typography>
					</FuseAnimate>

					<FuseAnimate duration={400} delay={600}>
						<Typography
							variant="subtitle1"
							color="inherit"
							className="opacity-75 mt-8 sm:mt-16 mx-auto max-w-512"
						>
							Pick the service you need, your budget, estimate your goals and timeline! We evaluate your plan, confirm, & coordinate multiple ideal service providers for you!
						</Typography>
					</FuseAnimate>
				</div>

			<div className="flex flex-col flex-1 flex-shrink-0 max-w-xl w-full mx-auto px-16 sm:px-24 py-24 sm:py-32">
					<div className="w-full max-w-2xl mx-auto">
						<FuseAnimateGroup
							enter={{
								animation: 'transition.slideUpBigIn'
							}}
							className="flex items-center justify-center flex-wrap"
						>
							
						{Object.entries(services).map(([key, n]) => {
							// console.log(key, '///', n.description.length)
							return (
								<div className="w-full max-w-320 sm:w-1/3 p-12" key={key} >
									<Card raised square>
										<div
											className={clsx(
												classes.cardHeader,
												'flex items-center justify-between px-24 py-16'
											)}
										>
											<Typography variant="subtitle1" color="inherit">
												{n.title}
											</Typography>
										</div>

										<CardContent className="p-32">
											<img src={n.image} alt={n.title}/>
											<Divider className="my-32" />
											<div className="flex flex-col" style={{ 'height': 120, 'marginBottom': 10 }}>
												<Typography variant='subtitle1' className="">
													{n.description}
												</Typography>
											</div>
										</CardContent>

										<div className="flex justify-center pb-32">
											<Button 
											onClick={()=> handleOpenEventDialoge(n)}
											variant="contained" color="secondary" className="w-128">
												<Icon className="text-16">{n.icon}</Icon>
												<span className="mx-4">CHOOSE SERVICE</span>
											</Button>

										</div>
									</Card>
								</div>
							);
						})}
						</FuseAnimateGroup>

						<div className="flex flex-col items-center py-96 text-center sm:ltr:text-left sm:rtl:text-right max-w-xl mx-auto">
							<Button size="large" variant="outlined" onClick={handleClick}>
								{open ? 'VIEW ALL SERVICES' : 'HIDE ALL SERVICES'}
							</Button>
							<FuseAnimateGroup
							enter={{
								animation: 'transition.slideUpBigIn'
							}}
							className="flex flex-wrap w-full"
							>
								{!open && generate(services, dispatch)}
							</FuseAnimateGroup>
						</div>
						
					</div>
				</div>
			</div>
			{/* {isCartLocked && <OverlayBackdrop />} */}
			{openActivateTripDialog && <ActivateTripDialog />}
			{openGetUserDataDialog && !openActivateTripDialog && <GetUserDataDialog />}
			<EventDialog />
		</>
	);
}

export default PricingStyle1Page;
