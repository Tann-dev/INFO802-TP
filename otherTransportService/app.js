import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

var app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// Server port
var HTTP_PORT = 3000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

//Insert a new score
app.post("/api/transport/", (req, res, next) => {
    var errors = []
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }

    var typeTransport = req.body.typeTransport
    var distanceEnKm = req.body.distanceEnKm
    var tempsTrajetMinute = 1000000;

    switch (typeTransport) {
        case "PogoStick":
            tempsTrajetMinute = distanceEnKm * 9;
            break;
        case "APied":
            tempsTrajetMinute = distanceEnKm * 8;
            break;
        case "Velo":
            tempsTrajetMinute = distanceEnKm * 4;
            break;
        case "Cheval":
            tempsTrajetMinute = distanceEnKm * 3;
            break;
        default:
            tempsTrajetMinute = distanceEnKm * 10;
            break;
    }

    res.json({tempsTrajetMinute})
})

// Default response for any other request
app.use(function(req, res) {
    res.status(404);
});