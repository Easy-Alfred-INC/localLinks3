import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useForm } from '@fuse/hooks';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

function Product(props) {
	const dispatch = useDispatch();
	const product = useSelector(({ eCommerceApp }) => eCommerceApp.product);
	// const contacts = useSelector(({ contactsApp }) => contactsApp);
	// console.log('contaccts', contacts)
	const theme = useTheme();
	const [tabValue, setTabValue] = useState(0);
	const { form, handleChange, setForm } = useForm(null);

	useEffect(() => {
		function updateProductState() {
			const { productId } = props.match.params;

			if (productId === 'new') {
				dispatch(Actions.newProduct());
			} else {
				dispatch(Actions.getProduct(props.match.params));
			}
		}
		updateProductState();
	}, [dispatch, props.match.params]);

	useEffect(() => {
		if ((product.data && !form) || (product.data && form && product.data.id !== form.id)) {
			setForm(product.data);
		}
	}, [form, product.data, setForm]);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	function canBeSubmitted() {
		return form.name.length > 0
		&& form.priceTaxIncl.length > 0
		&& form.quantity.length > 0
		&& form.name.length > 0
		&& form.sku.length > 0
		&& form.description.length > 0
		// && !handleIsError()


	}

	// function handleIsError(){
	// 	if (form.quantity === '1245') return false
	// 	return true
	// }

	if (
		(!product.data || (product.data && props.match.params.productId !== product.data.id)) &&
		props.match.params.productId !== 'new'
	) {
		return <FuseLoading />;
	}

	console.log('form', form)

	return (
		<FusePageCarded
			classes={{
				toolbar: 'p-0',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				form && (
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/apps/e-commerce/products"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Products</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									{form.images.length > 0 && form.featuredImageId ? (
										<img
											className="w-32 sm:w-48 rounded"
											src={form.description}
											alt={'broken img'}
										/>
									) : (
										<img
											className="w-32 sm:w-48 rounded"
											src="assets/images/ecommerce/product-image-placeholder.png"
											alt={form.name}
										/>
									)}
								</FuseAnimate>
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.priceTaxIncl ? form.priceTaxIncl : 'New Product'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Product Detail</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button
								className="whitespace-no-wrap normal-case"
								variant="contained"
								color="secondary"
								disabled={!canBeSubmitted()}
								onClick={() => {
									if (form.isNewHouse) {
										dispatch(Actions.saveNewProduct(form))
									} else {
										dispatch(Actions.saveProduct(form))
									}
								}}
							>
								Save
							</Button>
						</FuseAnimate>
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
					<Tab className="h-64 normal-case" label="House Info" />
					{/* <Tab className="h-64 normal-case" label="Product Images" />
					<Tab className="h-64 normal-case" label="Pricing" />
					<Tab className="h-64 normal-case" label="Inventory" />
					<Tab className="h-64 normal-case" label="Shipping" /> */}
				</Tabs>
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
						{tabValue === 0 && (
							
							<div>
								<TextField
									className="mt-8 mb-16"
									// error={form.priceTaxIncl === ''}
									required
									label="House Id"
									autoFocus
									id="priceTaxIncl"
									name="priceTaxIncl"
									value={form.priceTaxIncl}
									onChange={handleChange}
									variant="outlined"
									fullWidth
									disabled={!form.isNewHouse}
								/>

								<TextField
									className="mt-8 mb-16"
									required
									label="Service Id"
									id="quantity"
									name="quantity"
									value={form.quantity}
									onChange={handleChange}
									variant="outlined"
									fullWidth
									// error={handleIsError()}
									// helperText={handleIsError() && "Doesn't match a Service Id"}
								/>

								<TextField
									className="mt-8 mb-16"
									// error={form.name === ''}
									required
									label="House Name"
									// autoFocus
									id="name"
									name="name"
						
									value={form.name}
									onChange={handleChange}
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									id="sku"
									name="sku"
									onChange={handleChange}
									label="Address"
									type="text"
									value={form.sku}
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									required
									label="House Image"
									id="description"
									name="description"
									value={form.description}
									onChange={handleChange}
									variant="outlined"
									fullWidth
								/>
								{!form.isNewHouse && <img src={form.description} alt="product" />}
							</div>
						)}
					</div>
				)
			}
			innerScroll
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(Product);
