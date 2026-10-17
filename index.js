import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import 'dotenv/config'



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

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});