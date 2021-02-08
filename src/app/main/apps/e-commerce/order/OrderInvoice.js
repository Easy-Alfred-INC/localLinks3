import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import React from 'react';
import moment from 'moment';
import { handleCostColumn, handleGuestAndHourCount, handleTotalCostChip } from 'app/services/helper.js';

const useStyles = makeStyles(theme => ({
	root: {
		'& table ': {
			'& th:first-child, & td:first-child': {
				paddingLeft: `${0}!important`
			},
			'& th:last-child, & td:last-child': {
				paddingRight: `${0}!important`
			}
		}
	},
	divider: {
		width: 1,
		backgroundColor: theme.palette.divider,
		height: 144
	},
	seller: {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.getContrastText(theme.palette.primary.dark),
		marginRight: -88,
		paddingRight: 66,
		width: 480,
		'& .divider': {
			backgroundColor: theme.palette.getContrastText(theme.palette.primary.dark),
			opacity: 0.5
		}
	}
}));

const OrderInvoice = props => {
	const classes = useStyles(props);
	let tripArchive = props.order.tripArchive

	if(!tripArchive){
		return (
			<Typography variant="h4" style={{'textAlign':'center'}}>
				User has no past trips
			</Typography>
		)
	}

	return (
		<div className={clsx(classes.root, 'flex-grow flex-shrink-0 p-0')}>
			
			{Object.keys(tripArchive).map(key => {
				let trip = tripArchive[key].data
				let tripFiltered = Object.keys(trip.events.data).map(key2 => trip.events.data[key2])
				return (
				<div> 
				<br/>
				<Card key={key} className="w-xl mx-auto" elevation={4}>
					<CardContent className="p-88 print:p-0">
						<Typography color="textSecondary" className="mb-32">
							{moment(trip.tripStartDate).format('MM/DD/YYYY') + ' - ' + moment(trip.tripEndDate).format('MM/DD/YYYY')}
						</Typography>
						<div className="flex justify-between">
							<div>
								<Typography color="textSecondary">
									{trip.displayName}
								</Typography>
								<Typography color="textSecondary">
									{trip.email}
								</Typography>
								{/* <Typography color="textSecondary">
									{trip.phone}
								</Typography> */}
								<br/>
								<Button
									href={tripArchive[key].invoiceLink}
									rel="noreferrer noopener"
									color="secondary"
									target="_blank"
									style={{paddingLeft: "0px"}}
									disabled={tripArchive[key].invoiceLink ? false : true}
									>
										View Invoice
								</Button>
							</div>


							<div className={clsx(classes.seller, 'flex items-center p-16')}>
								<img className="w-80" src={trip.locationImage} alt="logo" />
								<div className={clsx(classes.divider, 'divider mx-8 h-96')} />

								<div className="px-8">
									<Typography color="inherit">{trip.locationName}</Typography>
									<Typography color="inherit">{trip.locationAddress}</Typography>
									<Typography color="inherit">TripId: {trip.sid}</Typography>
									<Typography color="inherit">ServiceId: {trip.tid}</Typography>
								</div>
							</div>
						</div>

						<div className="mt-64">
							<Table className="simple">
								<TableHead>
									<TableRow>
										<TableCell>SERVICE</TableCell>
										<TableCell>DATE</TableCell>
										<TableCell align="right">GUEST HOURS BUDGET</TableCell>
										<TableCell align="right">COST</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{Object.keys(trip.events.data).map(key2 => {
										let row = trip.events.data[key2]
										if(row.isLocked) {
											return null
										}
										
										return (<TableRow key={key2}>
											<TableCell>{row.serviceTitle} {row.subServiceTitle &&`(${row.subServiceTitle})`}</TableCell>
											<TableCell >{moment(row.start).format('MM/DD HH:mm')}</TableCell>
											<TableCell align="right">{handleGuestAndHourCount(row)}</TableCell>
											<TableCell align="right">${handleCostColumn(row)}</TableCell>
										</TableRow>)
									})}
								</TableBody>
							</Table>

							<Table className="simple mt-32">
								<TableBody>
									<TableRow>
										<TableCell>
											<Typography className="font-light" variant="h4" color="textSecondary">
												TOTAL
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography className="font-light" variant="h4" color="textSecondary">
												{handleTotalCostChip(tripFiltered)}
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
				<br/>
				</div>
				)
			})}
		</div>
	);
};

export default React.memo(OrderInvoice);
