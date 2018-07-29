// Refererd Links
// Pagination: https://stackoverflow.com/questions/40232847/how-to-implement-pagination-in-reactjs

import React from 'react';
import classNames from 'classnames'

export default class Scooters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scooters: [],
      filteredScooters: [],
      filter: {
        model: '',
        energy_level_min: 0,
        energy_level_max: 100
      },
      currentPage: 1,
      scootersPerPage: 10,
      updatedAt: new Date()
    }
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.refreshInterval = setInterval(() => {
      this.fetchScooters();
      this.setState({
        updatedAt: new Date()
      })
    }, 10000);
  }

  componentDidMount() {
    this.fetchScooters();
  }

  fetchScooters() {
    fetch('https://qc05n0gp78.execute-api.eu-central-1.amazonaws.com/prod/scooters')
      .then((res) => {
        res.json().then((body) => {
          this.setState({
            scooters: body.data.scooters,
            filteredScooters: body.data.scooters
          });
          this.filter();
        })
      });
  }

  handleFilterChange(event) {
    const { filter } = this.state;
    filter[event.target.name] = event.target.value;
    this.filter();
  }

  filter() {
    const { scooters, filter } = this.state;
    var filteredScooters = scooters.filter(({ model, energy_level })=> {
      return (filter.model === '' || model === filter.model)
        && energy_level >= filter.energy_level_min
        && energy_level <= filter.energy_level_max;
    });
    this.setState({ filteredScooters })
    this.handlePageChange(1);
  }

  handlePageChange(number) {
    this.setState({
      currentPage: Number(number)
    });
  }

  render() {
    const { filteredScooters, filter, currentPage, scootersPerPage, updatedAt } = this.state;
    // Logic for pagination
    const indexOfLastScooter = currentPage * scootersPerPage;
    const indexOfFirstScooter = indexOfLastScooter - scootersPerPage;
    const currentScooters = filteredScooters.slice(indexOfFirstScooter, indexOfLastScooter);

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredScooters.length / scootersPerPage); i++) {
      pageNumbers.push(i);
    }

    return <article>
      <form className="form-inline my-3">

        <div className="input-group">
          <div className="input-group-prepend">
            <label className="input-group-text" htmlFor="model">Model</label>
          </div>
          <select id='model' className="custom-select" name='model' value={filter.model} onChange={this.handleFilterChange}>
            <option value=''>All</option>
            <option value='Gogoro 1st edition'>Gogoro 1st edition</option>
            <option value='Gogoro 2nd edition'>Gogoro 2nd edition</option>
          </select>
        </div>

        <div className="input-group ml-3">
          <div className="input-group-prepend">
            <label className="input-group-text" htmlFor="energy_level-min">Battery Level</label>
          </div>
          <input type="number" id='energy_level-min' aria-label="Battery Level Min" className="form-control" placeholder='Min' min='0' max='100' value={filter.energy_level_min} name='energy_level_min' onChange={this.handleFilterChange} />
          <input type="number" aria-label="Battery Level Max" className="form-control" placeholder='Max' min='0' max='100' value={filter.energy_level_max} name='energy_level_max' onChange={this.handleFilterChange} />
        </div>

        <small className='ml-auto'>Updated at {updatedAt.toTimeString()}</small>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Scooter</th>
            <th scope="col">Model</th>
            <th scope="col">Energy Level</th>
          </tr>
        </thead>
        <tbody>
          {
            currentScooters.map(({id, license_plate, model, energy_level}) => {
              return <tr key={id}>
                <th scope="row">{id}</th>
                <td>{license_plate}</td>
                <td>{model}</td>
                <td>{energy_level}</td>
              </tr>
            })
          }
        </tbody>
      </table>

      <nav aria-label="Scooters Pagination">
        <ul className="pagination pagination-sm justify-content-center flex-wrap">
          <li className={classNames('page-item my-1', currentPage === 1 ? 'disabled' : '')}>
            <a className="page-link" aria-label="Previous" onClick={this.handlePageChange.bind(this, currentPage - 1)}>
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </a>
          </li>
          {
            pageNumbers.map((number) => {
              return <li key={number} className={classNames('page-item my-1', currentPage === number ? 'active': '')}>
                <a className="page-link" onClick={this.handlePageChange.bind(this, number)}>{number}</a>
              </li>
            })
          }
          <li className={classNames('page-item my-1', currentPage === pageNumbers.length ? 'disabled' : '')}>
            <a className="page-link" aria-label="Next" onClick={this.handlePageChange.bind(this, currentPage + 1)}>
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>

    </article>;
  }
}
