require('./App.css');
const React = require('react');
const { PureComponent } = require('react');
const map = require('lodash/fp/map').convert({ 'cap': false });
const isEqual = require('lodash/fp/isEqual');
const flatten = require('lodash/fp/flatten');
const uniqWith = require('lodash/fp/uniqWith');
const filter = require('lodash/fp/filter').convert({ 'cap': false });
const differenceWith = require('lodash/fp/differenceWith');
const reduce = require('lodash/fp/reduce');
const { getRandomNumberInRange, getIterator } = require('./helpers');
const { getCellsAroundCell, get_I_ShipDirections, get_L_ShipDirections } = require('./coordinatesGetters');
const { Row } = require('./Row');
const { Input } = require('./Input');

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.fieldSize = 10;
    this.cellDesignations = {
      default: 0,
      ship: 1,
      reserved: 2,
      missedShot: 3,
      damagedShot: 4,
      sunkShip: 5
    };
    this.numberOfShipsToMount = {
      dot: 2,
      I: 1,
      L: 1
    };
    // this.ships = {
    //   dot: {
    //     type: 'dot',
    //     count: 2,
    //     coordinates: []
    //   },
    //   I: {
    //     type: 'I',
    //     count: 1,
    //     coordinates:[]
    //   },
    //   L: {
    //     type: 'L',
    //     count: 1,
    //     coordinates:[]
    //   }
    // };
    this.state = {
      field: null
    };
  }

  getFieldRange = field => ({min: 0, max: field.length - 1})

  getField = (fieldSize, defaultCell) => Array(fieldSize).fill(Array(fieldSize).fill(defaultCell));

  pickADefaultCell = field => {
    const fieldRange = this.getFieldRange(field);
    const rowCoordinate = getRandomNumberInRange(fieldRange.min, fieldRange.max);
    const columnCoordinate = getRandomNumberInRange(fieldRange.min, fieldRange.max);
    const isCellDefault = field[rowCoordinate][columnCoordinate] === 0;

    if (isCellDefault)
      return [[rowCoordinate, columnCoordinate]];
    else
      return this.pickADefaultCell(field);
  }

  isNotOutsideField = (coordinate, fieldRange) => coordinate >= fieldRange.min && coordinate <= fieldRange.max;

  sieveDefaultCells = (field, reservedCell) => cellsToSieve => {
    const fieldRange = this.getFieldRange(field);
    const isInsideField = cell => this.isNotOutsideField(cell[0], fieldRange) && this.isNotOutsideField(cell[1], fieldRange);
    const isNotReserved = cell => field[cell[0]][cell[1]] !== reservedCell;

    const cellsInsideField = filter(isInsideField, cellsToSieve);
    const defaultCells = filter(isNotReserved, cellsInsideField);

    return defaultCells;
  };

  pickADirection = (directions, field, sieveCellsAcrossField) => {
    const hasDirections = directions.length > 0;

    if (hasDirections) {
      const directionToPick = getRandomNumberInRange(0, directions.length - 1);
      const pickedDirection = directions[directionToPick];
      const validLength = pickedDirection.length;
      const defaultCells = sieveCellsAcrossField(pickedDirection);
      const isValidDirection = defaultCells.length === validLength;

      if (isValidDirection) {
        return defaultCells;
      } else {
        const removeNotValidDirection = (direction, index) => index !== directionToPick;

        return this.pickADirection(filter(removeNotValidDirection, directions), field, sieveCellsAcrossField);
      }
    } else {
      return undefined;
    }
  }

  findADirection = (defaultCellGetter, directionsGetter, field, sieveCellsAcrossField) => {
    const directions = directionsGetter(defaultCellGetter());
    const direction = this.pickADirection(directions, field, sieveCellsAcrossField);
    const isDirectionDefined = direction !== undefined;

    if (isDirectionDefined)
      return direction;
    else
      return this.findADirection(defaultCellGetter, directionsGetter, field, sieveCellsAcrossField);
  };

  placeCellsOnField = (cells, field, placer) => reduce(placer, field, cells);

  placeOnField = cellDeisgnation => (field, cell) => {
    return map((row, index) => {
        if (index === cell[0]) {
          return map((column, index) => {
            if (index === cell[1])
              column = cellDeisgnation;

            return column;
          }, row)
        }

        return row;
      }, field);
  };

  mountShips = (times, cellDesignations, field, directionsGetter = x => [x]) => {
    if (times > 0) {
      const defaultCellGetter = () => this.pickADefaultCell(field);
      const sieveCellsAcrossField = this.sieveDefaultCells(field, cellDesignations.reserved);

      const shipCells = this.findADirection(defaultCellGetter, directionsGetter, field, sieveCellsAcrossField);
      const newFieldWithShipCells = this.placeCellsOnField(shipCells, field, this.placeOnField(cellDesignations.ship));
      const reservedCells = differenceWith(isEqual, uniqWith(isEqual, flatten(map(sieveCellsAcrossField, map(getCellsAroundCell, shipCells)))), shipCells);
      const newFieldWithReservecCells = this.placeCellsOnField(reservedCells, newFieldWithShipCells, this.placeOnField(cellDesignations.reserved));

      return this.mountShips(times - 1, cellDesignations, newFieldWithReservecCells, directionsGetter);
    } else {
      return field;
    }
  }

  add_Dot_Ships = field => this.mountShips(this.numberOfShipsToMount.dot, this.cellDesignations, field);
  add_I_Ships = field => this.mountShips(this.numberOfShipsToMount.I, this.cellDesignations, field, get_I_ShipDirections);
  add_L_Ships = field => this.mountShips(this.numberOfShipsToMount.L, this.cellDesignations, field, get_L_ShipDirections);

  componentDidMount() {
    this.setState({field: this.add_L_Ships(this.add_I_Ships(this.add_Dot_Ships(this.getField(this.fieldSize, this.cellDesignations.default))))})
  }

  fire = e => {
    e.preventDefault();

    const rowToFire = e.target.row.value;
    const columnToFire = e.target.column.value

    if (rowToFire && columnToFire) {
      if (this.isNotOutsideField(rowToFire, this.getFieldRange(this.state.field)) && this.isNotOutsideField(columnToFire, this.getFieldRange(this.state.field))) {
        const fieldCopy = [...this.state.field];
        const shot = fieldCopy[rowToFire][columnToFire]

        switch(shot) {
          case 0:
            this.setState({field: [...fieldCopy, ...fieldCopy[rowToFire][columnToFire] = 3]})
            break;
          case 1:
            this.setState({field: [...fieldCopy, ...fieldCopy[rowToFire][columnToFire] = 4]})
            break;
          case 2:
            this.setState({field: [...fieldCopy, ...fieldCopy[rowToFire][columnToFire] = 3]})
            break;
          case 3 || 4 || 5:
            alert('You already shot these coordinates')
            break;
          default:
            break;
        }
      } else {
        alert(`Coordinates are outside of field range! You should enter coordinates in range from ${this.getFieldRange(this.state.field).min} to ${this.getFieldRange(this.state.field).max}`)
      }
      e.target.row.value = '';
      e.target.column.value = '';
    } else {
      alert('You should fill coordinates before firing!')
    }
  }

  render() {
    const { field } = this.state;
    const isFieldReady = !!field;

    const rowHeaderIterator = getIterator();
    const columnHeaderIterator = getIterator();

    console.log(field);

    return (
      <div className="container">
        <h1>Test your luck against <u>mighty computer</u></h1>
        <div className='field'>
          {isFieldReady && field.map((rowData, index) => (
            <Row
              key={index}
              isColumnHeader={index === 0}
              rowData={rowData}
              rowHeaderIterator={rowHeaderIterator}
              columnHeaderIterator={columnHeaderIterator}
            />
          ))}
        </div>
        <form className='navigation' onSubmit={this.fire}>
          <Input title='Row'/>
          <Input title='Column'/>
          <button>Fire!</button>
        </form>
      </div>
    );
  }
}

export default App;