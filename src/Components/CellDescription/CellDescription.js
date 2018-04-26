import React from 'react';
import './CellDescription.css'

export const CellDescription = ({ label }) => (
  <div className='cell-description'>
    <div className={`cell ${label ? label : ''}`.trim()} />
    <div className='label'><i>{`— ${label} cell`}</i></div>
  </div>
);
