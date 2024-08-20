document.addEventListener('DOMContentLoaded', function() {
    const idUsuario = validarSession();

    const productIds = JSON.parse(localStorage.getItem('carrito')) || [];

    if (productIds.length === 0) {
        document.getElementById('carrito-container').innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    fetch('/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: productIds })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const carritoContainer = document.getElementById('carrito-container');
                carritoContainer.innerHTML = ''; // Limpiar el contenedor

                let total = 0; // Inicializar el total

                data.productos.forEach(producto => {
                    const productoDiv = document.createElement('div');
                    productoDiv.classList.add('producto');
                    productoDiv.innerHTML = `
                    <div class="nombre">${producto.nombre}</div>
                    <div class="descripcion">${producto.descripcion}</div>
                    <div class="precio">${producto.precio} USD</div>
                `;
                    carritoContainer.appendChild(productoDiv);

                    // Sumar el precio al total
                     total += parseFloat(producto.precio);

                });

                // Mostrar el total
                carritoContainer.innerHTML += `
                <div class="total">
                    <strong>Total: ${total.toFixed(2)} USD</strong>
                </div>
            `;

                // Agregar formulario de dirección y botón de compra
                carritoContainer.innerHTML += `
                <form id="checkout-form">
                    <label for="direccion">Dirección de envío:</label>
                    <input type="text" id="direccion" name="direccion" required>
                    <button type="submit">Comprar</button>
                </form>
            `;

                // Verificar que el formulario existe antes de agregar el event listener
                const checkoutForm = document.getElementById('checkout-form');
                if (checkoutForm) {
                    checkoutForm.addEventListener('submit', function(event) {
                        event.preventDefault();

                        const direccion = document.getElementById('direccion').value;
                        const ids = JSON.parse(localStorage.getItem('carrito')) || [];

                        fetch('/comprar', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                direccion: direccion,
                                productos: ids,
                                id_usuario: idUsuario,
                                total: total
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    localStorage.removeItem('carrito'); // Limpiar el carrito
                                    alert('Compra realizada con éxito');
                                    window.location.href = '/'; // Redirigir al inicio
                                } else {
                                    alert('Error al realizar la compra');
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Error al realizar la compra');
                            });
                    });
                } else {
                    console.error('Formulario de checkout no encontrado.');
                }
            } else {
                console.error('Error al cargar los productos del carrito:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
