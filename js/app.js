// =========================
// SISTEMA DE ALMACENAMIENTO
// =========================
console.log("APP.JS VERSION NUEVA");
const DB = {
    // Inicializar base de datos local
    init: function() {
        if (!localStorage.getItem('colegio_comentarios')) {
            localStorage.setItem('colegio_comentarios', JSON.stringify({}));
        }
        if (!localStorage.getItem('colegio_contenido')) {
            localStorage.setItem('colegio_contenido', JSON.stringify({
                arte: [],
                literatura: [],
                convivencia: [],
                eventos: [],
                inicio: []
            }));
        }
        if (!localStorage.getItem('colegio_publicaciones_inicio')) {
            localStorage.setItem('colegio_publicaciones_inicio', JSON.stringify([]));
        }
        if (!localStorage.getItem('usuario_actual')) {
            localStorage.setItem('usuario_actual', JSON.stringify({ tipo: 'estudiante', nombre: '' }));
        }
    },
    
    agregarPublicacionInicio: async function(titulo, contenido, autor) {

        const { error } = await supabaseClient
            .from("publicaciones")
            .insert([
                {
                    titulo: titulo,
                    descripcion: contenido,
                    seccion: "inicio"
                }
            ]);

        if (error) {
            console.error("❌ Error al guardar publicación:", error);
            return false;
        }

        console.log("✅ Publicación guardada correctamente");

        return true;
    },
    
    obtenerPublicacionesInicio: function() {
        let publicaciones = JSON.parse(localStorage.getItem('colegio_publicaciones_inicio')) || [];
        return publicaciones.reverse();
    },
    
    eliminarPublicacionInicio: function(id) {
        let publicaciones = JSON.parse(localStorage.getItem('colegio_publicaciones_inicio')) || [];
        publicaciones = publicaciones.filter(p => p.id !== id);
        localStorage.setItem('colegio_publicaciones_inicio', JSON.stringify(publicaciones));
        return true;
    },
    
    agregarComentario: function(pagina, nombre, mensaje) {
        let comentarios = JSON.parse(localStorage.getItem('colegio_comentarios')) || {};
        if (!comentarios[pagina]) comentarios[pagina] = [];
        
        comentarios[pagina].push({
            id: Date.now(),
            nombre: nombre,
            mensaje: mensaje,
            fecha: new Date().toLocaleDateString('es-ES'),
            aprobado: false,
            tipo: 'estudiante'
        });
        
        localStorage.setItem('colegio_comentarios', JSON.stringify(comentarios));
        return comentarios[pagina];
    },
    
    obtenerComentarios: function(pagina, soloAprobados = true) {
        let comentarios = JSON.parse(localStorage.getItem('colegio_comentarios')) || {};
        let items = comentarios[pagina] || [];
        
        if(soloAprobados) {
            return items.filter(c => c.aprobado === true);
        }
        return items;
    },
    
    obtenerTodosComentarios: function() {
        let comentarios = JSON.parse(localStorage.getItem('colegio_comentarios')) || {};
        return comentarios;
    },
    
    aprobarComentario: function(pagina, id) {
        let comentarios = JSON.parse(localStorage.getItem('colegio_comentarios')) || {};
        if(!comentarios[pagina]) return false;
        
        let comentario = comentarios[pagina].find(c => c.id === id);
        if(comentario) {
            comentario.aprobado = true;
            localStorage.setItem('colegio_comentarios', JSON.stringify(comentarios));
            return true;
        }
        return false;
    },
    
    rechazarComentario: function(pagina, id) {
        let comentarios = JSON.parse(localStorage.getItem('colegio_comentarios')) || {};
        if(!comentarios[pagina]) return false;
        
        comentarios[pagina] = comentarios[pagina].filter(c => c.id !== id);
        localStorage.setItem('colegio_comentarios', JSON.stringify(comentarios));
        return true;
    },
    
    agregarContenido: async function(seccion, titulo, descripcion, archivo) {

        const { error } = await supabaseClient
            .from("publicaciones")
            .insert([
                {
                    titulo: titulo,
                    descripcion: descripcion,
                    seccion: seccion,
                    url_archivo: archivo || null
                }
            ]);

        if (error) {
            console.error("❌ Error al guardar contenido:", error);
            return false;
        }

        console.log("✅ Contenido guardado en Supabase");

        return true;
    },
    
    obtenerContenido: function(seccion) {
        let contenido = JSON.parse(localStorage.getItem('colegio_contenido')) || {};
        return contenido[seccion] || [];
    }
};

// Inicializar al cargar
DB.init();

// =========================
// MENU RESPONSIVE
// =========================

function toggleMenu(){
    let nav = document.getElementById("menu");
    nav.classList.toggle("active");
    
    // Accesibilidad
    let menuToggle = document.querySelector(".menu-toggle");
    let isOpen = nav.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
}

// Cerrar menú al hacer clic en un enlace
document.addEventListener('DOMContentLoaded', function() {
    let navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            let nav = document.getElementById("menu");
            nav.classList.remove("active");
            let menuToggle = document.querySelector(".menu-toggle");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
});


// =========================
// COMENTARIOS
// =========================

function agregarComentario(){
    let nombre = document.getElementById("nombre").value.trim();
    let mensaje = document.getElementById("mensaje").value.trim();
    
    if(nombre === "") {
        mostrarError("Por favor ingresa tu nombre");
        return;
    }
    
    if(nombre.length < 3) {
        mostrarError("El nombre debe tener al menos 3 caracteres");
        return;
    }
    
    if(mensaje === "") {
        mostrarError("Por favor escribe un comentario");
        return;
    }
    
    if(mensaje.length > 500) {
        mostrarError("El comentario no puede exceder 500 caracteres");
        return;
    }
    
    // Detectar página actual
    let pagina = window.location.pathname.split('/').pop() || 'index.html';
    
    // Agregar a base de datos
    let comentarios = DB.agregarComentario(pagina, nombre, mensaje);
    
    // Limpiar formulario
    document.getElementById("nombre").value = "";
    document.getElementById("mensaje").value = "";
    
    // Recargar comentarios
    cargarComentarios();
    
    mostrarExito("✅ Comentario enviado - Pendiente de aprobación del docente");
}

function cargarComentarios(){
    let pagina = window.location.pathname.split('/').pop() || 'index.html';
    let comentarios = DB.obtenerComentarios(pagina, true); // Solo aprobados para estudiantes
    let contenedor = document.querySelector(".contenedor-comentarios");
    
    if(!contenedor) return;
    
    // Limpiar comentarios antiguos (excepto los predefinidos)
    let comentariosUI = contenedor.querySelectorAll('.comentario[data-id]');
    comentariosUI.forEach(c => c.remove());
    
    // Determinar ruta de imagen según la página
    let rutaImagen = 'img/estudiantes.JPG';
    if(pagina.includes('.html') && pagina !== 'index.html') {
        rutaImagen = '../img/estudiantes.JPG';
    }
    
    // Agregar comentarios de la BD (en orden inverso)
    comentarios.reverse().forEach(c => {
        let nuevoComentario = document.createElement("div");
        nuevoComentario.classList.add("comentario");
        nuevoComentario.setAttribute("data-id", c.id);
        
        nuevoComentario.innerHTML = `
            <img src="${rutaImagen}" alt="Avatar de estudiante">
            <div class="texto-comentario">
                <div class="encabezado-comentario">
                    <h3>${sanitizarHTML(c.nombre)}</h3>
                    <span>${c.fecha}</span>
                </div>
                <p>${sanitizarHTML(c.mensaje)}</p>
            </div>
        `;
        
        contenedor.appendChild(nuevoComentario);
    });
}

// =========================
// UTILIDADES
// =========================

function mostrarError(mensaje) {
    let modal = document.querySelector('.modal-error') || crearModal('error');
    modal.querySelector('.modal-mensaje').textContent = mensaje;
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 4000);
}

function mostrarExito(mensaje) {
    let modal = document.querySelector('.modal-exito') || crearModal('exito');
    modal.querySelector('.modal-mensaje').textContent = mensaje;
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

function crearModal(tipo) {
    let modal = document.createElement('div');
    modal.className = `modal-${tipo}`;
    modal.innerHTML = `
        <div class="modal-contenido">
            <p class="modal-mensaje"></p>
            <button onclick="this.parentElement.parentElement.style.display='none'">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function sanitizarHTML(texto) {
    let div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Cargar comentarios al entrar a página
document.addEventListener('DOMContentLoaded', cargarComentarios);


// =========================
// PUBLICACIONES DEL INICIO
// =========================

async function cargarPublicacionesInicio() {

    let contenedor = document.querySelector(".contenedor-publicaciones");

    if (!contenedor) return;

    contenedor.innerHTML = "<p class='sin-publicaciones'>Cargando publicaciones...</p>";

    const { data, error } = await supabaseClient
        .from("publicaciones")
        .select("*")
        .eq("seccion", "inicio")
        .order("id", { ascending: false });

    if (error) {
        console.error("❌ Error al cargar publicaciones:", error);
        contenedor.innerHTML = "<p class='sin-publicaciones'>Error al cargar publicaciones.</p>";
        return;
    }

    contenedor.innerHTML = "";

    if (data.length === 0) {
        contenedor.innerHTML = "<p class='sin-publicaciones'>No hay publicaciones.</p>";
        return;
    }

    data.forEach(item => {

        let publicacion = document.createElement("div");
        publicacion.className = "publicacion";

        publicacion.innerHTML = `
            <div class="publicacion-header">
                <h3>${sanitizarHTML(item.titulo)}</h3>
            </div>

            <p>${sanitizarHTML(item.descripcion)}</p>

            ${item.url_archivo ? `
                <p>
                    <a href="${item.url_archivo}" target="_blank">
                        📎 Ver archivo
                    </a>
                </p>
            ` : ""}
        `;

        contenedor.appendChild(publicacion);

    });

}

// =========================
// PUBLICACIONES DE SECCIONES (Arte, Convivencia, Eventos)
// =========================

async function cargarPublicacionesSeccion(seccion) {

    let contenedor = document.querySelector(".publicaciones-seccion .contenedor-publicaciones");

    if (!contenedor) return;

    contenedor.innerHTML = "<p class='sin-publicaciones'>Cargando contenido...</p>";

    const { data, error } = await supabaseClient
        .from("publicaciones")
        .select("*")
        .eq("seccion", seccion)
        .order("id", { ascending: false });

    console.log("Sección solicitada:", seccion);
    console.log("Datos recibidos:", data);    

    if (error) {
        console.error("❌ Error al cargar publicaciones:", error);
        contenedor.innerHTML = "<p class='sin-publicaciones'>Error al cargar publicaciones.</p>";
        return;
    }

    contenedor.innerHTML = "";

    if (data.length === 0) {
        contenedor.innerHTML = "<p class='sin-publicaciones'>No hay publicaciones.</p>";
        return;
    }

    data.forEach(item => {

        let publicacion = document.createElement("div");
        publicacion.className = "publicacion";

        publicacion.innerHTML = `
            <div class="publicacion-header">
                <h3>${sanitizarHTML(item.titulo)}</h3>
            </div>

            <p>${sanitizarHTML(item.descripcion)}</p>

            ${item.url_archivo ? `
                <p>
                    <a href="${item.url_archivo}" target="_blank">
                        📎 Ver archivo
                    </a>
                </p>
            ` : ""}
        `;

        contenedor.appendChild(publicacion);

    });

}

// Cargar publicaciones al entrar a página inicio
if(window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    document.addEventListener('DOMContentLoaded', cargarPublicacionesInicio);
}

// Cargar publicaciones de arte
if(window.location.pathname.includes('arte.html')) {
    document.addEventListener('DOMContentLoaded', () => cargarPublicacionesSeccion('arte'));
}
// Cargar publicaciones de literatura
if(window.location.pathname.includes('literatura.html')) {
    document.addEventListener('DOMContentLoaded', () => cargarPublicacionesSeccion('literatura'));
}

// Cargar publicaciones de convivencia
if(window.location.pathname.includes('convivencia.html')) {
    document.addEventListener('DOMContentLoaded', () => cargarPublicacionesSeccion('convivencia'));
}

// Cargar publicaciones de eventos
if(window.location.pathname.includes('eventos.html')) {
    document.addEventListener('DOMContentLoaded', () => cargarPublicacionesSeccion('eventos'));
}

// ===== PRUEBA =====
// obtenerPublicaciones();