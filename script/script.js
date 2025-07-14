// consumiendo un json----------
let productosGlobales = [];

// Cargar productos desde JSON
function cargarProductos() {
    fetch('../data/productos.json') 
        .then(response => response.json())
        .then(data => {
            productosGlobales = data;
            dibujarProductos(data);
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            mostrarMensajeError();
        });
}

// Mostrar error en caso de falla
function mostrarMensajeError() {
    const contenedor = document.querySelector('.productos-container');
    if (contenedor) {
        contenedor.innerHTML = '<p style="color: red;">No se pudieron cargar los productos. Intentalo más tarde.</p>';
    }
}

// Crear HTML para un producto
function crearProductoHTML(producto) {
    return `
        <div class="producto">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
            <div class="producto-descripcion">
                <h5>${producto.nombre}</h5>
                <p>${producto.descripcion}</p>
                <h4>$${producto.precio}</h4>
            </div>
            <a href="#" class="carrito" onclick="agregarAlCarrito(${producto.id})">
                <i class="fas fa-shopping-cart"></i>
            </a>
        </div>
    `;
}

// Dibujar productos en el DOM
function dibujarProductos(productos) {
    const contenedor = document.querySelector('.productos-container');
    if (!contenedor) return;

    const productosHTML = productos.map(p => crearProductoHTML(p)).join('');
    contenedor.innerHTML = productosHTML;
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
    const producto = productosGlobales.find(p => p.id === id);
    if (!producto) {
        console.error('Producto no encontrado:', id);
        return;
    }

    let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

    const indiceExistente = carrito.findIndex(p => p.id === id);

    if (indiceExistente !== -1) {
        carrito[indiceExistente].cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`${producto.nombre} fue agregado al carrito`);
}

// Actualizar contador de carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    const contadorElemento = document.getElementById('carrito-contador');
    if (contadorElemento) {
        contadorElemento.textContent = totalItems;
    }
}

// Cargar productos en el carrito (para carrito.html)
function cargarProductosCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    const tabla = document.querySelector('#tabla_carrito');
    if (!tabla) return;

    tabla.innerHTML = ''; // Limpiar

    let subtotalCalculado = 0;

    if (carrito.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Tu carrito está vacío. Agregá productos desde la <a href="./tienda.html">tienda</a>.</td></tr>';
    } else {
        carrito.forEach(producto => {
            const filaHTML = crearFilaProducto(producto);
            tabla.innerHTML += filaHTML;
            subtotalCalculado += producto.precio * producto.cantidad;
        });
    }

    actualizarTotalCarrito(subtotalCalculado);
    eventosFila();
}

// Crear fila HTML para la tabla del carrito
function crearFilaProducto(producto) {
    const productoSubtotal = (producto.precio * producto.cantidad).toFixed(2);
    const displayTitle = producto.nombre.length > 10 ? producto.nombre.substring(0, 10) + '...' : producto.nombre;

    return `
        <tr>
            <td>
                <button id="${producto.id}" class="remove-btn"><i class="far fa-times-circle"></i></button>
            </td>
            <td>
                <img src="${producto.imagen}" alt="${producto.nombre}" style="height: 80px; width: auto; object-fit: contain;">
            </td>
            <td>${displayTitle}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>
                <input type="number" value="${producto.cantidad}" min="1" id="${producto.id}" class="cantidad-producto">
            </td>
            <td>$${productoSubtotal}</td>
        </tr>
    `;
}

// Actualizar total del carrito
function actualizarTotalCarrito(subtotal) {
    document.querySelectorAll('#total').forEach(elemento => {
        elemento.innerHTML = subtotal.toFixed(2);
    });
}

// Asignar eventos a botones de eliminar y cambiar cantidad
function eventosFila() {
    // Eliminar
    document.querySelectorAll('.remove-btn').forEach(boton => {
        boton.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const productId = parseInt(boton.id);
            const indice = carrito.findIndex(p => p.id === productId);

            if (indice !== -1) {
                carrito.splice(indice, 1);
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                cargarProductosCarrito();
                actualizarContadorCarrito();
            }
        });
    });

    // Cambiar cantidad
    document.querySelectorAll('.cantidad-producto').forEach(input => {
        input.addEventListener('change', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const productId = parseInt(input.id);
            const nuevaCantidad = parseInt(input.value);

            if (nuevaCantidad < 1) {
                input.value = 1;
                return;
            }

            const producto = carrito.find(p => p.id === productId);
            if (producto) {
                producto.cantidad = nuevaCantidad;
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                actualizarTotales();
                actualizarContadorCarrito();
            }
        });
    });
}

// Actualizar subtotales individuales y total general
function actualizarTotales() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    let subtotal = 0;

    const filas = document.querySelectorAll('#tabla_carrito tr');
    filas.forEach(fila => {
        const input = fila.querySelector('.cantidad-producto');
        if (input) {
            const id = parseInt(input.id);
            const producto = carrito.find(p => p.id === id);
            if (producto) {
                const subtotalCelda = fila.cells[5];
                const subtotalProducto = (producto.precio * producto.cantidad).toFixed(2);
                subtotalCelda.textContent = `$${subtotalProducto}`;
                subtotal += producto.precio * producto.cantidad;
            }
        }
    });

    actualizarTotalCarrito(subtotal);
}

// Ejecutar funciones al cargar DOM
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();              // para index.html
    cargarProductosCarrito();      // para carrito.html si existe
    actualizarContadorCarrito();   // mostrar el contador desde el inicio
});

// -----------Boton color de pagina------------
//  // Agregamos un manejador de evento clic al botón
//  toggleButton.addEventListener('click', function() {
//     // Verificamos el color de fondo actual y lo cambiamos
//     if (body.classList.contains('dark')) {
//         body.classList.remove('dark');
//         body.classList.add('light');
//     } else {
//         body.classList.remove('light');
//         body.classList.add('dark');
//     }
// });

// Script for navigation bar-----------------------
const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const cerrar = document.getElementById('close');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active')
    })
}

if (cerrar) {
    cerrar.addEventListener('click', (e) => {
        e.preventDefault();
        nav.classList.remove('active')
    })
}