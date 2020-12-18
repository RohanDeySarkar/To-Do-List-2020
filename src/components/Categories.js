import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Firebase } from '../Firebase';

import AddCategory from './AddCategory';
import './Categories.css';
import ExistingCategory from './ExistingCategory';

import { useStateValue } from './StateProvider';

function Categories() {
	const history = useHistory();
	const [{ categories }, dispatch] = useStateValue();

	useEffect(() => {
		const db = Firebase.firestore();

		const token = localStorage.getItem('TOKEN');
		if (token === null) {
			history.push('/login');
		}

		const uid = localStorage.getItem('ID');
		db.collection('categories')
			.where('uid', '==', uid)
			.get()
			.then((data) => {
				let categories = [];
				data.docs.forEach((doc) => {
					let category = {
						title: doc.data()['title'],
						uid: doc.data()['uid'],
						cid: doc.id,
					};
					categories.push(category);
				});
				dispatch({
					type: 'UPDATE_CATEGORIES',
					payload: categories,
				});
			});
	}, [dispatch, history]);

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

			{categories?.map((category, index) => (
				<ExistingCategory
					key={index}
					name={category.title}
					cid={category.cid}
					uid={category.uid}
				/>
			))}
		</div>
	);
}

export default Categories;
