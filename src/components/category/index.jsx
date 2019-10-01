import React, {useState} from 'react'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import TextField from '@material-ui/core/TextField'

import './index.scss'
import MenuItem from "@material-ui/core/MenuItem";

export const Category = ({categories, category, selectCategory, searchEvent}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [filterCategory, setFilterCategory] = useState("All")

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose(title) {
        setAnchorEl(null);
        if (!(title instanceof Object))
            setFilterCategory(title)
    }


    return (
        <div
            className="category-container"
            role="tablist"
            id="category"
        >
            <Button className="filter-button" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                {filterCategory}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    aria-selected={category === "All" ? 'true' : 'false'}
                    onClick={() => {
                        selectCategory("All")
                        handleClose("All")
                    }}>All</MenuItem>

                {categories.map((item, idx) => (
                    <MenuItem
                        key={idx}
                        aria-selected={category === item ? 'true' : 'false'}
                        onClick={() => {
                            selectCategory(item)
                            handleClose(item)
                        }}>{item}</MenuItem>
                ))}
            </Menu>
            <TextField
                id="standard-search"
                className="search-filter"
                label="Search"
                type="search"
                margin="normal"
                onChange={searchEvent('Search')}
            />
        </div>
    )
}

/*
<Item title={'All'} category={category} selectCategory={selectCategory} handleClose={handleClose}/>
{categories.map((item, idx) => (
    <Item
        key={idx}
        title={item}
        category={category}
        selectCategory={selectCategory}
        handleClose={handleClose}
    />
))}*/


/*
*   <ul
      className="category-container"
      role="tablist"
      id="category"
      style={{
        margin: `0 -${rhythm(3 / 4)}`,
      }}
    >
      <Item title={'All'} category={category} selectCategory={selectCategory} />
      {categories.map((item, idx) => (
        <Item
          key={idx}
          title={item}
          category={category}
          selectCategory={selectCategory}
        />
      ))}
    </ul>
* */