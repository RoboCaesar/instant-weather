//import {apikey} from 'components/apikey.json';
const apikey = require('./components/apikey.json');
const fetch = require('node-fetch');

function loadPlaceName(latitude, longitude, fullAddress=false) {
    return new Promise ((resolve, reject) => {

        let submitURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + "&key=" + apikey.apikey[1];
        //console.log(submitURL);
        fetch(submitURL)
            .then((res) => res.json())
            .then((result) => {
                let resultsIndex = result.results[0].address_components.length;
                //console.log(result.results[0].address_components);
                console.log("Loaded");
                resolve(result.results[0].address_components.filter(thing => thing.types[0] === 'administrative_area_level_1' || thing.types[0] === 'country'));//.slice(resultsIndex-3));
                // if (fullAddress === false) return result//.results[0].address_components[resultsIndex - 1].long_name;
                // else return result;
            },
            (error) => {
                reject('Unknown place');
            }
        );
    });
}

async function printLocInfo() {
    console.log("Hello!");
    var placeInfo = await loadPlaceName(43.07, -89.40);
    console.log("loaded?");
    console.log(placeInfo);  
}

//console.log(apikey.apikey[0]);
printLocInfo();