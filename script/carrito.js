// document.addEventListener('DOMContentLoaded', () => {
//     cargarProductos();
//     cargarProductosCarrito();
//     actualizarContadorCarrito(); // también puede ir acá si querés mostrar el contador siempre
// });

// // ----------------------------------------------------------------------- //
// // Cargamos los productos que se encuentran en localStorage
// function cargarProductosCarrito() {
//     // Obtenemos el carrito
//     const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

//     document.querySelector('#tabla_carrito').innerHTML = ''; // Limpiar el contenido existente de la tabla

//     let subtotalCalculado = 0;

//     if (carrito.length === 0) {
//         // Mostrar mensaje si el carrito está vacío
//         document.querySelector('#tabla_carrito').innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Tu carrito está vacío. Agrega productos desde la <a href="./tienda.html">tienda</a>.</td></tr>';
//     } else {
//         carrito.forEach(producto => {
//             const filaHTML = crearFilaProducto(producto);
//             document.querySelector('#tabla_carrito').innerHTML += filaHTML; // Añadir la fila al tbody
//             subtotalCalculado += producto.precio * producto.cantidad;
//         });
//     }

//     // Actualizar el subtotal y el total en la sección de resumen
//     actualizarTotalCarrito(subtotalCalculado);

//     // Eventos a botones de eliminar o campos de cantidad 
//     eventosFila();
// }

// // ---------------------------------------------- //
// // Funciones auxiliares

// function crearFilaProducto(producto) {
//     const productoSubtotal = (producto.precio * producto.cantidad).toFixed(2);
//     const displayTitle = producto.nombre.substring(0, 10) + '...';
//     return `
//         <tr>
//             <td>
//                 <button id="${producto.id}" class="remove-btn"><i class="far fa-times-circle"></i></button>
//             </td>
//             <td>
//                 <img src="${producto.imagen}" alt="${producto.nombre}" style="height: 80px; width: auto; object-fit: contain;">
//             </td>
//             <td>${display}</td>
//             <td>$${producto.precio.toFixed(2)}</td>
//             <td>
//                 <input type="number" value="${producto.cantidad}" min="1" id="${producto.id}" class="cantidad-producto">
//             </td>
//             <td>$${productoSubtotal}</td>
//         </tr>
//    `;
// }


// function actualizarTotalCarrito(subtotal) {
//     document.querySelectorAll('#total').forEach(elemento => elemento.innerHTML = subtotal.toFixed(2))
// }

// // ------------------------------------------------- //
// // Lógica para eliminar o cambiar cantidad

// function eventosFila() {

//     // Eventos para botones de eliminar
//     //const botonesEliminar = document.querySelectorAll('.remove-btn');
//     document.querySelectorAll('.remove-btn').forEach(boton => {
//         boton.addEventListener('click', () => {
//             // Obtenemos el carrito
//             const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
//             //obtenemos el id del boton
//             const productId = parseInt(boton.id);
//             // Encontrar el índice del producto en el carrito
//             const indiceProducto = carrito.findIndex(producto => producto.id === productId);
//             //console.log(indiceProducto)
//             if (indiceProducto !== -1) {
//                 // Eliminar el producto del array
//                 carrito.splice(indiceProducto, 1);

//                 // Actualizar localStorage
//                 localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));

//                 // Recargar la vista del carrito
//                 cargarProductosCarrito();

//                 console.log(`Producto con ID ${productId} eliminado del carrito`);
//             }

//         });
//     });


//     // Eventos para cambiar cantidad

//     document.querySelectorAll('.cantidad-producto').forEach(input => {
//         input.addEventListener('change', () => {
//             // Obtenemos el carrito
//             const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
//             // Obtener el input que fue modificado
//             const input = document.activeElement;
//             const productId = parseInt(input.id);
//             const nuevaCantidad = parseInt(input.value);

//             // Validar que la cantidad sea válida
//             if (nuevaCantidad < 1) {
//                 input.value = 1;
//                 return;
//             }

//             // Encontrar el producto en el carrito
//             const producto = carrito.find(item => item.id === productId);

//             if (producto) {
//                 // Actualizar la cantidad
//                 producto.cantidad = nuevaCantidad;

//                 // Actualizar localStorage
//                 localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));

//                 // Recalcular y actualizar solo los totales (sin recargar toda la tabla)
//                 actualizarTotales();

//                 console.log(`Cantidad del producto ID ${productId} actualizada a ${nuevaCantidad}`);
//             }
//         });
//     });

// }

// function actualizarTotales() {
//     // Obtenemos el carrito
//     const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
//     let subtotalCalculado = 0;

//     // Recalcular subtotal
//     carrito.forEach(producto => {
//         subtotalCalculado += producto.precio * producto.cantidad;
//     });

//     // Actualizar subtotales individuales en la tabla
//     const filas = document.querySelectorAll('#tabla_carrito tr');
//     filas.forEach(fila => {
//         const input = fila.querySelector('.cantidad-producto');
//         if (input) {
//             const productId = parseInt(input.id);
//             const producto = carrito.find(item => item.id === productId);
//             if (producto) {
//                 const subtotalCelda = fila.cells[5]; // La celda del subtotal es la sexta (índice 5)
//                 const subtotalProducto = (producto.precio * producto.cantidad).toFixed(2);
//                 subtotalCelda.textContent = `$${subtotalProducto}`;
//             }
//         }
//     });

//     // Actualizar el total general
//     actualizarTotalCarrito(subtotalCalculado);
// }
function cargarProductosCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    const tabla = document.querySelector('#tabla_carrito');
    tabla.innerHTML = '';

    let subtotal = 0;

    if (carrito.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tu carrito está vacío. <a href="index.html">Volver a tienda</a></td></tr>';
        actualizarTotalCarrito(0);
        return;
    }

    carrito.forEach(producto => {
        tabla.innerHTML += crearFilaProducto(producto);
        subtotal += producto.precio * producto.cantidad;
    });

    actualizarTotalCarrito(subtotal);
    eventosFila();
}

function crearFilaProducto(producto) {
    const subtotal = (producto.precio * producto.cantidad).toFixed(2);
    return `
        <tr>
            <td><button class="remove-btn" data-id="${producto.id}"><i class="fas fa-times"></i></button></td>
            <td><img src="${producto.imagen}" alt="${producto.nombre}"></td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td><input type="number" min="1" class="cantidad-producto" data-id="${producto.id}" value="${producto.cantidad}"></td>
            <td>$${subtotal}</td>
        </tr>
    `;
}

function actualizarTotalCarrito(total) {
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
}

function eventosFila() {
    const inputs = document.querySelectorAll('.cantidad-producto');
    const botones = document.querySelectorAll('.remove-btn');

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const id = parseInt(input.dataset.id);
            const nuevaCantidad = parseInt(input.value);

            if (nuevaCantidad < 1) {
                input.value = 1;
                return;
            }

            const producto = carrito.find(p => p.id === id);
            if (producto) {
                producto.cantidad = nuevaCantidad;
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                cargarProductosCarrito();
            }
        });
    });

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const id = parseInt(btn.dataset.id);
            carrito = carrito.filter(p => p.id !== id);
            localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
            cargarProductosCarrito();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductosCarrito();
});