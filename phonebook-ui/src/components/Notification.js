import React from "react";

const info = {
  color: 'green',
  background: 'lightgrey',
  fontSize: '20px',
  borderStyle: 'solid',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '10px'
};

const error = {
  color: 'red',
  background: 'lightgrey',
  fontSize: '20px',
  borderStyle: 'solid',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '10px'
};

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }

  return <div style={isError ? error : info}>{message}</div>;
};

export default Notification