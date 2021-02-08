import { useForm } from '@fuse/hooks';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { withStyles } from '@material-ui/core/styles';
import { purple, green } from '@material-ui/core/colors';

const defaultFormState = {
	isAdmin: '',
	isCartLocked: '',
	invoiceLink: '',
	displayName: '',
};

function EditTripDialog(props) {
	const dispatch = useDispatch();
	const openTripDialog = useSelector(({ eCommerceApp }) => eCommerceApp.orders.tripDialog.props.open)
	const trip = useSelector(({ eCommerceApp }) => eCommerceApp.orders.tripDialog.data)
	const [hasConfirmedItinerary, setHasConfirmedItinerary] = useState(false);
	const [hasConfirmedArchive, setHasConfirmedArchive] = useState(false);
	const [hasConfirmedAdmin, setHasConfirmedAdmin] = useState(false);

	// const displayName = useSelector(({ eCommerceApp }) => eCommerceApp.orders.tripDialog)
	console.log('jojoz', trip)
	
	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		console.log('tip', trip);
		setForm({ 
			displayName: trip.displayName,
			isAdmin: trip.isAdmin,
			isCartLocked: trip.isCartLocked,
			invoiceLink: trip.invoiceLink,
			id: trip.id,
			tid: trip.tid,
		 });
	}, [trip, setForm]);

	useEffect(() => {
		if (openTripDialog) {
			initDialog();
		}
	}, [openTripDialog, initDialog]);


	const PurpleSwitch = withStyles({
		switchBase: {
			color: purple[300],
			'&$checked': {
			color: purple[500],
			},
			'&$checked + $track': {
			backgroundColor: purple[500],
			},
		},
		checked: {},
		track: {},
		})(Switch);

	const GreenSwitch = withStyles({
	switchBase: {
		color: green[300],
		'&$checked': {
		color: green[500],
		},
		'&$checked + $track': {
		backgroundColor: green[500],
		},
	},
	checked: {},
	track: {},
	})(Switch);

	function canBeSubmitted() {
		return true
	}

	function closeEditTripDialog() {
		return dispatch(Actions.closeEditTripDialog());
	}

	function handleSubmit(event) {
		event.preventDefault();
		dispatch(Actions.updateTrip(form));
		closeEditTripDialog();
	}

	function handleArchive(event) {
		event.preventDefault();
		let {id, reference} = trip
		console.log('trip', trip);
		
		dispatch(Actions.archiveTrip(id, reference, trip));
		closeEditTripDialog();
	}

	function handleItinerary(event) {
		event.preventDefault();
		dispatch(Actions.confirmServices(trip.id));
		closeEditTripDialog();
	}

	// function handleRehyrateServices() {
	// 	dispatch(Actions.rehydrateServices(trip));
	// 	// closeEditTripDialog();
	// }

	function handleHasConfirmedArchive(event) {
		setHasConfirmedArchive(true)
	}

	function handleConfirmItinerary(event) {
		setHasConfirmedItinerary(true)
	}

	function handleHasConfirmedAdmin(event) {
		setHasConfirmedAdmin(true)
	}


	if (!trip.active){
		return (
			<Dialog
			classes={{
				paper: 'm-24'
			}}
			open={openTripDialog}
			onClose={console.log('close')}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="px-8">
					<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
						Edit User / Trip
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
				<Typography variant="h6" color="inherit" className="flex-1 px-12">
						There is not an active trip for this user
					</Typography>
						<br/>
						{!hasConfirmedAdmin ?
							<Button
								variant="contained"
								onClick={handleHasConfirmedAdmin}
							>
								Edit User Privileges
					</Button>
							:
							<FormControlLabel
								control={form.isAdmin ? <PurpleSwitch
									checked={form.isAdmin}
									onChange={handleChange}
									name="isAdmin"
									id="isAdmin"
								/> :
									<GreenSwitch
										checked={form.isAdmin}
										onChange={handleChange}
										name="isAdmin"
										id="isAdmin"
									/>
								}
								label={form.isAdmin ? "User Is Admin" : "User Not Admin"}
							/>}
				</DialogContent>
				<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="secondary"
								// color="danger"
								onClick={closeEditTripDialog}
								type="submit"
								>
								Cancel
							</Button>
						</div>
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								type="submit"
								disabled={!canBeSubmitted()}
							>
								SAVE
							</Button>
						</div>

						
					</DialogActions>
			</form>
		</Dialog>
		)
	}

	if (hasConfirmedArchive){
		return (
			<Dialog
			classes={{
				paper: 'm-24'
			}}
			open={openTripDialog}
			onClose={console.log('close')}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="px-8">
					<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
						Edit User / Trip
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
				<Typography variant="h6" color="inherit" className="flex-1 px-12">
						Are you sure you want to archive trip?
					</Typography>
				</DialogContent>
				<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								// color="danger"
								onClick={closeEditTripDialog}
								type="submit"
								>
								Cancel
							</Button>
						</div>
						<div className="px-16">
							<Button
								variant="contained"
								color="secondary"
								onClick={handleArchive}
								type="submit"
								disabled={!canBeSubmitted()}
							>
								YES
							</Button>
						</div>
					</DialogActions>
			</form>
		</Dialog>
		)
	}

	if (hasConfirmedItinerary){
		return (
			<Dialog
			classes={{
				paper: 'm-24'
			}}
			open={openTripDialog}
			onClose={console.log('close')}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="px-8">
					<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
						Edit User / Trip
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
				<Typography variant="h6" color="inherit" className="flex-1 px-12">
						Are you sure you want to confirm current current itinerary?
					</Typography>
				</DialogContent>
				<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								// color="danger"
								onClick={closeEditTripDialog}
								type="submit"
								>
								Cancel
							</Button>
						</div>
						<div className="px-16">
							<Button
								variant="contained"
								color="secondary"
								// onClick={handleArchive}
								onClick={handleItinerary}
								type="submit"
								disabled={!canBeSubmitted()}
							>
								YES
							</Button>
						</div>
					</DialogActions>
			</form>
		</Dialog>
		)
	}


	return (
		<Dialog
			classes={{
				paper: 'm-24'
			}}
			open={openTripDialog}
			onClose={null}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="px-8">
					<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
						Edit User / Trip
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>


					<Typography variant="subtitle1">User</Typography>
					<br /> 
					{!hasConfirmedAdmin ? 
					<Button 
						variant="contained" 
						onClick={handleHasConfirmedAdmin} 
						>
						Edit User Privileges
					</Button>
					:
					<FormControlLabel
						control={form.isAdmin ? <PurpleSwitch 
						checked={form.isAdmin}
						onChange={handleChange} 
						name="isAdmin"
						id="isAdmin"
						/> :
						<GreenSwitch 
						checked={form.isAdmin}
						onChange={handleChange} 
						name="isAdmin"
						id="isAdmin"
					/> 
					}
						label={form.isAdmin ? "User Is Admin" : "User Not Admin"}
					/>}

					<br/>
					<br/>
					<br/>
					<Divider className="mx-16" />
					{/* <br/>
					<br/> */}

					<br /> 

					<Typography variant="subtitle1">Trip</Typography>
					<br /> 

					<Button 
						variant="contained" 
						onClick={handleConfirmItinerary} 
						>
						confirm current itinerary 
					</Button>
					<br/>
					<br/>

					<Button 
						variant="contained" 
						onClick={
							()=>{
							dispatch(Actions.rehydrateServices(form))
							// closeEditTripDialog();
							}
						} 
						>
						rehydrate  services
					</Button>
					<br/>
					<br/>
			

					<Button 
						variant="contained" 
						onClick={handleHasConfirmedArchive} 
						>
						archive trip 
					</Button>
					
					<br/>
					<br/>
					<FormControlLabel
						control={form.isCartLocked ? <PurpleSwitch 
							checked={form.isCartLocked}
							onChange={handleChange} 
							name="isCartLocked"
							id="isCartLocked"
							/> :
							<GreenSwitch 
							checked={form.isCartLocked}
							onChange={handleChange} 
							name="isCartLocked"
							id="isCartLocked"
							/> 
						}
						label={form.isCartLocked ? "Address is Displayed" : "Address is not displayed"}
					/>
					<br/>
					<br/>
					<TextField
						id="invoiceLink"
						name="invoiceLink"
						className="mt-8 mb-16"
						label="Invoice Link"
						type="text"
						variant="outlined"
						size="small"
						fullWidth
						multiline
						// InputProps={{readOnly}}
						onChange={handleChange}
						value={form.invoiceLink}
						rows={2}
					/>
					
				</DialogContent>

				<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								onClick={closeEditTripDialog}
								type="submit"
								>
								Cancel
							</Button>
						</div>
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								type="submit"
								disabled={!canBeSubmitted()}
							>
								SAVE
							</Button>
						</div>
					</DialogActions>
			</form>
		</Dialog>
	);
}

export default EditTripDialog;
