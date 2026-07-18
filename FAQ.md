# ❓ Preguntas Frecuentes (FAQ)

## Preguntas Generales

### ¿Por dónde empiezo?
**R:** 
1. Abre `index.html` en tu navegador
2. Explora las diferentes secciones
3. Si eres docente, haz clic en "Panel Docente" para cargar contenido

### ¿Qué navegadores son soportados?
**R:** Chrome, Firefox, Safari y Edge (versiones recientes). Funciona en computadoras, tablets y celulares.

### ¿Necesito conexión a internet?
**R:** No. El portal funciona completamente offline. No requiere servidor externo.

### ¿Se ve bien en móvil?
**R:** Sí. Está completamente optimizado para teléfonos y tablets. El menú se convierte en una opción "hamburguesa" en pantallas pequeñas.

---

## Para Estudiantes

### ¿Cómo dejo un comentario?
**R:** 
1. Baja hasta la sección "Comentarios de los Estudiantes"
2. Escribe tu nombre y comentario
3. Haz clic en "Enviar Comentario"
4. ¡Tu comentario aparecerá inmediatamente!

### ¿Mis comentarios se guardan?
**R:** Sí. Los comentarios se guardan en tu navegador. Puedes cerrar la página y volver después, tu comentario seguirá ahí.

### ¿Otros pueden ver mis comentarios?
**R:** Sí. Los comentarios son públicos. Respeta a otros compañeros y mantén un lenguaje apropiado.

### ¿Cuántos caracteres puedo escribir?
**R:** Máximo 500 caracteres por comentario. Es suficiente para expresar tus ideas.

### ¿Puedo editar o borrar mi comentario?
**R:** En esta versión no. Si necesitas cambiar algo, contacta al administrador.

### ¿Qué hago si otro estudiante deja un comentario inapropiado?
**R:** Reporta inmediatamente al docente o administrador del portal.

---

## Para Docentes

### ¿Cuál es la contraseña para el Panel?
**R:** 
- Usuario: `docente`
- Contraseña: `123456`

### ¿Puedo cambiar la contraseña?
**R:** Sí. El administrador TI puede cambiarla editando el archivo `js/admin.js`. Contacta a tu administrador de TI.

### ¿Qué tipo de contenido puedo subir?
**R:** Puedes compartir enlaces a:
- Videos (YouTube, Google Drive)
- Documentos (PDF, Google Docs)
- Imágenes
- Cualquier recurso en línea

### ¿Puedo subir archivos directamente?
**R:** En esta versión no. Debes usar enlaces externos. Recomendamos Google Drive o YouTube.

### ¿Dónde aparece el contenido que carguè?
**R:** En la sección que seleccionaste. Por ejemplo, si cargas en "Arte", verás el contenido en la página de Arte.

### ¿Cuánto contenido puedo cargar?
**R:** Sin límite técnico. Sin embargo, recomendamos máximo 10-20 items por sección para mantener la página ágil.

### ¿Mi contenido se ve inmediatamente?
**R:** Sí. Cuando haces clic en "Cargar Contenido", aparece inmediatamente en la sección.

### ¿Puedo editar contenido después de cargarlo?
**R:** No es posible editar. Puedes eliminarlo y cargar uno nuevo.

### ¿Cómo elimino contenido?
**R:** 
1. En el Panel, ve a la sección del contenido
2. Haz clic en el botón rojo "🗑️ Eliminar"
3. Confirma la eliminación

### ¿Dónde veo mis estadísticas?
**R:** Al final del Panel, en la sección "📊 Estadísticas" ves:
- Total de contenidos que cargaste
- Total de comentarios de estudiantes
- Cuántas secciones tienen contenido

### ¿Pueden otros docentes ver/eliminar mi contenido?
**R:** No. Solo puedes ver y gestionar tu propio contenido.

### ¿Cómo cierro sesión?
**R:** Haz clic en el botón rojo "Cerrar Sesión" en la navegación.

---

## Para Administradores TI

### ¿Cómo instalo el portal?
**R:** 
1. Descarga la carpeta `portal-educativo`
2. Cópiala a tu servidor web o carpeta compartida
3. Abre `index.html`
4. ¡Listo!

### ¿Necesita base de datos?
**R:** No. Usa localStorage del navegador. Los datos se guardan localmente en cada dispositivo.

### ¿Dónde se guardan los datos?
**R:** En `localStorage` del navegador del usuario. No hay servidor central.

### ¿Cómo hago backup de los datos?
**R:** Los datos están en el navegador de cada usuario. Recomendamos:
- Exportar datos periódicamente
- Hacer screenshots de contenido importante
- Para producción real, implementar base de datos

### ¿Cómo cambio las credenciales?
**R:** Edita `js/admin.js` y busca esta sección:
```javascript
const usuariosValidos = {
    'docente': '123456',
    'admin@colegio.edu': '123456'
};
```
Cambia las contraseñas y guarda.

### ¿Cómo cambio los colores del portal?
**R:** Edita `css/estilos.css`. Los colores principales son:
- Verde principal: `#2d6a4f`
- Verde secundario: `#40916c`
- Naranja botones: `#ff7b00`

Usa buscar y reemplazar para cambiar todos a la vez.

### ¿Cómo agrego una nueva sección?
**R:** 
1. Copia `paginas/arte.html` como base
2. Edita el contenido
3. Agrega link en todas las navegaciones
4. Modifica `admin.js` para agregar la opción en el select

### ¿El portal funciona sin internet?
**R:** Sí. Funciona completamente offline. No requiere conexión a servidores externos.

### ¿Qué hago si los datos desaparecen?
**R:** Si se limpió el caché, los datos se pierden. Por eso es importante hacer backups. Para futuro, recomendamos base de datos real.

### ¿Cómo limpio todos los datos?
**R:** En la consola del navegador (F12):
```javascript
localStorage.clear();
location.reload();
```

### ¿Puedo personalizar la interfaz?
**R:** Sí. Todo es editable:
- Textos: Edita archivos HTML
- Estilos: Edita CSS
- Funcionalidad: Edita JavaScript

### ¿Es seguro para producción?
**R:** Para un colegio pequeño, sí. Para instituciones grandes o sensibl es a datos, recomendamos:
- Backend real con autenticación segura
- Base de datos SQL
- Hosting profesional con SSL

---

## Problemas Técnicos

### ❌ "No veo el contenido que cargué"
**Soluciones:**
1. Recarga la página (F5)
2. Verifica estar en la sección correcta
3. Limpia caché y reinicia navegador
4. Intenta en otro navegador

### ❌ "Los comentarios desaparecieron"
**Causa:** Se limpió el caché del navegador
**Solución:** 
- En futuro, no limpies el caché
- Para producción, usa base de datos
- Haz backups regularmente

### ❌ "No puedo iniciar sesión en el Panel"
**Soluciones:**
1. Verifica usuario y contraseña (¿hay mayúsculas?)
2. Intenta en otro navegador
3. Limpia cookies: Ctrl+Shift+Del
4. Reinicia el navegador

### ❌ "Los botones no responden"
**Soluciones:**
1. Abre consola (F12) y busca errores rojos
2. Recarga la página
3. Intenta en otro navegador
4. Verifica tener JavaScript habilitado

### ❌ "Se ven mal los estilos"
**Causa:** No carga el CSS
**Soluciones:**
1. Verifica que `css/` esté en la carpeta correcta
2. Abre consola (F12) y busca errores
3. Recarga la página
4. Limpia caché

### ❌ "No funciona en móvil"
**Soluciones:**
1. Intenta en otro navegador móvil
2. Verifica que JavaScript esté habilitado
3. Recarga la página
4. Reinicia el dispositivo

### ❌ "Los enlaces externos no abren"
**Causa:** URL mal formada o sitio no accesible
**Soluciones:**
1. Verifica que la URL comience con `https://`
2. Prueba abrir el enlace directamente
3. Verifica tener conexión a internet

---

## Consejos y Mejores Prácticas

### ✅ Para Docentes
1. **Prueba primero**: Carga contenido de prueba antes del uso real
2. **Formatos recomendados**: PDF, Google Drive, YouTube
3. **Descripciones claras**: Explica qué es el contenido
4. **Revisa regularmente**: Mira qué dicen los estudiantes
5. **Actualiza contenido**: Cambia recursos antiguos

### ✅ Para Estudiantes
1. **Respeta a otros**: Lee las normas de convivencia
2. **Sé específico**: Comenta con detalles útiles
3. **Sé respetuoso**: Evita lenguaje inapropiado
4. **Participa activamente**: Deja tus opiniones
5. **Explora recursos**: Aprovecha los enlaces

### ✅ Para Administradores
1. **Haz backups**: Semanalmente o más
2. **Monitorea contenido**: Revisa lo que se carga
3. **Resuelve problemas rápido**: Mínimo 1 vez por semana
4. **Capacita docentes**: Dedica tiempo a la formación
5. **Documenta cambios**: Guarda récord de personalizaciones

---

## Migración Futura

### ¿Es posible pasar a un sistema con servidor?
**R:** Sí, totalmente. Los datos están bien organizados en localStorage y pueden exportarse a una BD real.

### ¿Qué se necesitaría?
**R:** 
1. Servidor web (Apache, Nginx)
2. Backend (Node.js, PHP, Python, Java)
3. Base de datos (MySQL, PostgreSQL, MongoDB)
4. Hosting profesional
5. Certificado SSL

### ¿Cuánto costaría?
**R:** Depende del proveedor. Estima $50-500 USD anuales.

### ¿Podría perder datos en la migración?
**R:** No, si se hace correctamente. Los datos se pueden exportar y importar.

---

## Contacto y Soporte

### ¿A quién contacto si tengo problemas?
**R:** 
1. Lee este FAQ primero
2. Consulta el archivo `README.md`
3. Revisa `instrucciones.html`
4. Contacta al administrador TI del colegio
5. Como último recurso, contacta al desarrollador

### ¿Dónde encuentro más ayuda?
**R:** En los siguientes archivos incluidos:
- `README.md` - Manual técnico
- `GUIA_RAPIDA.md` - Guía de usuarios
- `instrucciones.html` - Guía visual
- `CHECKLIST_ENTREGA.md` - Verificación

---

**Última actualización:** Mayo 16, 2026  
**Versión del Portal:** 1.0.0

*Si no encuentras respuesta aquí, consulta la documentación adicional o contacta a tu administrador TI.*
