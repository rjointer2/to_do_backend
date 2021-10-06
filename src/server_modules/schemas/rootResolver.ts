
import { todos, addTodo, likeTodo, getTodoById, updateTodo, deleteTodo, searchTodos } from '../resolvers/todoResolvers';
import { me, sign, user, searchUsers, updateUser, deleteUser } from '../resolvers/userResolvers';
import { addComment, deleteComment }  from '../resolvers/commentResolvers';

let resolvers = {
    Query: {
        me,
        user,
        todos,
        getTodoById,
    
    },
    Mutation: {
        deleteComment,
        searchUsers,
        searchTodos,
        deleteUser,
        updateUser,
        updateTodo,
        deleteTodo,
        addComment,
        likeTodo,
        addTodo,
        sign
    }
}

export default resolvers