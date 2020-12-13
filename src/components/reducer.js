export const initialState = {
	// categories: ["food", "music", "shoes", "series"],
	categories: [],
	reminders: [
		// {
		//     category: "food",
		//     id: 1,
		//     title: "sunday lunch",
		//     text: "on kfc",
		//     time: "11:30",
		//     date: "10-08-2020"
		// },
	],
	activeCategory: {
		title: '',
		cid: '',
		uid: '',
	},
	editId: 0,
	editTitle: '',
	editText: '',
};

const reducer = (state, action) => {
	// console.log(action);
	// console.log(state);

	switch (action.type) {
		case 'CREATE_CATEGORY':
			return {
				...state,
				categories: [...state.categories, action.payload],
				// delete if needed !!!
				activeCategory: action.payload,
			};

		case 'ACTIVE_CATEGORY':
			return {
				...state,
				activeCategory: action.payload,
			};

		case 'ADD_REMINDER':
			return {
				...state,
				reminders: [action.payload, ...state.reminders],
			};

		case 'UPDATE_REMINDERS':
			return {
				...state,
				reminders: action.payload,
			};

		case 'UPDATE_CATEGORIES':
			return {
				...state,
				categories: action.payload,
			};

		case 'EDIT_REMINDER':
			return {
				...state,
				editId: action.payload.id,
				editTitle: action.payload.title,
				editText: action.payload.text,
			};
		default:
			return state;
	}
};

export default reducer;
