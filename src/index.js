import React from "react";
import ReactDOM from "react-dom";

import { DataSet } from "./data";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
class Field extends React.Component {
  constructor(props) {
    super(props);
    console.log("Buduję stary komponent");
  }

  // console.log(props.colorForVariance);
  render() {
    var readOnly = "editable" in this.props ? false : true;
    return (
      <li>
        <span>{this.props.label}</span>
        <span>
          <input
            id={this.props.id}
            type="text"
            readOnly={readOnly}
            value={this.props.value}
            onChange={this.props.onChangeValue}
            style={{
              color: this.props.colorForVariance
                ? this.props.colorForVariance()
                : "black"
            }}
          />
        </span>
      </li>
    );
  }
}

// Field with Controler
class ColorfullField extends React.Component {
  constructor(props) {
    console.log("Buduję nowy komponent");
    super(props);
    this.readOnly = "editable" in props ? false : true;
    this.state = {
      value: this.props.value
    };
  }

  getColorClass = e => {
    if (this.state.value < 0) {
      return "too-low";
    }
    if (this.state.value > 0) {
      return "too-high";
    }

    return "";
  };

  onChange = e => {
    // console.log(e);
    const newValue = e.target.value;
    if (!isNaN(newValue) || newValue === "-") {
      this.setState({
        value: newValue
      });
    }
  };

  render() {
    return (
      <li>
        <span>{this.props.label}</span>
        <span>
          <input
            className={this.getColorClass()}
            id={this.props.id}
            type="text"
            readOnly={this.readOnly}
            value={this.state.value}
            onChange={this.onChange}
          />
        </span>
      </li>
    );
  }
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
            <ColorfullField
              id="input-expected"
              label="Różnica"
              value={s.value - s.expected}
            />
            <Field
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
    station.value = v;
    console.log("Akuku: ", v);
    this.setState({ data: this.state.data });
  };

  // updateColor = () => {
  //   var e = document.getElementById("input-expected");
  //   if (e) {
  //     //var v = parseInt(e.value);
  //     e.style.color = this.getColorForVariance();
  //   }
  // };

  // getColorForVariance = () => {
  //   var v = this.state.selected.value - this.state.selected.expected;
  //   console.log(v);
  //   return v >= 0 ? "green" : "red";
  // };

  componentDidMount() {
    //this.updateColor();
  }

  componentDidUpdate() {
    //this.updateColor();
  }

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
                // colorForVariance={this.getColorForVariance}
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
      <ColorfullField editable />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
