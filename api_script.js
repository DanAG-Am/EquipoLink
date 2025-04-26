function main() {
    // CRUD de los jugadores
    const formSelectUser = document.getElementById('formSelectUser');
    if (formSelectUser) {
        formSelectUser.onsubmit = async (e) => {
            e.preventDefault()

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
    }

    /*CRUD estadisticas de los jugadores */
    const formSelectEstadisticas = document.getElementById('formSelectEstadisticas');
    if (formSelectEstadisticas) {
        formSelectEstadisticas.onsubmit = async (e) => {
            e.preventDefault();
        
            const data = new FormData(formSelectEstadisticas);
            const dataObj = Object.fromEntries(data.entries());
        
            const id = dataObj['id_jugador'];
        
            let response = await fetch(`http://localhost:3000/api/Estadisticas/${id}`, {
                method: 'GET'
            });
        
            if (response.ok) {
                let results = await response.json();
        
                const container = document.getElementById('getEstadisticasResults');
                if (container) {
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
                }
            } else {
                const resultsContainer = document.getElementById('getEstadisticasResults');
                if (resultsContainer) {
                    resultsContainer.innerHTML = `Error! Status: ${response.status}`;
                }
            }
        };
    }
    

    const formUpdateEstadisticas = document.getElementById('formUpdateEstadisticas');
    if (formUpdateEstadisticas) {
        formUpdateEstadisticas.onsubmit = async (e) => {
            e.preventDefault()
            const data = new FormData(formUpdateEstadisticas)
            const dataObj = Object.fromEntries(data.entries())

            let response = await fetch('http://localhost:3000/api/Estadisticas',{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataObj)
            })

            if (response.ok) {
                let results = await response.json()
                const resultsContainer = document.getElementById('putEstadisticasResults');
                if (resultsContainer) {
                    resultsContainer.innerHTML = results.message;
                }
            } else {
                const resultsContainer = document.getElementById('putEstadisticasResults');
                if (resultsContainer) {
                    resultsContainer.innerHTML = response.status;
                }
            }
        }
    }

    // Campeones 
    const championButton = document.getElementById('championForm');
    if (championButton) {
        championButton.addEventListener('click', async (e) => {
            e.preventDefault();  // Esto previene que el formulario se envíe normalmente

            const container = document.getElementById('campeonResults');
            if (!container) return;
            
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
}

// Espera a que el DOM esté completamente cargado antes de ejecutar main()
document.addEventListener('DOMContentLoaded', function() {
    main();
});