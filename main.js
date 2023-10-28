//Mostrar prendas en tienda 
document.addEventListener('DOMContentLoaded', function() {
    const tiendaContainer = document.getElementById('tiendaContainer');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    prendas.forEach(prenda => {
        const divPrenda = document.createElement('div');
        divPrenda.className = 'prenda';

        const imagen = document.createElement('img');
        imagen.className = 'imgs-tienda img-fluid';
        imagen.src = prenda.imagen;
        imagen.alt = prenda.nombre;

        const nombrePrecio = document.createElement('div');
        nombrePrecio.className = 'tienda-nombreyprecios';
        const nombre = document.createElement('figcaption');
        nombre.textContent = prenda.nombre;
        const precio = document.createElement('figcaption');
        precio.textContent = `${prenda.precio}$`;

        nombrePrecio.appendChild(nombre);
        nombrePrecio.appendChild(precio);

        const botonAgregarCarrito = document.createElement('button');
        botonAgregarCarrito.className = 'btn-agregar-carrito';
        botonAgregarCarrito.textContent = 'Agregar al carrito';

        divPrenda.appendChild(imagen);
        divPrenda.appendChild(nombrePrecio);
        divPrenda.appendChild(botonAgregarCarrito);

        tiendaContainer.appendChild(divPrenda);

        botonAgregarCarrito.addEventListener('click', function() {

            let carritoEnLocalStorage = JSON.parse(localStorage.getItem('carrito')) || [];

            if (!Array.isArray(carritoEnLocalStorage)) {
                carritoEnLocalStorage = [];
            }

            carritoEnLocalStorage.push(prenda.id);

            localStorage.setItem('carrito', JSON.stringify(carritoEnLocalStorage));

            carrito = carritoEnLocalStorage;
            console.log(`Producto "${prenda.nombre}" agregado al carrito.`);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Producto agregado al carrito',
                showConfirmButton: false,
                timer: 1200
              })
        });
    });
});

// Carrrito de comprass
const carritoIcono = document.getElementById('carritocompras');
const modalCarrito = document.getElementById('modalCarrito');
const contenidoModal = document.getElementById('contenidomodal');
const cerrarModalBtn = document.querySelector('.cerrar-modal');


// Abrir el modal al hacer clic en el ícono del carrito
carritoIcono.addEventListener('click', function(event) {
    event.preventDefault();
    modalCarrito.style.display = 'block';

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    contenidoModal.innerHTML = '';

    const productosEnCarrito = {};

    carrito.forEach(productoId => {
        productosEnCarrito[productoId] = (productosEnCarrito[productoId] || 0) + 1;
    });

    // Crear tarjetas para los productos en el carrito
    Object.keys(productosEnCarrito).forEach(productoId => {
        const cantidad = productosEnCarrito[productoId];
        const producto = prendas.find(item => item.id === parseInt(productoId, 10));
        
        if (producto) {

            const tarjetaProducto = document.createElement('div');
            tarjetaProducto.className = 'tarjeta-producto';
            tarjetaProducto.className = 'd-flex flex-column gap-1';
    
            const imagenProducto = document.createElement('img');
            imagenProducto.src = producto.imagen;
            imagenProducto.alt = producto.nombre;
            imagenProducto.style.maxWidth = '100px';
            tarjetaProducto.appendChild(imagenProducto);
    
            const nombreProducto = document.createElement('h3');
            nombreProducto.textContent = producto.nombre;
            tarjetaProducto.appendChild(nombreProducto);
    
            const precioProducto = document.createElement('p');
            precioProducto.textContent = `$${producto.precio.toFixed(2)}`;
            tarjetaProducto.appendChild(precioProducto);
    
            if (cantidad > 1) {
                const cantidadProducto = document.createElement('span');
                cantidadProducto.textContent = `Cantidad: ${cantidad}`;
                tarjetaProducto.appendChild(cantidadProducto);
            }
    
            const botonBorrar = document.createElement('button');
            botonBorrar.textContent = 'Eliminar';
            botonBorrar.className = 'boton-borrar';
            botonBorrar.addEventListener('click', function() {
                // Eliminar el producto del carrito al hacer clic en el botón "Eliminar"
                eliminarProductoDelCarrito(producto.id);
                // Volver a generar las tarjetas del carrito después de eliminar el producto
                carritoIcono.click();
            });
    
            tarjetaProducto.appendChild(botonBorrar);
    
            contenidoModal.appendChild(tarjetaProducto);
        }
    });
    
});

function eliminarProductoDelCarrito(productoId) {

    let carritoEnLocalStorage = JSON.parse(localStorage.getItem('carrito')) || [];

    // Elimina el producto con el ID especificado del carrito
    const index = carritoEnLocalStorage.indexOf(productoId);
    if (index !== -1) {
        carritoEnLocalStorage.splice(index, 1);
    }

    // Guarda el carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(carritoEnLocalStorage));
}


// Cerrar el modal cuando se hace clic en la "X"
cerrarModalBtn.addEventListener('click', function() {
    modalCarrito.style.display = 'none';
});

// Cerrar el modal cuando se hace clic fuera de él
window.addEventListener('click', function(event) {
    if (event.target === modalCarrito) {
        modalCarrito.style.display = 'none';
    }
});

// Ordenar 
// Filtra las prendas por orden

function ordenarPorMayorPrecio(prendas) {
    return prendas.slice().sort((a, b) => b.precio - a.precio);
}
function ordenarPorMenorPrecio(prendas) {
    return prendas.slice().sort((a, b) => a.precio - b.precio);
}
function ordenarPorMasReciente(prendas) {
    return prendas.slice().sort((a, b) => b.id - a.id);
}
const selectOrdenar = document.querySelector('.select-ordenar');

// Evento change en select
selectOrdenar.addEventListener('change', function() {
    const valorSeleccionado = selectOrdenar.value;
    let prendasOrdenadas = [];
    if (valorSeleccionado === 'mayor-precio') {
        prendasOrdenadas = ordenarPorMayorPrecio(prendas);
    } else if (valorSeleccionado === 'menor-precio') {
        prendasOrdenadas = ordenarPorMenorPrecio(prendas);
    } else if (valorSeleccionado === 'mas-reciente') {
        prendasOrdenadas = ordenarPorMasReciente(prendas);
    }

    mostrarPrendasEnDOM(prendasOrdenadas);
});

const contenedorPrendas = document.querySelector('.tienda-completa');

// Filtra las prendas por tipo, color y talle

const selectTipo = document.querySelector('#prenda');
const selectColor = document.querySelector('#color');
const selectTalle = document.querySelector('#talle');

selectTipo.addEventListener('change', mostrarPrendasFiltradas);
selectColor.addEventListener('change', mostrarPrendasFiltradas);
selectTalle.addEventListener('change', mostrarPrendasFiltradas);

function mostrarPrendasFiltradas() {
    const tipoSeleccionado = selectTipo.value;
    const colorSeleccionado = selectColor.value;
    const talleSeleccionado = selectTalle.value;

    const prendasFiltradas = prendas.filter(prenda => 
        (tipoSeleccionado === 'prenda' || prenda.tipo === tipoSeleccionado) &&
        (colorSeleccionado === 'color' || prenda.color === colorSeleccionado) &&
        (talleSeleccionado === 'talle' || prenda.talle.includes(talleSeleccionado))
    );

    mostrarPrendasEnDOM(prendasFiltradas);
}
console.log(tipoSeleccionado, colorSeleccionado, talleSeleccionado);

// Mostrar las prendas en el DOM
function mostrarPrendasEnDOM(prendas) {
    contenedorPrendas.innerHTML = '';

    prendas.forEach(prenda => {
        const divPrenda = document.createElement('div');
        divPrenda.className = 'prenda';

        const imagen = document.createElement('img');
        imagen.className = 'imgs-tienda img-fluid';
        imagen.src = prenda.imagen;
        imagen.alt = prenda.nombre;

        const nombrePrecio = document.createElement('div');
        nombrePrecio.className = 'tienda-nombreyprecios';
        const nombre = document.createElement('figcaption');
        nombre.textContent = prenda.nombre;
        const precio = document.createElement('figcaption');
        precio.textContent = `${prenda.precio}$`;

        nombrePrecio.appendChild(nombre);
        nombrePrecio.appendChild(precio);

        const botonAgregarCarrito = document.createElement('button');
        botonAgregarCarrito.className = 'btn-agregar-carrito';
        botonAgregarCarrito.textContent = 'Agregar al carrito';

        divPrenda.appendChild(imagen);
        divPrenda.appendChild(nombrePrecio);
        divPrenda.appendChild(botonAgregarCarrito);

        tiendaContainer.appendChild(divPrenda);

        botonAgregarCarrito.addEventListener('click', function() {

            let carritoEnLocalStorage = JSON.parse(localStorage.getItem('carrito')) || [];

            if (!Array.isArray(carritoEnLocalStorage)) {
                carritoEnLocalStorage = [];
            }

            carritoEnLocalStorage.push(prenda.id);

            localStorage.setItem('carrito', JSON.stringify(carritoEnLocalStorage))

            // Actualiza la variable carrito con los datos del localStorage
            carrito = carritoEnLocalStorage;
            console.log(`Producto "${prenda.nombre}" agregado al carrito.`);
            alert('Producto agregado al carrito');
        });
    });
}

// Selecciona todos los botones "Agregar al carrito"
const botonesAgregarAlCarrito = document.querySelectorAll('.btn-comprar');

// Agrega un evento de clic a cada botón "Agregar al carrito"
botonesAgregarAlCarrito.forEach(boton => {
    boton.addEventListener('click', function(event) {
        const id = parseInt(event.target.dataset.id);
        agregarAlCarrito(id); // Llama a la función para agregar al carrito
    });
});


