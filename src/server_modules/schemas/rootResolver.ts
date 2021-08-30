
import { todos, addTodo, likeTodo, getTodoById } from '../resolvers/todoResolvers';
import { me, sign } from '../resolvers/userResolvers';
import { addComment, deleteComment }  from '../resolvers/commentResolvers';

let resolvers = {
    Query: {
        me,
        todos,
        getTodoById
    },
    Mutation: {
        deleteComment,
        addComment,
        likeTodo,
        addTodo,
        sign
    }
}

export default resolvers