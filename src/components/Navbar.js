import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Navbar.css';

import { Firebase } from '../Firebase';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
}));

function Navbar({ title }) {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();

	const [open, setOpen] = useState(false);
	const [name, setName] = useState('user');
	const [imageUrl, setImageUrl] = useState('');

	useEffect(() => {
		setImageUrl(localStorage.getItem('PHOTO_URL'));
		setName(localStorage.getItem('DISPLAY_NAME'));
	}, []);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const logout = async () => {
		await Firebase.auth()
			.signOut()
			.then((_) => {
				localStorage.clear();

				history.push('/login');
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<div className='navbar'>
			<div className='navbar__items'>
				<MenuIcon
					className='navbar__itemsIcon'
					onClick={handleDrawerOpen}
				/>

				<h1>{title}</h1>
			</div>

			<Drawer
				className={classes.drawer}
				variant='persistent'
				anchor='left'
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className='navbar__drawer'>
					<div className={classes.drawerHeader}>
						<IconButton onClick={handleDrawerClose}>
							<div className='navbar__drawerIcon'>
								{theme.direction === 'ltr' ? (
									<ChevronLeftIcon />
								) : (
									<ChevronRightIcon />
								)}
							</div>
						</IconButton>
					</div>

					<div className='navbar__user'>
						{imageUrl === null ? (
							<Avatar />
						) : (
							<img
								src={imageUrl}
								alt='user avatar'
								className='user-image'
							/>
						)}
						<p>{name}</p>
					</div>

					<div className='navbar__links' onClick={handleDrawerClose}>
						<Link to='/'>Home</Link>
						<Link to='/categories'>Categories</Link>
						<Link to='/reminder'>Reminders</Link>
					</div>

					<div className='navbar__logout'>
						<button onClick={logout}>
							<h3>Log out</h3>
						</button>
					</div>
				</div>
			</Drawer>
		</div>
	);
}

export default Navbar;
