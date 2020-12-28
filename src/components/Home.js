import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Firebase } from '../Firebase';
import Card from './Card';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Home.css';
import HomeSvg from './HomeSvg';

function Home() {
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(false);
	const [reminders, setReminders] = useState([{}]);
	const db = Firebase.firestore();
	const user = localStorage.getItem('ID');

	const fetchData = async () => {
		setIsLoading(true);
		const today = new Date();
		const year = today.getFullYear();
		const month = today.getMonth() + 1;
		const date = today.getDate();
		const hour = today.getHours();
		const min = today.getMinutes();

		const reminderDate = year + '-' + month + '-' + date;
		const time = hour + ':' + min;

		await db
			.collection('reminders')
			.where('uid', '==', user)
			.where('date', '==', reminderDate)
			.where('time', '<=', time)
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
				setIsLoading(false);
			});
	};

	useEffect(() => {
		const token = localStorage.getItem('TOKEN');
		if (token === null) {
			history.push('/login');
		}
		fetchData();
	}, [history]);

	const markComplete = async (id) => {
		setIsLoading(true);
		await db
			.doc(`/reminders/${id.id}`)
			.delete()
			.then((_) => {
				fetchData();
				setIsLoading(false);
			});
	};

	const snooze = async (data) => {
		setIsLoading(true);
		await db
			.doc(`/reminders/${data.id}`)
			.update({ date: data.updatedDate })
			.then((_) => {
				fetchData();
				setIsLoading(false);
			});
	};

	return (
		<div className='home'>
			{reminders.length === 0 ? (
				<div className='home-svg'>
					<HomeSvg />
				</div>
			) : (
				<>
					{isLoading ? (
						<CircularProgress color='secondary' />
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
									onMarkComplete={markComplete}
									onSnooze={snooze}
								/>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default Home;
