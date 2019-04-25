const express = require('express')
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

//connect to database
mongoose.connect('mongodb+srv://venumongo:Venu.mongodb93@cluster0-tobs1.mongodb.net/test?retryWrites=true')
mongoose.connection.once('open', ()=>{
  console.log('connected to database')
});


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(4000, () => {
  console.log('now listening for requests on port 4000')
});
