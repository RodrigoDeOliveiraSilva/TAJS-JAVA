import { createServer } from 'node:http';
import { once } from "node:events";
import Person from "./person.js";

const server = createServer(async (req, res) => {

    if (req.method !== 'POST' || req.url !== '/persons') {
        res.writeHead(404)
            .end()
        return;
    }

    try {
        const data = (await once(req, 'data')).toString();
        const result = Person.process(JSON.parse(data));
        return res.end(JSON.stringify(result));
    } catch (error) {
        if (error.message.includes('required')) {
            res.writeHead(400)
            res.write(
                    JSON.stringify({
                        validationError: error.message
                    }))
            res.end()
            return;
        }
        console.error('Lascou', error)
        res.writeHead(500)
            .end()
    }
})

export default server;

