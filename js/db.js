// ========================================
// BASE DE DATOS
// ========================================

async function obtenerPublicaciones() {

    const { data, error } = await supabaseClient
        .from("publicaciones")
        .select("*");

    if (error) {
        console.error("❌ Error al consultar publicaciones:", error);
        return [];
    }

    console.log("📚 Publicaciones encontradas:", data);

    return data;
}