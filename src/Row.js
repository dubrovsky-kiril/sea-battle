import React from 'react';
import { Column } from './Column';

export const Row = ({ rowData, isColumnHeader, rowHeaderIterator, columnHeaderIterator}) => {
  return (
    <div className='row'>
      {rowData.map((columnData, index) => (
        <Column
          key={index}
          columnData={columnData}
          columnHeaderData={isColumnHeader && rowHeaderIterator()}
          rowHeaderData={index === 0 && columnHeaderIterator()}
        />
      ))}
    </div>
  )
};
