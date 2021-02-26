import React from 'react';
import {  useSelector } from 'react-redux';
// import * as Actions from 'app/auth/store/actions';
import { InlineWidget } from "react-calendly";

function KnowledgeBasePage() {
	// const dispatch = useDispatch();

	const user = useSelector(({ auth }) => auth.user);
	const {email, displayName, phone } = user.data

	let firstname = ''
	let lastname = ''
	if (displayName.split(' ').length === 1){
		firstname = displayName
		lastname = ''
	} else {
		firstname = displayName.split(' ')[0]
		lastname = displayName.split(' ')[1]
	}

	// useEffect(() => {
	// 	const head = document.querySelector('head')
	// 	const script = document.createElement('script')
	// 	script.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js')
	// 	script.setAttribute('type', 'text/javascript')
	// 	// script.setAttribute('src', 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js')
	// 	head.appendChild(script)
	// }, []);

	// window.addEventListener('message',
	// 	function(e) {
	// 		if ( e.origin === 'https://meetings.hubspot.com'){
	// 			if ( e.data.meetingBookSucceeded ) {
	// 				console.log('this use to be lock cart after setting a meeting');
	// 				// dispatch(Actions.lockCart());
	// 			}
	// 		}
	// 	}
	// );

	// Calendly.initInlineWidget({
	// 	url: 'https://calendly.com/YOURLINK',
	// 	parentElement: document.getElementById('SAMPLEdivID'),
	// 	prefill: {},
	// 	utm: {}
	// });

	return (
		<div className="w-full">
			<InlineWidget 
			url="https://calendly.com/d/dsnp-d2jt/let-s-connect-you?primary_color=f5647c" 
			prefill={{
				email: email,
				firstName: firstname,
				lastName: lastname,
				name: displayName,
				customAnswers: {
					a1: phone,
				}
			}}
				/>
			{/* style="min-width:320px;height:630px;"  */}
			{/* <div style={{ marginTop: '66px', marginBottom: '66px'}}> */}
				{/* <div className="calendly-inline-widget" data-src="https://calendly.com/d/dsnp-d2jt/let-s-connect-you"/> */}
				{/* <div className="meetings-iframe-container" data-src={"https://hubspot.locallinks.online/meetings/connector/local-links-?embed=true&firstname=" + firstname + "&lastname=" + lastname + "&mobilephone=" + phone + "&email=" + email } /> */}
				{/* <div className="meetings-iframe-container" data-src={"https://meetings.hubspot.com/brian721/ring-your-alfred?embed=true&firstname=" + firstname + "&lastname=" + lastname + "&mobilephone=" + phone + "&email=" + email } /> */}
			{/* </div> */}
		</div>
	);
}

export default KnowledgeBasePage;
