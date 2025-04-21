function main() {
    // CRUD de los jugadores
    document.getElementById('formSelectUser').onsubmit = async (e) => {
        e.preventDefault()

        const formSelectUser = document.getElementById('formSelectUser')
        const data = new FormData(formSelectUser)
        console.log(data)
        const dataObj = Object.fromEntries(data.entries())
        console.log(dataObj);
        let response = await fetch(`http://localhost:3000/api/Jugador/${dataObj['id_jugador']}`, {
            method: 'GET'
        })
        console.log(response);
        if(response.ok)
        {
            let results = await response.json()

            if(results.length > 0)
            {
                const headers = Object.keys(results[0])
                let table = document.createElement("table")
                let tr = table.insertRow(-1)
                for (const header of headers) {
                    let th = document.createElement("th")
                    th.innerHTML = header
                    tr.appendChild(th)
                }
                for (const row of results) {
                    let tr = table.insertRow(-1)
                    for (const key in row) {
                        let tabCell = tr.insertCell(-1)
                        tabCell.innerHTML = row[key]
                    }
                }
                const container = document.getElementById('getResultsID')
                container.innerHTML = ''
                container.appendChild(table)
            } else {
                document.getElementById('getResultsID').innerHTML = 'No hay resultados para mostrar.'
            }
        } else {
            document.getElementById('getResultsID').innerHTML = response.status
        }
    }

    document.getElementById('formInsert').onsubmit = async (e) => {
        e.preventDefault()
        const formInsert = document.getElementById('formInsert')
        const data = new FormData(formInsert)
        const dataObj = Object.fromEntries(data.entries())

        let response = await fetch('http://localhost:3000/api/Jugador',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        })

        if (response.ok) {
            let results = await response.json()
            document.getElementById('postResults').innerHTML = results.message + ' ID: ' + results.id_jugador
        } else {
            document.getElementById('postResults').innerHTML = response.status
        }
    }

    /*CRUD estadisticas de los jugadores */
    document.getElementById('formSelectEstadisticas').onsubmit = async (e) => {
        e.preventDefault();
    
        const form = document.getElementById('formSelectEstadisticas');
        const data = new FormData(form);
        const dataObj = Object.fromEntries(data.entries());
    
        const id = dataObj['id_jugador'];
    
        let response = await fetch(`http://localhost:3000/api/Estadisticas/${id}`, {
            method: 'GET'
        });
    
        if (response.ok) {
            let results = await response.json();
    
            const container = document.getElementById('getEstadisticasResults');
            if (results.length > 0) {
                const headers = Object.keys(results[0]);
                let table = document.createElement("table");
    
                // Header
                let tr = table.insertRow(-1);
                for (const header of headers) {
                    let th = document.createElement("th");
                    th.innerHTML = header;
                    tr.appendChild(th);
                }
    
                // Rows
                for (const row of results) {
                    let tr = table.insertRow(-1);
                    for (const key in row) {
                        let tabCell = tr.insertCell(-1);
                        tabCell.innerHTML = row[key];
                    }
                }
    
                container.innerHTML = '';
                container.appendChild(table);
            } else {
                container.innerHTML = 'No hay resultados para mostrar.';
            }
        } else {
            document.getElementById('getEstadisticasResults').innerHTML = `Error! Status: ${response.status}`;
        }
    };
    
    document.getElementById('formInsertEstadisticas').onsubmit = async (e) => {
        e.preventDefault()
        const formInsert = document.getElementById('formInsertEstadisticas')
        const data = new FormData(formInsert)
        const dataObj = Object.fromEntries(data.entries())

        let response = await fetch('http://localhost:3000/api/Estadisticas',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        })

        if (response.ok) {
            let results = await response.json()
            document.getElementById('postEstadisticasResults').innerHTML = results.message + ' ID: ' + results.id_jugador
        } else {
            document.getElementById('postEstadisticasResults').innerHTML = response.status
        }
    }

    document.getElementById('formUpdateEstadisticas').onsubmit = async (e) => {
        e.preventDefault()
        const formUpdate = document.getElementById('formUpdateEstadisticas')
        const data = new FormData(formUpdate)
        const dataObj = Object.fromEntries(data.entries())

        let response = await fetch('http://localhost:3000/api/Estadisticas',{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        })

        if (response.ok) {
            let results = await response.json()
            document.getElementById('putEstadisticasResults').innerHTML = results.message
        } else {
            document.getElementById('putEstadisticasResults').innerHTML = response.status
        }
    }

    document.getElementById('formDeleteEstadisticas').onsubmit = async (e) => {
        e.preventDefault()
        const formDelete = document.getElementById('formDeleteEstadisticas')
        const data = new FormData(formDelete)
        const dataObj = Object.fromEntries(data.entries())

        // Se asume que se envia userID en el formulario. Si deseas usar otro nombre, ajústalo.
        let response = await fetch(`http://localhost:3000/api/Estadisticas/${dataObj['id_jugador']}`,{
            method: 'DELETE'
        })

        if (response.ok) {
            let results = await response.json()
            document.getElementById('deleteEstadisticasResults').innerHTML = results.message
        } else {
            document.getElementById('deleteEstadisticasResults').innerHTML = `Error! Status: ${response.status}`
        }
    }

document.getElementById('formSelectEnemigo').onsubmit = async (e) => {
    e.preventDefault()

    const formSelectEnemigo = document.getElementById('formSelectEnemigo')
    const data = new FormData(formSelectEnemigo)
    console.log(data)
    const dataObj = Object.fromEntries(data.entries())
    console.log(dataObj);
    let response = await fetch(`http://localhost:3000/api/Enemigo/${dataObj['id_enemigo']}`, {
        method: 'GET'
    })
    console.log(response);
    if(response.ok)
    {
        let results = await response.json()

        if(results.length > 0)
        {
            const headers = Object.keys(results[0])
            let table = document.createElement("table")
            let tr = table.insertRow(-1)
            for (const header of headers) {
                let th = document.createElement("th")
                th.innerHTML = header
                tr.appendChild(th)
            }
            for (const row of results) {
                let tr = table.insertRow(-1)
                for (const key in row) {
                    let tabCell = tr.insertCell(-1)
                    tabCell.innerHTML = row[key]
                }
            }
            const container = document.getElementById('getEnemigosResults')
            container.innerHTML = ''
            container.appendChild(table)
        } else {
            document.getElementById('getEnemigosResults').innerHTML = 'No hay resultados para mostrar.'
        }
    } else {
        document.getElementById('getEnemigosResults').innerHTML = response.status
    }
}

    document.getElementById('formInsertEnemigo').onsubmit = async (e) => {
        e.preventDefault()
        const formInsert = document.getElementById('formInsertEnemigo')
        const data = new FormData(formInsert)
        const dataObj = Object.fromEntries(data.entries())

        let response = await fetch('http://localhost:3000/api/Enemigo',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        })

        if (response.ok) {
            let results = await response.json()
            document.getElementById('postEnemigosResults').innerHTML = results.message + ' ID: ' + results.id_jugador
        } else {
            document.getElementById('postEnemigosResults').innerHTML = response.status
        }
    }

// Campeones 
document.getElementById('championForm').addEventListener('click', async (e) => {
    e.preventDefault();  // Esto previene que el formulario se envíe normalmente

    const container = document.getElementById('campeonResults');
    container.innerHTML = 'Cargando campeones...';

    try {
        const response = await fetch('http://localhost:3000/api/Campeon');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        console.log('Datos de campeones:', data);  // Aquí imprimimos los datos para inspeccionar su estructura

        // Verifica si los datos tienen la propiedad `menor_tiempo`, `mas_inventario`, `mas_enemigos`
        if (data && data.menor_tiempo && data.mas_inventario && data.mas_enemigos) {
            container.innerHTML = `
            <h3 style="margin: 10px;">🏃‍♂️ Jugador más rápido</h3>
            <p style="margin-top: 20px;"><strong>${data.menor_tiempo.usuario}</strong> - Tiempo: ${data.menor_tiempo.tiempo_jugado}</p>
        
            <h3 style="margin: 10px;">🎒 Inventario más grande</h3>
            <p style="margin-top: 20px;"><strong>${data.mas_inventario.usuario}</strong> - Objetos: ${data.mas_inventario.total_objetos}</p>
        
            <h3 style="margin: 10px;">⚔️ Más enemigos derrotados</h3>
            <p style="margin-top: 20px;"><strong>${data.mas_enemigos.usuario}</strong> - Enemigos derrotados: ${data.mas_enemigos.enemigos_derrotados}</p>
        `;        
        } else {
            container.innerHTML = 'No se pudieron cargar los datos de campeones.';
        }
    } catch (err) {
        console.error("Error al cargar campeones:", err);
        container.innerHTML = 'No se pudieron cargar los datos de campeones.';
    }
});

}

main();