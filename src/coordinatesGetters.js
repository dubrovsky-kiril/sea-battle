const getCellsAroundCell = ([ R, C ]) => ([
  [ R, C - 1], [ R, C + 1 ],
  [ R - 1, C], [ R + 1, C ],
  [ R - 1, C - 1 ], [ R + 1, C + 1],
  [ R + 1, C - 1 ], [ R - 1, C + 1]
]);

const get_I_ShipDirections = ([[ R, C ]]) => ([
  [[ R, C ], [ R + 1, C ], [ R + 2, C ], [ R + 3, C ]],
  [[ R, C ], [ R - 1, C ], [ R - 2, C ], [ R - 3, C ]],
  [[ R, C ], [ R, C + 1 ], [ R, C + 2 ], [ R, C + 3 ]],
  [[ R, C ], [ R, C - 1 ], [ R, C - 2 ], [ R, C - 3 ]]
]);

const get_L_ShipDirections = ([[ R, C ]]) => ([
  [[ R, C ], [ R + 1, C ], [ R + 2, C ], [ R + 2, C - 1 ]],
  [[ R, C ], [ R + 1, C ], [ R + 2, C ], [ R + 2, C + 1 ]],
  [[ R, C ], [ R - 1, C ], [ R - 2, C ], [ R - 2, C - 1 ]],
  [[ R, C ], [ R - 1, C ], [ R - 2, C ], [ R - 2, C + 1 ]],
  [[ R, C ], [ R, C + 1 ], [ R, C + 2 ], [ R - 1, C + 2 ]],
  [[ R, C ], [ R, C + 1 ], [ R, C + 2 ], [ R + 1, C + 2 ]],
  [[ R, C ], [ R, C - 1 ], [ R, C - 2 ], [ R - 1, C - 2 ]],
  [[ R, C ], [ R, C - 1 ], [ R, C - 2 ], [ R + 1, C - 2 ]]
]);

module.exports = {
  getCellsAroundCell,
  get_I_ShipDirections,
  get_L_ShipDirections
};
