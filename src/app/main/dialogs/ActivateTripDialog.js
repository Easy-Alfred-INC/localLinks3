import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/auth/store/actions';
import {Link} from 'react-router-dom';
// import { KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';

const tripStartDate = moment()
const tripEndDate = moment().add(2000, 'days')
// const tripStartDate2 = moment().format()

const defaultFormState = {
	tid: '',
	tripStartDate: tripStartDate,
	tripEndDate: tripEndDate,
};

function ActivateTripDialog(props) {
	const dispatch = useDispatch();
	const user = useSelector(({ auth }) => auth.user);
	const tripDialog = user.trip
	// console.log('==-=>',tripDialog);
	
	const { form, handleChange } = useForm(defaultFormState);

	function canBeSubmitted() {
		return form.tid.length > 0;
	}

	function closeComposeDialog() {
		console.log('in closeComposeDialog');
		dispatch(Actions.closeTripDialog())
	}

	function handleSubmit(event) {
		console.log('in handle submit1', form);
		form['tripStartDate'] = tripStartDate
		form['tripEndDate'] = tripEndDate
		console.log('in handle submit2', form);
		event.preventDefault();
		dispatch(Actions.addTrip(form));
		closeComposeDialog();
	}

		return (
			<Dialog
				classes={{
					paper: 'm-24'
				}}
				open={tripDialog.openDialog}
				onClose={closeComposeDialog}
				fullWidth
				maxWidth="xs"
			>
				<AppBar position="static" elevation={1}>
					<Toolbar className="flex w-full">
						<Typography variant="subtitle1" color="inherit">
							Enter your Market ID continue
						</Typography>
					</Toolbar>
				</AppBar>
				<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
					<DialogContent classes={{ root: 'p-24' }}>
						<TextField
							fullWidth
							id="tid"
							name="tid"
							label="Market ID"
							variant="outlined"
							value={form.tid}
							onChange={handleChange}
							required
							autoFocus
						/>

						{/* <KeyboardDatePicker
							fullWidth
							margin="normal"
							id="tripStartDate"
							name="tripStartDate"
							label="Start Date"
							inputVariant="outlined"
							value={form.tripStartDate}
							onChange={date => setInForm('tripStartDate', date)}
							format="MM/DD/YYYY"
							required
						/>

						<KeyboardDatePicker
							fullWidth
							margin="normal"
							id="tripEndDate"
							name="tripEndDate"
							label="End Date"
							inputVariant="outlined"
							value={form.tripEndDate}
							onChange={date => setInForm('tripEndDate', date)}
							format="MM/DD/YYYY"
							required
						/> */}
					</DialogContent>
	
					<DialogActions className="justify-between p-8">
							<div className="px-16">
								<Button
									component={Link}
									to={'/pages/faq'}
									variant="contained"
									color="primary"
									onClick={()=>console.log('in cancel button')}
									type="submit"
								>
									Cancel
								</Button>
							</div>
							<div className="px-16">
								<Button
									variant="contained"
									color="primary"
									type="submit"
									onClick={handleSubmit}
									disabled={!canBeSubmitted()}
								>
									Next
								</Button>
							</div>
						</DialogActions>
				</form>
			</Dialog>
		);
}

export default ActivateTripDialog;
