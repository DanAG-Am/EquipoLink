"use strict"

import express from 'express'
import mysql from 'mysql2/promise'
import fs from 'fs'

const app = express()
const port = 5000

app.use(express.json())

app.get('/', (req, res) => {
    fs.readFile('./html/statistics.html', 'utf8', (err, html)=> {
        if (err) {
            res.status(500).send('Error: ' + err)
            return
        }
        console.log('Cargando la página...')
        res.send(html)
    })
})


app.get('/api/jugadores', async (req, res) => {
    let connection = null
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'EquipoLink',
            password: 'asdf1234',
            database: 'TheLostSentinel'
        })
        const [results] = await connection.execute('SELECT * FROM Jugador')
        console.log(`${results.length} filas retornadas`)
        res.json(results)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    } finally {
        if (connection) {
            connection.end()
            console.log("Conexión cerrada correctamente!")
        }
    }
})

app.get('/api/jugadores/:id', async (req, res) => {
    let connection = null
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'EquipoLink',
            password: 'asdf1234',
            database: 'TheLostSentinel'
        })
        const [results] = await connection.execute('SELECT * FROM Jugador WHERE id_jugador = ?', [req.params.id])
        console.log(`${results.length} filas retornadas`)
        res.json(results)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    } finally {
        if (connection) {
            connection.end()
            console.log("Conexión cerrada correctamente!")
        }
    }
})

app.post('/api/jugadores', async (req, res) => {
    let connection = null
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'EquipoLink',
            password: 'asdf1234',
            database: 'TheLostSentinel'
        })
        const [results] = await connection.query('INSERT INTO Jugador SET ?', req.body)
        console.log(`${results.affectedRows} fila insertada`)
        res.status(201).json({ message: "Jugador insertado correctamente.", id: results.insertId })
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    } finally {
        if (connection) {
            connection.end()
            console.log("Conexión cerrada correctamente!")
        }
    }
})

app.put('/api/jugadores', async (req, res) => {
    let connection = null
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'EquipoLink',
            password: 'asdf1234',
            database: 'TheLostSentinel'
        })
        const { id_jugador, usuario, contrasena } = req.body
        const [results] = await connection.query('UPDATE Jugador SET usuario = ?, contrasena = ? WHERE id_jugador = ?', [usuario, contrasena, id_jugador])
        console.log(`${results.affectedRows} fila(s) actualizada(s)`)
        res.json({ message: `Jugador actualizado correctamente: ${results.affectedRows} fila(s) modificada(s).` })
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    } finally {
        if (connection) {
            connection.end()
            console.log("Conexión cerrada correctamente!")
        }
    }
})

app.delete('/api/jugadores/:id', async (req, res) => {
    let connection = null
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'EquipoLink',
            password: 'asdf1234',
            database: 'TheLostSentinel'
        })
        const [results] = await connection.query('DELETE FROM Jugador WHERE id_jugador = ?', [req.params.id])
        console.log(`${results.affectedRows} fila eliminada`)
        res.json({ message: `Jugador eliminado correctamente: ${results.affectedRows} fila eliminada.` })
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    } finally {
        if (connection) {
            connection.end()
            console.log("Conexión cerrada correctamente!")
        }
    }
})

app.listen(port, () => {
    console.log(`App escuchando en http://localhost:${port}`)
})