const express = require('express')
const request = require('request');

const PovpHitrost = require('./povp_hitrost')
const GostotaPrometa = require('./gostota_prometa')
const Ceste = require('./ceste')
const Lokacija = require('./lokacija')

const router = express.Router()

const LocationModel = require('./models/locationModel.js')
const RadarModel = require('./models/radarModel')

// vrne JSON objekt trenutnih live radarskih slik in imena cest / predorov
router.get('/api/v1/kamere', async (req, res) => {
    requestData("kamere", function(response) {
        res.send(response)
    })
})

// Vrne vse podatke iz promet.si tabele
router.get('/api/v1/all', async (req, res) => {
    requestData("ceste", function(response) {
        res.send(response)
    })
})

// vrne seznam cest
router.get('/api/v1/ceste', async (req, res) => {
    requestData("ceste", function(response) {
        var data = JSON.parse(response);
        
        if(data != null)
            res.send(JSON.stringify(Ceste.run(req, data)))
    })
})

// vrne povprecno hitrost na vsaki izmed cest
router.get('/api/v1/povprecna_hitrost', async (req, res) => {
    try {
        requestData("ceste", function(response) {
            var data = JSON.parse(response);
            
            if(data != null)
                res.send(JSON.stringify(PovpHitrost.run(req, data)))
        })
    } catch (err) {
        res.send(JSON.stringify("Error: " + err));
    }
})

// vrne povprecno hitrost za podano cesto
router.get('/api/v1/povprecna_hitrost/:road', async (req, res) => {
    try {
        requestData("ceste", function(response) {
            var data = JSON.parse(response);
            
            if(data != null)
                res.send(JSON.stringify(PovpHitrost.run(req, data)))
        })
    } catch (err) {
        res.send(JSON.stringify("Error: " + err));
    }
})

// vrne par cesta : gostota
router.get('/api/v1/gostota', async (req, res) => {
    try {
        requestData("ceste", function(response) {
            var data = JSON.parse(response);
            
            if(data != null)
                res.send(JSON.stringify(GostotaPrometa.run(req, data)))
        })
    } catch (err) {
        res.send(JSON.stringify("Error: " + err));
    }
})

// vrne trenutno gostoto prometa na podani cesti kot parameter :density
router.get('/api/v1/gostota/:density', async (req, res) => {
    try {
        requestData("ceste", function(response) {
            var data = JSON.parse(response);
            
            if(data != null)
                res.send(JSON.stringify(GostotaPrometa.run(req, data)))
        })
    } catch (err) {
        res.send(JSON.stringify("Error: " + err));
    }
})

// vrne podatno gostoto :density na podani cesti :road
router.get('/api/v1/gostota/:density/:road', async (req, res) => {
    try {
        requestData("ceste", function(response) {
            var data = JSON.parse(response);
            
            if(data != null)
                res.send(JSON.stringify(GostotaPrometa.run(req, data)))
        })
    } catch (err) {
        res.send(JSON.stringify("Error: " + err));
    }
})

router.post('/api/v1/ceste', async (req, res) => {
    Ceste.sendSigns(req, res)
})

// dobi lokacijo iz android appa
router.post('/api/v1/lokacija', async (req, res) => {
    //Lokacija.save(req, res);

    var loc = new LocationModel({
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        speed: req.body.speed,
        address: req.body.address,
        uuid: req.body.uuid,
        name: req.body.name
    })

    /*
    loc.save((err, location) => {
        if (err) {
            //return res.send(500)
        } else {
            // console.log(res.status(201).json(user))
            //return res.sendStatus(200)
        }
    })
    */

    var query = { 'uuid': req.body.uuid }
    LocationModel.findOneAndUpdate(query, loc, { upsert: true }, (err, doc) => {
        return res.send('Saved')
    })
})

router.post('/api/v1/report_radar', async (req, res) => {
    

    console.log("recieved radar report")

    const obj = JSON.parse(JSON.stringify(req.body));

    //console.log(obj.longitude);
    //console.log(obj.uuid)

    var rad = new RadarModel({
        longitude: obj.longitude,
        latitude: obj.latitude,
        address: obj.address,
        uuid: obj.uuid
    })


    var query = { 'uuid': obj.uuid }
    RadarModel.findOneAndUpdate(query, rad, { upsert: true }, (err, doc) => {
        return res.send('Saved')
    })
    
})

router.get('/api/v1/fetch_all_radar', async (req, res) => {

    console.log("fetching all radarji")

    RadarModel.find().sort({
        _id: -1
    }).exec((err, docs) => {
        //console.log(docs)
        res.send(JSON.stringify(docs))
    })

})

router.get('/api/v1/lokacija', async (req, res) => {
    LocationModel.find().sort({
        _id: -1
    }).exec((err, docs) => {
        //console.log(docs)
        res.send(JSON.stringify(docs))
    })
})

module.exports = router

var requestIndex = 0;

var scrapers = [
    "http://localhost:4999/",
    "http://192.168.0.27:4999/"
]

function requestData(endpoint, callback){
    console.log("Requesting", scrapers[requestIndex%scrapers.length] + endpoint)
    request(scrapers[requestIndex++%scrapers.length] + endpoint, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            callback(html)
        } else {
            callback(error)
        }
    });
}