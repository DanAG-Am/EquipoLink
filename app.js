"use strict"

// Importing modules
import express from 'express'
import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json())

// Middleware para corregir MIME types
app.use(function(req, res, next) {
  if (req.path.endsWith('.css')) {
    res.type('text/css');
  } else if (req.path.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});

// Servir archivos estáticos del directorio principal
app.use(express.static(path.join(__dirname)));

// Servir archivos estáticos desde Videojuego
app.use('/Videojuego/Assets', express.static(path.join(__dirname, 'Videojuego', 'Videojuego', 'Assets')));

// Servir api_script.js específicamente
app.use('/api_script.js', express.static(path.join(__dirname, 'api_script.js')));

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
});

// Ruta para servir la página de registro
app.get('/register', (request, response) => {
    fs.readFile("./Videojuego/Prototipo/html/register.html", 'utf8', (err, html) => {
        if (err) {
            console.error('Error loading register page:', err);
            response.status(500).send('There was an error: ' + err);
        } else {
            console.log('Loading register page...');
            response.send(html);
        }
    });
});

app.get('/login', (request, response) => {
    fs.readFile("./Videojuego/Prototipo/html/login.html", 'utf8', (err, html) => {
        if (err) {
            console.error('Error loading login page:', err);
            response.status(500).send('There was an error: ' + err);
        } else {
            console.log('Loading login page...');
            response.send(html);
        }
    });
});

app.get('/prototipo', (request, response) => {
    fs.readFile("./Videojuego/Prototipo/html/prototipo.html", 'utf8', (err, html) => {
        if (err) {
            console.error('Error loading prototipo page:', err);
            response.status(500).send('There was an error: ' + err);
        } else {
            console.log('Loading prototipo page...');
            response.send(html);
        }
    });
});

app.get('/creditos', (request, response) => {
    fs.readFile("./Videojuego/Prototipo/html/creditos.html", 'utf8', (err, html) => {
        if (err) {
            console.error('Error loading credits page:', err);
            response.status(500).send('There was an error: ' + err);
        } else {
            console.log('Loading prototipo page...');
            response.send(html);
        }
    });
});


app.get('/assets', (request, response) => {
    fs.readFile("./Videojuego/Prototipo/html/assets.html", 'utf8', (err, html) => {
        if (err) {
            console.error('Error loading assets page:', err);
            response.status(500).send('There was an error: ' + err);
        } else {
            console.log('Loading prototipo page...');
            response.send(html);
        }
    });
});


app.get('/controles', (request, response) => {
    fs.readFile("./Videojuego/Prototipo/html/controles.html", 'utf8', (err, html) => {
        if (err) {
            console.error('Error loading controls page:', err);
            response.status(500).send('There was an error: ' + err);
        } else {
            console.log('Loading prototipo page...');
            response.send(html);
        }
    });
});

app.get('/historia', (request, response) => {
    fs.readFile("./Videojuego/Prototipo/html/historia.html", 'utf8', (err, html) => {
        if (err) {
            console.error('Error loading historia page:', err);
            response.status(500).send('There was an error: ' + err);
        } else {
            console.log('Loading prototipo page...');
            response.send(html);
        }
    });
});

app.get('/', (request, response) => {
    fs.readFile("./Videojuego/Prototipo/html/prototipo.html", 'utf8', (err, html) => {
        if (err) {
            console.error('Error loading prototipo page:', err);
            response.status(500).send('There was an error: ' + err);
        } else {
            console.log('Loading prototipo page...');
            response.send(html);
        }
    });
});

app.get('/pagina_web', (request, response) => {
    fs.readFile("./Videojuego/Prototipo/html/pagina_web.html", 'utf8', (err, html) => {
        if (err) {
            console.error('Error loading pagina web page:', err);
            response.status(500).send('There was an error: ' + err);
        } else {
            console.log('Loading pagina web page...');
            response.send(html);
        }
    });
});

// GET: Obtener todos los jugadores
app.get('/api/Jugador', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results, fields] = await connection.execute('select id_jugador, usuario from Jugador')
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
        const [results_user, _] = await connection.query('select id_jugador, usuario from Jugador where id_jugador= ?', [request.params.id_jugador])
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

// POST: Insertar un nuevo jugador con estadísticas
app.post('/api/Jugador', async (request, response) => {
    let connection = null;

    try {
        connection = await connectToDB();
        
        // Paso 1: Verificar si existe al menos un mapa
        const [mapas] = await connection.query('SELECT id_mapa FROM Mapa LIMIT 1');
        let id_mapa;
        
        // Si no hay mapas, crear uno
        if (!mapas || mapas.length === 0) {
            console.log("No hay mapas disponibles, creando uno nuevo...");
            const newMap = {
                nombre: "Mapa inicial",
                descripcion: "Mapa creado automáticamente para nuevos jugadores",
                tamano_x: 100,
                tamano_y: 100
            };
            
            const [mapResult] = await connection.query('INSERT INTO Mapa SET ?', newMap);
            id_mapa = mapResult.insertId;
            console.log(`Mapa creado con ID: ${id_mapa}`);
        } else {
            id_mapa = mapas[0].id_mapa;
        }
        
        // Paso 2: Verificar si hay cuartos disponibles
        const [cuartos] = await connection.query('SELECT id_cuarto FROM Cuarto LIMIT 1');
        let id_cuarto;
        
        // Si no hay cuartos, crear uno
        if (!cuartos || cuartos.length === 0) {
            console.log("No hay cuartos disponibles, creando uno nuevo...");
            const newRoom = {
                id_mapa: id_mapa,
                descripcion: "Cuarto inicial para nuevos jugadores",
                tipo: "normal",
                acceso_bloqueado: false
            };
            
            const [roomResult] = await connection.query('INSERT INTO Cuarto SET ?', newRoom);
            id_cuarto = roomResult.insertId;
            console.log(`Cuarto creado con ID: ${id_cuarto}`);
        } else {
            id_cuarto = cuartos[0].id_cuarto;
        }
        
        // Paso 3: Crear el jugador con un id_cuarto válido
        const newUser = {
            usuario: request.body.usuario,
            contrasena: request.body.contrasena,
            id_cuarto: id_cuarto,
            hp_actual: 100,
            hp_max: 100,
            mp_actual: 100,
            mp_max: 100,
            monedas: 0,
            pociones: 0,
            bombas: 0,
            flechas: 0
        };
        
        const [userResults] = await connection.query('INSERT INTO Jugador SET ?', newUser);
        const id_jugador = userResults.insertId;
        console.log(`Jugador insertado con ID: ${id_jugador}`);
        
        const initialStats = {
            id_jugador: id_jugador,
            enemigos_derrotados: 0,
            cofres_abiertos: 0,
            objetos_usados: 0,
            muertes: 0,
            tiempo_jugado: '00:00:00'
        };
        
        await connection.query('INSERT INTO Estadisticas SET ?', initialStats);
        console.log(`Estadísticas iniciales creadas para el jugador ${id_jugador}`);
        
        response.status(201).json({ 
            'message': "Usuario registrado correctamente con estadísticas iniciales.", 
            'id_jugador': id_jugador
        });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            response.status(400).json({ message: "Este nombre de usuario ya está registrado." });
        } else {
            response.status(500).json({ message: "Error al insertar usuario: " + error.message });
        }
    }
    finally {
        if (connection !== null) {
            connection.end();
            console.log("Connection closed successfully!");
        }
    }
});

app.post('/api/login', async (request, response) => {
    let connection = null;

    try {
        const { usuario, contrasena } = request.body;

        if (!usuario || !contrasena) {
            return response.status(400).json({ message: "Faltan usuario o contraseña." });
        }

        connection = await connectToDB();

        const [rows] = await connection.query(
            'SELECT id_jugador, contrasena FROM Jugador WHERE usuario = ?',
            [usuario]
        );

        if (rows.length === 0) {
            return response.status(401).json({ message: "Usuario no encontrado." });
        }

        const jugador = rows[0];

        if (jugador.contrasena !== contrasena) {
            return response.status(401).json({ message: "Contraseña incorrecta." });
        }

        // Login exitoso
        return response.status(200).json({ 
            message: "Login exitoso", 
            id_jugador: jugador.id_jugador 
        });

    } catch (error) {
        console.error("Error en login:", error);
        response.status(500).json({ message: "Error en el servidor: " + error.message });
    } finally {
        if (connection) {
            connection.end();
        }
    }
});


// Estadisticas CRUD

// Ruta: Obtener estadísticas de todos los jugadores con sus nombres
app.get('/api/Estadisticas', async (req, res) => {
    let connection = null;

    try {
        // Conexión a la base de datos
        connection = await connectToDB();

        // Consulta que une Estadísticas con el nombre del jugador
        const [results] = await connection.execute(`
            SELECT 
                Jugador.usuario,
                Estadisticas.enemigos_derrotados,
                Estadisticas.cofres_abiertos,
                Estadisticas.objetos_usados,
                Estadisticas.muertes,
                Estadisticas.tiempo_jugado
            FROM Estadisticas
            INNER JOIN Jugador USING (id_jugador)
        `);

        console.log(`${results.length} registros encontrados`);
        res.json(results);
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({ message: "Error del servidor", error });
    } finally {
        if (connection) {
            await connection.end();
            console.log("Conexión cerrada correctamente");
        }
    }
});


// GET: Obtener un jugador específico por id
app.get('/api/Estadisticas/:usuario', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results_user, _] = await connection.query(`
            SELECT 
            Jugador.usuario,
            Estadisticas.enemigos_derrotados,
            Estadisticas.cofres_abiertos,
            Estadisticas.objetos_usados,
            Estadisticas.muertes,
            Estadisticas.tiempo_jugado
            FROM Estadisticas 
            LEFT JOIN Jugador ON Estadisticas.id_jugador = Jugador.id_jugador 
            WHERE Jugador.usuario = ?
        `, [request.params.usuario]) 
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
});

// PUT: Actualizar estadísticas de un jugador
app.put('/api/Estadisticas', async (request, response) => {
    let connection = null;

    try {
        connection = await connectToDB();

        // Mapeamos los campos del cuerpo de la solicitud a los de la tabla
        const updatedStats = {
            id_jugador: request.body.id_jugador,
            enemigos_derrotados: request.body.enemigos_derrotados || 0,
            cofres_abiertos: request.body.cofres_abiertos || 0,
            objetos_usados: request.body.objetos_usados || 0,
            muertes: request.body.muertes || 0,
            tiempo_jugado: request.body.tiempo_jugado || '00:00:00' // Usar valor por defecto si no se proporciona
        };

        // Aquí estamos usando el `id_jugador` para actualizar las estadísticas de ese jugador
        const [results, fields] = await connection.query(
            'UPDATE Estadisticas SET ? WHERE id_jugador = ?',
            [updatedStats, request.body.id_jugador]
        );

        if (results.affectedRows === 0) {
            // Si no se encuentra el jugador, lo creamos (fallback)
            const [insertResults] = await connection.query('INSERT INTO Estadisticas SET ?', updatedStats);
            response.status(201).json({ message: 'Estadísticas insertadas correctamente', id_jugador: insertResults.insertId });
        } else {
            response.status(200).json({ message: 'Estadísticas actualizadas correctamente' });
        }
    } catch (error) {
        response.status(500).json(error);
        console.error(error);
    } finally {
        if (connection !== null) {
            connection.end();
            console.log("Connection closed successfully!");
        }
    }
});



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