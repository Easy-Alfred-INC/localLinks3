import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Table from '@material-ui/core/Table';
import Toolbar from '@material-ui/core/Toolbar';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FusePageSimple from '@fuse/core/FusePageSimple';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import moment from 'moment';
import { Link } from 'react-router-dom';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import * as Actions from 'app/auth/store/actions';
import ActivateTripDialog from 'app/main/dialogs/ActivateTripDialog';
import GetUserDataDialog from 'app/main/dialogs/GetUserDataDialog';
import EventDialog from 'app/main/apps/calendar/EventDialog';

import {
	handleTotalCostChipUnconfirmed,
	// handleTotalCostChip,
	handleCostColumn,
	handleGuestAndHourCount
} from 'app/services/helper.js';

const useStyles = makeStyles(theme => ({
	root: {
		background: `radial-gradient(${darken(theme.palette.primary.dark, 0.5)} 0%, ${theme.palette.primary.dark} 80%)`,
		color: theme.palette.primary.contrastText
	},
	inline: {
		display: 'inline'
	},
	layoutRoot: {},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	}
}));

function ComingSoonPage() {
	const dispatch = useDispatch();
	const classes = useStyles();
	const user = useSelector(({ auth }) => auth.user);

	const [open, setOpen] = React.useState(true);

	const handleClick = () => {
		setOpen(!open);
	};

	const openActivateTripDialog = user.trip.openDialog;
	if (openActivateTripDialog) {
		return <>{openActivateTripDialog && <ActivateTripDialog />}</>;
	}

	const invoiceLink = user.trip.invoiceLink;
	// const isCartLocked = user.trip.isCartLocked
	const openGetUserDataDialog = user.data.openDialog;
	const events = user.trip.data.events ? user.trip.data.events.data : [];

	const eventRows = Object.keys(events)
		.filter(i => !events[i].isLocked)
		.map((key, value) => {
			const { start } = events[key];
			const date = moment(start).format('MM/DD HH:mm');
			const newEvent = {
				...events[key],
				date
			};
			return newEvent;
		});
	console.log('eventRows=>', eventRows);

	function handleRemove(id) {
		dispatch(Actions.removeEvent(id));
		// closeComposeDialog();
	}

	function handleOpenEventDialoge(event) {
		dispatch(Actions.openEditEventDialog(event));
	}

	if (eventRows.length === 0) {
		return (
			<>
				<div
					className={clsx(
						classes.root,
						'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32'
					)}
				>
					<div className="flex flex-col items-center justify-center w-full">
						<FuseAnimate animation="transition.expandIn">
							<Card className="w-full max-w-384">
								<CardContent className="flex flex-col items-center justify-center p-32 text-center">
									<img className="w-128 m-32" src="assets/images/logos/easyAlfred.png" alt="logo" />
									<Typography variant="subtitle1" className="mb-16">
										Hey! You have not booked any services.
									</Typography>
									<Button
										component={Link}
										to="/pages/pricing/style-1"
										size="small"
										role="button"
										variant="contained"
										color="secondary"
									>
										<Icon className="text-16">room_service</Icon>
										<span className="mx-4">Add Service</span>
									</Button>
								</CardContent>
							</Card>
						</FuseAnimate>
					</div>
				</div>
				{openActivateTripDialog && <ActivateTripDialog />}
				{openGetUserDataDialog && !openActivateTripDialog && <GetUserDataDialog />}
			</>
		);
	}

	return (
		<>
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24">
						<h1>Itinerary</h1>
					</div>
				}
				contentToolbar={
					<div className="px-24">
						<Button component={Link} to="/apps/calendar" color="inherit" size="small">
							<Icon>calendar_today</Icon>
							<span className="mx-4">View Calendar</span>
						</Button>
					</div>
				}
				content={
					<>
						<div className="p-24">
							<div className="table-responsive">
								<TableContainer component={Paper}>
									<Toolbar>
										<Typography variant="h6" id="tableTitle" component="div">
											Unconfirmed Services
										</Typography>
									</Toolbar>
									<Table className={classes.table} aria-label="spanning table">
										<TableHead>
											<TableRow>
												<TableCell>Edit</TableCell>
												<TableCell>Service</TableCell>
												<TableCell>Date</TableCell>
												<TableCell>Guests Hours Budget</TableCell>
												<TableCell>Cost</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{eventRows.map(row => {
												console.log('row', row);
												if (row.isConfirmed) return null;
												return (
													<TableRow key={row.id}>
														<TableCell>
															<IconButton
																aria-label="delete"
																onClick={() => handleRemove(row.id)}
																className={classes.margin}
															>
																<DeleteIcon fontSize="inherit" />
															</IconButton>
															<IconButton
																aria-label="delete"
																onClick={() => handleOpenEventDialoge(row)}
																className={classes.margin}
															>
																<EditIcon fontSize="inherit" />
															</IconButton>
														</TableCell>
														<TableCell>
															<Icon className="text-16 mx-4">{row.icon}</Icon> {/* {;} */}
															{row.serviceTitle}{' '}
															{row.subServiceTitle && `(${row.subServiceTitle})`}
														</TableCell>
														<TableCell>{row.date}</TableCell>
														<TableCell>{handleGuestAndHourCount(row)}</TableCell>
														<TableCell>${handleCostColumn(row)}</TableCell>
													</TableRow>
												);
											})}
											<TableRow>
												<TableCell colSpan={2} align="right">
													<Button
														href={invoiceLink}
														rel="noreferrer noopener"
														color="secondary"
														target="_blank"
														disabled={invoiceLink ? false : true}
													>
														View Invoice
													</Button>
												</TableCell>
												<TableCell colSpan={2}>
													<Chip
														size="medium"
														label={handleTotalCostChipUnconfirmed(eventRows)}
														color="primary"
													/>{' '}
													( all pricing is an estimate before taxes )
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
								<br />
							</div>
							<br />
							<br />
							<div className="flex flex-col items-center justify-center w-full">
								<Card className="w-full ">
									<CardContent className="flex flex-col items-left justify-left p-32">
										<Typography variant="h6" className="text-center mb-16">
											Let's Finalize your Plan!
										</Typography>

										<Typography
											variant="subtitle1"
											className="text-left w-full"
											color="textSecondary"
										>
											1) <a href="tel:1-310-662-4704">CALL NOW</a> or{' '}
											<Link to="/pages/knowledge-base">Schedule Local Guide</Link>
											{/* <Button
												href="#"
												className="p-0"
												rel="noreferrer noopener"
												color="secondary"
												to="/pages/knowledge-base"
												component={Link}
											>
												Schedule Local Guide
											</Button> */}{' '}
											to set your plan. To book services in the next 12 hours, connect now! We're
											excited to connect.
										</Typography>
										<br />
										<Typography
											variant="subtitle1"
											className="text-left w-full"
											color="textSecondary"
										>
											2) Our team identifies the best local businesses to complete your needs.
											This can take up 2-3 business hours to coordinate.
										</Typography>
										<br />
										<Typography
											variant="subtitle1"
											className="text-left w-full"
											color="textSecondary"
										>
											3) Your Local Guide calls you at the scheduled time. Please ensure you are
											available to speak.
										</Typography>
										<br />
										<Typography
											variant="subtitle1"
											className="text-left w-full"
											color="textSecondary"
										>
											4) Whether you're booking for tomorrow or 6 months from tomorrow, we work to
											ensure your services and power partner are perfect for you!
										</Typography>

										<br />
										<Typography variant="h6" className="text-center mb-16">
											Rest easy! Local Links Connects!
										</Typography>
									</CardContent>
								</Card>
							</div>
							<br />
							<br />
							{/* <div className="p-24"> */}
							<div className="flex flex-col items-center justify-center w-full">
								<Button size="large" variant="outlined" onClick={handleClick}>
									{open ? 'VIEW CONFIRMED SERVICES' : 'HIDE CONFIRMED SERVICES'}
								</Button>
							</div>
							<br />
							<br />
							{!open && (
								<div className="table-responsive">
									<TableContainer component={Paper}>
										<Toolbar>
											<Typography variant="h6" id="tableTitle" component="div">
												Confirmed Services
											</Typography>
										</Toolbar>
										<Table className={classes.table} aria-label="spanning table">
											<TableHead>
												<TableRow>
													{/* <TableCell>Edit</TableCell> */}
													<TableCell>Service</TableCell>
													<TableCell>Date</TableCell>
													<TableCell>Guests Hours Budget</TableCell>
													<TableCell>Cost</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{eventRows.map(row => {
													console.log('row', row);
													if (!row.isConfirmed) return null;
													return (
														<TableRow key={row.id}>
															{/* <TableCell>
													<IconButton aria-label="delete" onClick={() => handleRemove(row.id)} className={classes.margin}>
														<DeleteIcon fontSize="inherit" />
													</IconButton>
													<IconButton aria-label="delete" onClick={() => handleOpenEventDialoge(row)} className={classes.margin}>
														<EditIcon fontSize="inherit" />
													</IconButton>
												</TableCell> */}
															<TableCell>
																<Icon className="text-16 mx-4">{row.icon}</Icon>{' '}
																{/* {;} */}
																{row.serviceTitle}{' '}
																{row.subServiceTitle && `(${row.subServiceTitle})`}
															</TableCell>
															<TableCell>{row.date}</TableCell>
															<TableCell>{handleGuestAndHourCount(row)}</TableCell>
															<TableCell>${handleCostColumn(row)}</TableCell>
														</TableRow>
													);
												})}
												{/* <TableRow>
										<TableCell colSpan={2} align='right'>
											<Button
												href={invoiceLink}
												rel="noreferrer noopener"
												color="secondary"
												target="_blank"
												disabled={invoiceLink ? false : true}
											>
												View Invoice
									</Button>
										</TableCell>
										<TableCell colSpan={2}>
											<Chip
												size="medium"
												label={handleTotalCostChip(eventRows)}
												color="primary"
											/>
											{' '}
											{' '}
								
								</TableCell>
									</TableRow> */}
											</TableBody>
										</Table>
									</TableContainer>
									<br />
									<br />
								</div>
							)}
						</div>
					</>
				}
			/>
			<EventDialog />
			{openActivateTripDialog && <ActivateTripDialog />}
			{openGetUserDataDialog && !openActivateTripDialog && <GetUserDataDialog />}
		</>
	);
}

export default ComingSoonPage;
