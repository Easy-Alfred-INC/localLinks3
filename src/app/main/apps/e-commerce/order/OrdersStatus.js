import _ from '@lodash';
import clsx from 'clsx';
import React from 'react';

export const orderStatuses = [
	{
		id: 2,
		name: 'Trip Has Current Service Data',
		// name: 'Cart Unlocked',
		color: 'bg-green text-white'
	},
	{
		id: 7,
		name: 'Trip Has Old Service Data',
		color: 'bg-red text-white'
	},
	{
		id: 3,
		name: 'No Active Trip',
		color: 'bg-orange text-black'
	},
	{
		id: 1,
		name: 'No Status',
		color: 'bg-blue text-white'
	},
	{
		id: 4,
		name: 'Service Id Removed From Admin',
		color: 'bg-purple text-white'
	},
	{
		id: 6,
		name: 'House Id Removed From Admin',
		color: 'bg-pink text-white'
	},


	{
		id: 5,
		name: 'Delivered',
		color: 'bg-green-700 text-white'
	},
	{
		id: 8,
		name: 'Payment error',
		color: 'bg-red-700 text-white'
	},
	{
		id: 9,
		name: 'On pre-order (paid)',
		color: 'bg-purple-300 text-white'
	},
	{
		id: 10,
		name: 'Awaiting bank wire payment',
		color: 'bg-blue text-white'
	},
	{
		id: 11,
		name: 'Awaiting PayPal payment',
		color: 'bg-blue-700 text-white'
	},
	{
		id: 12,
		name: 'Cart Unlocked',
		color: 'bg-green-800 text-white'
	},
	{
		id: 13,
		name: 'Cart Locked',
		color: 'bg-purple-700 text-white'
	},
	{
		id: 14,
		name: 'Awaiting Cash-on-delivery payment',
		color: 'bg-blue-800 text-white'
	}
];

function OrdersStatus(props) {
	return (
		<div className={clsx('inline text-12 p-4 rounded truncate', _.find(orderStatuses, { name: props.name }).color)}>
			{props.name}
		</div>
	);
}

export default OrdersStatus;
