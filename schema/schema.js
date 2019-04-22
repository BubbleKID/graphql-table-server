import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } from 'graphql';
import _ from 'lodash';
import trades from '../trades.json';

const TradeType = new GraphQLObjectType({
  name: 'Trade',
  fields: () =>({
    uuid: {type: GraphQLString},
    updatedAt: {type: GraphQLString},
    price: {type: GraphQLString},
    volume: {type: GraphQLString},
    side: {type: GraphQLString},
    tradingPair: {type: TradingPairType}
  })
})

const TradingPairType = new GraphQLObjectType({
  name: 'tradingPair',
  fields: () =>({
    uuid:{type: GraphQLString},
    symbol:{type: GraphQLString},
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    trade1: {
      type: new GraphQLList(TradeType),
      args: {
        uuid: {type: GraphQLString},
        price: {type: GraphQLString},
        volume: {type: GraphQLString},
      },
      resolve(parent, args){
        const result = _.filter(trades.trades, function(trade) {
          return (trade.uuid == args.uuid || trade.price == args.price || trade.volume == args.volume)
        });
        return result;
      }
    },
    trade2: {
      type: new GraphQLList(TradeType),
      args: {
        side: {type: GraphQLString},
      },
      resolve(parent, args){
        const result = _.filter(trades.trades, function(trade) {
          return (trade.side == args.side)
        });
        return result;
      }
    },
  }
})


// {
//   trade1(uuid: "912b7900-b217-4a74-9df5-5ef742939e9a", price: "6795.33", volume: "1.16698") {
//     uuid
//     price
//     volume
//     side
//     tradingPair {
//       uuid
//       symbol
//     }
//   }
// }


const schema = new GraphQLSchema({
  query:RootQuery
});

export default schema;