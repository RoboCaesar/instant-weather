//import {apikey} from './apikey.json';
import {loadPlaceName} from './loadPlaceName';

export class LocationDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            placeInfo: [],
            isLoaded: false
        }
    }

    async componentDidMount() {
        let tempPlaceInfo = await loadPlaceName(this.props.cityCoords.lat, this.props.cityCoords.lon);
        console.log("This did run.")
        console.log("Input data: " + this.props.cityCoords.lat + "  " + this.props.cityCoords.lon);
        //console.log(tempPlaceInfo);
        // loadPlaceName(this.props.cityCoords.lat, this.props.cityCoords.lon).then((result) => {
        //     console.log("We got: " + result);
        //     that.setState({
        //         placeInfo: result
        //     });
        // });
        this.setState({
            placeInfo: tempPlaceInfo,
            isLoaded: true
        });        
    }

    async componentWillReceiveProps(nextProps) {
        let tempPlaceInfo = await loadPlaceName(nextProps.cityCoords.lat, nextProps.cityCoords.lon);
        this.setState({
            placeInfo: tempPlaceInfo,
            isLoaded: true
        });           
    }

    render() {
        console.log(this.state.placeInfo);
        const { placeInfo, isLoaded } = this.state;
        let moreInfo;
        if (isLoaded) moreInfo = placeInfo[0].long_name + ', ' + placeInfo[1].long_name;
        else moreInfo = 'Unknown';
        return(
            <div>
                <h3 style={{paddingTop: '2%', margin: '0px'}}>Current conditions in {this.props.cityname}, {moreInfo}</h3>
            </div>
        );
    }
}

export default LocationDisplay;