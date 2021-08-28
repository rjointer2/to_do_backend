

const todoResolvers = {

    todos: async( _: never, args: any, context: Auth ) => {
        const { username, email, id } = context.verify() as UserPayload;
        
    }

}

export default todoResolvers