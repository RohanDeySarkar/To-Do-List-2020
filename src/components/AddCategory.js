import React, { useState } from 'react';
import { Firebase } from '../Firebase';
import './AddCategory.css';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Dialog from '@material-ui/core/Dialog';

import { useStateValue } from './StateProvider';

import { DialogContent, DialogTitle, TextField } from '@material-ui/core';

function AddCategory() {
	const db = Firebase.firestore();
	const [{ categories }, dispatch] = useStateValue();

	const [open, setOpen] = useState(false);
	const [error, setError] = useState(false);
	const [errorName, setErrorName] = useState('category name cannot be empty');
	const [newCategory, setNewCategory] = useState('');

	// console.log(categories);
	// console.log(newCategory);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setError(false);
	};

	const handleChange = (e) => {
		setNewCategory(e.target.value);
		setError(false);
	};

	const handleSubmit = async (e) => {
		const user = Firebase.auth().currentUser;
		e.preventDefault();

		if (newCategory.length !== 0) {
			if (categories.includes(newCategory) == false) {
				const category = {
					title: newCategory,
					uid: user.uid,
					reminders: [],
				};
				await db
					.collection('categories')
					.add(category)
					.then((doc) => {
						category.id = doc.id;
					})
					.then((_) => {
						dispatch({
							type: 'CREATE_CATEGORY',
							payload: category,
						});
					})
					.catch((err) => {
						console.error(err);
					});

				setNewCategory('');
				setOpen(false);
			} else {
				setError(true);
				setErrorName('category already defined');
			}
		} else {
			setError(true);
			setErrorName('category name cannot be empty');
		}
	};

	return (
		<div className='addCategory'>
			<div className='addCategory__items'>
				<div className='addCategory__itemsIcon'>
					<AddCircleOutlineIcon onClick={handleOpen} />
				</div>

				<p>Add New Category</p>

				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby='form-dialog-title'
				>
					<div className='dialog'>
						<DialogTitle id='form-dialog-title'>
							Create New Category
						</DialogTitle>
						<DialogContent>
							<form onSubmit={handleSubmit}>
								<TextField
									error={error}
									helperText={error ? errorName : null}
									autoFocus
									margin='dense'
									label='Category Name'
									type='text'
									fullWidth
									value={newCategory}
									onChange={handleChange}
								/>

								<div className='dialog__buttons'>
									<button
										style={{ backgroundColor: '#fe5f55' }}
										type='button'
										onClick={handleClose}
									>
										close
									</button>
									<button
										style={{ backgroundColor: '#17b978' }}
										type='submit'
										onClick={handleSubmit}
									>
										create
									</button>
								</div>
							</form>
						</DialogContent>
					</div>
				</Dialog>
			</div>
		</div>
	);
}

export default AddCategory;
