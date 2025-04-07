function main() {
    // GET: Buscar jugador por ID
    document.getElementById('formSelectJugador').onsubmit = async (e) => {
        e.preventDefault()
        const data = new FormData(formSelectJugador)
        const dataObj = Object.fromEntries(data.entries())
        
        let response = await fetch(`http://localhost:5000/api/jugadores/${dataObj['jugadorID']}`, {
            method: 'GET'
        })
        
        if (response.ok) {
            let results = await response.json()
            if (results.length > 0) {
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
    
    document.getElementById('formInsertJugador').onsubmit = async (e) => {
        e.preventDefault()
        const data = new FormData(formInsertJugador)
        const dataObj = Object.fromEntries(data.entries())
        
        let response = await fetch('http://localhost:5000/api/jugadores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        })
        
        if (response.ok) {
            let results = await response.json()
            document.getElementById('postResults').innerHTML = results.message + ' ID: ' + results.id
        } else {
            document.getElementById('postResults').innerHTML = response.status
        }
    }
    
    document.getElementById('formUpdateJugador').onsubmit = async (e) => {
        e.preventDefault()
        const data = new FormData(formUpdateJugador)
        const dataObj = Object.fromEntries(data.entries())
        
        let response = await fetch('http://localhost:5000/api/jugadores', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        })
        
        if (response.ok) {
            let results = await response.json()
            document.getElementById('putResults').innerHTML = results.message
        } else {
            document.getElementById('putResults').innerHTML = response.status
        }
    }
    
    document.getElementById('formDeleteJugador').onsubmit = async (e) => {
        e.preventDefault()
        const data = new FormData(formDeleteJugador)
        const dataObj = Object.fromEntries(data.entries())
        
        let response = await fetch(`http://localhost:5000/api/jugadores/${dataObj['jugadorID']}`, {
            method: 'DELETE'
        })
        
        if (response.ok) {
            let results = await response.json()
            document.getElementById('deleteResults').innerHTML = results.message
        } else {
            document.getElementById('deleteResults').innerHTML = `Error! Status: ${response.status}`
        }
    }
}

main()