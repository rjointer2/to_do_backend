
// grab the module to create type definitions
const { gql } = require('apollo-server-express');

const typeDefs = gql`

    input KeyValuePair {
        key: String!
        value: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type User {
        id: ID!
        email: String!
        username: String!
        password: String!
        todos: [Todo]
        comments: [Comment]
        friends: [User]
    }

    type Comment {
        id: ID!
        createdBy: User
        comment: String!
        todo: Todo
        createdAt: String
    }

    type Todo {
        id: ID!
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
        
        addTodo( subject: String!, createdBy: String!, dueDate: String! todo: String! ): Todo
        addComment( createdBy: String!, comment: String!, todoID: String! ): Comment
        deleteComment( id: String ): Comment

        likeTodo( id: String!, type: String! ): Todo

        sign( username: String!, password: String!, email: String, type: String! ): Auth
    }

`;

export default typeDefs;