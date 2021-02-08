import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Icon from '@material-ui/core/Icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ProductsTableHead from './ProductsTableHead';
import FuseUtils from '@fuse/utils';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
// import clsx from 'clsx';
import Button from '@material-ui/core/Button';
// import React from 'react';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import * as Actions from '../store/actions';


function ProductsTable(props) {
	const dispatch = useDispatch();
	const products = useSelector(({ eCommerceApp }) => eCommerceApp.products.data);
	const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.products.searchText);
	// const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);
	// const user = useSelector(({ contactsApp }) => contactsApp.user);
	// const contacts = useSelector(({ eCommerceApp }) => contactsApp);
	// console.log('contacts', contacts);

	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(products);
	const [page, setPage] = useState(0);
	// const [shouldDelete, setShouldDelete] = useState(false);

	const [open, setOpen] = React.useState(false);
	const [deleteId, setDeleteId] = React.useState(false);

	const handleClickOpen = (id) => {
		setOpen(true);
		setDeleteId(id);
	};

	const handleClose = () => {
		setOpen(false);
	};


	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});


	useEffect(() => {
		dispatch(Actions.getProducts());
	}, [dispatch]);

	useEffect(() => {
		if (searchText.length !== 0) {
			// setData(_.filter(products, item => item.name.toLowerCase().includes(searchText.toLowerCase())));
			setData(FuseUtils.filterArrayByString(products, searchText));
			setPage(0);
		} else {
			setData(products);
		}
	}, [products, searchText]);

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
		props.history.push(`/apps/e-commerce/products/${item.id}/${item.handle}`);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	function handelDelete(id){
		// event.stopPropagation()
		console.log('in handle delete', id);
		dispatch(Actions.removeProduct(id))

	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table className="min-w-xl" aria-labelledby="tableTitle">
					<ProductsTableHead
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
									switch (order.id) {
										case 'categories': {
											return o.categories[0];
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
												{/* { shouldDelete ? 
												<MenuItem
													onClick={event => {
														// setShouldDelete(true)
														// if (shouldDelete){
														// } else {
														// 	handelDelete(event, n.id)
														// }
													}}
													>
													<ListItemIcon className="min-w-40">
														<Icon>save</Icon>
													</ListItemIcon>
												</MenuItem> 
												:  */}
												<MenuItem
												onClick={event => {
													event.stopPropagation()
													handleClickOpen(n.id)
													// setShouldDelete(true)
													// if (shouldDelete){
													// } else {
													// 	handelDelete(event, n.id)
													// }
													}}
												>
													<ListItemIcon className="min-w-40">
														<Icon>delete</Icon>
													</ListItemIcon>
												</MenuItem>
												{/* // } */}
										</TableCell>

										<TableCell className="w-52" component="th" scope="row" padding="none">
											{n.images.length > 0 && n.featuredImageId ? (
												<img
													className="w-full block rounded"
													src={_.find(n.images, { id: n.featuredImageId }).url}
													alt={'broken img'}
												/>
											) : (
												<img
													className="w-full block rounded"
													src="assets/images/ecommerce/product-image-placeholder.png"
													alt={n.name}
												/>
											)}
										</TableCell>

										<TableCell component="th" scope="row">
											{n.name}
										</TableCell>

										<TableCell className="truncate" component="th" scope="row">
											{n.categories.join(', ')}
										</TableCell>

										<TableCell component="th" scope="row" align="right">
											{n.priceTaxIncl}
										
											
										</TableCell>

										<TableCell component="th" scope="row" align="right">
											{n.quantity}
											{/* <i
												className={clsx(
													'inline-block w-8 h-8 rounded mx-8',
													n.quantity <= 5 && 'bg-red',
													n.quantity > 5 && n.quantity <= 25 && 'bg-orange',
													n.quantity > 25 && 'bg-green'
												)}
											/> */}
										</TableCell>

										<TableCell component="th" scope="row" align="right">
											{/* {n.active ? (
												<Icon className="text-green text-20">check_circle</Icon>
											) : (
												<Icon className="text-red text-20">remove_circle</Icon>
											)} */}
											{/* {!n.description && "(no match)"} */}
											{n.description ? (
												<Icon className="text-green text-20">check_circle</Icon>
											) : (
													<Icon className="text-red text-20">remove_circle</Icon>
												)}
										</TableCell>
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

			<div>
				{/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
					Open alert dialog
      </Button> */}
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{"Delete House Id: " + deleteId + ' ?'}</DialogTitle>
					<DialogContent>
						{/* <DialogContentText id="alert-dialog-description">
							Are you sure you want to delete house id: {deleteId}
					</DialogContentText> */}
								</DialogContent>
								<DialogActions>
						<Button onClick={()=> handelDelete(deleteId)} color="primary">
										Yes
					</Button>
									<Button onClick={handleClose} color="primary" autoFocus>
										No
					</Button>
					</DialogActions>
				</Dialog>
			</div>



		</div>
	);
}

export default withRouter(ProductsTable);
