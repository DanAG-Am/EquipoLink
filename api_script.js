function main() {
    // CRUD de los jugadores
    const formSelectUser = document.getElementById('formSelectUser');
    if (formSelectUser) {
        formSelectUser.onsubmit = async (e) => {
            e.preventDefault();

            const data = new FormData(formSelectUser);
            const dataObj = Object.fromEntries(data.entries());
            let response = await fetch(`http://localhost:3000/api/Jugador/${dataObj['id_jugador']}`, {
                method: 'GET'
            });
            if (response.ok) {
                let results = await response.json();
                const container = document.getElementById('getResultsID');
                container.innerHTML = '';

                if (results.length > 0) {
                    results = results.slice(-10);  // Mostrar solo los últimos 10

                    const headers = Object.keys(results[0]);
                    let table = document.createElement("table");
                    let tr = table.insertRow(-1);
                    for (const header of headers) {
                        let th = document.createElement("th");
                        th.innerHTML = header;
                        tr.appendChild(th);
                    }
                    for (const row of results) {
                        let tr = table.insertRow(-1);
                        for (const key in row) {
                            let tabCell = tr.insertCell(-1);
                            tabCell.innerHTML = row[key];
                        }
                    }
                    container.appendChild(table);
                } else {
                    container.innerHTML = 'No hay resultados para mostrar.';
                }
            } else {
                document.getElementById('getResultsID').innerHTML = response.status;
            }
        };
    }

    // CRUD estadísticas de los jugadores
    const formSelectEstadisticas = document.getElementById('formSelectEstadisticas');
    if (formSelectEstadisticas) {
        function createStatBar(label, value, max, color) {
            const percentage = Math.min((value / max) * 100, 100);
            return `
                <div class="stat-item">
                    <span class="stat-label">${label}</span>
                    <div class="stat-bar-container">
                        <div class="stat-bar-fill" style="width: ${percentage}%; background-color: ${color};"></div>
                        <span class="stat-value">${value}</span>
                    </div>
                </div>
            `;
        }

        formSelectEstadisticas.onsubmit = async (e) => {
            e.preventDefault();
            const data = new FormData(formSelectEstadisticas);
            const dataObj = Object.fromEntries(data.entries());
            const id = dataObj['id_jugador'];

            let response = await fetch(`http://localhost:3000/api/Estadisticas/${id}`);
            const container = document.getElementById('getEstadisticasResults');
            container.innerHTML = '';

            if (response.ok) {
                let results = await response.json();

                if (results.length > 0) {
                    results = results.slice(-10);  // Mostrar solo las últimas 10

                    results.forEach(stat => {
                        const card = document.createElement('div');
                        card.classList.add('stat-card');
                    
                        card.innerHTML = `
                            <h3 class="user-title">${stat.usuario}</h3>
                            <div class="stats-grid">
                                ${createStatBar("⚔️ Enemigos derrotados", stat.enemigos_derrotados, 500, "#ff4d4d")}
                                ${createStatBar("🗝️ Cofres abiertos", stat.cofres_abiertos, 100, "#ffc107")}
                                ${createStatBar("🧪 Objetos usados", stat.objetos_usados, 300, "#ff9100")}
                                ${createStatBar("💀 Muertes", stat.muertes, 100, "#b71c1c")}
                                ${createStatBar("⏳ Tiempo jugado (min)", timeToMinutes(stat.tiempo_jugado), 180, "#00bcd4")}
                                ${createStatBar("💣 Bombas usadas", stat.bombas_usadas, 100, "#ba68c8")}
                                ${createStatBar("🏹 Flechas disparadas", stat.flechas_disparadas, 100, "#64b5f6")}
                                ${createStatBar("🧙 Magia usada", stat.magias_usadas, 100, "#81c784")}
                                ${createStatBar("💰 Dinero recolectado", stat.dinero_recolectado, 300, "#ffd700")}
                                ${createStatBar("⚡ Dashes realizados", stat.dashs_realizados, 100, "#ff8a65")}
                                ${createStatBar("👑 Jefes derrotados", stat.jefes_derrotados, 10, "#9575cd")}
                                ${createStatBar("🏁 Niveles completados", stat.niveles_completados, 10, "#4db6ac")}
                                ${createStatBar("🧴 Pociones usadas", stat.pociones_usadas, 100, "#f06292")}
                            </div>
                        `;
                        container.appendChild(card);
                    });
                } else {
                    container.innerHTML = 'No hay resultados para mostrar.';
                }
            } else {
                container.innerHTML = `Error! Status: ${response.status}`;
            }
        };
    }

    // Campeones
    const championButton = document.getElementById('championForm');
    if (championButton) {
        championButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const container = document.getElementById('campeonResults');
            if (!container) return;

            container.innerHTML = 'Cargando campeones...';

            try {
                const response = await fetch('http://localhost:3000/api/Campeon');
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

                const data = await response.json();

                if (data && data.menor_tiempo && data.mas_inventario && data.mas_enemigos) {
                    let htmlContent = '';

                    htmlContent += '<h3 style="margin: 30px;">🏃‍♂️ Jugador más rápido</h3>';
                    data.menor_tiempo.slice(-10).forEach((champion) => {
                        htmlContent += `<p><strong>${champion.usuario}</strong> - Tiempo: ${champion.tiempo_jugado}</p>`;
                    });

                    htmlContent += '<h3 style="margin: 30px;">🎒 Inventario más grande</h3>';
                    data.mas_inventario.slice(-10).forEach((champion) => {
                        htmlContent += `<p><strong>${champion.usuario}</strong> - Objetos: ${champion.total_objetos}</p>`;
                    });

                    htmlContent += '<h3 style="margin: 30px;">⚔️ Más enemigos derrotados</h3>';
                    data.mas_enemigos.slice(-10).forEach((champion) => {
                        htmlContent += `<p><strong>${champion.usuario}</strong> - Enemigos derrotados: ${champion.enemigos_derrotados}</p>`;
                    });

                    container.innerHTML = htmlContent;
                } else {
                    container.innerHTML = 'No se pudieron cargar los datos de campeones.';
                }
            } catch (err) {
                container.innerHTML = 'No se pudieron cargar los datos de campeones.';
            }
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function () {
    main();
});