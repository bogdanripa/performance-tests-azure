const { app } = require('@azure/functions');

app.http('child', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return { body: 'DONE' };
    }
});
