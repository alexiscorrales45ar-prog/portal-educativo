# 📊 Implementación de Base de Datos con Firebase

## ¿Por qué Firebase?
- ✅ Gratuito para proyectos pequeños/medianos
- ✅ Tiempo real (datos se sincronizan al instante)
- ✅ No necesita servidor propio
- ✅ Escalable y confiable
- ✅ Fácil autenticación

## Paso 1: Crear Proyecto Firebase

1. Ve a https://firebase.google.com
2. Haz clic en **"Ir a la consola"**
3. Haz clic en **"Agregar proyecto"**
4. Nombre: `portal-educativo` (o tu preferencia)
5. Desactiva Google Analytics (opcional)
6. Haz clic en **"Crear proyecto"**

## Paso 2: Obtener Credenciales

1. En la consola de Firebase, haz clic en el ícono de engranaje ⚙️ → **Configuración del proyecto**
2. Ve a la pestaña **"General"**
3. Desplázate hasta **"Tus aplicaciones"** → haz clic en **"Crear app web"**
4. Nombre: `Portal Educativo`
5. Haz clic en **"Registrar aplicación"**
6. **COPIA** el objeto de configuración que aparece
7. Pégalo en `firebase-config.js` (reemplaza `TU_API_KEY`, etc.)

## Paso 3: Configurar Firestore Database

1. En el menú lateral, ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Modo: **Prueba** (para desarrollo, luego cambiar a Producción)
4. Ubicación: Tu región
5. Haz clic en **"Crear"**

## Paso 4: Crear Colecciones

Necesitas crear las siguientes colecciones en Firestore:

### Colección: `docentes_registrados`
```
{
  email: "string (ID del documento)",
  nombre: "string",
  password: "string (hasheada en producción)",
  fecha_registro: "timestamp"
}
```

### Colección: `contenido_educativo`
```
{
  id: "string (ID del documento)",
  seccion: "string (arte, literatura, convivencia, eventos)",
  titulo: "string",
  descripcion: "string",
  archivo: "string (URL)",
  fecha: "timestamp",
  autor: "string"
}
```

### Colección: `publicaciones_inicio`
```
{
  id: "string (ID del documento)",
  titulo: "string",
  contenido: "string",
  autor: "string",
  fecha: "timestamp",
  hora: "string"
}
```

### Colección: `comentarios`
```
{
  id: "string (ID del documento)",
  pagina: "string (nombre de la página)",
  nombre: "string",
  mensaje: "string",
  fecha: "timestamp",
  aprobado: "boolean",
  tipo: "string (estudiante)"
}
```

## Paso 5: Configurar Reglas de Seguridad

En **Firestore Database** → **Reglas**, reemplaza con esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de contenido y comentarios aprobados
    match /contenido_educativo/{document=**} {
      allow read: if true;
    }
    match /publicaciones_inicio/{document=**} {
      allow read: if true;
    }
    match /comentarios/{document=**} {
      allow read: if resource.data.aprobado == true;
      allow create: if true; // Estudiantes pueden crear comentarios
    }
    
    // Solo admin puede acceder a docentes
    match /docentes_registrados/{document=**} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```

## Paso 6: Descomentar Firebase en el HTML

En `admin.html` e `index.html`, descomenta estas líneas en el `<head>`:

```html
<script src="https://www.gstatic.com/firebaseapps/10.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebaseapps/10.0.0/firebase-firestore.js"></script>
<script src="firebase-config.js"></script>
```

## Paso 7: Validar Instalación

Abre la consola del navegador (F12) y ejecuta:

```javascript
if(typeof firebase !== 'undefined') {
  console.log('✅ Firebase está correctamente configurado');
  console.log(firebase.app().options.projectId);
} else {
  console.log('❌ Firebase no está cargado');
}
```

## Migración de Datos

Si ya tienes datos en `localStorage`, necesitarás:

1. Exportar datos de localStorage
2. Importarlos manualmente a Firestore (por ahora localhost)

## Alternativas a Firebase

Si prefieres otras opciones gratuitas:

- **Supabase** (PostgreSQL open source)
- **MongoDB Atlas** (NoSQL)
- **Appwrite** (Backend open source)
- **FaunaDB** (GraphQL)

## Soporte

Si necesitas ayuda:
1. Consola de Firebase: https://console.firebase.google.com
2. Documentación: https://firebase.google.com/docs/firestore/quickstart
3. Comunidad: Stack Overflow tag `firebase`
