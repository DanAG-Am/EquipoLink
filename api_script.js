function main() {
    // GET: Buscar jugador por ID
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
}

main()