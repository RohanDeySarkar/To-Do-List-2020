import React from 'react';
import './Home.css';
import HomeSvg from './HomeSvg';

function Home() {
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
