//https://nextjs.org/learn/basics/server-side-support-for-clean-urls/create-a-custom-server

const express = require('express')
const next = require('next')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let cityData;

const loadCityData = () => {
    console.log("Trying to load city data...");
    return new Promise ((resolve, reject) => {
        fs.readFile('./citylist/citylist.json', (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}


app.prepare()
// .then(() => {
//     fs.readFile('./citylist/citylist.json', (err, data) => {
//         if (err) return(err);
//         return(JSON.parse(data));
//     });
// })
.then(async () => {
  cityData = await loadCityData();
  console.log("Loaded city data with length " + cityData.length);
  const server = express()

  server.get('/search/:thestring', async (req, res) => {
      let searchQuery = '^' + req.params.thestring;
      let regExFilter = new RegExp(searchQuery, 'i');
      console.log("A search is being attempted for the query " + req.params.thestring + "!");

      let results = await cityData.filter(({name}) => name.match(regExFilter)).slice(0,7);
      if (results.length == 0) {
        searchQuery = '\\b' + req.params.thestring;
        regExFilter = RegExp(searchQuery, 'i');
        results = await cityData.filter(({name}) => name.match(regExFilter)).slice(0,7);
        return res.send(results);
      } else {
        return res.send(results);
      }
      //console.log(results);
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})