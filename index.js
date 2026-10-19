import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dns from 'node:dns';
import 'dotenv/config'


dns.setServers(['8.8.8.8', '8.8.4.4']);



const app = express()

const port = process.env.PORT || 5000 ; 

app.use(cors())
app.use(express.json())

const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irqjvwq.mongodb.net/`);

export async function connectToMongoDB()  {
  try{
    await client.connect();
     console.log("You successfully connected to MongoDB!");
     return client;
  }
  catch(err){
    console.dir(err);
  }
}
const connectedClient =  await connectToMongoDB();
const db = connectedClient.db('SimpleCrudDB');
const users = db.collection('users');



app.get('/',(req , res) => {
    res.send("simple crud is running")
})
app.get('/users', async (req , res) => {
  const cursor = users.find({})
  const allUsers = await cursor.toArray();
  res.send(allUsers)

app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const query = { _id: new ObjectId(id) };
    const result = await users.findOne(query);

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/users', async (req, res) => {
  const newUser = req.body;
 
  const result = await users.insertOne(newUser)
  res.send(result);
   
});
app.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;

   
    });
    const filter = {
      _id: new ObjectId(id)
    }
    const options = { upsert : true} 
    const updateDoc = {
      $set :{
        name:updatedUser.name ,
        email : updatedUser.email

      }

    }
    const result = await users.updateOne(filter, updateDoc , options);
    res.send(result)

});

app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const query = { _id: new ObjectId(id) };
    const result = await users.deleteOne(query);

    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});