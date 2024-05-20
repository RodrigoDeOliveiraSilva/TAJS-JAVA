import { randomUUID } from 'node:crypto'
import { once } from 'node:events'
import { createServer } from 'node:http'
const usersDb = []

function getUserCategory(birthDay) {
    const age = new Date().getFullYear() - new Date(birthDay).getFullYear()
    if (age >= 1 && age <= 17) throw new Error('User must be 18yo older')
    if (age >= 18 && age <= 25) return 'young-adult'
    if (age >= 26 && age <= 50) return 'adult'
    if (age >= 51) return 'senior'
    throw new Error('Invalid age') 
}

const server = createServer(async (req, res) => {
    try {
        if (req.url === '/users' && req.method === 'POST') {
            const user = JSON.parse(await once(req, 'data'))
            const updatedUser = {
                id: randomUUID(),
                ...user,
                category: getUserCategory(user.birthDay)
            }
            usersDb.push(updatedUser)

            res.writeHead(201, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
                id: updatedUser.id
            }))
            return;
        }
        if (req.url.startsWith('/users') && req.method === 'GET') {
            const [, , id] = req.url.split('/')
            const user = usersDb.find(user => user.id === id)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(user))
            return;
        }
    } catch (err) {
        if (err.message.includes('18yo older')) {
            res.writeHead(400, { 'Content-Type': 'application/json' }) // Error de Validação
            res.end(JSON.stringify({
                message: err.message
            }))
            return;
        }
        res.writeHead(500) // Erro do Servidor
        res.end('Error Internal')
        return;
    }


})

export { server };