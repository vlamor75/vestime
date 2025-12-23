#!/bin/bash

echo "🧹 Limpiando y renombrando imágenes correctamente..."

# Función para renombrar una carpeta
rename_folder() {
    local folder=$1
    local prefix=$2

    cd "/home/superadmin/Proyectos/vestime/clientes/images/productos/$folder"

    # Eliminar archivos Zone.Identifier
    find . -name "*Zone.Identifier" -delete 2>/dev/null

    # Obtener todas las imágenes válidas
    counter=1
    for file in $(find . -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" -o -iname "*.webp" \) | sort); do
        # Obtener extensión
        ext="${file##*.}"
        ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

        # Nuevo nombre
        newname="${prefix}${counter}.${ext}"

        # Solo renombrar si no tiene ya el formato correcto
        basename=$(basename "$file")
        if [[ ! "$basename" =~ ^${prefix}[0-9]+\. ]]; then
            mv "$file" "/tmp/$newname" 2>/dev/null
            echo "  ✓ $basename → $newname"
        fi

        counter=$((counter+1))
    done

    # Mover de vuelta desde /tmp
    mv /tmp/${prefix}*.* . 2>/dev/null

    # Contar total
    total=$(find . -maxdepth 1 -name "${prefix}*.*" -type f | wc -l)
    echo "  ✅ Total: $total imágenes"

    return $total
}

# MUJER
echo ""
echo "📁 Procesando: MUJER"
rename_folder "mujer" "mb"
total_mujer=$?

# HOMBRE
echo ""
echo "📁 Procesando: HOMBRE"
rename_folder "hombre" "hb"
total_hombre=$?

# PREMIUM
echo ""
echo "📁 Procesando: HOMBRE-PREMIUM"
rename_folder "hombre-premium" "hp"
total_premium=$?

echo ""
echo "=========================================="
echo "✅ LIMPIEZA Y RENOMBRADO COMPLETADO"
echo "=========================================="
echo "Mujer: $total_mujer imágenes"
echo "Hombre: $total_hombre imágenes"
echo "Premium: $total_premium imágenes"
echo "TOTAL: $((total_mujer + total_hombre + total_premium)) imágenes"
echo "=========================================="
