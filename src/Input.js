import React from 'react';

export const Input = ({ title }) => (
  <div className='input'>
    <label>{title}:</label>
    <input type='number' name={title.toLowerCase()} />
  </div>
);
