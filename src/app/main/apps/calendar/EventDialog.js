import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DateTimePicker } from '@material-ui/pickers';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/auth/store/actions';
import { handleCostColumn } from 'app/services/helper.js';
import ZDeals from 'app/services/zohoService/leads';

const defaultFormState = {
	id: FuseUtils.generateGUID(),
	serviceId: '',
	serviceTitle: '',
	subServiceId: '',
	subServiceTitle: '',
	title: '',
	desc: '',
	guestCount: '',
	hourCount: '', 
	start: '',
	end: '',
	budget: '',
	priceMax: '',
	priceMin: '',
	isConfirmed: '',
	priceQuantifier1: '',

	priceQuantifier1Label: '',
	serviceLabel: '',
	requestsLabel: '',
	priceLabel: '',
	subServiceLabel: '',
	priceQuantifier2Label: '',

	priceQuantifier2: '',
	subServiceOptions: '',
};

function EventDialog(props) {
	const dispatch = useDispatch();
	// const user = useSelector(({ auth }) => auth.user);
	const eventDialog = useSelector(({ auth }) => auth.user.eventDialog);
	const eid = eventDialog.data ? eventDialog.data.id : null
	const modalHasData = eventDialog.data
	const isOnlyTripDates = eventDialog.data ? eventDialog.data.isLocked : false
	// console.log('eventDialog.data', eventDialog.data);
	const uid = eventDialog.data ? eventDialog.data.uid : null
	// const isCartLocked = user.trip.isCartLocked
	// console.log('jj'), user.trip;
	const readOnly = false
	// const readOnly = eventDialog.type === 'edit'
	const serviceOptions = eventDialog.data ? eventDialog.data.serviceOptions : []

	let tripEndDate = 0
	let tripStartDate = 0
	let tripData = useSelector(({ auth }) => auth.user.trip.data);
	if (tripData) {
		tripEndDate = tripData.tripEndDate
		tripStartDate = tripData.tripStartDate
	}
	// const {tripEndDate, tripStartDate} = useSelector(({ auth }) => auth.user.trip.data);
	const minDate = moment(tripStartDate).format('MM/DD/YYYY');
	const maxDate = moment(tripEndDate).format('MM/DD/YYYY');
	const { form, handleChange, setForm, setInForm } = useForm(defaultFormState);
	
	const initDialog = useCallback(() => {
		if (eventDialog.type === 'edit' && eventDialog.data) {
			setForm({ ...eventDialog.data });
		}
		if (eventDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...eventDialog.data,
				id: FuseUtils.generateGUID(),
				start: minDate,
				end: minDate,
			});
		}
	}, [eventDialog.data, eventDialog.type, setForm, minDate]);

	useEffect(() => {
		if (eventDialog.props.open) {
			initDialog();
		}
	}, [eventDialog.props.open, initDialog]);

	function handleChangeDropdown(event) {
		let { isConfirmed, priceQuantifier1, 
			
			priceQuantifier1Label, 
			serviceLabel,  
			requestsLabel,
			priceLabel,
			subServiceLabel,
			priceQuantifier2Label,
			
			priceQuantifier2, serviceTitle, priceMax, priceMin, subServiceOptions, priceType, price} = serviceOptions[event.target.value]
		let budget = ''
		if (priceType.includes("exact")){
			budget = price
		}
		setForm({
			...form,
			budget,
			price,
			priceType, 
			priceMax,
			priceMin,
			isConfirmed,
			priceQuantifier1,

			priceQuantifier1Label,
			serviceLabel,
			requestsLabel,
			priceLabel,
			subServiceLabel,
			priceQuantifier2Label,

			priceQuantifier2,
			serviceTitle,
			subServiceOptions: subServiceOptions || '',
			serviceId: event.target.value,
			
			subServiceTitle: '',
			guestCount: '',
			hourCount: '', 
		});
	}

	function handleChangeDropdownSubService(event) {
		// console.log('form=>', form)
		// console.log('event.target=>', event.target)
		let subServiceTitle = form.subServiceOptions[event.target.value].subServiceTitle
		// console.log('subServiceTitle=>', subServiceTitle)

		setForm({
			...form,
			subServiceTitle,
			subServiceId: event.target.value,
		});
	}

	function closeComposeDialog() {
		return eventDialog.type === 'edit'
			? dispatch(Actions.closeEditEventDialog())
			: dispatch(Actions.closeNewEventDialog());
	}

	function handleRemove(id) {
		dispatch(Actions.removeEvent(id));
		closeComposeDialog();
	}

	function handleRemoveFromAdmin(uid, id) {
		dispatch(Actions.removeEventFromAdmin(uid, id));
		closeComposeDialog();
	}

	function handleSubmit(event) {
		form.start = moment(form.start)
		form.end = moment(form.end)
		event.preventDefault();
		// console.log('form', form)
		// console.log('eventDialog.fromAdmin', eventDialog.fromAdmin)

		const zPayload = {
			Deal_Name: `${tripData.displayName} - ${tripData.locationName}`,
			Stage: 'Qualification',
			Business_or_Consumer: 'B2B',
			Closing_Date: form.end.format('YYYY-MM-DD'),
			Pipeline: 'Consumer Pipeline',
			Account_Name: tripData.locationName,
			//Service_start_Date_Time: form.start.format('yyyy-mm-dd HH:mm:ss') + '+06:00',
			Description: form.desc,
			Party_Size_for_Event: form.guestCount,
			Hours: form.hourCount,
			Budget1: form.budget,
			Amount: form.guestCount != '' ? (parseInt(form.guestCount) * parseInt(form.budget)).toString() : form.budget
		};

		if (eventDialog.fromAdmin) {
			closeComposeDialog();
			const zoho = new ZDeals();
			zoho.createDeal(zPayload);
			dispatch(Actions.addEventFromAdmin(form));
		} else {
			const zoho = new ZDeals();
			zoho.createDeal(zPayload);
			dispatch(Actions.addEvent(form));
		}
		// closeComposeDialog();
	}

	function isBudgetError(form) {
		let {priceMax, priceMin, budget, priceType} = form
		if (priceType ? priceType.includes("exact") : false) return false
		if (!budget) return false
		if (+budget < +priceMin || +budget > +priceMax) return true
		return false
	}

	function handlePrice (form){
		return form.budget;
	}

	function isExactPrice(form) {
		return form.priceType ? form.priceType.includes("exact") : false
	}

	function canBeSubmitted(form) {
		// console.log('form', form)
		// console.log('form.priceQuantifier1', form.priceQuantifier1, form.guestCount)
		// console.log('form.priceQuantifier2', form.priceQuantifier2, form.hourCount)
		if (!form.budget) return false
		if (!form.priceType) return false
		if (form.priceQuantifier1 && !form.guestCount) return false
		if (form.priceQuantifier2 && !form.hourCount) return false
		if (form.priceType === "range" && isBudgetError(form)) return false
		return true
	}

	function handleBudgetHelperText (form){
		if (form.priceType === "range") return `min: $${form.priceMin} max: $${form.priceMax}`
		return null
	}

	function handlePriceLabel (form){
		if (!form.priceType) return null

		if (form.priceLabel) return form.priceLabel;

		let name = form.priceType === "exact" ? 'flat rate' : 'range'
		let priceQuantifier1 = form.priceQuantifier1 ? `per ${form.priceQuantifier1}` : ''
		let priceQuantifier2 = form.priceQuantifier2 ? `per ${form.priceQuantifier2}` : ''
		return `${name} ${priceQuantifier1} ${priceQuantifier2}`
	}

	if (!modalHasData){
		return null
	}

	if (tripEndDate === 0){
		return null
	}

	if (isOnlyTripDates) {
		return (
			<Dialog {...eventDialog.props} onClose={closeComposeDialog} fullWidth maxWidth="xs" component="form">
			<AppBar position="static">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{form.title}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate>
				<DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
					<Typography variant="subtitle1" color="inherit">
						{`${moment(tripStartDate).format('MM/DD/YYYY')} - ${moment(tripEndDate).format('MM/DD/YYYY')}`}
					</Typography>
				</DialogContent>
				<DialogActions className="justify-between px-8 sm:px-16">
					<Button onClick={closeComposeDialog} variant="contained" color="primary">
						Close
					</Button>
				</DialogActions>
			</form>
		</Dialog>
		)
	} 

	// console.log('eventDialog.data.fromAdmin', eventDialog.data);
	if (eventDialog.fromAdmin){
		return (
			<Dialog
				{...eventDialog.props}
				onClose={closeComposeDialog}
				fullWidth
				maxWidth="xs"
				component="form"
			>
				<AppBar position="static">
					<Toolbar className="px-8">
						<Typography style={{ marginLeft: 5 }} variant="subtitle1" color="inherit" className="flex-1 px-10">
							{form.title}
						</Typography>
						<div style={{ marginRight: 10 }}>${handleCostColumn(form)}</div>
					</Toolbar>
				</AppBar>

				<form noValidate onSubmit={handleSubmit} autoComplete="off" >
					<DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>

						<FormControl
							fullWidth
							size="small"
							disabled={eventDialog.fromAdmin}
							variant="outlined">
							<InputLabel id="demo-simple-select-label">{form.serviceLabel || 'Service'}</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								rows={4}
								className="mt-8 mb-16 w-full"
								value={form.serviceId}
								onChange={handleChangeDropdown}
							>
								{serviceOptions &&
									Object.keys(serviceOptions).map(item => {
										let serviceTitle = serviceOptions[item]['serviceTitle']
										return <MenuItem key={item} value={item}>{serviceTitle}</MenuItem>
									})
								}
							</Select>
						</FormControl>

						{form.subServiceOptions && <FormControl
							fullWidth
							size="small"
							// disabled={eventDialog.fromAdmin}
							variant="outlined">
							<InputLabel id="demo-simple-select-label">{form.subServiceLabel || 'Sub Service'}</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								rows={4}
								className="mt-8 mb-16 w-full"
								value={form.subServiceId}

								onChange={handleChangeDropdownSubService}
							>
								{form.subServiceOptions &&
									Object.keys(form.subServiceOptions).map(item => {
										let subServiceTitle = form.subServiceOptions[item]['subServiceTitle']
										return <MenuItem key={item} value={item}>{subServiceTitle}</MenuItem>
									})
								}
							</Select>
						</FormControl>}

						{form.priceQuantifier1 && <TextField
							id="guestCount"
							// label={form.priceQuantifier1}
							label={form.priceQuantifier1Label || `number of ${form.priceQuantifier1}s`}
							// label="Number Of Guests"
							className="mt-8 mb-16"
							InputLabelProps={{
								shrink: true, max: 100, min: 10
							}}
							InputProps={{
								readOnly,
								inputProps: {
									min: 1,
									max: 50,
								}
							}}
							// disabled={readOnly}
							name="guestCount"
							value={form.guestCount}
							onChange={handleChange}
							variant="outlined"
							type="number"
							size="small"
							fullWidth
						// disabled={eventDialog.fromAdmin}
						/>}

						{form.priceQuantifier2 && <TextField
							id="hourCount"
							label={form.priceQuantifier2Label || `number of ${form.priceQuantifier2}s`}
							// label="Number Of Hours"
							className="mt-8 mb-16"
							InputLabelProps={{
								shrink: true, max: 100, min: 10
							}}
							InputProps={{
								readOnly,
								inputProps: {
									min: 1,
									max: 50,
								}
							}}
							// disabled={readOnly}
							name="hourCount"
							value={form.hourCount}
							onChange={handleChange}
							variant="outlined"
							type="number"
							size="small"
							fullWidth
						// disabled={eventDialog.fromAdmin}
						/>}

						<TextField
							fullWidth
							id="budget"
							className="mt-8 mb-16"
							name="budget"
							variant="outlined"
							type="number"
							size="small"
							onChange={handleChange}
							error={isBudgetError(form)}
							value={handlePrice(form)}
							label={handlePriceLabel(form)}
							helperText={handleBudgetHelperText(form)}
							InputLabelProps={{ shrink: true }}
							InputProps={{
								readOnly,
								inputProps: {
									min: 1,
								},
								startAdornment: <InputAdornment position="start">$</InputAdornment>
							}}
							disabled={isExactPrice(form)}
						// disabled={isExactPrice(form) || eventDialog.fromAdmin}
						// disabled={readOnly || isExactPrice(form)}
						/>

						<TextField
							id="desc"
							className="mt-8 mb-16"
							label={form.requestsLabel || "Special Requests"}
							type="text"
							name="desc"
							variant="outlined"
							size="small"
							fullWidth
							multiline
							rows={2}
							onChange={handleChange}
							InputProps={{ readOnly }}
							value={form.desc}
						// disabled={eventDialog.fromAdmin}
						/>

						<DateTimePicker
							label="Start"
							inputVariant="outlined"
							value={form.start}
							size="small"
							onChange={date => setInForm('start', date)}
							className="mt-8 mb-16 w-full"
							minDate={minDate}
							maxDate={maxDate}
						// disabled={eventDialog.fromAdmin}
						/>
					</DialogContent>

					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button variant="contained" color="primary" type="submit" disabled={!canBeSubmitted(form)}>
								Save to My Plan
						</Button>
							<IconButton onClick={closeComposeDialog}>
								<Icon>close</Icon>
							</IconButton>
						</div>
						{!eventDialog.fromAdmin && eventDialog.type === 'edit' && <IconButton onClick={() => handleRemove(eid)}>
							<Icon>delete</Icon>
						</IconButton>}
						{eventDialog.fromAdmin && <IconButton onClick={() => handleRemoveFromAdmin(uid, eid)}>
							<Icon>delete</Icon>
						</IconButton>}
					</DialogActions>
				</form>
			</Dialog>
		);
		
	}

	// console.log('eventDialog=2>', eventDialog);
	if (eventDialog.data.isConfirmed){
		return (
			<Dialog 
				{...eventDialog.props} 
				onClose={closeComposeDialog} 
				fullWidth 
				maxWidth="xs" 
				component="form"
			>
				<AppBar position="static">
					<Toolbar className="px-8">
						<Typography style={{marginLeft: 5}} variant="subtitle1" color="inherit" className="flex-1 px-10">
							{form.title} (confirmed)
						</Typography>
						<div style={{marginRight: 10}}>{handleCostColumn(form)}</div>
					</Toolbar>
				</AppBar>
	
				<form noValidate onSubmit={handleSubmit} autoComplete="off" >
					<DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
	
						<FormControl 
						fullWidth
						size="small"
						disabled={true}
						variant="outlined">
							<InputLabel id="demo-simple-select-label">{form.serviceLabel || 'Service'}</InputLabel>
							<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							rows={4}
							className="mt-8 mb-16 w-full"
							value={form.serviceId}
							onChange={handleChangeDropdown}
							>
							{serviceOptions && 
								Object.keys(serviceOptions).map(item=> {
									let serviceTitle = serviceOptions[item]['serviceTitle']
									return <MenuItem key={item} value={item}>{serviceTitle}</MenuItem>
								})
							}
							</Select>
						</FormControl>

						{form.subServiceOptions && <FormControl 
						fullWidth
						size="small"
						disabled={true}
						variant="outlined">
							<InputLabel id="demo-simple-select-label">{form.subServiceLabel || 'Sub Service'}</InputLabel>
							<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							rows={4}
							className="mt-8 mb-16 w-full"
							value={form.subServiceId}
							// name={form.subServiceTitle}
							onChange={handleChangeDropdownSubService}
							>
							{form.subServiceOptions && 
								Object.keys(form.subServiceOptions).map(item=> {
									let subServiceTitle = form.subServiceOptions[item]['subServiceTitle']
									return <MenuItem key={item} value={item}>{subServiceTitle}</MenuItem>
								})
							}
							</Select>
						</FormControl>}
						
						{form.priceQuantifier1 && <TextField
							id="guestCount"
							// label={form.priceQuantifier1}
							label={form.priceQuantifier1Label || `number of ${form.priceQuantifier1}s`}
							// label="Number Of Guests"
							className="mt-8 mb-16"
							InputLabelProps={{
								shrink: true, max: 100, min: 10
							}}
							InputProps={{
								readOnly,
								inputProps: { 
									min: 1,
									max: 50, 
								}
							}}
							disabled={true}
							name="guestCount"
							value={form.guestCount}
							onChange={handleChange}
							variant="outlined"
							type="number"
							size="small"
							fullWidth
						/>}
						
						{form.priceQuantifier2 && <TextField
							id="hourCount"
							// label="Number Of Hours"
							// label={form.priceQuantifier2}
							label={form.priceQuantifier2Label || `number of ${form.priceQuantifier2}s`}
							className="mt-8 mb-16"
							InputLabelProps={{
								shrink: true, max: 100, min: 10
							}}
							InputProps={{
								readOnly,
								inputProps: { 
									min: 1,
									max: 50, 
								}
							}}
							disabled={true}
							name="hourCount"
							value={form.hourCount}
							onChange={handleChange}
							variant="outlined"
							type="number"
							size="small"
							fullWidth
						/>}
	
						<TextField
							fullWidth
							id="budget"
							className="mt-8 mb-16"
							name="budget"
							variant="outlined"
							type="number"
							size="small"
							onChange={handleChange}
							error={isBudgetError(form)}
							value={handlePrice(form)}
							label={handlePriceLabel(form)}
							helperText={handleBudgetHelperText(form)}
							InputLabelProps={{shrink: true}}
							InputProps={{
								readOnly,
								inputProps: { 
									min: 1,
								},
								startAdornment: <InputAdornment position="start">$</InputAdornment>
							}}
							disabled={true}
						/>
					
						<TextField
							id="desc"
							className="mt-8 mb-16"
							label={form.requestsLabel || "Special Requests"}
							type="text"
							InputProps={{readOnly}}
							disabled={true}
							name="desc"
							value={form.desc}
							onChange={handleChange}
							multiline
							rows={2}
							variant="outlined"
							size="small"
							fullWidth
						/>
	
						<DateTimePicker
							label="Start"
							inputVariant="outlined"
							value={form.start}
							size="small"
							onChange={date => setInForm('start', date)}
							className="mt-8 mb-16 w-full"
							minDate={minDate}
							maxDate={maxDate}
							disabled={true}
						/>
					</DialogContent>
	
					<DialogActions className="justify-between px-8 sm:px-16">
						<Button onClick={closeComposeDialog} variant="contained" color="primary">
							Close
						</Button>
					</DialogActions>
		
				</form>
			</Dialog>
		)
	}

	console.log('eventDialog=1>', eventDialog);
	console.log('form=1>', form);
	return (
		<Dialog 
			{...eventDialog.props} 
			onClose={closeComposeDialog} 
			fullWidth 
			maxWidth="xs" 
			component="form"
		>
			<AppBar position="static">
				<Toolbar className="px-8">
					<Typography style={{marginLeft: 5}} variant="subtitle1" color="inherit" className="flex-1 px-10">
						{form.title}
					</Typography>
					<div style={{marginRight: 10}}>${handleCostColumn(form)}</div>
				</Toolbar>
			</AppBar>

			<form noValidate onSubmit={handleSubmit} autoComplete="off" >
				<DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>

					<FormControl 
					fullWidth
					size="small"
					disabled={eventDialog.fromAdmin}
					variant="outlined">
						<InputLabel id="demo-simple-select-label">{ form.serviceLabel ||'Service'}</InputLabel>
						<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						rows={4}
						className="mt-8 mb-16 w-full"
						value={form.serviceId}
						onChange={handleChangeDropdown}
						>
						{serviceOptions && 
							Object.keys(serviceOptions).map(item=> {
								let serviceTitle = serviceOptions[item]['serviceTitle']
								return <MenuItem key={item} value={item}>{serviceTitle}</MenuItem>
							})
						}
						</Select>
					</FormControl>

					{form.subServiceOptions && <FormControl 
					fullWidth
					size="small"
					// disabled={eventDialog.fromAdmin}
					variant="outlined">
						<InputLabel id="demo-simple-select-label">{form.subServiceLabel || 'Sub Service'}</InputLabel>
						<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						rows={4}
						className="mt-8 mb-16 w-full"
						value={form.subServiceId}
						
							onChange={handleChangeDropdownSubService}
						>
						{form.subServiceOptions && 
							Object.keys(form.subServiceOptions).map(item=> {
								let subServiceTitle = form.subServiceOptions[item]['subServiceTitle']
								return <MenuItem key={item} value={item}>{subServiceTitle}</MenuItem>
							})
						}
						</Select>
					</FormControl>}
					
					{form.priceQuantifier1 && <TextField
						id="guestCount"
						// label={form.priceQuantifier1}
						label={form.priceQuantifier1Label || `number of ${form.priceQuantifier1}s`}
						// label="Number Of Guests"
						className="mt-8 mb-16"
						InputLabelProps={{
							shrink: true, max: 100, min: 10
						}}
						InputProps={{
							readOnly,
							inputProps: { 
								min: 1,
								max: 50, 
							}
						}}
						// disabled={readOnly}
						name="guestCount"
						value={form.guestCount}
						onChange={handleChange}
						variant="outlined"
						type="number"
						size="small"
						fullWidth
						// disabled={eventDialog.fromAdmin}
					/>}
					
					{form.priceQuantifier2 && <TextField
						id="hourCount"
						label={form.priceQuantifier2Label || `number of ${form.priceQuantifier2}s`}
						// label="Number Of Hours"
						className="mt-8 mb-16"
						InputLabelProps={{
							shrink: true, max: 100, min: 10
						}}
						InputProps={{
							readOnly,
							inputProps: { 
								min: 1,
								max: 50, 
							}
						}}
						// disabled={readOnly}
						name="hourCount"
						value={form.hourCount}
						onChange={handleChange}
						variant="outlined"
						type="number"
						size="small"
						fullWidth
						// disabled={eventDialog.fromAdmin}
					/>}

					<TextField
						fullWidth
						id="budget"
						className="mt-8 mb-16"
						name="budget"
						variant="outlined"
						type="number"
						size="small"
						onChange={handleChange}
						error={isBudgetError(form)}
						value={handlePrice(form)}
						label={handlePriceLabel(form)}
						helperText={handleBudgetHelperText(form)}
						InputLabelProps={{shrink: true}}
						InputProps={{
							readOnly,
							inputProps: { 
								min: 1,
							},
							startAdornment: <InputAdornment position="start">$</InputAdornment>
						}}
						disabled={isExactPrice(form)}
						// disabled={isExactPrice(form) || eventDialog.fromAdmin}
						// disabled={readOnly || isExactPrice(form)}
					/>
				
					<TextField
						id="desc"
						className="mt-8 mb-16"
						label={form.requestsLabel || "Special Requests"}
						type="text"
						name="desc"
						variant="outlined"
						size="small"
						fullWidth
						multiline
						rows={2}
						onChange={handleChange}
						InputProps={{readOnly}}
						value={form.desc}
						// disabled={eventDialog.fromAdmin}
					/>

					<DateTimePicker
						label="Start"
						inputVariant="outlined"
						value={form.start}
						size="small"
						onChange={date => setInForm('start', date)}
						className="mt-8 mb-16 w-full"
						minDate={minDate}
						maxDate={maxDate}
						// disabled={eventDialog.fromAdmin}
					/>
				</DialogContent>

				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button variant="contained" color="primary" type="submit" disabled={!canBeSubmitted(form)}>
							Save to My Plan
						</Button>
						<IconButton onClick={closeComposeDialog}>
							<Icon>close</Icon>
						</IconButton>
					</div>
					{!eventDialog.fromAdmin && eventDialog.type === 'edit' && <IconButton onClick={()=>handleRemove(eid)}>
						<Icon>delete</Icon>
					</IconButton>}
					{eventDialog.fromAdmin && <IconButton onClick={()=>handleRemoveFromAdmin(uid, eid)}>
						<Icon>delete</Icon>
					</IconButton>}
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default EventDialog;