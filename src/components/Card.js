import React from 'react';
import './Card.css';

const Card = ({ title, category, text, date, id }) => {
	return (
		<div className='card-container'>
			<div className='reminder-card'>
				<h1>{category}</h1>
				<h3>{title}</h3>
				<p>{text}</p>
				<p>{date}</p>
			</div>
		</div>
	);
};

export default Card;
