import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import React from 'react';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/auth/store/actions';
import ZContacts from 'app/services/zohoService/contacts';
// import {Link} from 'react-router-dom';

const defaultFormState = {
	phone: '',
	bio: '',
	displayName: ''
};

function GetUserDataDialog(props) {
	const dispatch = useDispatch();
	const userDataDialog = useSelector(({ auth }) => auth.user.data);
	const zohoContacts = new ZContacts();

	const { form, handleChange, setForm } = useForm(defaultFormState);
	const initDialog = useCallback(() => {
		setForm({
			...defaultFormState,
			...userDataDialog
		});
	}, [userDataDialog, setForm]);

	useEffect(() => {
		if (userDataDialog.openDialog) {
			initDialog();
		}
	}, [userDataDialog.openDialog, initDialog]);

	function canBeSubmitted() {
		return form.phone.length > 9 && form.displayName.length > 0;
	}

	function closeComposeDialog() {
		return dispatch(Actions.closeUpdateUserDataDialog());
	}

	async function handleSubmit(event) {
		const contactID = await zohoContacts.getContactByEmail(userDataDialog.email).then(contact => {
			if (contact) {
				return contact.data[0].id;
			}
			return null;
		});

		const zPayload = {
			Description: form.bio,
			Phone: '1' + form.phone
		};

		if (contactID) {
			await zohoContacts.updateContacts(zPayload, contactID);
		}

		event.preventDefault();
		dispatch(Actions.updateUserDataWithModal(form));
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24'
			}}
			open={userDataDialog.openDialog}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Your Profile
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">assignment</Icon>
						</div>

						<TextField
							className="mb-24"
							label="Name"
							// autoFocus
							id="displayName"
							name="displayName"
							type="text"
							value={form.displayName}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">phone</Icon>
						</div>

						<TextField
							className="mb-24"
							label="Phone"
							autoFocus
							id="phone"
							name="phone"
							type="tel"
							value={form.phone}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>

						<TextField
							className="mb-24"
							label="Bio"
							// autoFocus
							placeholder="Tell us about your business, your goals, your plans, and problems. How can we connect you today?"
							id="bio"
							name="bio"
							value={form.bio}
							onChange={handleChange}
							variant="outlined"
							multiline
							rows={5}
							// required
							fullWidth
						/>
					</div>
				</DialogContent>

				<DialogActions className="justify-between p-8">
					{/* <div className="px-16">
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
							</div> */}
					<div className="px-16">
						<Button variant="contained" color="primary" onClick={handleSubmit} disabled={!canBeSubmitted()}>
							OK
						</Button>
					</div>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default GetUserDataDialog;
