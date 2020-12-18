import React, { useState } from 'react';
import './Card.css';
import { Button } from '@material-ui/core';
import AlarmIcon from '@material-ui/icons/Alarm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Card = ({
	title,
	category,
	text,
	date,
	id,
	onMarkComplete,
	onSnooze,
}) => {
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [reminderDate, setReminderDate] = useState(new Date());

	const handleCheck = () => {
		onMarkComplete({ id });
	};

	const handleSnooze = (date) => {
		const newDate = new Date(date);
		const year = newDate.getFullYear();
		const month = newDate.getMonth() + 1;
		const rDate = newDate.getDate();

		const updatedDate = year + '-' + month + '-' + rDate;
		setReminderDate(date);
		setShowDatePicker(false);
		onSnooze({ updatedDate, id });
	};

	return (
		<div className='card-container'>
			<div className='reminder-card'>
				<h1 className='c-title'>{category}</h1>
				<div className='reminder-details'>
					<div className='details'>
						<h3>{title}</h3>
						<p>{text}</p>
						<p>{date}</p>
					</div>
					<div className='actions'>
						<span>
							<input type='checkbox' onClick={handleCheck} />
							<label>Mark as complete</label>
						</span>
						{showDatePicker ? (
							<DatePicker
								selected={reminderDate}
								onChange={(date) => handleSnooze(date)}
							/>
						) : (
							<Button
								variant='contained'
								color='secondary'
								onClick={() => setShowDatePicker(true)}
							>
								<AlarmIcon />
								Snooze
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Card;
