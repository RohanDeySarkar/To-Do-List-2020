import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Firebase } from '../Firebase';
import Card from './Card';

import './Home.css';
import HomeSvg from './HomeSvg';

function Home() {
	const history = useHistory();
	const [reminders, setReminders] = useState([{}]);
	const db = Firebase.firestore();
	const user = localStorage.getItem('ID');

	useEffect(() => {
		const token = localStorage.getItem('TOKEN');
		if (token === null) {
			history.push('/login');
		}

		db.collection('reminders')
			.where('uid', '==', user)
			.get()
			.then((data) => {
				let reminderData = [];
				data.docs.forEach((doc) => {
					let reminder = {
						title: doc.data()['title'],
						cid: doc.data()['cid'],
						id: doc.id,
						text: doc.data()['text'],
						date: doc.data()['date'],
						time: doc.data()['time'],
						uid: doc.data()['uid'],
						category: doc.data()['category'],
					};
					reminderData.push(reminder);
				});
				setReminders(reminderData);
			});
	}, [history, db, user]);

	return (
		<div className='home'>
			{reminders.length === 0 ? (
				<div className='home-svg'>
					<HomeSvg />
				</div>
			) : (
				<div className='home-card'>
					{reminders.map((reminder, index) => (
						<Card
							key={index}
							title={reminder.title}
							cid={reminder.cid}
							text={reminder.text}
							id={reminder.id}
							date={reminder.date}
							category={reminder.category}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default Home;
