import React from 'react';

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
      <div className={`cell`} />
    </div>
  )
};
