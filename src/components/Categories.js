import React from 'react';
import AddCategory from './AddCategory';
import './Categories.css';
import ExistingCategory from './ExistingCategory';

import {useStateValue} from './StateProvider';

function Categories() {

    const [{categories}, dispatch] = useStateValue();

    // console.log({categories});

    const categoriesLength = Object.keys(categories).length;

    // console.log("length", categoriesLength);

    return (
        <div 
            className={`${categoriesLength === 0 && "single"} ${categoriesLength !== 0 && "categories"}`}
        >
            <AddCategory />
            
            {categories?.map((category) => 
                <ExistingCategory name={category} />
            )}
        </div>
    )
}

export default Categories
