document.addEventListener('DOMContentLoaded', function() {
    const  rol = validarAdmin();
});

document.getElementById('productoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;

    console.log('Enviando datos:', { nombre, descripcion, precio });

    fetch('/agregar-producto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, descripcion, precio })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Red error: ' + response.statusText);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('resultado').textContent = 'Ocurrió un error al intentar agregar el producto.';
        });

    document.getElementById('productoForm').reset();
});
