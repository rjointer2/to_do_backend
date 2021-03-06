
// grab the module to create type definitions
const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type Auth {
        token: String
        user: User
    }

    type User {
        id: String!
        email: String!
        username: String!
        password: String!
        todos: [Todo]
        comments: [Comment]
        picture: String
    }

    type Comment {
        id: String!
        createdBy: User
        comment: String!
        todo: Todo
        createdAt: String
    }

    type Todo {
        id: String!
        completed: Boolean
        subject: String!
        todo: String!
        likedBy: [User]
        createdBy: User
        dueDate: String!
        didUserLike: Boolean
        comments: [Comment]
        createdAt: String!
    }


    type Query {
        me: User
        user( id: String! ): User
        todos( offset: Int!, limit: Int! ): [Todo]
        getTodoById( id: String! ): Todo
        getTodosById( id: String! ): [Todo]
        comments: [Comment]
    }

    type Mutation {
        
        addComment( createdBy: String!, comment: String!, todoID: String! ): Comment
        deleteComment( id: String ): Comment

        searchUsers( value: String! ): [User]
        searchTodos( value: String! ): [Todo]

        likeTodo( id: String!, type: String! ): Todo
        addTodo( subject: String!, dueDate: String! todo: String! ): Todo
        updateTodo( option: String!, id: String!, value: String! ): Todo
        deleteTodo( id: String! ): Todo

        deleteUser( password: String! ): User
        updateUser( picture: String, username: String, password: String, email: String, confirmPassword: String ): User
        sign( username: String, password: String, email: String, type: String! ): Auth
    }

`;

export default typeDefs;