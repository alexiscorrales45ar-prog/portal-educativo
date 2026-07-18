// DATOS DE DEMOSTRACIÓN PARA EL PORTAL
// Copia este código en la consola del navegador (F12) si quieres pre-cargar datos de ejemplo

// Crear datos de ejemplo
function cargarDatosDemo() {
    // COMENTARIOS DE EJEMPLO
    const comentariosDemo = {
        "index.html": [
            {
                id: 1,
                nombre: "Carlos López",
                mensaje: "Excelente portal, muy útil para conectar con la institución. Felicitaciones al equipo de desarrollo.",
                fecha: "15/05/2026"
            },
            {
                id: 2,
                nombre: "Ana Martínez",
                mensaje: "Me encanta poder comentar y ver las actividades del colegio. Espero que sigan agregando más contenido.",
                fecha: "14/05/2026"
            }
        ],
        "paginas/arte.html": [
            {
                id: 3,
                nombre: "Diego Ramos",
                mensaje: "La sección de arte tiene obras muy interesantes. ¡Quisiera ver más trabajos de los estudiantes!",
                fecha: "13/05/2026"
            }
        ],
        "paginas/literatura.html": [
            {
                id: 4,
                nombre: "María González",
                mensaje: "Los poemas que compartieron son hermosos. Siento inspiración para escribir los míos también.",
                fecha: "12/05/2026"
            }
        ]
    };

    // CONTENIDO DE EJEMPLO PARA DOCENTES
    const contenidoDemo = {
        arte: [
            {
                id: 1000,
                titulo: "Técnicas de Acuarela - Nivel Básico",
                descripcion: "Video tutorial completo sobre cómo comenzar con acuarelas. Cubrimos materiales necesarios, técnicas de mojado, mezcla de colores y proyectos para principiantes.",
                archivo: "https://www.youtube.com/watch?v=ejemploId1",
                fecha: "16/05/2026"
            },
            {
                id: 1001,
                titulo: "Galería Virtual - Obras de Estudiantes",
                descripcion: "Colección de trabajos artísticos realizados por estudiantes de 8vo y 9no grado. Incluye dibujos, pinturas y proyectos de escultura. ¡Explora el talento de nuestros estudiantes!",
                archivo: "https://drive.google.com/folder/ejemploId2",
                fecha: "15/05/2026"
            }
        ],
        literatura: [
            {
                id: 2000,
                titulo: "Análisis de 'Cien Años de Soledad'",
                descripcion: "Documento PDF con análisis detallado de la novela clásica. Incluye análisis de personajes, temas principales, estructura narrativa y contexto histórico.",
                archivo: "https://drive.google.com/file/d/ejemploId3/view",
                fecha: "14/05/2026"
            },
            {
                id: 2001,
                titulo: "Taller de Poesía - Junio 2026",
                descripcion: "Inscripciones abiertas para el taller de poesía moderna. Aprenderás a escribir diferentes tipos de poemas, técnicas de versificación y análisis de grandes poetas.",
                archivo: "",
                fecha: "10/05/2026"
            }
        ],
        convivencia: [
            {
                id: 3000,
                titulo: "Proyecto de Paz - Iniciativas Escolares",
                descripcion: "Información sobre nuestras iniciativas de paz y convivencia. Incluye proyectos en marcha, valores institucionales y cómo estudiantes y docentes contribuyen a la armonía.",
                archivo: "https://docs.google.com/document/d/ejemploId4/edit",
                fecha: "16/05/2026"
            }
        ],
        eventos: [
            {
                id: 4000,
                titulo: "Festival de Talento - 25 de Junio",
                descripcion: "Gran evento anual donde estudiantes presentan sus talentos. Habrá presentaciones artísticas, musicales, danza, teatro y mucho más. ¡No te lo pierdas!",
                archivo: "",
                fecha: "16/05/2026"
            },
            {
                id: 4001,
                titulo: "Jornada de Convivencia - 20 de Junio",
                descripcion: "Día especial de actividades recreativas para toda la comunidad educativa. Juegos, deportes, comida típica y mucha diversión en familia.",
                archivo: "https://calendar.google.com/ejemploId5",
                fecha: "12/05/2026"
            }
        ]
    };

    // GUARDAR EN LOCALSTORAGE
    localStorage.setItem('colegio_comentarios', JSON.stringify(comentariosDemo));
    localStorage.setItem('colegio_contenido', JSON.stringify(contenidoDemo));
    
    console.log("✅ Datos de demostración cargados exitosamente");
    console.log("Recarga la página para ver los cambios");
}

// EJECUTAR
cargarDatosDemo();
