const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eepi0pq.mongodb.net/?retryWrites=true&w=majority`

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
        //  client.connect();
        // Send a ping to confirm a successful connection
        const coleges = client.db('college-cunnect').collection('coleges')
        const images = client.db('college-cunnect').collection('images')
        const revews = client.db('college-cunnect').collection('revews')
        const usersInformations = client.db('college-cunnect').collection('usersInformations')
        const admitionData = client.db('college-cunnect').collection('admitionData')

        app.get('/coleges', async (req, res) => {
            const colege = await coleges.find().toArray()
            res.send(colege)
        })
        app.get('/images', async (req, res) => {
            const image = await images.find().toArray()
            res.send(image)
        })
        app.get('/revews', async (req, res) => {
            const revew = await revews.find().toArray()
            res.send(revew)
        })
        app.get('/coleges/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const singledtails = await coleges.findOne(filter)
            res.send(singledtails)
        })
        app.get('/admitonData', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const admitionDatas = await admitionData.find(query).toArray()
            res.send(admitionDatas)
        })
        app.get('/usersInformations', async (req, res) => {
            const email = req.query.email;

            const query = { email: email };
            const userInformations = await usersInformations.find(query).toArray()
            res.send(userInformations)
        })
        app.post('/usersInformations', async (req, res) => {
            const users = req.body;

            const query = { email: users.email };
            const existingUser = await usersInformations.findOne(query);
            if (existingUser) {
                return res.send({ message: 'vai already added' });
            }
            const result = await usersInformations.insertOne(users);
            res.send(result);
        });

        app.post('/admitonData', async (req, res) => {
            const admitonData = req.body
            const result = await admitionData.insertOne(admitonData)
            res.send(result)
        })
        app.post('/addRevew', async (req, res) => {
            const revewData = req.body
            const result = await revews.insertOne(revewData)
            res.send(result)
        })
        app.put('/updateUserProfile', async (req, res) => {
            const data = req.body;
            console.log(data)
            const email = data.email
            const phoneNumber = data.phoneNumbar
            const adress = data.adress
            console.log(phoneNumber)
            const filter = { email };
            const update = { $set: { phoneNumber, adress } }
            const result = await usersInformations.updateOne(filter, update);
            res.send(result)
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('college is building')
})

app.listen(port, () => {
    console.log(`college building at port ${port}`)
})