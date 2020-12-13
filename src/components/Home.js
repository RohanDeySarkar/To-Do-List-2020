import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import HomeSvg from './HomeSvg';

function Home() {
	const history = useHistory();

	useEffect(() => {
		const token = localStorage.getItem('TOKEN');
		if (token === null) {
			history.push('/login');
		}
	}, []);

	return (
		<div className='home'>
			<h1>All Caught Up!</h1>
			<div className='home-svg'>
				<HomeSvg />
			</div>
		</div>
	);
}

export default Home;
