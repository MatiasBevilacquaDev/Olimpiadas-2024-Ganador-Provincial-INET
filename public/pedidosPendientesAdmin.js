document.addEventListener('DOMContentLoaded', function() {
    const  rol = validarAdmin();
    fetch('/pedidos-pendientes-admin', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
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
                        <div class="pedido-total">Total: ${pedido.total} USD</div>
                        <div class="pedido-productos">Productos: ${pedido.productos.map(producto => producto.nombre).join(", ")}</div>
                        <div class="pedido-status">Estado: pendiente de entrega</div>
                        <div class="pedido-actions">
                            <button class="btn-entregado" data-id="${pedido.id_pedido}">Entregado</button>
                            <button class="btn-anular" data-id="${pedido.id_pedido}">Anular</button>
                        </div>
                    `;
                    pedidosContainer.appendChild(pedidoDiv);
                });

                // Añadir event listeners a los botones "Entregado"
                const entregadoButtons = document.querySelectorAll('.btn-entregado');
                entregadoButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const pedidoId = this.getAttribute('data-id');
                        fetch(`/entregar-pedido/${pedidoId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    this.closest('.pedido').remove(); // Eliminar el pedido del DOM
                                } else {
                                    console.error('Error al marcar el pedido como entregado:', data.message);
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    });
                });

                // Añadir event listeners a los botones "Anular"
                const anularButtons = document.querySelectorAll('.btn-anular');
                anularButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const pedidoId = this.getAttribute('data-id');
                        fetch(`/anular-pedido/${pedidoId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    this.closest('.pedido').remove(); // Eliminar el pedido del DOM
                                } else {
                                    console.error('Error al anular el pedido:', data.message);
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    });
                });
            } else {
                console.error('Error al cargar los pedidos:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
