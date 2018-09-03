import {tempToF} from './mathfunctions';

export class TempDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMode: 'C'
    }
    this.handleTempUnitClick = this.handleTempUnitClick.bind(this);
  }

  handleTempUnitClick() {
    if (this.state.displayMode === 'C') {
      this.setState({displayMode: 'F'});
    } else {
      this.setState({displayMode: 'C'});
    }
  }

  render() {
    return (
      <div className="same-line">
        <table>
          <tbody>
            <tr>
              <td>
                <img src={"./static/weather_icons/" + this.props.weathericon + ".svg"} alt="current weather icon"/>
              </td>
              <td onClick={this.handleTempUnitClick}>                
                <p className="temperature">{(this.state.displayMode === 'C' ? this.props.temperature : tempToF(this.props.temperature)).toFixed(1)}</p>
                <p style={{verticalAlign: 'top', transform: 'translateY(10px)'}}>°{this.state.displayMode}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default TempDisplay;
