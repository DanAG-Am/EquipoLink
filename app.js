"use strict"

// Importing modules
import express from 'express'
import mysql from 'mysql2/promise'
import fs from 'fs'

const app = express();
const port = 3000;

app.use(express.json())
// Se sirve la carpeta raíz, ten cuidado con la ubicación de tus archivos estáticos
app.use(express.static('./'))

// Función para conectarse a la base de datos
async function connectToDB() {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'EquipoLink',
        password: 'asdf1234',
        database: 'TheLostSentinel'
    })
}

// Ruta para servir la página de statistics
app.get('/statistics', (request, response) => {
    fs.readFile("./Videojuego/Prototipo/html/statistics.html", 'utf8', (err, html) => {
        if (err) response.status(500).send('There was an error: ' + err)
        console.log('Loading page...')
        response.send(html)
    })
})

// GET: Obtener todos los jugadores
app.get('/api/Jugador', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results, fields] = await connection.execute('select * from Jugador')
        console.log(`${results.length} rows returned`)
        response.json(results)
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// GET: Obtener un jugador específico por id
app.get('/api/Jugador/:id_jugador', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results_user, _] = await connection.query('select * from Jugador where id_jugador= ?', [request.params.id_jugador])
        console.log(`${results_user.length} rows returned`)
        response.json(results_user)
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// POST: Insertar un nuevo jugador
app.post('/api/Jugador', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()

        // Mapeamos los campos del formulario a los de la tabla
        const newUser = {
            usuario: request.body.username,
            contrasena: request.body.contrasena,
            id_cuarto: 1,    // valor por defecto (ajústalo según corresponda)
            hp_actual: 100,
            hp_max: 100,
            mp_actual: 100,
            mp_max: 100,
            monedas: 0,
            pociones: 0,
            bombas: 0,
            flechas: 0
        }
        
        const [results, fields] = await connection.query('insert into Jugador set ?', newUser)
        console.log(`${results.affectedRows} row inserted`)
        response.status(201).json({ 'message': "Data inserted correctly.", "id_jugador": results.insertId })
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// PUT: Actualizar un jugador
app.put('/api/Jugador', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        // Se actualizan las columnas 'usuario' y 'contrasena' a partir de 'name' y 'surname'
        const [results, fields] = await connection.query(
            'update Jugador set usuario = ?, contrasena = ? where id_jugador = ?',
            [request.body.name, request.body.surname, request.body.userID]
        )
        console.log(`${results.affectedRows} rows updated`)
        response.json({ 'message': `Data updated correctly: ${results.affectedRows} rows updated.` })
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// DELETE: Eliminar un jugador
app.delete('/api/Jugador/:id_jugador', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results, fields] = await connection.query(
            'delete from Jugador where id_jugador = ?',
            [request.params.id_jugador]
        )
        console.log(`${results.affectedRows} row deleted`)
        response.json({ 'message': `Data deleted correctly: ${results.affectedRows} rows deleted.` })
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})


// Estadisticas CRUD

// GET: Obtener todos los jugadores
app.get('/api/Estadisticas', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results, fields] = await connection.execute('select * from Estadisticas')
        console.log(`${results.length} rows returned`)
        response.json(results)
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// GET: Obtener un jugador específico por id
app.get('/api/Estadisticas/:id_jugador', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results_user, _] = await connection.query('select * from Estadisticas where id_jugador= ?', [request.params.id_jugador])
        console.log(`${results_user.length} rows returned`)
        response.json(results_user)
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// POST: Insertar un nuevo jugador
app.post('/api/Estadisticas', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()

        // Mapeamos los campos del formulario a los de la tabla
        const newStats = {
            id_jugador: request.body.id_jugador, // Pass this in the request body
            enemigos_derrotados: request.body.enemigos_derrotados || 0,
            cofres_abiertos: request.body.cofres_abiertos || 0,
            objetos_usados: request.body.objetos_usados || 0,
            muertes: request.body.muertes || 0,
            tiempo_jugado: request.body.tiempo_jugado || '00:00:00' // Use default if not provided
        }
        
        const [results, fields] = await connection.query('INSERT INTO Estadisticas SET ?', newStats)
        console.log(`${results.affectedRows} row inserted`)
        response.status(201).json({ 'message': "Data inserted correctly.", "id_jugador": results.insertId })
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// PUT: Actualizar un jugador
app.put('/api/Estadisticas', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        // Se actualizan las columnas 'usuario' y 'contrasena' a partir de 'name' y 'surname'
        const [results, fields] = await connection.query(
            'update Jugador set usuario = ?, contrasena = ? where id_jugador = ?',
            [request.body.name, request.body.surname, request.body.userID]
        )
        console.log(`${results.affectedRows} rows updated`)
        response.json({ 'message': `Data updated correctly: ${results.affectedRows} rows updated.` })
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// DELETE: Eliminar un jugador
app.delete('/api/Estadisticas/:id_jugador', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results, fields] = await connection.query(
            'delete from Estadisticas where id_jugador = ?',
            [request.params.id_jugador]
        )
        console.log(`${results.affectedRows} row deleted`)
        response.json({ 'message': `Data deleted correctly: ${results.affectedRows} rows deleted.` })
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

//CRUD Enemigo

// GET: Obtener todos los jugadores
app.get('/api/Enemigo', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results, fields] = await connection.execute('select * from Enemigo')
        console.log(`${results.length} rows returned`)
        response.json(results)
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// GET: Obtener un jugador específico por id
app.get('/api/Enemigo/:id_enemigo', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results_user, _] = await connection.query('select * from Enemigo where id_enemigo= ?', [request.params.id_jugador])
        console.log(`${results_user.length} rows returned`)
        response.json(results_user)
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// POST: Insertar un nuevo jugador
app.post('/api/Enemigo', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()

        // Mapeamos los campos del formulario a los de la tabla
        const newEnemy = {
            id_cuarto: request.body.id_cuarto,  // Reference to the 'Cuarto' table
            nombre: request.body.nombre,        // Name of the enemy
            vida_max: request.body.vida_max,    // Maximum health
            vida_actual: request.body.vida_actual,  // Current health
            velocidad: request.body.velocidad,  // Speed of the enemy
            dano: request.body.dano,            // Damage dealt by the enemy
            drop_monedas: request.body.drop_monedas // Money dropped by the enemy
        };
        
        const [results, fields] = await connection.query('INSERT INTO Enemigo SET ?', newEnemy)
        console.log(`${results.affectedRows} row inserted`)
        response.status(201).json({ 'message': "Data inserted correctly.", "id_enemigo": results.insertId })
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// PUT: Actualizar un jugador
app.put('/api/Enemigo', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        // Se actualizan las columnas 'usuario' y 'contrasena' a partir de 'name' y 'surname'
        const [results, fields] = await connection.query(
            'update Enemigo set usuario = ?, contrasena = ? where id_enemigo = ?',
            [request.body.name, request.body.surname, request.body.userID]
        )
        console.log(`${results.affectedRows} rows updated`)
        response.json({ 'message': `Data updated correctly: ${results.affectedRows} rows updated.` })
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// DELETE: Eliminar un jugador
app.delete('/api/Enemigo/:id_enemigo', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results, fields] = await connection.query(
            'delete from Enemigo where id_enemigo = ?',
            [request.params.id_enemigo]
        )
        console.log(`${results.affectedRows} row deleted`)
        response.json({ 'message': `Data deleted correctly: ${results.affectedRows} rows deleted.` })
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if (connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})