import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import AddCategory from './AddCategory';
import './Categories.css';
import ExistingCategory from './ExistingCategory';

import { useStateValue } from './StateProvider';

function Categories() {
	const history = useHistory();

	useEffect(() => {
		const token = localStorage.getItem('TOKEN');
		if (token === null) {
			history.push('/login');
		}
	}, []);

	const [{ categories }, dispatch] = useStateValue();

	// console.log({categories});

	const categoriesLength = Object.keys(categories).length;

	// console.log("length", categoriesLength);

	return (
		<div
			className={`${categoriesLength === 0 && 'single'} ${
				categoriesLength !== 0 && 'categories'
			}`}
		>
			<AddCategory />

			{categories?.map((category) => (
				<ExistingCategory name={category} />
			))}
		</div>
	);
}

export default Categories;
