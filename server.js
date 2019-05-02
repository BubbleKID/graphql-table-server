import express from 'express';
import graphqlHTTP from 'express-graphql';
import tradeSchema from './schema/tradeSchema';
import withdrawSchema from './schema/withdrawSchema';
import cors from 'cors';

const PORT = process.env.PORT || 5000;
const app = express();

//allow cross-origin requests
app.use(cors());

app.use('/trades', graphqlHTTP({
  schema: tradeSchema,
  graphiql: true,
}));

app.use('/withdraws', graphqlHTTP({
  schema: withdrawSchema,
  graphiql: true,
}));

app.listen(PORT,()=>{
  console.log('Example app listening on port 5000!');
});
