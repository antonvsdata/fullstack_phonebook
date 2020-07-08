import React from 'react'

const Filter = ({ value, changer }) => {
  return (
    <div>
      <span>filter shown with </span>
      <input value={value} onChange={changer} />
    </div>
  )
}

export default Filter
