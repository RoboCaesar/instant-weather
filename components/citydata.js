import {apikey} from './apikey.json';
import {getCountryName} from './countrylist';
import SearchBox from './searchbox.js';
import Footer from '../components/footer';
import TempDisplay from '../components/temperature-display';
import ExtraInfo from '../components/extra-weather-info';

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
            backgroundType: 'default-color',
            showExtras: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadCityData = this.loadCityData.bind(this);
        this.toggleExtraInfo = this.toggleExtraInfo.bind(this);
    }

    toggleExtraInfo() {
        this.setState((prevState) => {return {showExtras: !prevState.showExtras}});
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

    loadCityData(cityNameOrID, numerical=false) {
        let submitURL;
        if (numerical === false) {
            submitURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityNameOrID + '&appid=' + apikey;
        } else { //With suggested search results, the city's id is submitted, not the name!
            submitURL = 'http://api.openweathermap.org/data/2.5/weather?id=' + cityNameOrID + '&appid=' + apikey;
        }

        fetch(submitURL)
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
                <SearchBox searchSubmit={this.loadCityData}/>
                <h3>Error: {cityData.message}</h3>
            </div>;
        } else if (!isLoaded) {
            returnObject = <div id={backgroundType} className="page-appearance">Loading Weather Data....</div>;
        } else {
            //return (
            returnObject = 
                <div id={backgroundType} className="page-appearance">
                    <h1 className="title">instantWeather</h1>
                    <SearchBox searchSubmit={this.loadCityData}/>
                    <h3 style={{paddingTop: '2%', margin: '0px'}}>Current conditions in {cityData.name}, {getCountryName(cityData.sys.country)}</h3>

                    <TempDisplay temperature={(cityData.main.temp - 273.15)} weathericon={cityData.weather[0].icon} />
                    {/* <table>
                        <td>

                        </td>
                        <td>

                        </td>
                    </table> */}
                    <div className="other-info">
                        {this.state.showExtras && <table id="weather-table">
                            <tbody>
                                <tr>
                                    <td>Bar. pressure</td>
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
                        </table>}
                        <button onClick={this.toggleExtraInfo}>More info on this location</button>
                    </div>
                    <Footer />
                </div>
            ;
        }

        return returnObject;
    }
}

export default CityData;