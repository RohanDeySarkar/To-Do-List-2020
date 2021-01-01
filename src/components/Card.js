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
	const [remark, setRemark] = useState('');
	const [updatedDate, setUpdatedDate] = useState('');

	const handleCheck = () => {
		const action = 'complete';
		onMarkComplete({ id, action });
	};

	const handleSnooze = (date) => {
		const newDate = new Date(date);
		const year = newDate.getFullYear();
		const month = newDate.getMonth() + 1;
		const rDate = newDate.getDate();

		var snoozeDate;
		if (rDate < 10) {
			snoozeDate = '0' + rDate;
		} else {
			snoozeDate = rDate;
		}

		var newMonth;
		if (month < 10) {
			newMonth = '0' + month;
		} else {
			newMonth = month;
		}

		const updateDate = year + '-' + newMonth + '-' + snoozeDate;
		setReminderDate(date);
		setUpdatedDate(updateDate);
	};

	const handleConfirm = () => {
		setShowDatePicker(false);
		const action = 'snooze';
		onSnooze({ remark, updatedDate, id, action });
		setRemark('');
	};

	const handleCancel = () => {
		setShowDatePicker(false);
		setRemark('');
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
							<div className='snooze'>
								<DatePicker
									selected={reminderDate}
									onChange={(date) => handleSnooze(date)}
								/>
								<label>Remark</label>
								<input
									type='text'
									value={remark}
									onChange={(e) => setRemark(e.target.value)}
								/>
								<div className='buttons'>
									<Button
										variant='contained'
										color='primary'
										onClick={handleConfirm}
									>
										Confirm
									</Button>
									<Button
										variant='outlined'
										color='secondary'
										onClick={handleCancel}
									>
										Cancel
									</Button>
								</div>
							</div>
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
