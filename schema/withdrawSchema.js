import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLSchema } from 'graphql';
import withdraws from '../withdraws.json';

const WithdrawType = new GraphQLObjectType({
  name: 'Withdraws',
  fields: () =>({
    uuid: {type: GraphQLString},
    createdAt: {type: GraphQLString},
    amount: {type: GraphQLString},
    status: {type: GraphQLString},
    bankReferenceNumber: {type: GraphQLString},
  })
})

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
    withdraws: {type: new GraphQLList(WithdrawType)},
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
        let result;
        if(args.filter[0] != ""){
          args.filter.forEach((filter) => {
            let newObj = withdraws.withdraws.filter(withdraw => withdraw.status == filter);
            filterResult = [...newObj, ...filterResult];
          });
        } else {
          filterResult = withdraws.withdraws;
        }
        dateResult = filterResult.filter(withdraw=>
          (new Date(withdraw.createdAt) >= new Date(args.fromDate)) && (new Date(withdraw.createdAt) <= new Date(args.toDate))
        );
        if(args.searchString !== ""){
          result = dateResult.filter(withdraw =>
            withdraw.uuid.includes(args.searchString) || withdraw.amount.includes(args.searchString) || withdraw.bankReferenceNumber.includes(args.searchString)
          );
        } else {
          result =  dateResult;
        }
        const returnValue = {
          withdraws: result.slice((args.number-1) * args.size, args.number * args.size),
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