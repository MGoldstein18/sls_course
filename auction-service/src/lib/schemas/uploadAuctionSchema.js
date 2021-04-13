const schema = {
    properties: {
        body: {
            type: 'string',
            minLength: 1,
            patter: '\=$'
        }
    }, 
    required: ['body']
}

export default schema