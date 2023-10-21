const express = require('express');
const cors = require('cors');

require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tv4qtbo.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

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
        await client.connect();

        const productCollection = client.db("productDB").collection("products");
        const userCollection = client.db("productDB").collection("users");
        const cartProductCollection = client.db("productDB").collection("cartProducts");
        const branCollection = client.db("productDB").collection("brands");

        // Product api 

        // post single product endpoint
        app.post("/products", async (req, res) => {
            const product = req.body;
            console.log("product", product);
            const result = await productCollection.insertOne(product);
            // console.log(result);
            res.send(result);
        });

        // get all product endpoint 

        app.get("/products", async (req, res) => {
            const result = await productCollection.find().toArray();
            // console.log(result);
            res.send(result);
        });

        // delete single product end point
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            console.log("id", id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await productCollection.deleteOne(query);
            // console.log(result);
            res.send(result);
        });

        // get single product using id endpoint

        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            console.log("id", id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await productCollection.findOne(query);
            // console.log(result);
            res.send(result);
        });

        // update single product

        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = {
                _id: new ObjectId(id),
            };
            const options = { upsert: true };
            const product = {
                $set: {
                    img: updatedProduct.img,
                    name: updatedProduct.name,
                    brand: updatedProduct.brand,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    description: updatedProduct.description,
                    rating: updatedProduct.rating
                },
            };
            const result = await productCollection.updateOne(
                filter,
                product,
                options
            );
            res.send(result);
        });


        // brand api

        // post single brand endpoint
        app.post("/brands", async (req, res) => {
            const brand = req.body;
            console.log("brands", brand);
            const result = await branCollection.insertOne(brand);
            // console.log(result);
            res.send(result);
        });

        // get all brand endpoint 

        app.get("/brands", async (req, res) => {
            const result = await branCollection.find().toArray();
            // console.log(result);
            res.send(result);
        });

        // delete single brand end point
        app.delete("/brands/:id", async (req, res) => {
            const id = req.params.id;
            console.log("id", id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await branCollection.deleteOne(query);
            // console.log(result);
            res.send(result);
        });

        // get single brand using id endpoint

        app.get("/brands/:id", async (req, res) => {
            const id = req.params.id;
            console.log("id", id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await branCollection.findOne(query);
            // console.log(result);
            res.send(result);
        });


        //  user api 

        // post single user endpoint
        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log("user:", user);
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.send(result);
        });

        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray();
            // console.log(result);
            res.send(result);
        });


        // cart api 
        // post cart product api endpoint 
        app.post("/addToCart", async (req, res) => {
            const cartProduct = req.body;
            // const cartId = cartProduct.cartId;
            // console.log(cartId);
            console.log("cart Product:", cartProduct);
            const result = await cartProductCollection.insertOne(cartProduct);
            if (!result) {
                return res.status(400).send("data not found");
            };
            res.send(result);
        })

        // get all cart data 

        app.get("/addToCart", async (req, res) => {
            const result = await cartProductCollection.find().toArray();
            // console.log(result);
            res.send(result);
        });

        // get single cart product using id endpoint
        app.get("/addToCart/:id", async (req, res) => {
            const id = req.params.id;
            console.log("single id", id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await cartProductCollection.findOne(query);
            console.log(result);
            res.send(result);
        });


        // delete single product end point
        app.delete("/addToCart/:id", async (req, res) => {
            const id = req.params.id;
            console.log("deleted id", typeof (id), id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await cartProductCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Green Diva server is running ')
})

app.listen(port, () => {
    console.log(`Green diva server is running on port: ${port}`)
})