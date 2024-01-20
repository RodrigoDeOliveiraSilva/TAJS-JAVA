import server from "./server.js";

if (process.env.NODE_ENV !== 'test') {
    server.listen(process.env.PORT, () => {
        const serveInfo = server.address()
        console.log(`Server running at ${serveInfo.address}:${serveInfo.port}`)
    }) 
}

export default server;

/*
    curl -i -X POST \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "Xuxa Cabral", 
        "cpf": "123.123.123-12"
    }' \
    http://localhost:3000/persons
 */