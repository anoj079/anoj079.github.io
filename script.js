// Aquí seleccionamos elementos del HTML para poder usarlos en el código
const vistaPrincipal = document.getElementById('vista-principal'); // La vista principal donde inicias el juego
const vistaJuego = document.getElementById('vista-juego'); // La vista que muestra el juego cuando comienza
const botonJugar = document.getElementById('boton-jugar'); // El botón que inicia el juego
const botonAñadirPalabra = document.getElementById('boton-añadir-palabra'); // El botón para añadir una nueva palabra
const entradaNuevaPalabra = document.getElementById('nueva-palabra'); // La caja donde escribes una nueva palabra
const canvasAhorcado = document.getElementById('canvas-ahorcado'); // El área donde se dibuja el ahorcado
const textoIntentos = document.getElementById('intentos'); // El texto que muestra cuántos intentos te quedan
const divPalabraAdivinar = document.getElementById('palabra-a-adivinar'); // El área que muestra la palabra que estás adivinando
const divTeclado = document.getElementById('teclado'); // El área que contiene las letras para adivinar
const botonReiniciar = document.getElementById('boton-reiniciar'); // El botón para reiniciar el juego
const botonVolverInicio = document.getElementById('boton-volver-inicio'); // El botón para volver a la vista inicial

// Aquí tenemos una lista de palabras que puedes adivinar en el juego
let palabras = ["hola", "web", "cleopatra", "luna", "magui", "dulce", "caballo", "corcel", "esternocleidomastoideo", "ruperto", "ciriaco", "fulgencio", "rodolfo", "aniceto", "cristel", "studio", "bamboleo", "helicoptero", "pincel", "misterio", "cerveza", "naranja"];

// Variables que usaremos durante el juego
let palabraSeleccionada = ''; // Aquí se guardará la palabra que tienes que adivinar
let palabraMostrada = []; // Aquí se guarda la palabra que estás adivinando, pero con guiones bajos (_) para las letras que no has adivinado aún
let intentosRestantes = 7; // Comienzas el juego con 7 intentos
let letrasUsadas = []; // Aquí guardamos las letras que ya has intentado

// Aquí estamos añadiendo eventos a los botones, para que hagan algo cuando los presiones
botonJugar.addEventListener('click', iniciarJuego); // Cuando presionas "Jugar", comienza el juego
botonAñadirPalabra.addEventListener('click', agregarPalabra); // Cuando presionas "Añadir palabra", la nueva palabra se agrega a la lista
botonReiniciar.addEventListener('click', reiniciarJuego); // Cuando presionas "Reiniciar", el juego empieza de nuevo
botonVolverInicio.addEventListener('click', volverAlInicio); // Cuando presionas "Volver al Inicio", regresas a la pantalla principal

// Esta función comienza el juego
function iniciarJuego() {
    // Seleccionamos una palabra al azar de la lista
    palabraSeleccionada = palabras[Math.floor(Math.random() * palabras.length)];
    
    // Llenamos palabraMostrada con guiones bajos para cada letra de la palabra seleccionada
    palabraMostrada = Array(palabraSeleccionada.length).fill('_'); //**Qué hace**: El método `fill` llena todos los elementos de un array con un valor específico. en este caso _
    
    // Reseteamos los intentos restantes a 7 y limpiamos las letras que has usado
    intentosRestantes = 7;
    letrasUsadas = [];
    
    // Actualizamos el texto de los intentos en pantalla
    textoIntentos.textContent = `Intentos: ${intentosRestantes}`;
    
    // Mostramos la palabra a adivinar con guiones bajos
    divPalabraAdivinar.textContent = palabraMostrada.join(' ');//**Qué hace**: `join` convierte todos los elementos de un array en una cadena de texto, separándolos por un separador
    
    // Mostramos el teclado en la pantalla
    mostrarTeclado();
    
    // Ocultamos la vista principal y mostramos la vista del juego
    vistaPrincipal.style.display = 'none';
    vistaJuego.style.display = 'block';
    
    // Dibujamos el ahorcado (que al principio está vacío)
    dibujarAhorcado();
}

// Esta función agrega una nueva palabra a la lista de palabras que puedes adivinar
function agregarPalabra() {
    const nuevaPalabra = entradaNuevaPalabra.value.trim().toLowerCase(); // Obtenemos la nueva palabra del input y la ponemos en minúsculas
    if (nuevaPalabra && !palabras.includes(nuevaPalabra)) { // Si la palabra no está vacía y no está ya en la lista
        palabras.push(nuevaPalabra); // Añadimos la palabra a la lista **Qué hace**: Añade un nuevo elemento al final de un array.
        entradaNuevaPalabra.value = ''; // Limpiamos el campo de texto
        alert(`Palabra "${nuevaPalabra}" añadida a la lista.`); // Mostramos un mensaje de confirmación
    }
}

// Esta función muestra las letras del teclado en pantalla
function mostrarTeclado() {
    divTeclado.innerHTML = ''; // Limpiamos el teclado para que no haya botones duplicados
    
    // Creamos un botón para cada letra del alfabeto
    for (let i = 65; i <= 90; i++) { // Los números 65 y 90 son los códigos de las letras A y Z en ASCII
        const letra = String.fromCharCode(i); // Convertimos el código en una letra 
        //- **Qué hace**: Convierte un código ASCII en su carácter correspondiente.
        //**Por qué está ahí**: Lo usamos para crear las letras del teclado, de la `A` a la `Z`.
        const boton = document.createElement('button'); // Creamos un botón
        boton.textContent = letra; // Le ponemos la letra al botón
        boton.addEventListener('click', () => manejarIntento(letra)); // Hacemos que cuando presionas el botón, intentes adivinar esa letra
        divTeclado.appendChild(boton); // Añadimos el botón al teclado
    }
}

// Esta función maneja lo que pasa cuando intentas adivinar una letra
function manejarIntento(letra) {
    const botones = Array.from(divTeclado.getElementsByTagName('button')); // Obtenemos todos los botones del teclado
    const boton = botones.find(b => b.textContent === letra); // Encontramos el botón que corresponde a la letra que presionaste
    boton.disabled = true; // Desactivamos ese botón para que no lo puedas presionar de nuevo
    
    if (palabraSeleccionada.includes(letra.toLowerCase())) { // Si la palabra seleccionada contiene la letra
        for (let i = 0; i < palabraSeleccionada.length; i++) { // Recorremos cada letra de la palabra seleccionada
            if (palabraSeleccionada[i] === letra.toLowerCase()) { // Si la letra coincide
                palabraMostrada[i] = letra.toUpperCase(); // La mostramos en la palabra adivinada
            }
        }
        divPalabraAdivinar.textContent = palabraMostrada.join(' '); // Actualizamos la palabra mostrada en pantalla
        if (!palabraMostrada.includes('_')) { // Si no quedan guiones bajos, ganaste
            alert('¡Ganaste!');
            bloquearTeclado(); // Desactivamos todo el teclado porque ya ganaste
        }
    } else {
        intentosRestantes--; // Si la letra no está en la palabra, pierdes un intento
        textoIntentos.textContent = `Intentos: ${intentosRestantes}`; // Actualizamos el número de intentos en pantalla
        dibujarAhorcado(); // Dibujamos una parte más del ahorcado
        if (intentosRestantes === 0) { // Si ya no te quedan intentos, perdiste
            alert(`Perdiste. La palabra era: ${palabraSeleccionada.toUpperCase()}`);
            bloquearTeclado(); // Desactivamos todo el teclado porque ya perdiste
        }
    }
}

// Esta función dibuja el ahorcado dependiendo de cuántos intentos te quedan
function dibujarAhorcado() {
    const ctx = canvasAhorcado.getContext('2d'); // Obtenemos el contexto de dibujo del canvas
    ctx.clearRect(0, 0, canvasAhorcado.width, canvasAhorcado.height); // Limpiamos el dibujo anterior

    if (intentosRestantes < 7) { // Si has perdido al menos un intento
        // Dibujamos la base del ahorcado
        ctx.fillRect(50, 150, 100, 10);
        ctx.fillRect(90, 10, 10, 140);
        ctx.fillRect(90, 10, 60, 10);
    }
    if (intentosRestantes < 6) { // Si has perdido al menos dos intentos
        // Dibujamos la cuerda
        ctx.fillRect(140, 10, 1, 30);
    }
    if (intentosRestantes < 5) { // Si has perdido al menos tres intentos
        // Dibujamos la cabeza
        ctx.beginPath();
        ctx.arc(140, 50, 10, 0, Math.PI * 4);
        ctx.stroke();
    }
    if (intentosRestantes < 4) { // Si has perdido al menos cuatro intentos
        // Dibujamos el cuerpo
        ctx.fillRect(140, 60, 1, 40);
    }
    if (intentosRestantes < 3) { // Si has perdido al menos cinco intentos
        // Dibujamos el brazo izquierdo
        ctx.moveTo(140, 80);
        ctx.lineTo(130, 90);
        ctx.stroke();
    }   
    if (intentosRestantes < 2) { // Si has perdido al menos seis intentos
        // Dibujamos el brazo derecho
        ctx.moveTo(140, 80);
        ctx.lineTo(150, 90);
        ctx.stroke();
        
    }
    if (intentosRestantes < 1) { // Si ya no te quedan intentos
        // Dibujamos las piernas
        ctx.moveTo(140, 100);
        ctx.lineTo(120, 120);
        ctx.moveTo(140, 100);
        ctx.lineTo(160, 120);
        ctx.stroke(); 
    }
}

// Esta función desactiva todos los botones del teclado, para que no puedas seguir jugando después de ganar o perder
function bloquearTeclado() {
    const botones = divTeclado.getElementsByTagName('button'); // Obtenemos todos los botones del teclado
    for (let boton of botones) { // Recorremos cada botón
        boton.disabled = true; // Desactivamos el botón
    }
}

// Esta función reinicia el juego, volviendo a elegir una nueva palabra y reseteando los intentos
function reiniciarJuego() {
    iniciarJuego(); // Volvemos a empezar el juego desde el principio
}

// Esta función te lleva de vuelta a la vista inicial del juego
function volverAlInicio() {
    vistaJuego.style.display = 'none'; // Ocultamos la vista del juego
    vistaPrincipal.style.display = 'block'; // Mostramos la vista principal
}
    