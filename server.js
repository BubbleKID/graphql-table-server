import express from 'express';
import graphqlHTTP from 'express-graphql';
import trades from './trades.json';
import { buildSchema } from 'graphql';
import schema from './schema/schema';


const PORT = 3000;
const app = express();

app.use('/trades', graphqlHTTP({
  schema: schema,
  //rootValue: trades,
  graphiql: true,
}));

app.listen(PORT,()=>{
  console.log('Example app listening on port 3000!');
});
