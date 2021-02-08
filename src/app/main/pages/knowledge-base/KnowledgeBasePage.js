import React, { useEffect } from 'react';
import {  useSelector } from 'react-redux';
// import * as Actions from 'app/auth/store/actions';

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

	useEffect(() => {
		const head = document.querySelector('head')
		const script = document.createElement('script')
		script.setAttribute('src', 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js')
		head.appendChild(script)
	}, []);

	window.addEventListener('message',
		function(e) {
			if ( e.origin === 'https://meetings.hubspot.com'){
				if ( e.data.meetingBookSucceeded ) {
					console.log('this use to be lock cart after setting a meeting');
					// dispatch(Actions.lockCart());
				}
			}
		}
	);

	return (
		<div className="w-full">
			<div style={{ marginTop: '66px', marginBottom: '66px'}}>
				<div className="meetings-iframe-container" data-src={"https://hubspot.locallinks.online/meetings/connector/local-links-?embed=true&firstname=" + firstname + "&lastname=" + lastname + "&mobilephone=" + phone + "&email=" + email } />
				{/* <div className="meetings-iframe-container" data-src={"https://meetings.hubspot.com/brian721/ring-your-alfred?embed=true&firstname=" + firstname + "&lastname=" + lastname + "&mobilephone=" + phone + "&email=" + email } /> */}
			</div>
		</div>
	);
}

export default KnowledgeBasePage;
