const { app } = require('@azure/functions');
const https = require('https');
const { lookup } = require('dns').promises;

app.http('parent', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        console.log('START');
        const host = 'geneziochild.azurewebsites.net';
        const hostIp = (await lookup(host)).address;
        console.log("Calling " + host + " / " + hostIp);

        const options = {
            hostname: hostIp,
            port: 443, // Use the correct port for HTTPS, typically 443
            path: '/api/child', // Specify the endpoint path
            method: 'GET',
            rejectUnauthorized: false, // Ignore invalid or self-signed certificates
            headers: {
            'host': host
            },
            servername: host
        };
    
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const request = https.request(options, (res) => {
            
            // Accumulate data as it comes in
            res.on('data', (chunk) => {
                //console.log(chunk.toString());
            });
            
            // Log the response data once the entire response is received
            res.on('end', () => {
                    const fetchTime = Date.now() - startTime;
                    console.log(`DONE in ${fetchTime}`);
                    resolve({body: `${fetchTime}`});
                });
            });
    
            // Log errors if they occur
            request.on('error', (error) => {
                console.log(error);
                reject({ body: `${error.toString()}` });
            });
    
            // Send the request
            request.end();
        });
    }
});