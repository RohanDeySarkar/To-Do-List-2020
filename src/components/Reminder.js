import React, { useEffect, useState } from 'react';
import './Reminder.css';
import { Firebase } from '../Firebase';

import { useStateValue } from './StateProvider';

import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import Dialog from '@material-ui/core/Dialog';
import {
	DialogContent,
	DialogTitle,
	TextField,
	Tooltip,
} from '@material-ui/core';

import ReminderCard from './ReminderCard';
import { useHistory } from 'react-router-dom';

import ReminderSvg from './ReminderSvg';

const useStyles = makeStyles((theme) => ({
	textField: {
		marginBottom: '20px',
		//   display: 'grid',
		//   placeItems: 'center'
	},
}));

function Reminder() {
	const history = useHistory();
	const user = localStorage.getItem('ID');
	const db = Firebase.firestore();
	const classes = useStyles();

	const [
		{ activeCategory, reminders, categories, editId, editTitle, editText },
		dispatch,
	] = useStateValue();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [activeReminders, setActiveReminders] = useState([]);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [error, setError] = useState(false);

	const filterReminders = () => {
		var items = reminders.filter(function (reminder) {
			return reminder.category === activeCategory.cid;
		});

		// console.log(items);

		setActiveReminders(items);
	};

	useEffect(() => {
		const token = localStorage.getItem('TOKEN');
		if (token === null) {
			history.push('/login');
		}

		if (activeCategory.cid !== '' && activeCategory !== undefined) {
			db.doc(`/categories/${activeCategory.cid}`)
				.get()
				.then((doc) => {
					const reminders = doc.data()['reminders'];
					dispatch({
						type: 'UPDATE_REMINDERS',
						payload: reminders,
					});
				});
		}
	}, [dispatch, history, activeCategory]);

	useEffect(() => {
		filterReminders();
	}, [reminders]);

	useEffect(() => {
		setTitle(editTitle);
		setDescription(editText);
	}, [editId, editText, editTitle]);

	// console.log(activeReminders);

	// console.log(reminders);

	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		if (editId !== 0) {
			dispatch({
				type: 'EDIT_REMINDER',
				payload: { id: 0, title: '', text: '' },
			});
		}

		setDialogOpen(false);
	};

	// Date format reminder match
	// console.log(new Date().toLocaleString())

	const handleDateTime = (e) => {
		setError(false);

		const item = e.target.value;

		// 2020-12-12T17:08
		// console.log(item.slice(0, 10));
		// console.log(item.slice(11, 16));

		setDate(item.slice(0, 10));
		setTime(item.slice(11, 16));
	};

	// console.log(Math.floor(Math.random() * 10000) + Math.floor(Math.random() * 1000));

	const handleReminderSubmit = async (e) => {
		e.preventDefault();
		// Also use this for edit -> delete current card then add a new card

		var randomId =
			Math.floor(Math.random() * 10000) +
			Math.floor(Math.random() * 1000);

		var reminderData = {
			category: activeCategory.cid,
			title: title,
			id: randomId,
			text: description,
			time: time,
			date: date,
		};

		// console.log("Add Reminder >>>", tempState);

		if (title.length === 0 || date.length === 0 || time.length === 0) {
			setError(true);
		} else {
			// EDIT  REMINDER
			// console.log(editId);

			if (editId !== 0) {
				var updatedReminders = reminders.filter(function (reminder) {
					return reminder.id !== editId;
				});

				await db
					.doc(`/categories/${activeCategory.cid}`)
					.update({ reminders: updatedReminders });

				dispatch({
					type: 'UPDATE_REMINDERS',
					payload: updatedReminders,
				});

				dispatch({
					type: 'EDIT_REMINDER',
					payload: { id: 0, title: '', text: '' },
				});
			}

			await db
				.doc(`/categories/${activeCategory.cid}`)
				.get()
				.then((doc) => {
					var reminders = doc.data()['reminders'];
					reminders.push(reminderData);
					db.doc(`/categories/${activeCategory.cid}`).update({
						reminders: reminders,
					});
				});

			dispatch({
				type: 'ADD_REMINDER',
				payload: reminderData,
			});

			setTitle('');
			setDescription('');
			setDate('');
			setTime('');
			setDialogOpen(false);
		}
	};

	// console.log("Dialog Open >>>>", dialogOpen);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const handleDeleteCategory = () => {
		db.doc(`/categories/${activeCategory.cid}`)
			.get()
			.then((doc) => {
				if (doc.exists) {
					const uid = doc.data()['uid'];
					if (uid !== user) {
						return;
					} else {
						db.doc(`/categories/${activeCategory.cid}`)
							.delete()
							.then((_) => {
								var updatedReminders = reminders.filter(
									function (reminder) {
										return (
											reminder.category !==
											activeCategory.cid
										);
									}
								);

								var updatedCategories = categories.filter(
									function (category) {
										return category !== activeCategory;
									}
								);

								dispatch({
									type: 'UPDATE_REMINDERS',
									payload: updatedReminders,
								});

								dispatch({
									type: 'UPDATE_CATEGORIES',
									payload: updatedCategories,
								});

								dispatch({
									type: 'ACTIVE_CATEGORY',
									payload: {
										title: '',
										cid: '',
										uid: '',
									},
								});

								localStorage.removeItem('ACTIVE_CATEGORY_ID');
								setOpenDeleteDialog(false);
								history.push('/categories');
							});
					}
				} else {
					return;
				}
			});
	};

	return (
		<div className='reminder'>
			{activeCategory.cid !== '' ? (
				<div className='reminder__container'>
					<h1>Your Reminders for {activeCategory.title}</h1>

					<div className='reminder__add' onClick={handleDialogOpen}>
						<AddCircleIcon className='reminder__addIcon' />

						<p className='reminder__addText'>Add new reminder</p>
					</div>

					<Dialog
						open={dialogOpen}
						onClose={handleDialogClose}
						aria-labelledby='form-dialog-title'
					>
						<div className='reminder__dialog'>
							<DialogTitle id='form-dialog-title'>
								Add a Reminder
							</DialogTitle>
							<DialogContent>
								<form onSubmit={handleReminderSubmit}>
									<TextField
										error={
											error
												? title.length > 0
													? false
													: true
												: false
										}
										helperText={
											error
												? title.length > 0
													? null
													: 'please add a title'
												: null
										}
										autoFocus
										margin='dense'
										label='Title'
										type='text'
										fullWidth
										className={classes.textField}
										value={title}
										onChange={(e) => {
											setTitle(e.target.value);
											setError(false);
										}}
									/>

									<TextField
										autoFocus
										margin='dense'
										label='Description'
										type='text'
										fullWidth
										className={classes.textField}
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
									/>

									<TextField
										error={
											error
												? date.length > 0
													? false
													: true
												: false
										}
										helperText={
											error
												? date.length > 0
													? null
													: 'please select date and time'
												: null
										}
										id='datetime-local'
										label='Set Date and Time'
										type='datetime-local'
										// defaultValue='2020-01-01T00:00'
										className={classes.textField}
										InputLabelProps={{
											shrink: true,
										}}
										onChange={handleDateTime}
									/>

									<div className='reminder__dialogButtons'>
										<button
											style={{
												backgroundColor: '#fe5f55',
											}}
											type='button'
											onClick={handleDialogClose}
										>
											close
										</button>
										<button
											style={{
												backgroundColor: '#17b978',
											}}
											type='submit'
											onClick={handleReminderSubmit}
										>
											add
										</button>
									</div>
								</form>
							</DialogContent>
						</div>
					</Dialog>

					<div
						className={`${
							activeReminders?.length === 0 && 'reminder__noCards'
						} ${'reminder__cards'}`}
					>
						{activeReminders?.map((reminder, index) => (
							<ReminderCard
								key={index}
								id={reminder.id}
								title={reminder.title}
								text={reminder.text}
								time={reminder.time}
								date={reminder.date}
								cid={reminder.category}
								openDialog={handleDialogOpen}
								// pass delete
							/>
						))}
					</div>

					<div className='reminder__buttons'>
						<Tooltip title='Go To Categories' placement='right-end'>
							<KeyboardReturnIcon
								style={{ color: '#3a3d44' }}
								className='reminder__buttons--hover'
								onClick={() => {
									localStorage.removeItem(
										'ACTIVE_CATEGORY_ID'
									);
									history.push('/categories');
								}}
							/>
						</Tooltip>
						<Tooltip
							title='Delete This Category'
							placement='left-end'
						>
							<DeleteIcon
								style={{ color: '#3a3d44' }}
								className='reminder__buttons--hover'
								onClick={() => setOpenDeleteDialog(true)}
							/>
						</Tooltip>

						<Dialog
							open={openDeleteDialog}
							onClose={() => setOpenDeleteDialog(false)}
							aria-labelledby='alert-dialog-title'
							aria-describedby='alert-dialog-description'
						>
							<div className='reminder__dialog'>
								<DialogTitle id='alert-dialog-title'>{`Delete category ${activeCategory.title} ?`}</DialogTitle>

								<div
									style={{
										justifyContent: 'space-evenly',
									}}
									className='reminder__dialogButtons'
								>
									<button
										style={{
											backgroundColor: '#fe5f55',
										}}
										onClick={() =>
											setOpenDeleteDialog(false)
										}
									>
										No
									</button>
									<button
										style={{
											backgroundColor: '#17b978',
										}}
										onClick={handleDeleteCategory}
									>
										Yes
									</button>
								</div>
							</div>
						</Dialog>
					</div>
				</div>
			) : (
				<>
					<ReminderSvg />
				</>
			)}
		</div>
	);
}
export default Reminder;
