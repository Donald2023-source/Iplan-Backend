// connect.js
const { MongoClient, ServerApiVersion } = require('mongodb');

// Your MongoDB URI
const uri = process.env.MONGODB_URI || "mongodb+srv://donalddyusuf:pj234frr@st-christophers.trvhc.mongodb.net/?retryWrites=true&w=majority&appName=St-Christophers";

// Create a new MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to connect to MongoDB
async function connect() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Export the client and connect function
module.exports = { client, connect };
