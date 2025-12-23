#!/bin/bash

# Script para renombrar imágenes de productos

echo "🔄 Renombrando imágenes..."

# MUJER - mb1, mb2, mb3...
echo ""
echo "📁 Carpeta: MUJER"
cd /home/superadmin/Proyectos/vestime/clientes/images/productos/mujer
counter=1
for file in $(find . -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" -o -iname "*.webp" \) ! -name "mb*" ! -name "*Zone.Identifier" | sort); do
    ext="${file##*.}"
    newname="mb${counter}.${ext}"
    mv "$file" "$newname" 2>/dev/null
    echo "  ✓ $file → $newname"
    counter=$((counter+1))
done
total_mujer=$(ls mb*.* 2>/dev/null | wc -l)
echo "  ✅ Total: $total_mujer imágenes"

# HOMBRE - hb1, hb2, hb3...
echo ""
echo "📁 Carpeta: HOMBRE"
cd /home/superadmin/Proyectos/vestime/clientes/images/productos/hombre
counter=1
for file in $(find . -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" -o -iname "*.webp" \) ! -name "hb*" ! -name "*Zone.Identifier" | sort); do
    ext="${file##*.}"
    newname="hb${counter}.${ext}"
    mv "$file" "$newname" 2>/dev/null
    echo "  ✓ $file → $newname"
    counter=$((counter+1))
done
total_hombre=$(ls hb*.* 2>/dev/null | wc -l)
echo "  ✅ Total: $total_hombre imágenes"

# HOMBRE-PREMIUM - hp1, hp2, hp3...
echo ""
echo "📁 Carpeta: HOMBRE-PREMIUM"
cd /home/superadmin/Proyectos/vestime/clientes/images/productos/hombre-premium
counter=1
for file in $(find . -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" -o -iname "*.webp" \) ! -name "hp*" ! -name "*Zone.Identifier" | sort); do
    ext="${file##*.}"
    newname="hp${counter}.${ext}"
    mv "$file" "$newname" 2>/dev/null
    echo "  ✓ $file → $newname"
    counter=$((counter+1))
done
total_premium=$(ls hp*.* 2>/dev/null | wc -l)
echo "  ✅ Total: $total_premium imágenes"

echo ""
echo "=========================================="
echo "✅ RENOMBRADO COMPLETADO"
echo "=========================================="
echo "Mujer: $total_mujer imágenes"
echo "Hombre: $total_hombre imágenes"
echo "Premium: $total_premium imágenes"
echo "TOTAL: $((total_mujer + total_hombre + total_premium)) imágenes"
echo "=========================================="
