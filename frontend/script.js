// Función para validar que todas las preguntas hayan sido respondidas
function validarRespuestas() {
    // Iterar sobre todas las preguntas
    for (var i = 1; i <= 22; i++) { // teniendo 22 preguntas en total
        var pregunta = document.querySelector('input[name="q' + i + '"]:checked');
        if (!pregunta) {
            alert('Por favor, responda todas las preguntas antes de continuar.');
            return false; // Detener el envío de respuestas
        }
    }
    alert('¡Todas las respuestas han sido enviadas correctamente!');
    return true; // Todas las preguntas han sido respondidas
}

// Función para enviar las respuestas al backend
function enviarRespuestas() {
    // Validar que todas las preguntas hayan sido respondidas
    if (!validarRespuestas()) {
        return; // Detener el envío de respuestas si alguna pregunta no está respondida
    }

    // Capturar las respuestas del usuario
    var respuestas = {};
    for (var i = 1; i <= 22; i++) {
        respuestas['q' + i] = document.querySelector('input[name="q' + i + '"]:checked').value;
    }

    //Envio de las respuestas al backend al archivo Conexion.py (Fetch API)

    // Configurar la solicitud Fetch para enviar las respuestas al backend
    fetch('http://127.0.0.1:5000/recibir-respuestas', {
        method: 'POST', // Método HTTP POST para enviar datos
        headers: {
            'Content-Type': 'application/json' // Especificar el tipo de contenido como JSON
        },
        body: JSON.stringify(respuestas) // Convertir el objeto de respuestas a JSON y enviarlo en el cuerpo de la solicitud
    })

    .then(response => {
        if (response.ok) {
            return response.json(); // Convertir la respuesta a JSON
        } else {
            // Error al enviar las respuestas del usuario al backend.
            throw new Error();
        }
    })

    // Mostrar las respuestas en la página web
    .then(data => {
        // clase donde esta la lista de respuestas de las carreras.
        mostrarCarreras(data);
        /* oculta la zona de las carreras que son las respuestas y solo aparecen cuando 
        ya se envie las respuestas del cuestionario. */
        document.getElementById('carreras-section').style.display = 'block';
        
        // Ocultar todas las preguntas
        var questionContainers = document.querySelectorAll('.question-container');
        questionContainers.forEach(container => {
            container.style.display = 'none';
        }); 

        // Ocultar el botón de "Enviar respuestas"
        var botonEnviar = document.querySelector('.Envio');
        botonEnviar.style.display = 'none';

        // Mostrar el botón de recargar la página
        var botonRecargar = document.getElementById('reload-btn');
        botonRecargar.style.display = 'block';
        
        // Evento para recargar la página al hacer clic en el botón
        botonRecargar.addEventListener('click', function() {
            location.reload(); // Recargar la página
        });
    })

    .catch(error => {
        console.error(error);
        alert('Hubo un problema de conexión al comunicarse con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
    });

    // Función para mostrar las carreras recomendadas en la página web HTML
    function mostrarCarreras(carreras) {
        // Obtener el elemento donde se mostrarán las carreras
        var carrerasContainer = document.getElementById('carreras-container');
        // Limpiar cualquier contenido previo
        carrerasContainer.innerHTML = '';

        // Crear un elemento de lista ul 
        var ul = document.createElement('ul');

        // Iterar sobre las carreras recomendadas recibidas del backend
        carreras.forEach(function(carrera) {
            // Crear un elemento de lista li para cada carrera
            var li = document.createElement('li');
            
            // Agregar tanto el nombre de la carrera como su descripción como contenido del li
            li.innerHTML = '<b>' + carrera.nombre + '</b>: ' + carrera.descripcion;
            
            // Agregar el li al ul
            ul.appendChild(li);

            // Agregar un salto de línea después de cada carrera
            ul.appendChild(document.createElement("br"));

        });

        // Agregar el ul al contenedor de carreras
        carrerasContainer.appendChild(ul);
    }
}

// Agregar un event listener al botón "Enviar respuestas"
var botonEnviar = document.querySelector('button');