import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLSchema } from 'graphql';
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
    tradingPair: {type: TradingPairType},
  })
})

const TradingPairType = new GraphQLObjectType({
  name: 'tradingPair',
  fields: () =>({
    uuid:{type: GraphQLString},
    symbol:{type: GraphQLString},
  })
});

const PageInfoType = new GraphQLObjectType({
  name: 'pageInfo',
  fields: () =>({
    total: {type: GraphQLInt}
  })
});

const MainQueryType = new GraphQLObjectType({
  name: 'MainQueryType',
  description: 'The main query',
  fields: () =>({
    trades: {type: new GraphQLList(TradeType)},
    pageInfo:{
      type: PageInfoType,
      description: 'Page Information Part of the Query '
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    mainQuery: {
      type: MainQueryType,
      args: {
        searchString: {type: GraphQLString},
        filter: {type: new GraphQLList(GraphQLString)},
        fromDate: {type: GraphQLString},
        toDate: {type: GraphQLString},
        number:{type: GraphQLInt},
        size:{type: GraphQLInt}
      },
      resolve(parent, args){
        let filterResult =[];
        let dateResult = [];
        let result, total, size;
        if(args.filter[0] != ""){
          args.filter.forEach((filter) => {
            console.log(filter)
            let newObj = trades.trades.filter(trade => trade.side == filter || trade.tradingPair.symbol == filter);
            console.log(filterResult)
            filterResult = [...newObj, ...filterResult];
          });
        } else {
          filterResult = trades.trades;
        }
        dateResult = filterResult.filter(trade=>
          (new Date(trade.updatedAt) >= new Date(args.fromDate)) && (new Date(trade.updatedAt) <= new Date(args.toDate))
        );
        if(args.searchString !== ""){
          result = dateResult.filter(trade =>
            trade.uuid.includes(args.searchString) || trade.price.includes(args.searchString) || trade.volume.includes(args.searchString)
          );
        } else {
          result =  dateResult;
        }
        const returnValue = {
          trades: result.slice((args.number-1) * args.size, args.number * args.size),
          pageInfo:{
            total: result.length,
          }
        }
        return returnValue;
      }
    }
  }
});

const schema = new GraphQLSchema({
  query:RootQuery
});

export default schema;