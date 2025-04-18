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
    console.log('Incoming data:', request.body); // Debug here

    const newUser = {
        usuario: request.body.usuario,
        contrasena: request.body.contrasena,
        id_cuarto: 1,
        hp_actual: 100,
        hp_max: 100,
        mp_actual: 100,
        mp_max: 100,
        monedas: 0,
        pociones: 0,
        bombas: 0,
        flechas: 0
    };

    try {
        const [results, fields] = await connection.query('INSERT INTO Jugador SET ?', newUser);
        console.log(`${results.affectedRows} row inserted`);
        response.status(201).json({ 'message': "Usuario registrado correctamente.", 'id_jugador': results.insertId });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Error al insertar usuario." });
    } finally {
        connection.end();
    }
});

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
        const [results_user, _] = await connection.query('select * from Enemigo where id_enemigo= ?', [request.params.id_enemigo])
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


//campeones 
// Endpoint para obtener los campeones
app.get('/api/Campeon', async (req, res) => {
    let connection = null;

    try {
        connection = await connectToDB();

        // Jugador con menor tiempo jugado
        const [menorTiempo] = await connection.query(`
            SELECT j.usuario, e.tiempo_jugado 
            FROM Estadisticas e 
            JOIN Jugador j ON e.id_jugador = j.id_jugador 
            ORDER BY e.tiempo_jugado ASC 
            LIMIT 1
        `);

        // Jugador con más objetos en el inventario
        const [masInventario] = await connection.query(`
            SELECT j.usuario, SUM(i.cantidad) AS total_objetos 
            FROM Inventario i 
            JOIN Jugador j ON i.id_jugador = j.id_jugador 
            GROUP BY i.id_jugador 
            ORDER BY total_objetos DESC 
            LIMIT 1
        `);

        // Jugador con más enemigos derrotados
        const [masEnemigos] = await connection.query(`
            SELECT j.usuario, e.enemigos_derrotados 
            FROM Estadisticas e 
            JOIN Jugador j ON e.id_jugador = j.id_jugador 
            ORDER BY e.enemigos_derrotados DESC 
            LIMIT 1
        `);

        res.json({
            menor_tiempo: menorTiempo[0] || {},
            mas_inventario: masInventario[0] || {},
            mas_enemigos: masEnemigos[0] || {}
        });

    } catch (error) {
        console.error("Error al obtener campeones:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) connection.end();
    }
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})