const graphql = require('graphql')
const _ = require('lodash')
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull} = graphql;
const Book = require('../models/book');
const Author = require('../models/author');


var books = [
  {name:'How to learn graphQL', genre:'Programming',id:'1',authorId:'1'},
  {name:'Get started with Magneto', genre:'Physics',id:'2',authorId:'2'},
  {name:'Get Hold on air', genre:'Physics',id:'3',authorId:'3'},
  {name:'Breaking Ice with Hands', genre:'Skills',id:'4',authorId:'2'},
  {name:'Making dough smooth as Duck', genre:'Skills',id:'2',authorId:'3'},
  {name:'Code like Linus', genre:'Programming',id:'3',authorId:'3'}
];

var authors = [
  {name:'nikhil dhore',age:'26',id:'1'},
  {name:'bismillah rithale',age:'25',id:'2'},
  {name:'janardhan jule',age:'24',id:'3'}
];


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields : () => ({
    id: {type:GraphQLID},
    name: {type:GraphQLString},
    genre: {type:GraphQLString},
    author : {
      type : AuthorType,
      resolve(parent, args){
        //return _.find(authors, {id:parent.authorId});
        return Author.findById(parent.authorId)
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name : 'Author',
  fields : () => ({
    id : {type: GraphQLID},
    name : {type : GraphQLString},
    age : {type : GraphQLInt},
    books : {
      type : new GraphQLList(BookType),
      resolve(parent, args){
        //return _.filter(books, {authorId: parent.id})
        return Book.find({authorId: parent.id})
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name : 'RootQueryType',
  fields : {
    book : {
      type : BookType,
      args : {id: {type : GraphQLID}},
      resolve(parent, args){
        //grab data from database
        //now using dummy data
        //console.log(typeof(args.id))
        //return _.find(books, {id:args.id});
        return Book.findById(args.id);
      }
    },
    author : {
      type : AuthorType,
      args : {id : {type : GraphQLID}},
      resolve(parent, args){
        //return _.find(authors, {id: args.id})
        return Author.findById(args.id)
      }
    },
    books : {
      type : new GraphQLList(BookType),
      resolve(parent, args){
        //return books
        return Book.find({});
      }
    },
    authors : {
      type : new GraphQLList(AuthorType),
      resolve(parent, args) {
        //return authors
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {type:  new GraphQLNonNull(GraphQLString)},
        age: {type:  new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook : {
      type : BookType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type:  new GraphQLNonNull(GraphQLString)},
        authorId: {type:  new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args){
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query : RootQuery,
  mutation: Mutation
});
