document.addEventListener('DOMContentLoaded', function() {
    const userId = validarSession();

    fetch('/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_usuario: userId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const pedidosContainer = document.getElementById('pedidos-container');
                pedidosContainer.innerHTML = ''; // Limpiar el contenedor

                data.pedidos.forEach(pedido => {
                    const pedidoDiv = document.createElement('div');
                    pedidoDiv.classList.add('pedido');
                    pedidoDiv.innerHTML = `
                        <div class="pedido-id">ID Pedido: ${pedido.id_pedido}</div>
                        <div class="pedido-direccion">Dirección: ${pedido.direccion}</div>
                        <div class="pedido-total">Total: <span class="pedido-total-amount">${pedido.total}</span> USD</div>
                        <div class="pedido-productos">
                            Productos: ${pedido.productos.map(producto => `
                                <div class="producto-item">
                                    ${producto.nombre}
                                    <button class="btn-eliminar-producto" data-pedido-id="${pedido.id_pedido}" data-producto-id="${producto.id_producto}">Eliminar</button>
                                </div>
                            `).join("")}
                        </div>
                        <button class="btn-anular" data-id="${pedido.id_pedido}">Anular</button>
                        <button class="btn-modificar" data-id="${pedido.id_pedido}">Modificar</button>
                    `;
                    pedidosContainer.appendChild(pedidoDiv);
                });

                // Añadir event listeners a los botones de eliminar producto
                const eliminarProductoButtons = document.querySelectorAll('.btn-eliminar-producto');
                eliminarProductoButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const pedidoId = this.getAttribute('data-pedido-id');
                        const productoId = this.getAttribute('data-producto-id');

                        fetch(`/eliminar-producto/${pedidoId}/${productoId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    // Eliminar el producto del DOM
                                    this.closest('.producto-item').remove();

                                    // Actualizar el total en el DOM
                                    const pedidoDiv = this.closest('.pedido');
                                    const totalElement = pedidoDiv.querySelector('.pedido-total-amount');
                                    totalElement.textContent = data.nuevoTotal;
                                } else {
                                    console.error('Error al eliminar el producto:', data.message);
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    });
                });

                // Añadir event listeners a los botones de anular pedido y modificar pedido
                // ...
            } else {
                console.error('Error al cargar los pedidos:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
