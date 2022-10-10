const fs = require('fs');
const secretKey = "sk_test_51Jc4KaFYrsT4JzuLSlN2TI0R3GT2Z9m1r7wSyqHmaYKyM8sikFVBs9BDUQPlTeUTbn4IY6hOG7ts8lkb3gP4mbMu00cWKPINRj"
const express = require('express');
const stripe = require('stripe')(secretKey)
let stripeCustomerID = {};
let wholeSession = {};

const app = express()
app.use(express.static("public"))


app.use("/api", express.json())

//global variabel senaste köpet

app.get("/api", (req, res) => {
    res.status(200).send("Välkommen")
})

app.post("/api/session/new/", async (req, res) => {
    //let item = JSON.stringify
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.line_items,
        success_url: "http://localhost:3000/checkout_success.html",
        cancel_url: "http://localhost:3000/checkout_canceled.html",
    })
    wholeSession = session
    res.status(200).json({ id: session.id })
})

app.post("/api/session/verify/:id", async (req, res) => {
    //sparar sessions ID som kommer från client till server
    const sessionId = req.params.id

    const session = await stripe.checkout.sessions.retrieve(sessionId)


    //Kollar ifall kund gör köpet eller ej
    res.status(200).json({ id: session.id })
    res.json({ sessionId })
})
app.post('/api/recet', (req, res) => {

    let today = new Date()
    let date = today.getFullYear() + " " + (today.getMonth() + 1) + "-" + today.getDate()

    let order = {
        customerID: "",
        orderId: wholeSession.id,
        amountTotal: wholeSession.amount_total,
        stuff: date,
        products: req.body.products,
        orderId: wholeSession.payment_intent,
        userID: ''
    }

    try {
        let raw = fs.readFileSync("kvitton.json")
        let kvitton = JSON.parse(raw)
        kvitton.push(order)
        fs.writeFileSync("kvitton.json", JSON.stringify(kvitton))
        res.json("sparat")
    } catch (err) {

    }

})
app.listen(3000, () => {
    console.log("server is running")
})
