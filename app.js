const yargs = require('yargs');
const axios = require('axios');

const arg = yargs
    .options({
        a:{
            demand: true,
            alias: 'address',
            describe: 'Address to fetch the weather',
            string: true
        }
    })
    .help()
    .alias('help','h')
    .argv;

var encodedAddress = encodeURIComponent(arg.address);
var googleKey ='';
var skyKey = '****';
var geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key='+googleKey+'&address='+encodedAddress;



axios.get(geocodeUrl)
.then((response) =>{
    if(response.data.status === 'ZERO_RESULTS'){
        throw new Error('The address has been not found from Google API');
    }
    //we collect lat/lnt from google
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = 'https://api.darksky.net/forecast/'+skyKey+'/'+lat+','+lng;
    //we print the address
    console.log('Address -> '+response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
})
.then((response)=>{
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    var summary = response.data.currently.summary;
    console.log('Temperature -> '+temperature+'(F)');
    console.log('Apparent Temperature -> '+apparentTemperature+'(F)');
    console.log('Current weather -> '+summary);
    
})
.catch((e)=>{
    if(e.code === 'ENOTFOUND'){
        console.log('Unable to connect to Google API Server.')
    } else{
        console.log(e.message);
    }
    
});



