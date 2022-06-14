// import Checkbox from '@material-ui/core/Checkbox';
// import Icon from '@material-ui/core/Icon';
// import IconButton from '@material-ui/core/IconButton';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import MenuList from '@material-ui/core/MenuList';
// import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
// import clsx from 'clsx';
import React from 'react';

const rows = [
	{
		id: 'customer',
		align: 'left',
		disablePadding: false,
		label: 'Customer Name',
		sort: true
	},
	{
		id: 'phone',
		align: 'right',
		disablePadding: false,
		label: 'Phone',
		sort: true
	},
	{
		id: 'payment',
		align: 'left',
		disablePadding: false,
		label: 'Email',
		sort: true
	},
	// {
	// 	id: 'date',
	// 	align: 'left',
	// 	disablePadding: false,
	// 	label: 'Trip Dates',
	// 	sort: true
	// },
	{
		id: 'lastUpdated',
		align: 'left',
		disablePadding: false,
		label: 'Last Updated',
		sort: true
	},
	{
		id: 'tid',
		align: 'left',
		disablePadding: false,
		label: 'House Id',
		sort: true
	},
	{
		id: 'sid',
		align: 'left',
		disablePadding: false,
		label: 'Service Id',
		sort: true
	},
	{
		id: 'isCartLocked',
		align: 'left',
		disablePadding: false,
		label: 'Address',
		sort: true
	},
	{
		id: 'status',
		align: 'left',
		disablePadding: false,
		label: 'Status',
		sort: true
	}
];

function OrdersTableHead(props) {
	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow className="h-64">
				<TableCell padding="none" className="relative w-64 text-center"></TableCell>
				{rows.map(row => {
					// console.log('row', row);
					return (
						<TableCell
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'default'}
							sortDirection={props.order.id === row.id ? props.order.direction : false}
						>
							{row.sort && (
								<Tooltip
									title="Sort"
									placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={props.order.id === row.id}
										direction={props.order.direction}
										onClick={createSortHandler(row.id)}
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							)}
						</TableCell>
					);
				}, this)}
			</TableRow>
		</TableHead>
	);
}

export default OrdersTableHead;
