function validarSession() {
    const session = JSON.parse(window.localStorage.getItem("session"))

    if (!session) {
        window.location.href = "/login"
        return
    }

    return session.id
}

function validarAdmin() {
    const session = JSON.parse(window.localStorage.getItem("session"))

    if (!session || session.rol !== 'admin') {
        window.location.href = "/login"
        return
    }
}