const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const _ = require("lodash");
const request = require("request");
const https = require("https");
const { response } = require("express");



const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ******************* create mongodb connection *****************************

// open database connection
mongoose.connect("mongodb://localhost:27017/HotelDB", { useNewUrlParser: true })

// ******procedure for inserting data******

// rooms collection
const roomSchema = {
    name: {
        // validating user data
        type: String,
        required: [true, "No name specified"]
    },
    email: String,
    telephone: Number,
    adults: Number,
    children: Number,
    checkInDate: Date,
    CheckOutDate: Date,
    pet: Boolean,
    pickMeUp: Boolean,
    clientInformation: String
}
const Room = mongoose.model("room", roomSchema);


// Subscribers collection
const subscribersSchema = {
    firstName: String,
    lastName: String,
    email: String
}
const Subscriber = mongoose.model("subscriber", subscribersSchema);

// ***********************************************************************

app.post("/bookRoom", (req, res) => {
    // ********Use body-parser to capture user data detailed in the form
    // use lodash to autocapitalize first letter of client name
    const clientName = _.upperFirst(_.toLower(req.body.guestName));
    const emailAddress = req.body.guestEmail;
    const telephone_No = req.body.guestTelephone;
    const noOfAdults = req.body.adults;
    const noOfChildren = req.body.children;
    const checkIn = req.body.checkin;
    const checkOut = req.body.checkout;
    const clientHasPet = req.body.switch1 ? true : false;
    const pickUpClient = req.body.switch2 ? true : false;
    const additionalInfo = req.body.comment;

    const room = new Room({
        name: clientName,
        email: emailAddress,
        telephone: telephone_No,
        adults: noOfAdults,
        children: noOfChildren,
        checkInDate: checkIn,
        CheckOutDate: checkOut,
        pet: clientHasPet,
        pickMeUp: pickUpClient,
        clientInformation: additionalInfo
    });
    // save details of the client that booked the room
    room.save();

    // const request = https.request((response) => {
    //     if (response.statusCode === 200) {
    //         res.send("succesfully booked");
    //     } else {
    //         res.send("Failed! please check your credentials");
    //     }
    // });
});

app.post("/newsletter", (req, res) => {

    const subscriber = new Subscriber({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });
    // save new subscriber to database
    subscriber.save();
});



app.get("/", (req, res) => {
    res.render("index");
});
app.get("/book-room", (req, res) => {
    res.render("bookRoom");
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
});