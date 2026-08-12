// =========================
// SISTEMA DE ALMACENAMIENTO
// =========================
console.log("APP.JS VERSION NUEVA");
const DB = {
    // Inicializar base de datos local
    init: function() {
        if (!localStorage.getItem('colegio_contenido')) {
            localStorage.setItem('colegio_contenido', JSON.stringify({
                arte: [],
                literatura: [],
                convivencia: [],
                eventos: [],
                inicio: []
            }));
        }
        if (!localStorage.getItem('usuario_actual')) {
            localStorage.setItem('usuario_actual', JSON.stringify({ tipo: 'estudiante', nombre: '' }));
        }
    },
    
    agregarComentario: async function(publicacionId, nombre, mensaje) {

        const { data, error } = await supabaseClient
            .from('comentarios')
            .insert([
                {
                    publicacion_id: publicacionId,
                    nombre: nombre,
                    mensaje: mensaje
                }
            ])
            .select();

        if (error) {
            console.error('❌ Error al guardar comentario:', error);
            return false;
        }

        console.log('✅ Comentario guardado en Supabase:', data);

        return true;
    },

    obtenerPublicacionInicio: async function(id) {
        const { data, error } = await supabaseClient
            .from("publicaciones")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("❌ Error al obtener publicación:", error);
            return null;
        }

        return data;
    },

    actualizarPublicacionInicio: async function(id, titulo, contenido) {
        const { error } = await supabaseClient
            .from("publicaciones")
            .update({
                titulo: titulo,
                descripcion: contenido
            })
            .eq("id", id);

        if (error) {
            console.error("❌ Error al actualizar publicación:", error);
            return false;
        }

        return true;
    },

    obtenerPublicacionesInicio: async function() {

        console.log("🔎 Buscando publicaciones de inicio...");

        const { data, error } = await supabaseClient
            .from("publicaciones")
            .select("*")
            .eq("seccion", "inicio")
            .order("id", { ascending: false });

        console.log("📦 Datos inicio:", data);
        console.log("❌ Error inicio:", error);

        if (error) {
            console.error("❌ Error al obtener publicaciones de inicio:", error);
            return [];
        }

        return data || [];
    },
    
    eliminarPublicacionInicio: async function(id) {

        const { error } = await supabaseClient
            .from("publicaciones")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("❌ Error al eliminar publicación:", error);
            return false;
        }

        console.log("✅ Publicación eliminada correctamente");

        return true;
    },

    obtenerComentarios: async function(publicacionId) {

        const { data, error } = await supabaseClient
            .from('comentarios')
            .select('*')
            .eq('publicacion_id', publicacionId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error al obtener comentarios:', error);
            return [];
        }

        return (data || []).map(item => ({
            ...item,
            fecha: item.fecha || item.created_at || null,
            mensaje: item.mensaje || item.comentario || ''
        }));
    },
    
    obtenerTodosComentarios: async function() {
        const { data, error } = await supabaseClient
            .from('comentarios')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error al obtener todos los comentarios:', error);
            return [];
        }

        return (data || []).map(item => ({
            ...item,
            fecha: item.fecha || item.created_at || null,
            mensaje: item.mensaje || item.comentario || ''
        }));
    },
    
    rechazarComentario: async function(id) {
        const { error } = await supabaseClient
            .from('comentarios')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('❌ Error al eliminar comentario:', error);
            return false;
        }

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

async function agregarComentario(publicacionId) {
    let nombreField = document.getElementById(`nombre-${publicacionId}`);
    let mensajeField = document.getElementById(`mensaje-${publicacionId}`);

    if (!nombreField || !mensajeField) return;

    let nombre = nombreField.value.trim();
    let mensaje = mensajeField.value.trim();

    if (nombre === "") {
        mostrarError("Por favor ingresa tu nombre");
        return;
    }

    if (nombre.length < 3) {
        mostrarError("El nombre debe tener al menos 3 caracteres");
        return;
    }

    if (mensaje === "") {
        mostrarError("Por favor escribe un comentario");
        return;
    }

    if (mensaje.length > 500) {
        mostrarError("El comentario no puede exceder 500 caracteres");
        return;
    }

    const enviado = await DB.agregarComentario(publicacionId, nombre, mensaje);
    if (!enviado) {
        mostrarError("No fue posible enviar el comentario.");
        return;
    }

    nombreField.value = "";
    mensajeField.value = "";

    await cargarComentariosPublicacion(publicacionId);
    mostrarExito("✅ Comentario publicado correctamente");
}

async function cargarComentariosPublicacion(publicacionId) {
    let contenedor = document.getElementById(`comentarios-lista-${publicacionId}`);
    if (!contenedor) return;

    contenedor.innerHTML = "<p class='sin-comentarios'>Cargando comentarios...</p>";
    const comentarios = await DB.obtenerComentarios(publicacionId);
    
    if (!comentarios || comentarios.length === 0) {
        contenedor.innerHTML = '<p class="sin-comentarios">No hay comentarios aún.</p>';
        return;
    }

    contenedor.innerHTML = "";

    comentarios.forEach(c => {
        let comentario = document.createElement("div");
        comentario.className = "comentario";
        comentario.innerHTML = `
            <img src="${getRutaImagenComentario()}" alt="Avatar de estudiante">
            <div class="texto-comentario">
                <div class="encabezado-comentario">
                    <h3>${sanitizarHTML(c.nombre)}</h3>
                    <span>${c.fecha ? new Date(c.fecha).toLocaleDateString('es-ES') : ''}</span>
                </div>
                <p>${sanitizarHTML(c.mensaje)}</p>
            </div>
        `;
        contenedor.appendChild(comentario);
    });
}

function getRutaImagenComentario() {
    let pagina = window.location.pathname.split('/').pop() || 'index.html';
    if (pagina.includes('.html') && pagina !== 'index.html') {
        return '../img/estudiantes.JPG';
    }
    return 'img/estudiantes.JPG';
}

function crearFormularioComentario(publicacionId) {
    // Mostrar un botón compacto que abre un modal para comentar (evita panels grandes)
    return `
        <div class="formulario-comentario-boton">
            <button type="button" class="btn-comentar" onclick="abrirModalComentario(${publicacionId})">💬 Comentar</button>
        </div>
    `;
}

// Abre un modal ligero para dejar un comentario sin afectar el diseño de la publicación
function abrirModalComentario(publicacionId) {
    // Si ya existe, mostrarlo
    let existing = document.getElementById(`modal-comentario-${publicacionId}`);
    if (existing) {
        existing.style.display = 'flex';
        return;
    }

    let modal = document.createElement('div');
    modal.id = `modal-comentario-${publicacionId}`;
    modal.className = 'modal-comentario';
    modal.style = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.4);z-index:9999;";
    modal.innerHTML = `
        <div style="background:#fff;padding:18px;border-radius:8px;max-width:520px;width:92%;box-shadow:0 6px 20px rgba(0,0,0,0.12);">
            <h3 style="margin-top:0;">Deja tu comentario</h3>

            <p class="info-comentario">
    💬          Tu comentario aparecerá inmediatamente después de enviarlo.
            </p>

            <input type="text" id="modal-nombre-${publicacionId}" placeholder="Tu nombre" style="width:100%;padding:8px;margin:8px 0;border:1px solid #ddd;border-radius:6px;">
            <textarea id="modal-mensaje-${publicacionId}" placeholder="Escribe tu comentario" style="width:100%;height:110px;padding:8px;border:1px solid #ddd;border-radius:6px;margin-bottom:8px;"></textarea>
            <div style="display:flex;gap:8px;justify-content:flex-end;">
                <button onclick="document.getElementById('modal-comentario-${publicacionId}').style.display='none'" class="btn-secundario">Cerrar</button>
                <button onclick="agregarComentarioModal(${publicacionId})" class="btn-primario">Enviar Comentario</button>
            </div>
        </div>
    `;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.style.display = 'none';
    });

    document.body.appendChild(modal);
}

async function agregarComentarioModal(publicacionId) {
    let nombreField = document.getElementById(`modal-nombre-${publicacionId}`);
    let mensajeField = document.getElementById(`modal-mensaje-${publicacionId}`);

    if (!nombreField || !mensajeField) return;

    let nombre = nombreField.value.trim();
    let mensaje = mensajeField.value.trim();

    if (nombre === "") {
        mostrarError("Por favor ingresa tu nombre");
        return;
    }

    if (nombre.length < 3) {
        mostrarError("El nombre debe tener al menos 3 caracteres");
        return;
    }

    if (mensaje === "") {
        mostrarError("Por favor escribe un comentario");
        return;
    }

    if (mensaje.length > 500) {
        mostrarError("El comentario no puede exceder 500 caracteres");
        return;
    }

    const enviado = await DB.agregarComentario(publicacionId, nombre, mensaje);
    if (!enviado) {
        mostrarError("No fue posible enviar el comentario.");
        return;
    }

    nombreField.value = "";
    mensajeField.value = "";

    let modal = document.getElementById(`modal-comentario-${publicacionId}`);
    if (modal) modal.style.display = 'none';

    await cargarComentariosPublicacion(publicacionId);
    mostrarExito("✅ Comentario publicado correctamente");
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

// =========================
// PUBLICACIONES DEL INICIO
// =========================

async function cargarPublicacionesInicio() {

    let contenedor = document.querySelector(".publicaciones-inicio .contenedor-publicaciones");

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

    if (!data || data.length === 0) {
        contenedor.innerHTML = "<p class='sin-publicaciones'>No hay publicaciones.</p>";
        return;
    }

    for (const item of data) {
        let publicacion = document.createElement("div");
        publicacion.className = "publicacion";

        publicacion.innerHTML = `
            <div class="publicacion-header">
                <h3>${sanitizarHTML(item.titulo)}</h3>
            </div>

            <p>${sanitizarHTML(item.descripcion)}</p>

            ${item.url_archivo ? `
                <div class="publicacion-imagen">
                    <img src="${sanitizarHTML(item.url_archivo)}" alt="Imagen de la publicación ${sanitizarHTML(item.titulo)}">
                </div>
            ` : ""}

            <div id="comentarios-lista-${item.id}" class="contenedor-comentarios">
                <p class="sin-comentarios">Cargando comentarios...</p>
            </div>

            ${crearFormularioComentario(item.id)}
        `;

        contenedor.appendChild(publicacion);
        await cargarComentariosPublicacion(item.id);
    }
}

// =========================
// PUBLICACIONES DE SECCIONES (Arte, Convivencia, Eventos, Literatura)
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
    console.log("📌 Contenedor encontrado:", contenedor);
    console.log("📌 Cantidad de publicaciones:", data ? data.length : 0);

    if (error) {
        console.error("❌ Error al cargar publicaciones:", error);
        contenedor.innerHTML = "<p class='sin-publicaciones'>Error al cargar publicaciones.</p>";
        return;
    }

    contenedor.innerHTML = "";

    if (!data || data.length === 0) {
        contenedor.innerHTML = "<p class='sin-publicaciones'>No hay publicaciones.</p>";
        return;
    }

    for (const item of data) {
        console.log("📌 Publicación que se va a mostrar:", item);
        let publicacion = document.createElement("div");
        publicacion.className = "publicacion";

        publicacion.innerHTML = `
            <div class="publicacion-header">
                <h3>${sanitizarHTML(item.titulo)}</h3>
            </div>

            <p>${sanitizarHTML(item.descripcion)}</p>

            ${item.url_archivo ? `
                <div class="publicacion-imagen">
                    <img 
                        src="${item.url_archivo}" 
                        alt="${sanitizarHTML(item.titulo)}"
                        loading="lazy"
                        onerror="this.parentElement.style.display='none';"
                    >
                </div>
            ` : ""}

            <div id="comentarios-lista-${item.id}" class="contenedor-comentarios">
                <p class="sin-comentarios">Cargando comentarios...</p>
            </div>

            ${crearFormularioComentario(item.id)}
        `;

        contenedor.appendChild(publicacion);
        console.log("✅ Publicación agregada al HTML");
        await cargarComentariosPublicacion(item.id);
    }
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


// Cargar publicaciones de convivencia
if(window.location.pathname.includes('convivencia.html')) {
    console.log("🟢 Detectó convivencia.html");

    document.addEventListener('DOMContentLoaded', () => {
        console.log("🟢 Ejecutando cargarPublicacionesSeccion('convivencia')");
        cargarPublicacionesSeccion('convivencia');
    });
}

// ===== PRUEBA =====
// obtenerPublicaciones();