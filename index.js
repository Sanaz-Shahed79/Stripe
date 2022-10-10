const express = require("express");
const fs = require("fs");
require("dotenv").config();
const { Console } = require("console");
const { runInNewContext } = require("vm");
const stripe = require("stripe")(process.env.SUPER_SECRET_KEY);
const PORT = 3000;
const app = express();
app.use("/", express.static("./client"));
app.use(express.json());
app.set("view engine", "ejs");

// Login
app.post("/api/login", async function (req, res) {
  try {
    let user = await stripe.customers.list({
      email: req.body.email,
    });
    let status = true;
    let msg = "Customer logged in!";
    if (user.data.length == 0) {
      status = false;
      msg = "Det hittades inte";
    }
    res.status(200).json({
      user : user.data[0] ?? null,
      status,
      msg
    });
    
  } catch (err) {
    res.status(404).json(err);
  }
});
// Register
app.post("/api/register", async function (req, res) {
  try {
    let user = await stripe.customers.list({
      email: req.body.email,
    });
    let status = true;
    let msg = "Customer skapades!"
    if (user.data.length == 0) {
      user = await stripe.customers.create({
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
      });
      
    }else {
      status = false;
      msg = "Custumer finns redan";
    }
    res.status(200).json({
      user,
      status,
      msg
    });
    
  } catch (err) {
    res.status(404).json(err);
  }
});
// Submit Order
app.post("/api/submit-order", async function (req, res) {
  let boughtItems = req.body.carts;
  let itemsToPay = [];
  boughtItems.forEach((item) => {
    let items = {
      price_data: {
        currency: "sek",
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
    itemsToPay.push(items);
  });
  console.log(itemsToPay);
  console.log(itemsToPay[0].price_data.product_data);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: itemsToPay,
    mode: "payment",
    submit_type: "pay",
    success_url: `http://localhost:3000/callback/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:3000/callback/cancel.html",
  });
  console.log(session);

  res.status(200).json(session.id);
});
// Verify Order
app.post("/api/verify-order/:sessionId", async function (req, res) {
  try {
    const sessionId = req.params.sessionId;
    let notPaid = false;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status == "paid") {
      let orders = fs.readFileSync("orders.json");
      let orderData = JSON.parse(orders);

      // check if orderId already in json-file
      let orderItem = orderData.find((order) => order.sessionId === sessionId);

      // if not
      if (!orderItem) {
        orderItem = {
          sessionId: session.id,
          customerName: session.customer_details.name,
          customerDetails: session.customer_details.email,
          total: session.amount_total,
          date: dateOrdered,
        };
        orderData.push(orderItem);
        fs.writeFileSync("orders.json", JSON.stringify(orderData));
        res.status(200).json(orderItem);
        return;
      }
    }
    res.status(401).json(notPaid);
  } catch (err) {
    res.status(400).json(err.message);
  }
});


const endpointSecret =
  "whsec_fd11830989b34d10dd54553c7dc1434174840b2b8cd4dcae7439921e8c56f3e1";

app.post("/webhook", function (request, response) {
  const sig = request.headers["stripe-signature"];
  const body = request.body;

  let event = null;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    // invalid signature
    response.status(400).end();
    return;
  }

  let intent = null;
  switch (event["type"]) {
    case "payment_intent.succeeded":
      intent = event.data.object;
      console.log("Succeeded:", intent.id);
      break;
    case "payment_intent.payment_failed":
      intent = event.data.object;
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.log("Failed:", intent.id, message);
      break;
  }
  response.sendStatus(200);
});

/*
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
      userID: req.session.username
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

app.get('/api/getrecet', (req, res) => {
  let raw = fs.readFileSync("kvitton.json")
  let kvitton = JSON.parse(raw)


  let kvittoList = []

  let kvitto = kvitton.map((kvitto) => {
      if (kvitto.userID == req.session.username) {
          kvittoList.push(kvitto)
      }
  })

  res.json(kvittoList)

})
*/


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
