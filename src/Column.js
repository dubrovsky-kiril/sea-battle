import React from 'react';

export const Column = ({ columnData, columnHeaderData, rowHeaderData }) => {
  return (
    <div className='column'>
      {columnHeaderData !== false
        ? <div className='rowHeader'>{columnHeaderData}</div>
        : null
      }
      {rowHeaderData !== false
        ? <div className='columnHeader'>{rowHeaderData}</div>
        : null
      }
      <div className={`cell`} />
    </div>
  )
};
