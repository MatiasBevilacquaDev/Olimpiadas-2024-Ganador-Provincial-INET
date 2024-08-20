document.addEventListener('DOMContentLoaded', function() {

    const idUsuario = validarSession();

    fetch('/productos')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const productosContainer = document.getElementById('productos-container');
                data.productos.forEach(producto => {
                    const productoDiv = document.createElement('div');
                    productoDiv.classList.add('producto');
                    productoDiv.innerHTML = `
                        <div class="nombre">${producto.nombre}</div>
                        <div class="descripcion">${producto.descripcion}</div>
                        <div class="precio">${producto.precio} USD</div>
                        <div class="agregar"><button data-id="${producto.id_producto}">Agregar</button></div>
                    `;
                    productosContainer.appendChild(productoDiv);
                });

                // Agregar evento click a cada botón de agregar
                productosContainer.addEventListener('click', function(event) {
                    if (event.target.tagName === 'BUTTON') {
                        const idProducto = event.target.getAttribute('data-id');
                        addToCart(idProducto);
                    }
                });
            } else {
                console.error('Error al cargar los productos:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function addToCart(idProducto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (!carrito.includes(idProducto)) {
        carrito.push(idProducto);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert('Producto agregado al carrito');
    } else {
        alert('El producto ya está en el carrito');
    }
}
