import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import reducer from '../store/reducers';
import OrderInvoice from './OrderInvoice';
import Chip from '@material-ui/core/Chip';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import EditIcon from '@material-ui/icons/Edit';
import EventDialog from 'app/main/apps/calendar/EventDialog';
import * as Actions from '../store/actions';
import * as Actions2 from 'app/auth/store/actions';

import { handleTotalCostChip, handleCostColumn } from 'app/services/helper.js';

function Order(props) {
	const dispatch = useDispatch();
	const order = useSelector(({ eCommerceApp }) => eCommerceApp.order);
	console.log('order---', order);
	const theme = useTheme();
	const [tabValue, setTabValue] = useState(0);

	useEffect(() => {
		dispatch(Actions.getOrder(props.match.params));
	}, [dispatch, props.match.params]);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	function handleOpenEventDialoge(event, user){
		event.user = user
		dispatch(Actions2.openEditEventDialogFromAdmin(event, user));
	}
	
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				order && (
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-1 flex-col items-center sm:items-start">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/apps/e-commerce/orders"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Orders</span>
								</Typography>
							</FuseAnimate>

							<div className="flex flex-col min-w-0 items-center sm:items-start">
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography className="text-16 sm:text-20 truncate">
										{`Market ID ${order.tid}`}
									</Typography>
								</FuseAnimate>

								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography variant="caption">
										{`From ${order.customer.firstName}`}
									</Typography>
								</FuseAnimate>
							</div>
						</div>
					</div>
				)
			}
			contentToolbar={
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					classes={{ root: 'w-full h-64' }}
				>
					<Tab className="h-64 normal-case" label="User Details" />
					<Tab className="h-64 normal-case" label="Trip Details" />
					<Tab className="h-64 normal-case" label="Trip Itinerary" />
					<Tab className="h-64 normal-case" label="Past Trips" />
				</Tabs>
			}
			content={
				order && (
					<div className="p-16 sm:p-24 max-w-2xl w-full">

						{tabValue === 0 && (
						<div>
							<div className="pb-48">
								<div className="mb-24">
									<div className="table-responsive mb-16">
										<Card className="w-full mb-16">
											<AppBar position="static" elevation={0}>
												<Toolbar className="px-8">
													<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
														User Details
													</Typography>
												</Toolbar>
											</AppBar>

											<CardContent>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">User ID</Typography>
													<Typography>{order.id}</Typography>
												</div>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">User Role</Typography>
													<Typography>{order.customer.role}</Typography>
												</div>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Name</Typography>
													<Typography>{order.customer.firstName}</Typography>
												</div>

												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Email</Typography>
													<Typography>{order.customer.email}</Typography>
												</div>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Phone</Typography>
													<Typography>{order.customer.phone}</Typography>
												</div>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Bio</Typography>
													<Typography>{order.customer.bio}</Typography>
												</div>
											</CardContent>
										</Card>
									</div>
								</div>
							</div>
						</div>
						)}

						{tabValue === 1 && (
						<div>
							<div className="pb-48">
								<div className="mb-24">
									<div className="table-responsive mb-16">
										<Card className="w-full mb-16">
											<AppBar position="static" elevation={0}>
												<Toolbar className="px-8">
													<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
														Trip Details
													</Typography>
												</Toolbar>
											</AppBar>

											<CardContent>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Address Displayed</Typography>
													<Typography>{order.isCartLocked.toString()}</Typography>
												</div>
												{/* <div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Date</Typography>
													<Typography>{order.date}</Typography>
												</div> */}
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Location Name</Typography>
													<Typography>{order.customer.locationName}</Typography>
												</div>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Location Address</Typography>
													<Typography>{order.customer.shippingAddress.address}</Typography>
												</div>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Location Image</Typography>
													<Typography>{order.customer.locationImage}</Typography>
												</div>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Invoice Link</Typography>
													<Typography>{order.invoiceLink}</Typography>
												</div>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Last Updated</Typography>
													<Typography>{moment(order.reference).format('MM/DD/YYYY, h:mm:ss')}</Typography>
												</div>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Market ID</Typography>
													<Typography>{order.tid}</Typography>
												</div>
												<div className="mb-24">
													<Typography className="font-bold mb-4 text-15">Service ID</Typography>
													<Typography>{order.sid}</Typography>
												</div>
											</CardContent>
										</Card>
									</div>
								</div>
							</div>
						</div>
						)}

						{tabValue === 2 && (
						<div>
								<div className="table-responsive">
									<table className="simple">
										<thead>
											<tr>
												<th>Edit</th>
												<th>Confirmed</th>
												<th>Date</th>
												<th>Service</th>
												<th>Requests</th>
												<th>Guest Count</th>
												<th>Hour Count</th>
												<th>Budget</th>
												<th>Total</th>
											</tr>
										</thead>
										<tbody>
											{order.products.filter((product)=>product && !product.isLocked).map(product => (
												
												<tr key={product.id}>
													<td className="w-64">
														<ButtonGroup size="small" aria-label="small outlined button group">
															{/* <IconButton aria-label="delete" size="small" onClick={()=>handleRemove(order.id, product.id)}>
																<DeleteIcon fontSize="inherit" />
															</IconButton> */}
															<IconButton aria-label="delete" size="small" onClick={()=> handleOpenEventDialoge(product, order.user)}>
																<EditIcon fontSize="inherit" />
															</IconButton>
														</ButtonGroup>
													</td>
													<td className="w-64">
														{/* <span className="truncate">{product.isConfirmed.toString()}</span> */}
														{product.isConfirmed ? (
															<Icon className="text-green text-20">check_circle</Icon>
														) : (
																<Icon className="text-red text-20">remove_circle</Icon>
															)}
													</td>
													<td className="w-64">
														<span className="truncate">{moment(product.start).format('MM/DD HH:mm')}</span>
													</td>
													<td className="w-64">
														<span className="truncate">{product.serviceTitle} {product.subServiceTitle && `(${product.subServiceTitle})`}</span>
													</td>
													<td className="w-64">
														<span className="truncate">{product.desc}</span>
													</td>
													<td className="w-64">
														<span className="truncate">{product.guestCount}</span>
													</td>
													<td className="w-64">
														<span className="truncate">{product.hourCount}</span>
													</td>
													<td className="w-64">
														<span className="truncate">${product.budget}</span>
													</td>
													<td className="w-64">
														<span className="truncate">${handleCostColumn(product)}</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<br/>
								<div className="flex flex-col items-center">
									<Chip
									size="medium"
									label={handleTotalCostChip(order.products)}
									color="primary"/>
								</div>
							</div>
						)}

						{tabValue === 3 && <OrderInvoice order={order} />}

						<EventDialog />

					</div>
				)
			}
			innerScroll
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(Order);
