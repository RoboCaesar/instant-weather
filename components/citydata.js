import {apikey} from './apikey.json';
import {getCountryName} from './countrylist';

function giveDirection(degrees) {
    let adjustedDegrees = degrees + 11.25; //Adjusting the degrees makes it easier to get the direction.
    if (adjustedDegrees > 360) adjustedDegrees -= 360;
    let directions = [
        'N', 'NNE', 'NE',
        'ENE', 'E', 'ESE',
        'SE', 'SSE', 'S',
        'SSW', 'SW', 'WSW',
        'W', 'WNW', 'NW', 'NNW'
    ];

    let directionIndex = Math.floor(adjustedDegrees/22.50);

    return directions[directionIndex];
}

export class CityData extends React.Component {
    constructor() {
        console.log("Hello!!!");
        super();
        this.state= {
            currentCity: "Ho Chi Minh City",
            error: null,
            isLoaded: false,
            cityData: [],
            backgroundType: 'default-color'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({currentCity: event.target.value});
      }

    handleSubmit(event) {
        this.setState({isLoaded: false});
        console.log("Loading the data of: " + event.target.value);
        this.loadCityData(this.state.currentCity);
        event.preventDefault();
    }

    loadCityData(cityName) {
        fetch('http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apikey)
        //('http://api.openweathermap.org/data/2.5/weather?q=ho%20chi%20minh%20city&appid=' + apikey)
            .then((res) => res.json())
            .then((result) => {
                this.setState({
                    cityData: result,
                    isLoaded: true,
                });
                let timeOfDay = result.weather[0].icon[result.weather[0].icon.length - 1];
                if (timeOfDay === 'd') {
                    this.setState({
                        backgroundType: 'day-gradient'
                    });
                } else {
                    this.setState({
                        backgroundType: 'night-gradient'
                    });                
                }    
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    cityData: {
                        cod: '404',
                        message: "Can't load weather data for some reason."
                    }
                });
            }
        );
    }

    componentDidMount() {
        this.loadCityData(this.state.currentCity);
    }

    render() {
        let returnObject;
        const { error, isLoaded, cityData, backgroundType } = this.state;
        if (cityData.cod === '404') {
            returnObject = <div id={backgroundType} className="page-appearance">
                <h1 className="title">instantWeather</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Enter a city here"/>
                </form>
                <h3>Error: {cityData.message}</h3>
            </div>;
            //return <div id={backgroundType} className="page-appearance">Error: {error.message}</div>;
        } else if (!isLoaded) {
            returnObject = <div id={backgroundType} className="page-appearance">Loading Weather Data....</div>;
            //return <div id={backgroundType} className="page-appearance">Loading Weather Data....</div>;
        } else {
            //return (
            returnObject = 
                <div id={backgroundType} className="page-appearance">
                    <h1 className="title">instantWeather</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Enter a city here"/>
                    </form>
                    <h3 style={{paddingTop: '2%', margin: '0px'}}>Current conditions in: {cityData.name}, {getCountryName(cityData.sys.country)}</h3>
                    <div className="same-line">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <img src={"./static/weather_icons/" + cityData.weather[0].icon + ".svg"} alt="current weather icon"/>
                                    </td>
                                    <td>                
                                        <p className="temperature">{(cityData.main.temp - 273.15).toFixed(1)}</p>
                                        <p>°C</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="other-info">
                        <table id="weather-table">
                            <tbody>
                                <tr>
                                    <td>Barometric pressure</td>
                                    <td>{cityData.main.pressure} mb/hPa</td>
                                </tr>
                                <tr>
                                    <td>Humidity</td>
                                    <td>{cityData.main.humidity}%</td>
                                </tr>
                                <tr>
                                    <td>Wind speed</td>
                                    <td>{cityData.wind.speed} km/h</td>
                                </tr>
                                <tr>
                                    <td>Wind direction</td>
                                    <td>{cityData.wind.deg}° ({giveDirection(cityData.wind.deg)})</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ;
        }

        return returnObject;
    }
}

export default CityData;