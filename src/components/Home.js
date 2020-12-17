import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useStateValue } from './StateProvider';

import './Home.css';
import HomeSvg from './HomeSvg';

function Home() {
	const history = useHistory();

	const [{ dispatch, reminders }] = useStateValue();

	useEffect(() => {
		const token = localStorage.getItem('TOKEN');
		if (token === null) {
			history.push('/login');
		}

		console.log(reminders);
	}, [history]);

	return (
		<div className='home'>
			<div className='home-svg'>
				<HomeSvg />
			</div>
		</div>
	);
}

export default Home;
