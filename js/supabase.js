// =========================================
// CONEXIÓN A SUPABASE
// =========================================

// URL del proyecto
const SUPABASE_URL = "https://jrbkfdpgqpwcxfikxnpd.supabase.co";

// Llave pública
const SUPABASE_KEY = "sb_publishable_7-qbDIXoOF2tarQrHtdnQQ_LRD7TAuv";

// Crear cliente
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Mensaje de prueba
console.log("✅ Supabase conectado correctamente");