const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mmuv9dp.mongodb.net/?appName=Cluster0`;

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

    const courseCollection = client.db('courseDB').collection('course');
    const userCollection = client.db('courseDB').collection('admin');

    

    app.post('/course', async(req, res) => {
        const newCourse = req.body;
        console.log(newCourse);
        const result = await courseCollection.insertOne(newCourse);
        res.send(result);
    })

    app.get('/course', async (req, res) => {
      const cursor = courseCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/course/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await courseCollection.findOne(query);
      // const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/user/:id', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.patch('/course/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedAvailable = req.body;
      const item = {
        $set: {
          available: updatedAvailable.available,
        }
      }
      
      const result = await courseCollection.updateOne(filter, item);
      res.send(result);
    })

    app.put('/user/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedActive = req.body;
      console.log(updatedActive);
      const item = {
        $set: {
          user: updatedActive.user,
        }
      }
      
      const result = await userCollection.updateOne(filter, item);
      res.send(result);
    })

    app.get('/course/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await courseCollection.findOne(query);
      res.send(result);
    })

    app.put('/course/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCourse = req.body;
      const item = {
        $set: {
          title: updatedCourse.title,
          thumbnail: updatedCourse.thumbnail,
          duration: updatedCourse.duration,
          duration_status: updatedCourse.duration_status,
          live_status: updatedCourse.live_status,
          fees: updatedCourse.fees,
          category: updatedCourse.category,
          description: updatedCourse.description
        }
      }
      const result = await courseCollection.updateOne(filter, item, options);
      res.send(result);
    })

    // app.put('/user/:id', async(req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) }
    //   const options = { upsert: true };
    //   const updatedUser = req.body;
    //   const item = {
    //     $set: {
    //       user: updatedUser.user
    //     }
    //   }
    //   const result = await userCollection.updateOne(filter, item, options);
    //   res.send(result);
    // })

    app.delete('/course/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await courseCollection.deleteOne(query);
      res.send(result);
    })

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
    res.send('EduTune server is running')
})

app.listen(port, () => {
    console.log(`EduTune server is running on port: ${port}`)
})