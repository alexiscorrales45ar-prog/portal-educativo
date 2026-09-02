// =========================================
// CONEXIÓN A SUPABASE
// =========================================

// URL del proyecto
const SUPABASE_URL = "https://jrbkfdpgqpwcxfikxnpd.supabase.co";

// Llave pública
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyYmtmZHBncXB3Y3hmaWt4bnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0MDM4NDUsImV4cCI6MjA5OTk3OTg0NX0.aFpBhfuopH9VL5J0C93YJ_pZZmJT3pK4ivpyteY_K0w";

// Crear cliente
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Mensaje de prueba
console.log("✅ Supabase conectado correctamente");