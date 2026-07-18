# 🔐 SISTEMA DE USUARIOS Y ROLES - Portal Educativo

## Credenciales de Administrador (Rector)

**Estas son las credenciales principales que debe usar el Rector:**

```
📧 Correo: rector@institucion.edu
🔑 Contraseña: Rector2026!
```

**Cambiar credenciales:**
- Puede editar estas credenciales directamente en `js/admin.js` línea 51
- Las credenciales se validan al iniciar sesión
- Recomendado: Cambiar la contraseña después del primer acceso

---

## Gestión de Docentes

El Rector puede registrar docentes asignando:

### 1. **Información del Docente**
- ✅ Nombre Completo
- ✅ Correo Electrónico (será usado como usuario para iniciar sesión)
- ✅ Contraseña Temporal (mínimo 6 caracteres)
- ✅ Rol / Área de trabajo

### 2. **Roles Disponibles**

| Rol | Código | Descripción |
|-----|--------|-------------|
| 🎨 Docente de Arte | `docente_arte` | Sube contenido educativo en sección Arte |
| 📚 Docente de Literatura | `docente_literatura` | Gestiona contenido de Literatura |
| 🕊️ Docente de Convivencia | `docente_convivencia` | Administra información de Convivencia |
| 🎉 Coordinador de Eventos | `docente_eventos` | Publica eventos institucionales |
| ⚙️ Moderador de Comentarios | `moderador` | Aprueba/rechaza comentarios de estudiantes |

---

## Flujo de Autenticación

### **Paso 1: Acceso al Panel**
1. Ir a `admin.html`
2. Ingresa credenciales (rector o docente registrado)
3. Sistema valida contra base de datos (localStorage)

### **Paso 2: Validación**
```javascript
// Validación en admin.js (línea 51-80)
- Usuarios predefinidos (rector + demo)
- Docentes registrados por el rector
- Contraseña debe coincidir exactamente
```

### **Paso 3: Sesión Activa**
```javascript
// Se guarda en localStorage
{
  "usuario_actual": {
    "tipo": "admin" | "docente" | "demo",
    "nombre": "Nombre del usuario",
    "usuario": "email@institucion.edu",
    "fecha_login": "2026-06-14T..."
  }
}
```

---

## Ejemplo: Registrar un Docente

### Desde el Panel Rector:
1. ✅ Click en "👥 Gestionar Docentes"
2. ✅ Completa el formulario:
   - Nombre: Juan Pérez García
   - Correo: juan.perez@institucion.edu
   - Contraseña: Juan2026!
   - Rol: Docente de Arte
3. ✅ Click "Registrar Docente"

### El Docente puede entrar con:
```
Correo: juan.perez@institucion.edu
Contraseña: Juan2026!
```

---

## Datos Guardados

### **En localStorage:**
```javascript
// Docentes registrados
{
  "docentes_registrados": {
    "juan.perez@institucion.edu": {
      "nombre": "Juan Pérez García",
      "password": "Juan2026!",
      "rol": "docente_arte",
      "fecha_registro": "14/6/2026"
    }
  }
}
```

### **Ubicación:**
- Navegador > DevTools > Application > Local Storage > file:///e:/portal-educativo

---

## Funcionalidades por Rol

### **Rector/Admin (rector@institucion.edu)**
- ✅ Gestionar docentes (agregar, editar, eliminar)
- ✅ Ver todos los contenidos educativos
- ✅ Publicar noticias en homepage
- ✅ Aprobar/rechazar comentarios de estudiantes
- ✅ Ver estadísticas del portal

### **Docentes (según rol asignado)**
- ✅ Subir contenido a su sección asignada
- ✅ Ver/editar su propio contenido
- ✅ No pueden ver panel de administración

### **Moderador de Comentarios**
- ✅ Revisar comentarios pendientes
- ✅ Aprobar o rechazar comentarios
- ✅ No puede modificar contenido educativo

---

## Acciones del Rector sobre Docentes

### **Editar Docente**
1. Click en ✏️ "Editar" en la tarjeta del docente
2. Ingresa nuevo nombre (requerido)
3. Ingresa nueva contraseña (opcional)
4. Click "Actualizar"

### **Eliminar Docente**
1. Click en 🗑️ "Eliminar"
2. Confirma eliminación
3. El docente pierde acceso inmediatamente

---

## Seguridad Implementada

✅ **Validación de contraseñas:**
- Mínimo 6 caracteres
- Se validan contra base de datos
- Demo: Contraseña: 123456

✅ **Validación de emails:**
- Formato correo@dominio.com obligatorio
- Es único para cada docente (no pueden repetir email)

✅ **Sesión segura:**
- Se guarda en localStorage (solo lectura/escritura local)
- Cierre de sesión borra datos de autenticación
- No hay cookies que exponer

✅ **Rol-based Access:**
- Cada usuario solo puede ver su contenido según rol
- Admin tiene acceso completo
- Docentes no ven panel administrativo

---

## Casos de Uso

### **Caso 1: Nuevo año escolar**
```
1. Rector registra todos los docentes con sus roles
2. Docentes inician sesión con credenciales
3. Sistema asigna permisos automáticamente
```

### **Caso 2: Cambio de docente**
```
1. Rector elimina docente anterior
2. Registra nuevo docente con mismo rol
3. Nuevo docente accede con nueva contraseña
```

### **Caso 3: Cambio de rol**
```
1. Rector elimina docente
2. Vuelve a registrar con nuevo rol
```

---

## Información Técnica

**Archivo principal:** `js/admin.js`

**Funciones principales:**
- `iniciarSesion(e)` - Valida credenciales
- `guardarDocente(e)` - Guarda nuevo docente con rol
- `cargarDocentesAdmin()` - Muestra lista de docentes
- `editarDocente(email)` - Modifica docente existente
- `eliminarDocente(email)` - Elimina docente

**Base de datos:** localStorage (sin conexión a servidor)
**Cuando se active Firebase:** Será reemplazado por Firestore

---

## Próximos Pasos

### Cuando Firebase sea aprobado:
1. ✅ Transferir datos a Firestore
2. ✅ Agregar autenticación Firebase
3. ✅ Implementar 2FA (dos factores)
4. ✅ Encriptación de contraseñas automática
5. ✅ Auditoría de cambios (logs)

### Mejoras futuras:
- [ ] Cambio de contraseña por el docente
- [ ] Recuperación de contraseña olvidada
- [ ] Historial de cambios
- [ ] Permisos más granulares por seccion

---

## Soporte

**Problema:** "Usuario o contraseña incorrectos"
- Verifica que correo y contraseña sean exactos
- Las mayúsculas importan: "Rector2026!" ≠ "rector2026!"
- Verifica que el docente esté registrado en el panel

**Problema:** Docente no puede iniciar sesión
- Verifica que fue registrado por el rector
- Confirma email y contraseña exactos
- Intenta con la cuenta demo (usuario: demo, password: 123456)

---

**Última actualización:** Junio 2026
**Estado:** ✅ Sistema completo y funcional
