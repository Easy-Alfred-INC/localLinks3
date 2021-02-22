import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
// import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import OrdersStatus from '../order/OrdersStatus';
import * as Actions from '../store/actions';
import OrdersTableHead from './OrdersTableHead';
import moment from 'moment';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditTripDialog from 'app/main/apps/e-commerce/dialogs/EditTripDialog.js';
import ActivateTripDialog from 'app/main/dialogs/ActivateTripDialog';

function OrdersTable(props) {
	const dispatch = useDispatch();
	const orders = useSelector(({ eCommerceApp }) => eCommerceApp.orders.data);
	const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.orders.searchText);
	const closeEditTripDialog = useSelector(({ eCommerceApp }) => eCommerceApp.orders.tripDialog.props.open);
	
	const user = useSelector(({ auth }) => auth.user);
	const openActivateTripDialog = user.trip.openDialog

	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(orders);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});

	useEffect(() => {
		dispatch(Actions.getOrders());
	}, [dispatch]);

	useEffect(() => {
		if (searchText.length !== 0) {
			setData(FuseUtils.filterArrayByString(orders, searchText));
			setPage(0);
		} else {
			setData(orders);
		}
	}, [orders, searchText]);

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	function handleClick(item) {
		props.history.push(`/apps/e-commerce/orders/${item.id}`);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	return (
		<>
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table className="min-w-xl" aria-labelledby="tableTitle">
					<OrdersTableHead
						numSelected={selected.length}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
					/>

					<TableBody>
						{_.orderBy(
							data,
							[
								o => {
									console.log('o',o);
									switch (order.id) {
										case 'id': {
											return parseInt(o.id, 10);
										}
										case 'customer': {
											return o.customer.firstName;
										}
										case 'payment': {
											return o.customer.email;
										}
										case 'status': {
											return o.status[0].name;
										}
										case 'lastUpdated': {
											return o.lastUpdated;
										}
										default: {
											return o[order.id];
										}
									}
								}
							],
							[order.direction]
						)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map(n => {
								console.log('n', n );
								const isSelected = selected.indexOf(n.id) !== -1;

								return (
									<TableRow
										className="h-64 cursor-pointer"
										hover
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										onClick={event => handleClick(n)}
									>
										<TableCell className="w-64 text-center" padding="none">
											<Tooltip title="Edit Trip">
												<IconButton
													onClick={(event)=>{
														event.stopPropagation()
														// handleEditTrip(n)
														dispatch(Actions.openEditTripDialog(n));
													}}
													>
													<Icon>edit</Icon>
												</IconButton>
											</Tooltip>
										</TableCell>

										<TableCell className="truncate" component="th" scope="row">
											{n.customer.firstName}
										</TableCell>

										<TableCell component="th" scope="row" align="right">
											{n.customer.phone}
										</TableCell>

										<TableCell component="th" scope="row">
											{n.customer.email}
										</TableCell>

										{/* <TableCell component="th" scope="row">
											{n.date}
										</TableCell> */}

										<TableCell component="th" scope="row">
											{/* {n.lastUpdated} */}
											{moment(n.lastUpdated).format('MM/DD/YYYY')}
											{/* {n.tid} */}
										</TableCell>
										
										<TableCell component="th" scope="row">
											{/* {moment(n.reference).format('MM/DD/YYYY, h:mm:ss')} */}
											{n.tid}
										</TableCell>

										<TableCell component="th" scope="row">
											{n.sid}
										</TableCell>
										
										<TableCell  component="th" scope="row">
											{n.isCartLocked ? 
											 <div className="text-green">Displayed</div>
											 : 
											 <div>Hidden</div>}
										</TableCell>

										<TableCell component="th" scope="row">
											<OrdersStatus name={n.status[0].name} />
										</TableCell>
{/* 										
										<TableCell component="th" scope="row">
											<OrdersStatus name={n.status[0].name} />
										</TableCell> */}
								
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<TablePagination
				className="overflow-hidden"
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label': 'Previous Page'
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page'
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
		{closeEditTripDialog && <EditTripDialog />}
		{openActivateTripDialog && <ActivateTripDialog />}
		</>
	);
}

export default withRouter(OrdersTable);
