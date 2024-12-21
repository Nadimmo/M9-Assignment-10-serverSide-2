const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();
// middleware
app.use(cors({
  Origin: ["http://localhost:5173", "https://assignment-10-b4d8f.web.app", "https://touristsports.vercel.app"]
}))
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rrkijcq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://assignment10:fLkJ3gKhR3vVEUnc@cluster0.rrkijcq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const collectionOfCart = client.db('touristDB').collection('tourist')

    app.get('/cartes', async(req,res)=>{
      const newCart = collectionOfCart.find()
      const result = await newCart.toArray()
      res.send(result)
    })

    app.get('/cartes/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await collectionOfCart.findOne(filter)
      res.send(result)
    })
    app.post('/cartes', async(req,res)=>{
        const newCart = req.body;
        console.log('cart form user side', newCart)
        const result = await collectionOfCart.insertOne(newCart)
        res.send(result)
    })

    app.delete('/cartes/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await collectionOfCart.deleteOne(filter)
      res.send(result)
    })

    app.put('/cartes/:id', async(req,res)=>{
      const id = req.params.id;
      const cart = req.body
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateCart = {
        $set: {
           country : cart.country,
           location : cart.location,
           description : cart.description,
           spot : cart.spot,
           name : cart.user,
           email : cart.email,
           time : cart.time,
           photo : cart.photo,
           visitorsPerYear : cart.visitorsPerYear,
           seasonality : cart.seasonality,
           title : cart.title,
           average : cart.average
        }
      }
      const result = await collectionOfCart.updateOne(filter,updateCart, options)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
  res.send('server side is ready..')
})

app.listen(port, ()=>{
    console.log(`server is heating now..${port}`)
})