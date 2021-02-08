import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
// import Button from '@material-ui/core/Button';
// import { Link } from 'react-router-dom';

function ContactsHeader(props) {
	const dispatch = useDispatch();
	const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
	const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);

	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-224">
				<Hidden lgUp>
					<IconButton
						onClick={ev => {
							props.pageLayout.current.toggleLeftSidebar();
						}}
						aria-label="open left sidebar"
					>
						<Icon>menu</Icon>
					</IconButton>
				</Hidden>

				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32">account_box</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography variant="h6" className="mx-12 hidden sm:flex">
							Services
						</Typography>
					</FuseAnimate>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-center px-8 sm:px-12">
				<ThemeProvider theme={mainTheme}>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Paper className="flex p-4 items-center w-full max-w-512 h-48 px-8 py-4" elevation={1}>
							<Icon color="action">search</Icon>

							<Input
								placeholder="Search for anything"
								className="flex flex-1 px-16"
								disableUnderline
								fullWidth
								value={searchText}
								inputProps={{
									'aria-label': 'Search'
								}}
								onChange={ev => dispatch(Actions.setSearchText(ev))}
							/>
						</Paper>
					</FuseAnimate>
				</ThemeProvider>
			{/* <FuseAnimate animation="transition.slideRightIn" delay={300}>
				<Button
					// component={Link}
					onClick={()=>dispatch(Actions.openNewContactDialog())}
					to="/apps/e-commerce/products/new"
					className="whitespace-no-wrap normal-case"
					variant="contained"
					color="secondary"
				>
					<span className="hidden sm:flex">Add New Service</span>
					<span className="flex sm:hidden">New</span>
				</Button>
			</FuseAnimate>{
				' '
			}
			<FuseAnimate animation="transition.slideRightIn" delay={300}>
				<Button
					onClick={()=>dispatch(Actions.openNewContactDialog())}
					to="/apps/e-commerce/products/new"
					className="whitespace-no-wrap normal-case"
					variant="contained"
					color="secondary"
				>
					<span className="hidden sm:flex">Rehydrate Current Trips</span>
					<span className="flex sm:hidden">New</span>
				</Button>
			</FuseAnimate> */}
			</div>
			</div>
	);
}

export default ContactsHeader;
