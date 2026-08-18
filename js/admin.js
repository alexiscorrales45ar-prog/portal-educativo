// =========================
// PANEL ADMINISTRATIVO - SISTEMA DE ROLES
// =========================

const ADMIN_EMAILS = [
    'jahteseguire@hotmail.com' // Reemplaza con el correo del administrador principal
];

let seccionActual = 'arte';
let panelActual = 'contenido'; // 'contenido', 'publicaciones', 'comentarios'
let usuarioActual = null;
let publicacionEditId = null;

// Inicializar panel
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
});

async function verificarAutenticacion() {

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('❌ Error al verificar sesión:', error);
        mostrarLogin();
        return;
    }

    const session = data.session;

    // No existe sesión real en Supabase
    if (!session || !session.user) {
        mostrarLogin();
        return;
    }

    const usuario = session.user;

    console.log('👤 Usuario completo:', usuario);
    console.log('🔐 Metadata del usuario:', usuario.user_metadata);

    console.log('✅ Sesión válida de Supabase:', usuario.email);

    const nombre =
        usuario.user_metadata?.nombre ||
        usuario.email;

    const tipo =
        usuario.user_metadata?.tipo ||
        (ADMIN_EMAILS.includes(usuario.email) ? 'admin' : 'docente');

    usuarioActual = {
        nombre,
        email: usuario.email,
        tipo,
        fecha_login: new Date().toISOString()
    };

    const elementoNombre = document.getElementById('nombre-docente');

    if (elementoNombre) {
        elementoNombre.textContent = nombre;
    }

    if (tipo === 'admin') {
        mostrarPanelAdmin();
    } else {
        mostrarPanelDocente();
    }
}

function mostrarLogin() {
    document.body.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <div class="login-header">
                    <img src="img/escudo.JPG" alt="Escudo institucional" class="login-logo">
                    <h1>Acceso Administrativo</h1>
                    <p>Panel exclusivo para docentes y administradores</p>
                </div>

                <form onsubmit="iniciarSesion(event)" class="form-login">
                    <input type="text" id="usuario-login" placeholder="Usuario o correo" required 
                           aria-label="Usuario o correo electrónico">
                    <input type="password" id="pass-login" placeholder="Contraseña" required 
                           aria-label="Contraseña">
                    <p class="login-recover" onclick="recuperarContraseña()">
                        ¿Olvidaste tu contraseña?
                    </p>
                    <button type="submit" class="btn-primario">Entrar</button>
                </form>

                <a href="index.html" class="link-volver">← Volver al inicio</a>
            </div>
        </div>
    `;
}
async function recuperarContraseña() {
    const email = document.getElementById('usuario-login').value.trim();

    if (!email) {
        alert('Escribe primero tu correo electrónico.');
        return;
    }

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/paginas/recuperar-password.html'
    });

    if (error) {
        console.error('❌ Error al recuperar contraseña:', error);
        alert('No se pudo enviar el correo: ' + error.message);
        return;
    }

    alert('Se ha enviado un enlace para restablecer la contraseña a tu correo.');
}
async function iniciarSesion(e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario-login').value.trim();
    const password = document.getElementById('pass-login').value;

    if (!usuario || !password) {
        alert('Ingresa tu correo y contraseña.');
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: usuario,
            password: password
        });

        if (error) {
            console.error('❌ Error al iniciar sesión:', error);
            alert('Correo o contraseña incorrectos.');
            return;
        }

        if (!data.user) {
            alert('No se pudo iniciar la sesión.');
            return;
        }

        console.log('✅ Sesión iniciada:', data.user.email);

        const tipoUsuario =
            data.user.user_metadata?.tipo ||
            (ADMIN_EMAILS.includes(data.user.email) ? 'admin' : 'docente');

        usuarioActual = {
            nombre: data.user.user_metadata?.nombre || data.user.email,
            email: data.user.email,
            tipo: tipoUsuario,
            fecha_login: new Date().toISOString()
        };

        window.location.reload();

    } catch (error) {
        console.error('❌ Error inesperado al iniciar sesión:', error);
        alert('Ocurrió un error al intentar iniciar sesión.');
    }
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
    const nav = document.querySelector('.panel-navegacion');

    // Asegurar que el botón de gestión de docentes no esté visible para docentes.
    const btnAdmin = document.querySelector('[data-panel="docentes"]');
    if (btnAdmin) {
        btnAdmin.style.display = 'none';
    }

    // Asegurar que docentes vean las secciones de publicaciones y comentarios.
    ['publicaciones', 'comentarios', 'contenido'].forEach(panel => {
        const btn = document.querySelector(`[data-panel="${panel}"]`);
        if (btn) {
            btn.style.display = 'inline-flex';
        }
    });

    if (!nav) {
        console.log('Navegación de panel no encontrada');
    }
}

async function cerrarSesion() {

    if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        return;
    }

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error('❌ Error al cerrar sesión:', error);
        alert('No se pudo cerrar la sesión.');
        return;
    }

    console.log('✅ Sesión cerrada correctamente');

    usuarioActual = null;

    window.location.href = 'index.html';
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

async function guardarContenido(e) {
    e.preventDefault();

    let seccion = document.getElementById('seccion').value;
    let titulo = document.getElementById('titulo').value.trim();
    let descripcion = document.getElementById('descripcion').value.trim();
    let archivo = document.getElementById('archivo').value.trim();
    let archivoFinal = archivo;

    // ==========================================
    // VALIDAR DATOS BÁSICOS
    // ==========================================

    if (!seccion) {
        mostrarError('Debes seleccionar una sección');
        return;
    }

    if (titulo.length < 5) {
        mostrarError('El título debe tener al menos 5 caracteres');
        return;
    }

    if (descripcion.length < 10) {
        mostrarError('La descripción debe tener al menos 10 caracteres');
        return;
    }

    // ==========================================
    // SUBIR IMAGEN A SUPABASE STORAGE
    // ==========================================

    try {
        const fileInput = document.getElementById('archivo-file');

        if (
            fileInput &&
            fileInput.files &&
            fileInput.files.length > 0
        ) {
            const file = fileInput.files[0];

            const safeName = file.name.replace(
                /[^a-zA-Z0-9_.-]/g,
                '_'
            );

            // Nombre único dentro del bucket publicaciones
            const path = `${Date.now()}_${safeName}`;

            console.log('📤 Subiendo imagen:', path);

            const {
                data: uploadData,
                error: uploadError
            } = await supabaseClient.storage
                .from('publicaciones')
                .upload(path, file);

            if (uploadError) {
                console.error(
                    '❌ Error subiendo imagen:',
                    uploadError
                );

                mostrarError(
                    'No fue posible subir la imagen. Intenta nuevamente.'
                );

                return;
            }

            console.log(
                '✅ Imagen subida correctamente:',
                uploadData
            );

            // ==========================================
            // OBTENER URL PÚBLICA
            // ==========================================

            const {
                data: publicData
            } = supabaseClient.storage
                .from('publicaciones')
                .getPublicUrl(path);

            if (
                publicData &&
                publicData.publicUrl
            ) {
                archivoFinal = publicData.publicUrl;

                console.log(
                    '🔗 URL pública:',
                    archivoFinal
                );
            }
        }

    } catch (err) {

        console.error(
            '❌ Error al procesar la imagen:',
            err
        );

        mostrarError(
            'Error al procesar la imagen.'
        );

        return;
    }

    // ==========================================
    // GUARDAR CONTENIDO EN LA BASE DE DATOS
    // ==========================================

    const guardado = await DB.agregarContenido(
        seccion,
        titulo,
        descripcion,
        archivoFinal
    );

    if (!guardado) {
        mostrarError(
            'No fue posible guardar el contenido. Verifica la conexión con Supabase.'
        );
        return;
    }

    // ==========================================
    // LIMPIAR FORMULARIO
    // ==========================================

    document
        .querySelector('.form-contenido')
        .reset();

    // ==========================================
    // ACTUALIZAR VISTA
    // ==========================================

    await mostrarSeccion(seccion);
    await cargarEstadisticas();

    mostrarExito(
        '✅ Contenido cargado correctamente'
    );
}

async function mostrarSeccion(seccion) {

    seccionActual = seccion;

    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('activo'));
    document.querySelector(`[data-seccion="${seccion}"]`).classList.add('activo');

    const lista = document.getElementById('contenido-lista');
    if (!lista) return;
    lista.innerHTML = "<p class='sin-contenido'>Cargando...</p>";

    const { data, error } = await supabaseClient
        .from("publicaciones")
        .select("*")
        .eq("seccion", seccion)
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        lista.innerHTML = "<p>Error al cargar contenido.</p>";
        return;
    }

    if (!data || data.length === 0) {
        lista.innerHTML = '<p class="sin-contenido">No hay contenido cargado en esta sección.</p>';
        return;
    }

    // Cache minimal fields for client-side operations
    window._publicacionesCache = data.map(item => ({
        id: item.id,
        titulo: item.titulo || '',
        descripcion: item.descripcion || '',
        seccion: item.seccion || '',
        url_archivo: item.url_archivo || item.url || item.archivo || null,
        fecha: item.fecha || item.created_at || null
    }));

    // Render controls and container
    lista.innerHTML = `
        <div class="lista-controls">
            <input type="search" id="buscar-publicacion" class="buscar-publicacion" placeholder="🔎 Buscar publicación..." aria-label="Buscar publicación">
            <div id="estadisticas-seccion" class="stats-small"></div>
        </div>
        <div id="lista-rows" class="lista-rows"></div>
        <div id="contenido-paginacion" class="contenido-paginacion"></div>
    `;

    const searchInput = document.getElementById('buscar-publicacion');
    const rowsContainer = document.getElementById('lista-rows');
    const pagContainer = document.getElementById('contenido-paginacion');
    const statsElem = document.getElementById('estadisticas-seccion');

    const publicaciones = window._publicacionesCache.slice();
    let filteredList = publicaciones;
    let currentPage = 1;
    const pageSize = 20;

    function formatDate(fecha) {
        if (!fecha) return '';
        const d = new Date(fecha);
        if (isNaN(d)) return '';
        return d.toLocaleDateString('es-ES');
    }

    function renderRows(list, page = 1) {
        rowsContainer.innerHTML = '';

        const start = (page - 1) * pageSize;
        const pageItems = list.slice(start, start + pageSize);

        // Header (desktop)
        const header = document.createElement('div');
        header.className = 'lista-row header';
        header.innerHTML = `
            <div class="col id-col">ID</div>
            <div class="col title-col">Publicación</div>
            <div class="col section-col">Sección</div>
            <div class="col date-col">Fecha</div>
            <div class="col resource-col">Recurso</div>
            <div class="col actions-col">Acciones</div>
        `;
        rowsContainer.appendChild(header);

        pageItems.forEach(it => {
            const row = document.createElement('div');
            row.className = 'lista-row';
            row.innerHTML = `
                <div class="col id-col">${sanitizarHTML(String(it.id))}</div>
                <div class="col title-col">${sanitizarHTML(it.titulo)}</div>
                <div class="col section-col">${sanitizarHTML(it.seccion)}</div>
                <div class="col date-col">${formatDate(it.fecha)}</div>
                <div class="col resource-col">${it.url_archivo ? '📎' : ''}</div>
                <div class="col actions-col">
                    <button type="button" class="btn-ver" data-id="${it.id}">👁️</button>
                    <button type="button" class="btn-eliminar-list" data-id="${it.id}">🗑️</button>
                </div>
            `;
            rowsContainer.appendChild(row);
        });

        // Attach events
        rowsContainer.querySelectorAll('.btn-ver').forEach(b => b.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id, 10);
            abrirModalPublicacion(id);
        }));

        rowsContainer.querySelectorAll('.btn-eliminar-list').forEach(b => b.addEventListener('click', async (e) => {
            const id = parseInt(e.currentTarget.dataset.id, 10);
            if (!confirm('¿Eliminar este contenido?')) return;
            await eliminarContenido(seccion, id);
            // refresh data after deletion
            await mostrarSeccion(seccion);
        }));

        statsElem.textContent = `${list.length} publicaciones en esta sección`;

        renderPagination(list.length);
    }

    function renderPagination(total) {
        pagContainer.innerHTML = '';
        if (total <= pageSize) return;
        const totalPages = Math.ceil(total / pageSize);

        const info = document.createElement('div');
        info.className = 'pagin-info';
        const startItem = Math.min((currentPage - 1) * pageSize + 1, total);
        const endItem = Math.min(currentPage * pageSize, total);
        info.textContent = `Mostrando ${startItem}–${endItem} de ${total} publicaciones`;
        pagContainer.appendChild(info);

        const controls = document.createElement('div');
        controls.className = 'pagin-controls';

        const prev = document.createElement('button');
        prev.textContent = 'Anterior';
        prev.disabled = currentPage <= 1;
        prev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderRows(filteredList, currentPage); } });
        controls.appendChild(prev);

        // show up to 7 page buttons
        const maxButtons = 7;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let p = startPage; p <= endPage; p++) {
            const btn = document.createElement('button');
            btn.textContent = String(p);
            if (p === currentPage) btn.className = 'active';
            btn.addEventListener('click', () => { currentPage = p; renderRows(filteredList, currentPage); });
            controls.appendChild(btn);
        }

        const next = document.createElement('button');
        next.textContent = 'Siguiente';
        next.disabled = currentPage >= totalPages;
        next.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; renderRows(filteredList, currentPage); } });
        controls.appendChild(next);

        pagContainer.appendChild(controls);
    }

    // Search filtering (client-side)
    searchInput.addEventListener('input', function () {
        const q = (this.value || '').trim().toLowerCase();
        currentPage = 1;
        if (!q) filteredList = publicaciones.slice();
        else filteredList = publicaciones.filter(it => (it.titulo && it.titulo.toLowerCase().includes(q)) || (it.descripcion && it.descripcion.toLowerCase().includes(q)));
        renderRows(filteredList, currentPage);
    });

    // Initial render
    renderRows(filteredList, currentPage);

    // Modal de detalles
    window.abrirModalPublicacion = function (id) {
        const item = (window._publicacionesCache || []).find(x => x.id === id);
        if (!item) return;
        let existing = document.getElementById(`modal-publicacion-${id}`);
        if (existing) { existing.style.display = 'flex'; return; }
        const modal = document.createElement('div');
        modal.id = `modal-publicacion-${id}`;
        modal.className = 'modal-publicacion';
        modal.style = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.4);z-index:9999;";
        modal.innerHTML = `
            <div style="background:#fff;padding:20px;border-radius:8px;max-width:760px;width:94%;max-height:90vh;overflow:auto;">
                <h3>${sanitizarHTML(item.titulo)}</h3>
                <p><strong>Sección:</strong> ${sanitizarHTML(item.seccion)}</p>
                <p><strong>Fecha:</strong> ${formatDate(item.fecha)}</p>
                <div style="margin:12px 0;color:#333;">${sanitizarHTML(item.descripcion)}</div>
                ${item.url_archivo ? `<p><a href="${item.url_archivo}" target="_blank" class="btn-secundario">📎 Ver Recurso</a></p>` : ''}
                <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
                    <button class="btn-secundario" onclick="document.getElementById('modal-publicacion-${id}').style.display='none'">Cerrar</button>
                    <button class="btn-secundario" id="modal-delete-${id}">🗑️ Eliminar</button>
                </div>
            </div>
        `;
        modal.addEventListener('click', function (e) { if (e.target === modal) modal.style.display = 'none'; });
        document.body.appendChild(modal);
        document.getElementById(`modal-delete-${id}`).addEventListener('click', async function () {
            if (!confirm('¿Eliminar este contenido?')) return;
            await eliminarContenido(seccion, id);
            modal.style.display = 'none';
            await mostrarSeccion(seccion);
        });
    };

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

    const { count: totalComentarios, error: errorTotal } = await supabaseClient
        .from('comentarios')
        .select('*', { count: 'exact', head: true });

    if (errorTotal) {
        console.error('❌ Error al contar comentarios:', errorTotal);
    }

    document.getElementById("stat-comentarios").textContent = totalComentarios ?? 0;

}

async function guardarPublicacionInicio(e) {

    e.preventDefault();

    const titulo = document.getElementById('titulo-pub').value.trim();
    const contenido = document.getElementById('contenido-pub').value.trim();

    if (titulo.length < 5) {
        mostrarError('El título debe tener al menos 5 caracteres');
        return;
    }

    if (contenido.length < 10) {
        mostrarError('El contenido debe tener al menos 10 caracteres');
        return;
    }

    let archivoFinal = '';

    try {

        // =========================
        // SUBIR IMAGEN SI EXISTE
        // =========================

        const fileInput = document.getElementById('archivo-pub');

        if (fileInput && fileInput.files && fileInput.files.length > 0) {

            const file = fileInput.files[0];

            const safeName = file.name.replace(
                /[^a-zA-Z0-9_.-]/g,
                '_'
            );

            const path = `publicaciones-inicio/${Date.now()}_${safeName}`;

            const {
                data: uploadData,
                error: uploadError
            } = await supabaseClient.storage
                .from('publicaciones')
                .upload(path, file);

            if (uploadError) {
                console.error(
                    '❌ Error subiendo imagen:',
                    uploadError
                );

                mostrarError(
                    'No fue posible subir la imagen.'
                );

                return;
            }

            console.log(
                '✅ Imagen subida:',
                uploadData
            );

            const {
                data: publicData
            } = supabaseClient.storage
                .from('publicaciones')
                .getPublicUrl(path);

            archivoFinal =
                publicData?.publicUrl || '';

            console.log(
                '🔗 URL pública:',
                archivoFinal
            );
        }

        // =========================
        // EDITAR PUBLICACIÓN
        // =========================

        if (publicacionEditId) {

            const actualizado =
                await DB.actualizarPublicacionInicio(
                    publicacionEditId,
                    titulo,
                    contenido,
                    archivoFinal
                );

            if (!actualizado) {
                mostrarError(
                    'No fue posible actualizar la publicación.'
                );
                return;
            }

            mostrarExito(
                '✅ Publicación actualizada correctamente'
            );

            publicacionEditId = null;

        } else {

            // =========================
            // CREAR PUBLICACIÓN
            // =========================

            const guardado =
                await DB.agregarContenido(
                    'inicio',
                    titulo,
                    contenido,
                    archivoFinal
                );

            if (!guardado) {
                mostrarError(
                    'No fue posible guardar la publicación. Verifica la conexión con Supabase.'
                );
                return;
            }

            mostrarExito(
                '✅ Publicación agregada correctamente'
            );
        }

    } catch (error) {

        console.error(
            '❌ Error procesando publicación:',
            error
        );

        mostrarError(
            'Ocurrió un error al procesar la publicación.'
        );

        return;
    }

    // =========================
    // LIMPIAR FORMULARIO
    // =========================

    document
        .querySelector('.form-publicacion')
        .reset();

    cancelarEdicionPublicacion();

    // =========================
    // ACTUALIZAR VISTA
    // =========================

    await cargarPublicacionesAdmin();
    await cargarEstadisticas();
}

async function editarPublicacionInicio(id) {
    const publicacion = await DB.obtenerPublicacionInicio(id);
    if (!publicacion) {
        mostrarError('No se encontró la publicación para editar.');
        return;
    }

    document.getElementById('titulo-pub').value = publicacion.titulo || '';
    document.getElementById('contenido-pub').value = publicacion.descripcion || '';
    publicacionEditId = id;

    let btnEnviar = document.querySelector('.form-publicacion button[type="submit"]');
    if (btnEnviar) {
        btnEnviar.textContent = 'Actualizar Publicación';
    }

    let tituloForm = document.querySelector('.form-publicacion h3');
    if (tituloForm) {
        tituloForm.textContent = '✏️ Editar Publicación';
    }

    let cancelBtn = document.getElementById('cancelar-edicion-publicacion');
    if (!cancelBtn) {
        cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelar-edicion-publicacion';
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn-secundario';
        cancelBtn.style.marginLeft = '10px';
        cancelBtn.textContent = 'Cancelar edición';
        cancelBtn.onclick = cancelarEdicionPublicacion;
        let form = document.querySelector('.form-publicacion');
        if (form) form.appendChild(cancelBtn);
    }

    mostrarExito('Edita los campos y guarda para actualizar la publicación');
}

function cancelarEdicionPublicacion() {
    publicacionEditId = null;
    document.querySelector('.form-publicacion').reset();

    let btnEnviar = document.querySelector('.form-publicacion button[type="submit"]');
    if (btnEnviar) {
        btnEnviar.textContent = 'Publicar';
    }

    let tituloForm = document.querySelector('.form-publicacion h3');
    if (tituloForm) {
        tituloForm.textContent = '📢 Crear Nueva Publicación';
    }
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

            <div class="btn-acciones">
            <button onclick="editarPublicacionInicio(${pub.id})" class="btn-secundario">
                ✏️ Editar
            </button>
            <button onclick="eliminarPublicacionInicio(${pub.id})" class="btn-eliminar">
                🗑️ Eliminar
            </button>
        </div>
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
// GESTIÓN DE COMENTARIOS
// =========================

async function cargarComentariosAdmin() {
    const { data: todosCom, error } = await supabaseClient
        .from("comentarios")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("❌ Error al cargar comentarios:", error);
        return;
    }

    const lista = document.getElementById('comentarios-lista');
    const totalLabel = document.getElementById('comentarios-total');
    const searchInput = document.getElementById('buscar-comentarios');
    const pagContainer = document.getElementById('comentarios-paginacion');

    if (!lista || !totalLabel || !searchInput || !pagContainer) return;

    const comentarios = (todosCom || []).map(c => ({
        ...c,
        fecha: c.fecha || c.created_at || null,
        mensaje: c.mensaje || c.comentario || '',
        publicacion_titulo: `Publicación #${c.publicacion_id}`
    }));

    if (comentarios.length === 0) {
        lista.innerHTML = '<p class="sin-contenido">No hay comentarios aún.</p>';
        totalLabel.textContent = 'Total comentarios: 0';
        pagContainer.innerHTML = '';
        return;
    }

    let filtered = comentarios.slice();
    let currentPage = 1;
    const pageSize = 8;

    function formatDate(fecha) {
        if (!fecha) return '';
        const d = new Date(fecha);
        if (isNaN(d)) return '';
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function renderPage(page = 1) {
        lista.innerHTML = '';
        const start = (page - 1) * pageSize;
        const pageItems = filtered.slice(start, start + pageSize);

        totalLabel.textContent = `Total comentarios: ${filtered.length}`;

        pageItems.forEach(c => {
            const fecha = formatDate(c.fecha);
            const card = document.createElement('article');
            card.className = 'comentario-card';
            card.innerHTML = `
                <div class="comentario-header">
                    <div>
                        <h5>${sanitizarHTML(c.nombre)}</h5>
                        <p class="comentario-publicacion">${sanitizarHTML(c.publicacion_titulo)}</p>
                    </div>
                    <span class="fecha">${sanitizarHTML(fecha)}</span>
                </div>
                <p class="comentario-texto">${sanitizarHTML(c.mensaje)}</p>
                <div class="comentario-acciones">
                    <button type="button" onclick="eliminarComentarioAdmin(${c.id})" class="btn-eliminar">🗑️ Eliminar</button>
                </div>
            `;
            lista.appendChild(card);
        });

        renderPagination(filtered.length, page);
    }

    function renderPagination(total, page) {
        pagContainer.innerHTML = '';
        if (total <= pageSize) return;

        const totalPages = Math.ceil(total / pageSize);

        const info = document.createElement('div');
        info.className = 'pagin-info';
        const startItem = Math.min((page - 1) * pageSize + 1, total);
        const endItem = Math.min(page * pageSize, total);
        info.textContent = `Mostrando ${startItem}–${endItem} de ${total}`;
        pagContainer.appendChild(info);

        const controls = document.createElement('div');
        controls.className = 'pagin-controls';

        const prev = document.createElement('button');
        prev.textContent = 'Anterior';
        prev.disabled = page <= 1;
        prev.addEventListener('click', () => { if (page > 1) { currentPage -= 1; renderPage(currentPage); } });
        controls.appendChild(prev);

        const maxButtons = 5;
        let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let p = startPage; p <= endPage; p++) {
            const btn = document.createElement('button');
            btn.textContent = String(p);
            if (p === page) btn.className = 'active';
            btn.addEventListener('click', () => { currentPage = p; renderPage(currentPage); });
            controls.appendChild(btn);
        }

        const next = document.createElement('button');
        next.textContent = 'Siguiente';
        next.disabled = page >= totalPages;
        next.addEventListener('click', () => { if (page < totalPages) { currentPage += 1; renderPage(currentPage); } });
        controls.appendChild(next);

        pagContainer.appendChild(controls);
    }

    searchInput.value = '';
    searchInput.oninput = function () {
        const query = (this.value || '').trim().toLowerCase();
        currentPage = 1;
        if (!query) {
            filtered = comentarios.slice();
        } else {
            filtered = comentarios.filter(c =>
                c.nombre.toLowerCase().includes(query) ||
                c.mensaje.toLowerCase().includes(query) ||
                c.publicacion_titulo.toLowerCase().includes(query)
            );
        }
        renderPage(currentPage);
    };

    renderPage(currentPage);
}


async function eliminarComentarioAdmin(id) {
    if (!confirm("¿Eliminar este comentario? Esta acción no se puede deshacer.")) {
        return;
    }

    const { error } = await supabaseClient
        .from("comentarios")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("❌ Error al eliminar comentario:", error);
        mostrarError("No fue posible eliminar el comentario.");
        return;
    }

    await cargarComentariosAdmin();
    await cargarEstadisticas();

    mostrarExito("🗑️ Comentario eliminado correctamente");
}
// =========================
// GESTIÓN DE DOCENTES - PANEL ADMIN
// =========================

async function cargarDocentesAdmin() {
    const lista = document.getElementById('docentes-lista');

    if (!lista) return;

    lista.innerHTML = `
        <p class="sin-contenido">Cargando usuarios...</p>
    `;

    try {
        const { data, error } =
            await supabaseClient.functions.invoke(
                'crear-usuario-admin',
                {
                    body: {
                        accion: 'listar'
                    }
                }
            );

        if (error) {
            console.error(
                '❌ Error al cargar usuarios:',
                error
            );

            lista.innerHTML = `
                <p class="sin-contenido">
                    No fue posible cargar los usuarios.
                </p>
            `;

            return;
        }

        if (!data || data.success !== true) {
            console.error(
                '❌ Error devuelto por Edge Function:',
                data
            );

            lista.innerHTML = `
                <p class="sin-contenido">
                    ${sanitizarHTML(
                        data?.error ||
                        'No fue posible cargar los usuarios.'
                    )}
                </p>
            `;

            return;
        }

        const usuarios = data.usuarios || [];

        lista.innerHTML = '';

        if (usuarios.length === 0) {
            lista.innerHTML = `
                <p class="sin-contenido">
                    No hay usuarios registrados.
                </p>
            `;
            return;
        }

        usuarios.forEach(usuario => {

            const card =
                document.createElement('div');

            card.className = 'docente-card';

            const nombre =
                usuario.nombre ||
                usuario.email ||
                'Usuario';

            const email =
                usuario.email ||
                '';

            const tipo =
                usuario.tipo === 'admin'
                    ? 'Administrador'
                    : 'Docente';

            const icono =
                usuario.tipo === 'admin'
                    ? '🔐'
                    : '👨‍🏫';

            const fecha =
                usuario.creado
                    ? new Date(
                        usuario.creado
                    ).toLocaleDateString(
                        'es-ES'
                    )
                    : '';

            card.innerHTML = `
                <div class="docente-header">
                    <div>
                        <h4>
                            ${sanitizarHTML(nombre)}
                        </h4>

                        <p class="docente-email">
                            ${sanitizarHTML(email)}
                        </p>

                        <p class="docente-rol">
                            📌 ${icono}
                            ${sanitizarHTML(tipo)}
                        </p>

                        ${
                            fecha
                                ? `
                                <small>
                                    Registrado:
                                    ${fecha}
                                </small>
                                `
                                : ''
                        }
                    </div>

                    <span class="estado-activo">
                        ✅ Activo
                    </span>
                </div>

                <div class="docente-acciones">

                    <button
                        onclick="editarDocente('${sanitizarHTML(email)}')"
                        class="btn-editar">
                        ✏️ Editar
                    </button>

                    <button
                        onclick="eliminarDocente('${sanitizarHTML(email)}')"
                        class="btn-eliminar">
                        🗑️ Eliminar
                    </button>

                </div>
            `;

            lista.appendChild(card);
        });

    } catch (error) {

        console.error(
            '❌ Error inesperado al cargar usuarios:',
            error
        );

        lista.innerHTML = `
            <p class="sin-contenido">
                Ocurrió un error al cargar los usuarios.
            </p>
        `;
    }
}

async function guardarDocente(e) {
    e.preventDefault();

    const nombre = document.getElementById('docente-nombre').value.trim();
    const email = document.getElementById('docente-email').value.trim().toLowerCase();
    const password = document.getElementById('docente-password').value;
    const rol = document.getElementById('docente-rol').value;

    // =========================
    // VALIDACIONES
    // =========================

    if (nombre.length < 3) {
        mostrarError('El nombre debe tener al menos 3 caracteres.');
        return;
    }

    if (!email || !email.includes('@')) {
        mostrarError('Ingresa un correo electrónico válido.');
        return;
    }

    if (password.length < 6) {
        mostrarError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    if (rol !== 'docente' && rol !== 'admin') {
        mostrarError('Debes seleccionar un rol válido.');
        return;
    }

    // =========================
    // CONFIRMAR CREACIÓN
    // =========================

    const nombreRol = rol === 'admin'
        ? 'Administrador'
        : 'Docente';

    if (
        !confirm(
            `¿Crear este usuario?\n\n` +
            `Nombre: ${nombre}\n` +
            `Correo: ${email}\n` +
            `Rol: ${nombreRol}`
        )
    ) {
        return;
    }

    // =========================
    // DESACTIVAR BOTÓN
    // =========================

    const formulario = e.target;
    const boton = formulario.querySelector('button[type="submit"]');

    if (boton) {
        boton.disabled = true;
        boton.textContent = 'Creando usuario...';
    }

    try {

        // =========================
        // VERIFICAR SESIÓN ACTUAL
        // =========================

        const {
            data: { session },
            error: sessionError
        } = await supabaseClient.auth.getSession();

        if (sessionError || !session) {
            mostrarError('Tu sesión ha expirado. Inicia sesión nuevamente.');
            return;
        }

        // =========================
        // LLAMAR EDGE FUNCTION
        // =========================

        const { data, error } = await supabaseClient.functions.invoke(
            'crear-usuario-admin',
            {
                body: {
                    accion: 'crear',
                    nombre: nombre,
                    email: email,
                    password: password,
                    tipo: rol
                }
            }
        );

        // =========================
        // ERROR DE LA FUNCIÓN
        // =========================

        if (error) {
            console.error(
                '❌ Error al crear usuario:',
                error
            );

            mostrarError(
                'No fue posible crear el usuario.'
            );

            return;
        }

        // La Edge Function también puede devolver
        // un error dentro de data
        if (!data || data.success !== true) {

            console.error(
                '❌ Error devuelto por Edge Function:',
                data
            );

            mostrarError(
                data?.error ||
                'No fue posible crear el usuario.'
            );

            return;
        }

        // =========================
        // ÉXITO
        // =========================

        console.log(
            '✅ Usuario creado correctamente:',
            data.usuario
        );

        formulario.reset();

        mostrarExito(
            `✅ ${nombreRol} ${nombre} creado correctamente.`
        );

        // Recargar la lista de usuarios.
        // Actualmente cargarDocentesAdmin()
        // todavía usa localStorage, por lo que
        // la reemplazaremos posteriormente.
        //
        // NO dependemos de localStorage para crear
        // el usuario.

    } catch (error) {

        console.error(
            '❌ Error inesperado al crear usuario:',
            error
        );

        mostrarError(
            'Ocurrió un error inesperado al crear el usuario.'
        );

    } finally {

        // =========================
        // RESTAURAR BOTÓN
        // =========================

        if (boton) {
            boton.disabled = false;
            boton.textContent = 'Crear Usuario';
        }
    }
}

async function eliminarDocente(email) {

    if (!confirm(
        `¿Eliminar al usuario ${email}?\n\n` +
        `Perderá inmediatamente el acceso al panel.`
    )) {
        return;
    }

    try {

        const { data, error } =
            await supabaseClient.functions.invoke(
                'crear-usuario-admin',
                {
                    body: {
                        accion: 'eliminar',
                        email: email
                    }
                }
            );

        if (error) {
            console.error(
                '❌ Error al eliminar usuario:',
                error
            );

            mostrarError(
                'No fue posible eliminar el usuario.'
            );

            return;
        }

        if (!data || data.success !== true) {

            console.error(
                '❌ Error devuelto por Edge Function:',
                data
            );

            mostrarError(
                data?.error ||
                'No fue posible eliminar el usuario.'
            );

            return;
        }

        console.log(
            '✅ Usuario eliminado:',
            email
        );

        await cargarDocentesAdmin();

        mostrarExito(
            `🗑️ Usuario ${email} eliminado correctamente.`
        );

    } catch (error) {

        console.error(
            '❌ Error inesperado al eliminar:',
            error
        );

        mostrarError(
            'Ocurrió un error al eliminar el usuario.'
        );
    }
}

async function editarDocente(email) {

    const nuevoNombre = prompt(
        'Nuevo nombre:',
        ''
    );

    if (nuevoNombre === null) {
        return;
    }

    const nombre = nuevoNombre.trim();

    if (nombre.length < 3) {
        mostrarError(
            'El nombre debe tener al menos 3 caracteres.'
        );
        return;
    }

    const nuevaPassword = prompt(
        'Nueva contraseña (mínimo 6 caracteres).\n' +
        'Deja vacío si no deseas cambiarla:',
        ''
    );

    if (nuevaPassword === null) {
        return;
    }

    if (
        nuevaPassword &&
        nuevaPassword.length < 6
    ) {
        mostrarError(
            'La contraseña debe tener mínimo 6 caracteres.'
        );
        return;
    }

    if (!confirm(
        `¿Guardar los cambios para ${email}?`
    )) {
        return;
    }

    try {

        const { data, error } =
            await supabaseClient.functions.invoke(
                'crear-usuario-admin',
                {
                    body: {
                        accion: 'editar',
                        email: email,
                        nombre: nombre,
                        password:
                            nuevaPassword || undefined
                    }
                }
            );

        if (error) {

            console.error(
                '❌ Error al actualizar usuario:',
                error
            );

            mostrarError(
                'No fue posible actualizar el usuario.'
            );

            return;
        }

        if (!data || data.success !== true) {

            console.error(
                '❌ Error devuelto por Edge Function:',
                data
            );

            mostrarError(
                data?.error ||
                'No fue posible actualizar el usuario.'
            );

            return;
        }

        console.log(
            '✅ Usuario actualizado:',
            data.usuario
        );

        await cargarDocentesAdmin();

        mostrarExito(
            `✅ Usuario ${nombre} actualizado correctamente.`
        );

    } catch (error) {

        console.error(
            '❌ Error inesperado al actualizar:',
            error
        );

        mostrarError(
            'Ocurrió un error inesperado.'
        );
    }
}
