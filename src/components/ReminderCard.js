import React from 'react';
import './ReminderCard.css';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { Tooltip } from '@material-ui/core';

import { useStateValue } from './StateProvider';

function ReminderCard({ id, title, text, time, date, openDialog }) {
	const [{ reminders }, dispatch] = useStateValue();

	const handleEdit = () => {
		dispatch({
			type: 'EDIT_REMINDER',
			payload: { id: id, title: title, text: text },
		});

		openDialog();
	};

	const handleDelete = () => {
		var updatedReminders = reminders.filter(function (reminder) {
			return reminder.id !== id;
		});

		dispatch({
			type: 'UPDATE_REMINDERS',
			payload: updatedReminders,
		});
	};

	return (
		<div className='card'>
			<div className='card__left'>
				<h1>{title}</h1>
				{/* <TextTruncate 
                    line={1}
                    element="p"
                    truncateText="  ..."
                    text={text}
                    textTruncateChild={<a href="#">Read more</a>}
                /> */}
				<p>{text}</p>
			</div>

			<div className='card__right'>
				<div className='card__rightText'>
					<p>{date}</p>
					<p>{time}</p>
				</div>

				<div className='card__rightIcons'>
					<Tooltip title='Delete Reminder' placement='left-end'>
						<DeleteIcon
							style={{ color: '#e53935' }}
							className='card__rightIcons--hover'
							onClick={handleDelete}
						/>
					</Tooltip>
					<Tooltip title='Edit Reminder' placement='right-end'>
						<EditIcon
							style={{ color: '#0d8549' }}
							className='card__rightIcons--hover'
							onClick={handleEdit}
						/>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}

export default ReminderCard;
