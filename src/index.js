import React from "react";
import ReactDOM from "react-dom";
import Scooters from './components/Scooters'

const Index = () => {
  return <article className='container'>
    <div className='row'>
      <div className='col-10 offset-1'>
        <Scooters/>
      </div>
    </div>
  </article>;
};

ReactDOM.render(<Index />, document.getElementById("index"));
