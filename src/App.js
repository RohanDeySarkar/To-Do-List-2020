import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Categories from './components/Categories';
import Reminder from './components/Reminder';
import SignIn from './components/SignIn';

import { useStateValue } from './components/StateProvider';

function App() {
	const [{ activeCategory }] = useStateValue();

	return (
		<div className='app'>
			<Switch>
				<Route exact path='/login'>
					<SignIn />
				</Route>
				<Route exact path='/'>
					<Navbar title='Home' />
					<Home />
				</Route>
				<Route exact path='/categories'>
					<Navbar title='Categories' />
					<Categories />
				</Route>
				<Route exact path='/reminder'>
					<Navbar
						title={
							activeCategory?.length ? 'Reminders' : 'Reminders'
						}
					/>
					<Reminder />
				</Route>
			</Switch>
		</div>
	);
}

export default App;
