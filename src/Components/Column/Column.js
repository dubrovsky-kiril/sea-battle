import React from 'react';
import './Column.css';

const getCellStyle = cellType => {
  switch(cellType) {
    case 3:
      return 'missed';
    case 4:
      return 'damaged';
    case 5:
      return 'sunk';
    default:
      return '';
  }
}

export const Column = ({ columnData, columnHeaderData, rowHeaderData }) => {
  return (
    <div className='column'>
      {columnHeaderData !== false
        ? <span className='rowHeader'>{columnHeaderData}</span>
        : null
      }
      {rowHeaderData !== false
        ? <span className='columnHeader'>{rowHeaderData}</span>
        : null
      }
      <div className={(`cell ${getCellStyle(columnData)}`).trim()} />
    </div>
  )
};
