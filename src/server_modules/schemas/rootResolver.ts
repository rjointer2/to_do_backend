
import { todos, addTodo } from '../resolvers/todoResolvers'  

let resolvers = {
    Query: {
        todos
    },
    Mutation: {
        addTodo
    }
}

export default resolvers