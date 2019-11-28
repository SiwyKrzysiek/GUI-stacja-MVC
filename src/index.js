import React from "react";
import ReactDOM from "react-dom";

import { DataSet } from "./data";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

function Field(props) {
  console.log(props.colorForVariance);
  var readOnly = "editable" in props ? false : true;
  return (
    <li>
      <span>{props.label}</span>
      <span>
        <input
          id={props.id}
          type="text"
          readOnly={readOnly}
          value={props.value}
          onChange={props.onChangeValue}
        />
      </span>
    </li>
  );
}

// Field with Controler
function ColoredField(props) {
  const readOnly = "editable" in props ? false : true;

  const getColorClass = value => {
    if (value < 0) return "too-low";
    if (value > 0) return "too-high";
    return "";
  };

  return (
    <li>
      <span>{props.label}</span>
      <span>
        <input
          id={props.id}
          type="text"
          readOnly={readOnly}
          value={props.value}
          onChange={props.onChangeValue}
          className={getColorClass(props.value)}
        />
      </span>
    </li>
  );
}

function Station(props) {
  let s = props.station;
  return (
    <div>
      {s === undefined ? (
        <div>Wybierz stację.</div>
      ) : (
        <form>
          <ul>
            <Field label="Identyfikator" value={s.name} />
            <Field label="Data" value={s.date} />
            <Field label="Oczekiwana" value={s.expected} />
            <Field
              label="Wartość"
              onChangeValue={e => {
                props.onChangeValue(s, e);
              }}
              value={s.value}
              editable
            />
            <ColoredField
              id="input-expected"
              label="Różnica"
              value={s.value - s.expected}
              colorForVariance={props.colorForVariance}
            />
          </ul>
        </form>
      )}
    </div>
  );
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: DataSet,
      selected: undefined
    };
  }

  selected = e => {
    var id = e.target.value;
    for (let idx in this.state.data.stations) {
      var s = this.state.data.stations[idx];
      if (s.id === parseInt(id, 10)) {
        this.setState({ selected: s });
        return;
      }
    }
  };

  onChangeValue = (station, e) => {
    console.log(station);
    let v = e.target.value;
    if (isNaN(v)) return;

    station.value = v;
    // console.log("Akuku: ", v);
    this.setState({ data: this.state.data });
  };

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-4">
              <select name="stations" multiple onChange={this.selected}>
                {this.state.data.stations.map((s, idx) => {
                  return (
                    <option key={idx} value={s.id}>
                      {s.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-4">
              <Station
                onChangeValue={this.onChangeValue}
                station={this.state.selected}
                colorForVariance={this.getColorForVariance}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <h1>Mapa stacji bazowych</h1>

      <Form />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
