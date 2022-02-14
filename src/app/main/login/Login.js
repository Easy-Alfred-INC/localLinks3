import FuseAnimate from '@fuse/core/FuseAnimate';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import FirebaseLoginTab from './tabs/FirebaseLoginTab';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles(theme => ({
	root: {
		background: `#F7F7F7`,
		color: theme.palette.primary.dark
	}
}));

function Login() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0')}>
			<div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-center md:flex-shrink-0 md:flex-1 md:text-left">
				<FuseAnimate animation="transition.expandIn">
					<img width="60%" src="assets/images/logos/easyAlfredLong2.png" alt="logo" />
				</FuseAnimate>

				<FuseAnimate animation="transition.slideUpIn" delay={300}>
					<Typography variant="h4" color="secondary">
						Welcome to the Local Links Connector!
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={400}>
					<Typography variant="subtitle1" color="secondary" className="max-w-512 mt-16">
						How can we connect you today?
					</Typography>
				</FuseAnimate>
				<br />
				<Button size="large" component={Link} to="/register" variant="outlined" color="secondary">
					CREATE YOUR ACCOUNT
				</Button>
				<br />
				{console.log(window.screen.width < 1000, window.screen.width, typeof window.screen.width)}
				{window.screen.width < 1000 ? (
					<Card className="h-256 rounded-8 shadow-none border-1">
						<CardMedia
							component="iframe"
							title="test"
							width="100%;"
							height="100%;"
							src="https://www.youtube.com/embed/QzoRRO9wpZY"
						/>
					</Card>
				) : (
					<Card className="w-full h-512 rounded-8 shadow-none border-1">
						<CardMedia
							component="iframe"
							title="test"
							width="auto"
							height="100%;"
							src="https://www.youtube.com/embed/QzoRRO9wpZY"
						/>
					</Card>
				)}
			</div>

			{/* <iframe
				width="1280"
				height="720"
				src="https://www.youtube.com/embed/QzoRRO9wpZY"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe> */}

			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
					<CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
						<Typography variant="h6" className="text-center md:w-full mb-48">
							LOGIN TO YOUR ACCOUNT
						</Typography>

						<FirebaseLoginTab />

						<div className="flex flex-col items-center justify-center pt-32">
							<Link className="font-medium mt-8" to="/pages/auth/forgot-password-2">
								Forgot Password?
							</Link>
							<br />
							<span className="font-medium">Don't have an account?</span>
							<Link className="font-medium" to="/register">
								Create an account
							</Link>
						</div>
					</CardContent>
				</Card>
			</FuseAnimate>
		</div>
	);
}

export default Login;
