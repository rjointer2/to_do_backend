
// grab the module to create type definitions
const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type Auth {
        token: ID!
        user: User
    }

    type User {
        _id: ID!
        email: String!
        username: String!
        password: String!
        todos: [Todo]
        comments: [Comment]
        friends: [User]
    }

    type Comment {
        _id: ID!
        createdBy: User
        comment: String!
        todo: Todo
        createdAt: String
    }

    type Todo {
        _id: ID!
        completed: Boolean
        subject: String!
        todo: String!
        likedBy: [User]
        createdBy: User
        dueDate: String!
        didUserLike: Boolean
        comments: [Comment]
    }


    type Query {
        me: User
        todos( offset: Int!, limit: Int! ): [Todo]
        getTodoById( id: String! ): Todo
        comments: [Comment]
    }

    type Mutation {
        
        addTodo( completed: Boolean, subject: String!, todo: String!, likedBy: String!, createdBy: String!, dueDate: String!, comments: String! ): Todo
        addComment( createdBy: String!, comment: String!, todoID: String! ): Comment
        deleteComment( id: String ): Comment

        likeTodo( id: String!, type: String! ): Todo

        sign( username: String!, password: String!, email: String, type: String! ): Auth
    }

`;

export default typeDefs;