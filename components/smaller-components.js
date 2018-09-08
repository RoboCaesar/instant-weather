//import {apikey} from './apikey.json';
import {loadPlaceName} from './loadPlaceName';

export class LocationDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <h3 style={{paddingTop: '2%', margin: '0px'}}>Current conditions in {this.props.cityname}, </h3>
            </div>
        );
    }
}

export default LocationDisplay;