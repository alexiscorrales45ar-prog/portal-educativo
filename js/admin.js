// =========================
// PANEL ADMINISTRATIVO - SISTEMA DE ROLES
// =========================

let seccionActual = 'arte';
let panelActual = 'contenido'; // 'contenido', 'publicaciones', 'comentarios'
let usuarioActual = null;

// Inicializar panel
document.addEventListener('DOMContentLoaded', function() {
    usuarioActual = JSON.parse(localStorage.getItem('usuario_actual'));
    verificarAutenticacion();
    if(usuarioActual && (usuarioActual.tipo === 'docente' || usuarioActual.tipo === 'admin')) {
        cargarEstadisticas();
        if(usuarioActual.tipo === 'docente') {
            mostrarSeccion('arte');
        }
    }
});

function verificarAutenticacion() {
    if(!usuarioActual || (usuarioActual.tipo !== 'docente' && usuarioActual.tipo !== 'admin')) {
        mostrarLogin();
    } else {
        document.getElementById('nombre-docente').textContent = usuarioActual.nombre;
        
        // Mostrar panel de admin si es admin
        if(usuarioActual.tipo === 'admin') {
            mostrarPanelAdmin();
        } else if(usuarioActual.tipo === 'docente') {
            mostrarPanelDocente();
        }
    }
}

function mostrarLogin() {
    document.body.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <h1>Acceso Administrativo</h1>
                <p>Panel exclusivo para docentes y administradores</p>
                
                <form onsubmit="iniciarSesion(event)" class="form-login">
                    <input type="text" id="usuario-login" placeholder="Usuario o correo" required 
                           aria-label="Usuario o correo electrónico">
                    <input type="password" id="pass-login" placeholder="Contraseña" required 
                           aria-label="Contraseña">
                    <button type="submit" class="btn-primario">Entrar</button>
                </form>
                
                <p class="hint-login">
                    <strong>🔐 Credenciales Rector/Admin:</strong><br>
                    Correo: rector@institucion.edu<br>
                    Contraseña: Rector2026!
                    <br><br>
                    <strong>📌 Demo (Dev):</strong><br>
                    Usuario: demo | Contraseña: 123456
                </p>
                
                <a href="index.html" class="link-volver">← Volver al inicio</a>
            </div>
        </div>
    `;
}

function iniciarSesion(e) {
    e.preventDefault();
    
    let usuario = document.getElementById('usuario-login').value.trim();
    let password = document.getElementById('pass-login').value;
    
    // Docentes registrados (el admin los agrega)
    let docentesRegistrados = JSON.parse(localStorage.getItem('docentes_registrados')) || {};
    
    // Usuarios válidos
    const usuariosValidos = {
        'rector@institucion.edu': { password: 'Rector2026!', tipo: 'admin', nombre: 'Rector - Administrador' },
        'demo': { password: '123456', tipo: 'demo', nombre: 'Demo Desarrollador' }
    };
    
    // Verificar en usuarios predefinidos
    if(usuariosValidos[usuario] && usuariosValidos[usuario].password === password) {
        let datos = usuariosValidos[usuario];
        localStorage.setItem('usuario_actual', JSON.stringify({
            tipo: datos.tipo,
            nombre: datos.nombre,
            usuario: usuario,
            fecha_login: new Date().toISOString()
        }));
        window.location.reload();
        return;
    }
    
    // Verificar en docentes registrados
    if(docentesRegistrados[usuario] && docentesRegistrados[usuario].password === password) {
        localStorage.setItem('usuario_actual', JSON.stringify({
            tipo: 'docente',
            nombre: docentesRegistrados[usuario].nombre,
            email: usuario,
            fecha_login: new Date().toISOString()
        }));
        window.location.reload();
        return;
    }
    
    alert('Usuario o contraseña incorrectos');
}

function mostrarPanelAdmin() {
    // Cambiar contenido del panel para admin
    let header = document.querySelector('.admin-header p');
    if(header) {
        header.textContent = 'Panel de administración - Gestión de docentes y contenido';
    }
    
    // Agregar botón de admin a la navegación si no existe
    let btnDocentes = document.querySelector('[data-panel="docentes"]');
    if(!btnDocentes) {
        let nav = document.querySelector('.panel-navegacion');
        if(nav) {
            let btnAdmin = document.createElement('button');
            btnAdmin.className = 'panel-nav-btn';
            btnAdmin.setAttribute('data-panel', 'docentes');
            btnAdmin.setAttribute('onclick', "cambiarPanel('docentes')");
            btnAdmin.innerHTML = '👥 Gestionar Docentes';
            nav.appendChild(btnAdmin);
        }
    }
}

function mostrarPanelDocente() {
    // Asegurar que los botones de navegación existan
    let nav = document.querySelector('.panel-navegacion');
    if(!nav) {
        console.log('Navegación de panel no encontrada');
    }
}

function cerrarSesion() {
    if(confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.setItem('usuario_actual', JSON.stringify({ tipo: 'estudiante', nombre: '' }));
        window.location.href = 'index.html';
    }
}

// =========================
// GESTIÓN DE NAVEGACIÓN DEL PANEL
// =========================

function cambiarPanel(panel) {
    panelActual = panel;
    
    // Actualizar botones
    document.querySelectorAll('.panel-nav-btn').forEach(btn => {
        btn.classList.remove('activo');
    });
    let btn = document.querySelector(`[data-panel="${panel}"]`);
    if(btn) btn.classList.add('activo');
    
    // Mostrar/Ocultar secciones
    document.querySelectorAll('.panel-seccion').forEach(sec => {
        sec.style.display = 'none';
    });
    let panel_elem = document.getElementById(`panel-${panel}`);
    if(panel_elem) panel_elem.style.display = 'block';
    
    // Cargar datos según el panel
    if(panel === 'publicaciones') {
        cargarPublicacionesAdmin();
    } else if(panel === 'comentarios') {
        cargarComentariosAdmin();
    } else if(panel === 'docentes') {
        cargarDocentesAdmin();
    }
}

// =========================
// GESTIÓN DE CONTENIDO
// =========================

function guardarContenido(e) {
    e.preventDefault();
    
    let seccion = document.getElementById('seccion').value;
    let titulo = document.getElementById('titulo').value.trim();
    let descripcion = document.getElementById('descripcion').value.trim();
    let archivo = document.getElementById('archivo').value.trim();
    
    if(!seccion) {
        mostrarError('Debes seleccionar una sección');
        return;
    }
    
    if(titulo.length < 5) {
        mostrarError('El título debe tener al menos 5 caracteres');
        return;
    }
    
    if(descripcion.length < 10) {
        mostrarError('La descripción debe tener al menos 10 caracteres');
        return;
    }
    
    // Agregar contenido
    DB.agregarContenido(seccion, titulo, descripcion, archivo);
    
    // Limpiar formulario
    document.querySelector('.form-contenido').reset();
    
    // Actualizar vista
    mostrarSeccion(seccion);
    cargarEstadisticas();
    
    mostrarExito('Contenido cargado correctamente');
}

async function mostrarSeccion(seccion) {

    seccionActual = seccion;

    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('activo');
    });

    document.querySelector(`[data-seccion="${seccion}"]`).classList.add('activo');

    let lista = document.getElementById('contenido-lista');

    lista.innerHTML = "<p>Cargando...</p>";

    const { data, error } = await supabaseClient
    .from("publicaciones")
    .select("*")
    .eq("seccion", seccion)
    .order("id", { ascending: false });

    console.log("Sección:", seccion);
    console.log("Datos:", data);
    console.log("Error:", error);

    if (error) {
        console.error(error);
        lista.innerHTML = "<p>Error al cargar contenido.</p>";
        return;
    }

    if (data.length === 0) {
        lista.innerHTML = '<p class="sin-contenido">No hay contenido cargado en esta sección.</p>';
        return;
    }

    lista.innerHTML = "";

    data.forEach(item => {

        let card = document.createElement("div");

        card.className = "contenido-card";

        card.innerHTML = `
            <div class="contenido-header">
                <h4>${sanitizarHTML(item.titulo)}</h4>
            </div>

            <p>${sanitizarHTML(item.descripcion)}</p>

            ${item.url_archivo ?
            `<a href="${item.url_archivo}" target="_blank" class="btn-secundario">
                📎 Ver recurso
            </a>` : ""}

            <button onclick="eliminarContenido('${seccion}', ${item.id})" class="btn-eliminar">
                🗑️ Eliminar
            </button>
        `;

        lista.appendChild(card);

    });

}

async function eliminarContenido(seccion, id) {

    if (!confirm("¿Eliminar este contenido?")) return;

    const { error } = await supabaseClient
        .from("publicaciones")
        .delete()
        .eq("id", id);

    console.log("ID a eliminar:", id);
    console.log("Resultado DELETE:", error);

    if (error) {
        console.error("❌ Error al eliminar:", error);
        mostrarError("No fue posible eliminar el contenido.");
        return;
    }

    await mostrarSeccion(seccion);
    await cargarEstadisticas();
    mostrarExito("✅ Contenido eliminado correctamente");
}

// =========================
// ESTADÍSTICAS
// =========================

async function cargarEstadisticas() {

    // PUBLICACIONES
    const { data: publicaciones, error } = await supabaseClient
        .from("publicaciones")
        .select("seccion");

    if (error) {
        console.error("Error cargando estadísticas:", error);
        return;
    }

    const totalContenido = publicaciones.length;

    const secciones = [...new Set(publicaciones.map(p => p.seccion))];

    document.getElementById("stat-total").textContent = totalContenido;

    document.getElementById("stat-secciones").textContent = secciones.length;

    // Por ahora siguen en 0 hasta migrar comentarios
    document.getElementById("stat-comentarios").textContent = "0";

    const pendientes = document.getElementById("stat-pendientes");

    if (pendientes) {
        pendientes.textContent = "0";
    }

}

async function guardarPublicacionInicio(e) {

    e.preventDefault();

    let titulo = document.getElementById('titulo-pub').value.trim();
    let contenido = document.getElementById('contenido-pub').value.trim();

    if (titulo.length < 5) {
        mostrarError('El título debe tener al menos 5 caracteres');
        return;
    }

    if (contenido.length < 10) {
        mostrarError('El contenido debe tener al menos 10 caracteres');
        return;
    }

    const { error } = await supabaseClient
        .from("publicaciones")
        .insert([
            {
                seccion: "inicio",
                titulo: titulo,
                descripcion: contenido
            }
        ]);

    if (error) {
        console.error("❌ Error al guardar:", error);
        mostrarError("No fue posible guardar la publicación.");
        return;
    }

    // Limpiar formulario
    document.querySelector('.form-publicacion').reset();

    // Actualizar vista
    await cargarPublicacionesAdmin();
    await cargarEstadisticas();

    mostrarExito("✅ Publicación agregada correctamente");

}

async function cargarPublicacionesAdmin() {

    let lista = document.getElementById("publicaciones-lista");

    if (!lista) return;

    lista.innerHTML = "<p>Cargando publicaciones...</p>";

    const { data, error } = await supabaseClient
        .from("publicaciones")
        .select("*")
        .eq("seccion", "inicio")
        .order("id", { ascending: false });

    if (error) {
        console.error("❌ Error al cargar publicaciones:", error);
        lista.innerHTML = "<p>Error al cargar publicaciones.</p>";
        return;
    }

    if (data.length === 0) {
        lista.innerHTML = '<p class="sin-contenido">No hay publicaciones aún</p>';
        return;
    }

    lista.innerHTML = "";

    data.forEach(pub => {

        let card = document.createElement("div");
        card.className = "contenido-card";

        card.innerHTML = `
            <div class="contenido-header">
                <h4>${sanitizarHTML(pub.titulo)}</h4>
            </div>

            <p>${sanitizarHTML(pub.descripcion)}</p>

            ${pub.url_archivo ? `
                <a href="${pub.url_archivo}" target="_blank" class="btn-secundario">
                    📎 Ver archivo
                </a>
            ` : ""}

            <button onclick="eliminarPublicacionInicio(${pub.id})" class="btn-eliminar">
                🗑️ Eliminar
            </button>
        `;

        lista.appendChild(card);

    });

}

async function eliminarPublicacionInicio(id) {

    if (!confirm("¿Eliminar esta publicación?")) return;

    const { error } = await supabaseClient
        .from("publicaciones")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("❌ Error al eliminar:", error);
        mostrarError("No fue posible eliminar la publicación.");
        return;
    }

    await cargarPublicacionesAdmin();
    await cargarEstadisticas();

    mostrarExito("✅ Publicación eliminada correctamente");

}
// =========================
// GESTIÓN DE COMENTARIOS - APROBACIÓN
// =========================

function cargarComentariosAdmin() {
    let todosCom = DB.obtenerTodosComentarios();
    let lista = document.getElementById('comentarios-lista');
    
    if(!lista) return;
    
    let comentariosPendientes = [];
    let comentariosAprobados = [];
    
    // Separar comentarios
    Object.entries(todosCom).forEach(([pagina, comentarios]) => {
        comentarios.forEach(c => {
            let item = {...c, pagina: pagina};
            if(c.aprobado) {
                comentariosAprobados.push(item);
            } else {
                comentariosPendientes.push(item);
            }
        });
    });
    
    lista.innerHTML = '';
    
    // Mostrar comentarios pendientes
    if(comentariosPendientes.length > 0) {
        let titulo = document.createElement('h4');
        titulo.className = 'comentarios-titulo';
        titulo.textContent = '⏳ Comentarios Pendientes de Aprobación (' + comentariosPendientes.length + ')';
        lista.appendChild(titulo);
        
        comentariosPendientes.forEach(c => {
            let card = document.createElement('div');
            card.className = 'comentario-card pendiente';
            card.innerHTML = `
                <div class="comentario-header">
                    <h5>${sanitizarHTML(c.nombre)} - ${c.pagina}</h5>
                    <span class="fecha">${c.fecha}</span>
                </div>
                <p>${sanitizarHTML(c.mensaje)}</p>
                <div class="comentario-acciones">
                    <button onclick="aprobarComentarioAdmin('${c.pagina}', ${c.id})" class="btn-aprobado">
                        ✅ Aprobar
                    </button>
                    <button onclick="rechazarComentarioAdmin('${c.pagina}', ${c.id})" class="btn-rechazado">
                        ❌ Rechazar
                    </button>
                </div>
            `;
            lista.appendChild(card);
        });
    }
    
    // Mostrar comentarios aprobados
    if(comentariosAprobados.length > 0) {
        let titulo = document.createElement('h4');
        titulo.className = 'comentarios-titulo';
        titulo.textContent = '✅ Comentarios Aprobados (' + comentariosAprobados.length + ')';
        lista.appendChild(titulo);
        
        comentariosAprobados.forEach(c => {
            let card = document.createElement('div');
            card.className = 'comentario-card aprobado';
            card.innerHTML = `
                <div class="comentario-header">
                    <h5>${sanitizarHTML(c.nombre)} - ${c.pagina}</h5>
                    <span class="fecha">${c.fecha}</span>
                </div>
                <p>${sanitizarHTML(c.mensaje)}</p>
                <div class="comentario-acciones">
                    <button onclick="rechazarComentarioAdmin('${c.pagina}', ${c.id})" class="btn-rechazado">
                        ❌ Desaprobar
                    </button>
                </div>
            `;
            lista.appendChild(card);
        });
    }
    
    if(comentariosPendientes.length === 0 && comentariosAprobados.length === 0) {
        lista.innerHTML = '<p class="sin-contenido">No hay comentarios aún</p>';
    }
}

function aprobarComentarioAdmin(pagina, id) {
    DB.aprobarComentario(pagina, id);
    cargarComentariosAdmin();
    cargarEstadisticas();
    mostrarExito('Comentario aprobado');
}

function rechazarComentarioAdmin(pagina, id) {
    if(!confirm('¿Rechazar este comentario? Se eliminará permanentemente.')) return;
    
    DB.rechazarComentario(pagina, id);
    cargarComentariosAdmin();
    cargarEstadisticas();
    mostrarExito('Comentario rechazado');
}

// =========================
// GESTIÓN DE DOCENTES - PANEL ADMIN
// =========================

function cargarDocentesAdmin() {
    let docentesRegistrados = JSON.parse(localStorage.getItem('docentes_registrados')) || {};
    let lista = document.getElementById('docentes-lista');
    
    if(!lista) return;
    
    lista.innerHTML = '';
    
    if(Object.keys(docentesRegistrados).length === 0) {
        lista.innerHTML = '<p class="sin-contenido">No hay docentes registrados. Agrega uno nuevo con el formulario arriba.</p>';
        return;
    }
    
    Object.entries(docentesRegistrados).forEach(([email, datos]) => {
        let card = document.createElement('div');
        card.className = 'docente-card';
        card.innerHTML = `
            <div class="docente-header">
                <div>
                    <h4>${sanitizarHTML(datos.nombre)}</h4>
                    <p class="docente-email">${sanitizarHTML(email)}</p>
                    <p class="docente-rol">📌 ${sanitizarHTML(datos.rol || 'Sin rol asignado')}</p>
                </div>
                <span class="estado-activo">✅ Activo</span>
            </div>
            <div class="docente-acciones">
                <button onclick="editarDocente('${email}')" class="btn-editar">
                    ✏️ Editar
                </button>
                <button onclick="eliminarDocente('${email}')" class="btn-eliminar">
                    🗑️ Eliminar
                </button>
            </div>
        `;
        lista.appendChild(card);
    });
}

function guardarDocente(e) {
    e.preventDefault();
    
    let nombre = document.getElementById('docente-nombre').value.trim();
    let email = document.getElementById('docente-email').value.trim();
    let password = document.getElementById('docente-password').value.trim();
    let rol = document.getElementById('docente-rol').value.trim();
    
    if(nombre.length < 3) {
        mostrarError('El nombre debe tener al menos 3 caracteres');
        return;
    }
    
    if(!email.includes('@')) {
        mostrarError('Ingresa un email válido');
        return;
    }
    
    if(password.length < 6) {
        mostrarError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if(!rol) {
        mostrarError('Debes seleccionar un rol para el docente');
        return;
    }
    
    let docentesRegistrados = JSON.parse(localStorage.getItem('docentes_registrados')) || {};
    
    docentesRegistrados[email] = {
        nombre: nombre,
        password: password,
        rol: rol,
        fecha_registro: new Date().toLocaleDateString('es-ES')
    };
    
    localStorage.setItem('docentes_registrados', JSON.stringify(docentesRegistrados));
    
    document.querySelector('.form-docente').reset();
    cargarDocentesAdmin();
    mostrarExito(`Docente ${nombre} registrado correctamente como ${rol}`);
}

function eliminarDocente(email) {
    if(!confirm('¿Eliminar este docente? Perderá acceso al panel.')) return;
    
    let docentesRegistrados = JSON.parse(localStorage.getItem('docentes_registrados')) || {};
    let nombre = docentesRegistrados[email].nombre;
    
    delete docentesRegistrados[email];
    localStorage.setItem('docentes_registrados', JSON.stringify(docentesRegistrados));
    
    cargarDocentesAdmin();
    mostrarExito(`Docente ${nombre} eliminado`);
}

function editarDocente(email) {
    let docentesRegistrados = JSON.parse(localStorage.getItem('docentes_registrados')) || {};
    let datos = docentesRegistrados[email];
    
    let nuevoNombre = prompt('Nuevo nombre:', datos.nombre);
    if(nuevoNombre === null) return;
    
    let nuevaPassword = prompt('Nueva contraseña (mín. 6 caracteres, dejar vacío para no cambiar):', '');
    if(nuevaPassword === null) return;
    
    if(nuevaPassword && nuevaPassword.length < 6) {
        mostrarError('La contraseña debe tener mínimo 6 caracteres');
        return;
    }
    
    datos.nombre = nuevoNombre;
    if(nuevaPassword) {
        datos.password = nuevaPassword;
    }
    
    localStorage.setItem('docentes_registrados', JSON.stringify(docentesRegistrados));
    cargarDocentesAdmin();
    mostrarExito(`Docente ${nuevoNombre} actualizado correctamente`);
}
