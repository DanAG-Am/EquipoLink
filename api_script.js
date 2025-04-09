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

    document.getElementById('formUpdate').onsubmit = async (e) => {
        e.preventDefault()
        const formUpdate = document.getElementById('formUpdate')
        const data = new FormData(formUpdate)
        const dataObj = Object.fromEntries(data.entries())

        let response = await fetch('http://localhost:3000/api/Jugador',{
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

    document.getElementById('formDelete').onsubmit = async (e) => {
        e.preventDefault()
        const formDelete = document.getElementById('formDelete')
        const data = new FormData(formDelete)
        const dataObj = Object.fromEntries(data.entries())

        // Se asume que se envia userID en el formulario. Si deseas usar otro nombre, ajústalo.
        let response = await fetch(`http://localhost:3000/api/Jugador/${dataObj['userID']}`,{
            method: 'DELETE'
        })

        if (response.ok) {
            let results = await response.json()
            document.getElementById('deleteResults').innerHTML = results.message
        } else {
            document.getElementById('deleteResults').innerHTML = `Error! Status: ${response.status}`
        }
    }

    /*CRUD estadisticas de los jugadores */
    document.getElementById('formSelectEstadisticas').onsubmit = async (e) => {
        e.preventDefault()

        const formSelectUser = document.getElementById('formSelectEstadisticas')
        const data = new FormData(formSelectUser)
        console.log(data)
        const dataObj = Object.fromEntries(data.entries())
        console.log(dataObj);
        let response = await fetch(`http://localhost:3000/api/Estadisticas/${dataObj['id_jugador']}`, {
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
                const container = document.getElementById('getEstadisticasResults')
                container.innerHTML = ''
                container.appendChild(table)
            } else {
                document.getElementById('getEstadisticasResults').innerHTML = 'No hay resultados para mostrar.'
            }
        } else {
            document.getElementById('getEstadisticasResults').innerHTML = response.status
        }
    }

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
        const formUpdate = document.getElementById('formUpdate')
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

    document.getElementById('formDelete').onsubmit = async (e) => {
        e.preventDefault()
        const formDelete = document.getElementById('formDelete')
        const data = new FormData(formDelete)
        const dataObj = Object.fromEntries(data.entries())

        // Se asume que se envia userID en el formulario. Si deseas usar otro nombre, ajústalo.
        let response = await fetch(`http://localhost:3000/api/Estadisticas/${dataObj['userID']}`,{
            method: 'DELETE'
        })

        if (response.ok) {
            let results = await response.json()
            document.getElementById('formDeleteEstadisticas').innerHTML = results.message
        } else {
            document.getElementById('formDeleteEstadisticas').innerHTML = `Error! Status: ${response.status}`
        }
    }
}

// CRUD Enemigos 
    document.getElementById('formSelectEnemigo').onsubmit = async (e) => {
        e.preventDefault()

        const formSelectUser = document.getElementById('formSelectEnemigo')
        const data = new FormData(formSelectUser)
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

    document.getElementById('formUpdateEnemigo').onsubmit = async (e) => {
        e.preventDefault()
        const formUpdate = document.getElementById('formUpdate')
        const data = new FormData(formUpdate)
        const dataObj = Object.fromEntries(data.entries())

        let response = await fetch('http://localhost:3000/api/Enemigo',{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        })

        if (response.ok) {
            let results = await response.json()
            document.getElementById('putEnemigosResults').innerHTML = results.message
        } else {
            document.getElementById('putEnemigosResults').innerHTML = response.status
        }
    }

    document.getElementById('formDeleteEnemigo').onsubmit = async (e) => {
        e.preventDefault()
        const formDelete = document.getElementById('formDeleteEnemigo')
        const data = new FormData(formDelete)
        const dataObj = Object.fromEntries(data.entries())

        // Se asume que se envia userID en el formulario. Si deseas usar otro nombre, ajústalo.
        let response = await fetch(`http://localhost:3000/api/Enemigo/${dataObj['id_enemigo']}`,{
            method: 'DELETE'
        })

        if (response.ok) {
            let results = await response.json()
            document.getElementById('deleteEnemigosResults').innerHTML = results.message
        } else {
            document.getElementById('deleteEnemigosResults').innerHTML = `Error! Status: ${response.status}`
        }
    }

main()