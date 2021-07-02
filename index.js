const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config()



const port = 5000;



app.use(cors())
app.use(express.json());

const uri = "mongodb+srv://blogDialog:wu9XRPXsUqHe7JHc@jobayer.eggfq.mongodb.net/blogDialog?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




client.connect(err => {
  const blogsCollection = client.db("blogDialog").collection("blogs");
  const userCollection = client.db("blogDialog").collection("users");

  app.post('/AddBlog', (req, res) => {
    const blogs = req.body;
    blogsCollection.insertOne(blogs)
      .then(result => {
        res.send('blogs added')
        console.log(result)
      })
  })

  app.post('/createUser', (req, res) => {
    const user = req.body;
    userCollection.insertOne(user)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.post(`/getUser`, (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    userCollection.find({email: email, pass: pass})
      .toArray((err, document) => {
        res.send(document.length > 0)
        console.log(document[0])
      })
    
  });

  app.get(`/getBlogs`, (req, res) => {
    blogsCollection.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  });

  app.get(`/getBlog/:id`, (req, res) => {
    const blogId = ObjectID(req.params.id)
    blogsCollection.find({ _id: blogId })
      .toArray((err, document) => {
        res.send(document[0])
      })
  })

  app.delete(`/deleteBlog/:id`, (req, res) => {
    const blogId = ObjectID(req.params.id);
    blogsCollection.deleteOne({ _id: blogId })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })


});


app.get('/', (req, res) => {
  res.send('server is running')
})




app.listen(port || process.env.PORT, () => console.log(`server is running on ${port} port`))