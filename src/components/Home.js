import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Firebase } from '../Firebase';
import Card from './Card';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import CsvDownload from 'react-json-to-csv';

import './Home.css';
import HomeSvg from './HomeSvg';

function Home() {
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(false);
	const [reminders, setReminders] = useState([{}]);
	const [loadData, setLoadData] = useState(false);
	const [exportData, setExportData] = useState([]);
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

		var newDate;
		if (date < 10) {
			newDate = '0' + date;
		} else {
			newDate = date;
		}

		var newMonth;
		if (month < 10) {
			newMonth = '0' + month;
		} else {
			newMonth = month;
		}

		const reminderDate = year + '-' + newMonth + '-' + newDate;
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
					if (doc.data()['action'] !== 'complete') {
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
					}
				});
				setReminders(reminderData);
				setIsLoading(false);
			});
	};

	var autoTimeout = setInterval(() => {
		window.location.reload();
	}, 300000);

	useEffect(() => {
		const token = localStorage.getItem('TOKEN');
		if (token === null) {
			clearInterval(autoTimeout);
			history.push('/login');
		}
		fetchData();
	}, [history]);

	const markComplete = async (data) => {
		setIsLoading(true);
		await db
			.doc(`/reminders/${data.id}`)
			.update({ action: data.action })
			.then((_) => {
				fetchData();
				setIsLoading(false);
			});
	};

	const snooze = async (data) => {
		setIsLoading(true);
		await db
			.doc(`/reminders/${data.id}`)
			.update({
				date: data.updatedDate,
				remark: data.remark,
				action: data.action,
			})
			.then((_) => {
				fetchData();
				setIsLoading(false);
			});
	};

	const handleExport = async () => {
		setLoadData(true);
		const today = new Date();
		const year = today.getFullYear();
		const month = today.getMonth() + 1;
		const date = today.getDate();

		var newDate;
		if (date < 10) {
			newDate = '0' + date;
		} else {
			newDate = date;
		}

		var newMonth;
		if (month < 10) {
			newMonth = '0' + month;
		} else {
			newMonth = month;
		}

		const reminderDate = year + '-' + newMonth + '-' + newDate;

		await db
			.collection('reminders')
			.where('uid', '==', user)
			.where('date', '<=', reminderDate)
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
						action: doc.data()['action'],
						remark: doc.data()['remark'],
					};
					reminderData.push(reminder);
				});
				setExportData(reminderData);
				setLoadData(false);
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
						<>
							<div className='export'>
								{loadData ? (
									<CircularProgress color='secondary' />
								) : (
									<>
										{exportData.length > 0 ? (
											<CsvDownload
												data={exportData}
												filename='export.csv'
												style={{
													boxShadow:
														'inset 0px 1px 0px 0px #e184f3',
													background:
														'linear-gradient(to bottom, #c123de 5%, #a20dbd 100%)',
													backgroundColor: '#c123de',
													borderRadius: '6px',
													border: '1px solid #a511c0',
													display: 'inline-block',
													cursor: 'pointer',
													color: '#ffffff',
													fontSize: '15px',
													fontWeight: 'bold',
													padding: '6px 24px',
													textDecoration: 'none',
													textShadow:
														'0px 1px 0px #9b14b3',
												}}
											>
												Download CSV
											</CsvDownload>
										) : (
											<Button
												variant='contained'
												color='primary'
												onClick={handleExport}
											>
												Export
											</Button>
										)}
									</>
								)}
							</div>
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
						</>
					)}
				</>
			)}
		</div>
	);
}

export default Home;
