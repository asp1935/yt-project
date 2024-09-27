/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import PropTypes from 'prop-types';
function ReadMore({ children }) {
    const [readMore, setReadMore] = useState(false);
    const toggleReadMore = () => {
        setReadMore(prev => !prev);
    }

    return (

        <div>
            <div className={`transition-all ease-in-out duration-500 cursor-pointer break-words ${readMore ? 'max-h-full' : 'max-h-[5rem] overflow-hidden'}`}
                onClick={toggleReadMore}>
                {children}
            </div>
            <button onClick={toggleReadMore} className='outline-none font-medium'>
                {readMore?'Show Less':'...More'}
            </button>
        </div>
    )
}
ReadMore.propTypes={
    children:PropTypes.node,
}
export default ReadMore
