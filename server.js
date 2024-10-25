const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const uniqid = require('uniqid');
const { promisify } = require('util');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar la sesión
app.use(session({
    secret: 'secret_key', // Cambia a una clave secreta segura en producción
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // En desarrollo, usa false si no estás usando HTTPS
}));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'olimpiadass'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});



app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pedidosPendientesAdmin.html'));
});

app.get('/carga', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cargar_producto.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/register', (req, res) => {
    const { correo, username, nombre, apellido, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = 'INSERT INTO users (correo, username, nombre, apellido, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [correo, username, nombre, apellido, hashedPassword], (err, result) => {
        if (err) throw err;
        res.send('Usuario registrado');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const user = result[0];

            if (bcrypt.compareSync(password, user.password)) {
                res.json({ success: true, username: user.username, userId: user.id_usuario, rol: user.rol });
            } else {
                res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            res.json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Ruta para agregar un producto con un ID único generado
app.post('/agregar-producto', (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    const id_producto = uniqid(); // Genera un ID único para el producto

    console.log('Datos recibidos:', { nombre, descripcion, precio });

    const query = 'INSERT INTO productos (id_producto, nombre, descripcion, precio) VALUES (?, ?, ?, ?)';
    db.query(query, [id_producto, nombre, descripcion, precio], (err, result) => {
        if (err) {
            console.error('Error al insertar el producto en la base de datos:', err);
            return res.status(500).json({ success: false, message: 'Error al agregar el producto' });
        }
        console.log('Producto agregado:', id_producto);
        res.json({ success: true, message: 'Producto agregado exitosamente', id_producto });
    });
});


// Ruta para mostrar la lista de productos
app.get('/productos',  (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al consultar los productos:', err);
            return res.status(500).json({ success: false, message: 'Error al consultar los productos' });
        }
        res.json({ success: true, productos: results });
    });
});

// Ruta para agregar productos al carrito
app.post('/agregar-al-carrito', (req, res) => {
    if (!req.session.carrito) {
        req.session.carrito = [];
    }
    const { id_producto, nombre, precio } = req.body;
    req.session.carrito.push({ id_producto, nombre, precio });
    res.json({ success: true, message: 'Producto agregado al carrito' });
});

// Ruta para ver el carrito
app.post('/carrito', (req, res) => {
    const ids = req.body.ids; // IDs de productos almacenados en localStorage

    if (ids.length === 0) {
        return res.json({ success: true, productos: [] });
    }

    // Crear placeholders para la consulta SQL
    const placeholders = ids.map(() => '?').join(',');
    const sql = `SELECT * FROM productos WHERE id_producto IN (${placeholders})`;

    db.query(sql, ids, (err, result) => {
        if (err) {
            console.error('Error al obtener productos del carrito:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener productos del carrito.' });
        }
        res.json({ success: true, productos: result });
    });
});




// Ruta para procesar la compra
app.post('/comprar', (req, res) => {
    const { direccion, productos, id_usuario, total } = req.body;
    const id_pedido = uniqid(); // Generar ID único para el pedido

    if (productos.length === 0) {
        return res.status(400).json({ success: false, message: 'El carrito está vacío.' });
    }

    const productosString = productos.join(',');

    const sql = `INSERT INTO pedidos (id_pedido, productos, id_usuario, direccion, total) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [id_pedido, productosString, id_usuario, direccion, total], (err) => {
        if (err) {
            console.error('Error al realizar el pedido:', err);
            return res.status(500).json({ success: false, message: 'Error al realizar el pedido.' });
        }
        res.json({ success: true });
    });
});

app.post('/pedidos', async (req, res) => {
    const { id_usuario } = req.body;

    if (!id_usuario) {
        return res.status(400).json({ success: false, message: 'ID de usuario no proporcionado' });
    }

    const query = 'SELECT * FROM pedidos WHERE id_usuario = ?';
    const myQuery = promisify(db.query).bind(db)
    let pedidos = await myQuery(query, [id_usuario])

    pedidos = await Promise.all(pedidos.map(async pedido => {
        const productos = await myQuery('SELECT * FROM productos WHERE id_producto IN (?)', [pedido.productos.split(",")])
        pedido.productos = productos;
        return pedido
    }))

    return res.json({success: true, pedidos})
});

app.get('/pedidos-pendientes-admin', async (req, res) => {

    const query = 'SELECT * FROM pedidos';
    const myQuery = promisify(db.query).bind(db)
    let pedidos = await myQuery(query, [query])

    pedidos = await Promise.all(pedidos.map(async pedido => {
        const productos = await myQuery('SELECT * FROM productos', [pedido.productos.split(",")])
        pedido.productos = productos;
        return pedido
    }))

    return res.json({success: true, pedidos})

});

app.delete('/anular-pedido/:id', (req, res) => {
    const pedidoId = req.params.id;

    const query = "DELETE FROM pedidos WHERE id_pedido = ?";

    db.query(query, [pedidoId], (err, results) => {
        if (err) {
            res.json({ success: false, message: 'Error al anular el pedido.' });
            console.error(err);
        } else {
            res.json({ success: true });
        }
    });
});

app.put('/entregar-pedido/:id', (req, res) => {
    const pedidoId = req.params.id;
    const fechaActual = new Date();

    const querySelect = "SELECT * FROM pedidos WHERE id_pedido = ?";
    const queryInsert = `
        INSERT INTO pedidosEntregados (id_pedido, productos, id_usuario, direccion, total, fecha)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const queryDelete = "DELETE FROM pedidos WHERE id_pedido = ?";

    // Obtener el pedido desde la tabla 'pedidos'
    db.query(querySelect, [pedidoId], (err, results) => {
        if (err || results.length === 0) {
            res.json({ success: false, message: 'Error al obtener el pedido o pedido no encontrado.' });
            console.error(err);
        } else {
            const pedido = results[0];

            // Insertar el pedido en la tabla 'pedidosEntregados'
            db.query(queryInsert, [
                pedido.id_pedido,
                pedido.productos,
                pedido.id_usuario,
                pedido.direccion,
                pedido.total,
                fechaActual
            ], (err) => {
                if (err) {
                    res.json({ success: false, message: 'Error al mover el pedido a pedidosEntregados.' });
                    console.error(err);
                } else {
                    // Eliminar el pedido de la tabla 'pedidos'
                    db.query(queryDelete, [pedidoId], (err) => {
                        if (err) {
                            res.json({ success: false, message: 'Error al eliminar el pedido de pedidos.' });
                            console.error(err);
                        } else {
                            res.json({ success: true });
                        }
                    });
                }
            });
        }
    });
});

app.delete('/eliminar-producto/:pedidoId/:productoId', (req, res) => {
    const { pedidoId, productoId } = req.params;

    db.query(
        'SELECT productos FROM pedidos WHERE id_pedido = ?',
        [pedidoId],
        (error, results) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Error al buscar el pedido.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Pedido no encontrado.' });
            }

            let productos = results[0].productos.split(',').map(id => id.trim());
            productos = productos.filter(id => id !== productoId);

            // Recalcular el total sumando los precios de los productos restantes
            db.query(
                'SELECT SUM(precio) AS nuevoTotal FROM productos WHERE id_producto IN (?)',
                [productos],
                (error, totalResult) => {
                    if (error) {
                        return res.status(500).json({ success: false, message: 'Error al recalcular el total.' });
                    }

                    const nuevoTotal = totalResult[0].nuevoTotal || 0;

                    db.query(
                        'UPDATE pedidos SET productos = ?, total = ? WHERE id_pedido = ?',
                        [productos.join(','), nuevoTotal, pedidoId],
                        (error) => {
                            if (error) {
                                return res.status(500).json({ success: false, message: 'Error al actualizar el pedido.' });
                            }

                            res.json({ success: true, message: 'Producto eliminado y total actualizado correctamente.', nuevoTotal });
                        }
                    );
                }
            );
        }
    );
});





app.listen(3000, () => {
    console.log('Servidor en el puerto 3000');
});
