import React from 'react'

const RankNumber = ({ number }) => {
  return (
    <svg 
        className="top-ten__rank"
        viewBox='0 0 160 220'
        aria-label={`Rank ${number}`}
        >
        <text
            x="50%"
            y="82%"
            textAnchor="middle"
            className='top-ten__rank-text'
        >
            {number}
        </text>
    </svg>
  )
}

export default RankNumber