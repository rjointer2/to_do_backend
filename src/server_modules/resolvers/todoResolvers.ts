

const todoResolvers = {

    todos: async( _: never, args: any, context: Auth ) => {
        const { username } : UserPayload = context.verify()
        
    }

}

export default todoResolvers