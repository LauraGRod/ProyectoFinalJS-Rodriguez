const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const emailInput = document.getElementById('email');
const numPedidoInput = document.getElementById('num-pedido');
const mensajeInput = document.getElementById('mensaje');
const enviarBtn = document.getElementById('enviarBtn');

// Evento boton enviar
enviarBtn.addEventListener('click', function(event) {
    event.preventDefault();

    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const email = emailInput.value;
    const numPedido = numPedidoInput.value;
    const mensaje = mensajeInput.value;

    if (nombre && apellido && email && numPedido && mensaje) {
        Swal.fire({
            icon: 'success',
            title: '¡Su mensaje fue enviado con éxito!',
            text: 'Nos pondremos en contacto.'
        });

        const contacto = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            numPedido: numPedido,
            mensaje: mensaje
        };

        localStorage.setItem('contacto', JSON.stringify(contacto));

        nombreInput.value = '';
        apellidoInput.value = '';
        emailInput.value = '';
        numPedidoInput.value = '';
        mensajeInput.value = '';
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Por favor, complete todos los campos.'
        });
    }
});

// Obtener los valores del localStorage
const datosGuardados = localStorage.getItem('contacto');

if (datosGuardados) {
    const contactoGuardado = JSON.parse(datosGuardados);
    
    nombreInput.value = contactoGuardado.nombre;
    apellidoInput.value = contactoGuardado.apellido;
    emailInput.value = contactoGuardado.email;
    numPedidoInput.value = contactoGuardado.numPedido;
    mensajeInput.value = contactoGuardado.mensaje;
}

console.log(datosGuardados)

enviarBtn.addEventListener('submit', (e) => {
    e.preventDefault();

    const body = {
        service_id: 'service_10u6v05',
        template_id: 'template_orziuoe',
        user_id: 'QUUzwpiiJXoTKNC4p',
        template_params: {
            'nombreUsuario': nombreInput.value,
            'apellidoUsuario': apellidoInput.value,
            'emailUsuario': emailInput.value,
            'numeroPedido': numPedidoInput.value,
            'mensajeUsuario': mensajeInput.value,
        }
    };

    sendEmail(body)
        .then(response => console.log(response.text()))
        .catch(error => {
            console.log(error);
        })
});

const sendEmail = async (body) => {
    const settings = {
        method: 'POST',
        headers: {
            'contentType': 'application/json'
        },
        body: JSON.stringify(body)
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', settings);
    const data = await response.json();
    console.log(data);
    
    return data;
}