import React from 'react'

const Message = ({ message, color }) => {
  if (message === null) {
    return null
  }

  const msgStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={msgStyle}>{message}</div>
}

export default Message
