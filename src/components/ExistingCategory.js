import React from 'react';
import './ExistingCategory.css';

import CategoryIcon from '@material-ui/icons/Category';
import { useHistory } from 'react-router-dom';

import { useStateValue } from './StateProvider';

function ExistingCategory({ name, cid, uid }) {
	const category = {
		title: String(name),
		cid: String(cid),
		uid: String(uid),
	};

	const [{}, dispatch] = useStateValue();

	const history = useHistory();

	const handleClick = () => {
		dispatch({
			type: 'ACTIVE_CATEGORY',
			payload: category,
		});

		history.push('/reminder');
	};

	return (
		<div className='exCategory' onClick={handleClick}>
			<div className='exCategory__items'>
				<div className='exCategory__itemsIcon'>
					<CategoryIcon />
				</div>

				<p>{name}</p>
			</div>
		</div>
	);
}

export default ExistingCategory;
