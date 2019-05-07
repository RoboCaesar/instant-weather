import {apikey} from './apikey.json';

export function loadPlaceName(latitude, longitude, fullAddress=false) {
    return new Promise ((resolve, reject) => {

        let submitURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + "&key=" + apikey[1];
        //console.log(submitURL);
        fetch(submitURL)
            .then((res) => res.json())
            .then((result) => {
                //let resultsIndex = result.results[0].address_components.length;
                //console.log(result.results[0].address_components);
                console.log("Loaded");
                resolve(result.results[0].address_components.filter(thing => thing.types[0] === 'administrative_area_level_1' || thing.types[0] === 'country'));//slice(resultsIndex-2));
                // if (fullAddress === false) return result//.results[0].address_components[resultsIndex - 1].long_name;
                // else return result;
            },
            (error) => {
                reject('Unknown place');
            }
        );
    });
}
