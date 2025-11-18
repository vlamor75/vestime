# 🔍 Extraer IDs de Google Drive - Método Super Rápido

## Método 1: Script Automático (2 minutos) ⚡ RECOMENDADO

### Paso 1: Abre la Carpeta de Hombres
https://drive.google.com/drive/folders/1g7koiHM-qTu3v4N2tGgmmJfQdCqfBp8F

### Paso 2: Abre la Consola del Navegador
- Windows/Linux: **Ctrl + Shift + J**
- Mac: **Cmd + Option + J**

### Paso 3: Pega este Código y Presiona Enter

```javascript
// Script para extraer IDs de archivos en Google Drive
const archivos = [];
const items = document.querySelectorAll('[data-id]');

items.forEach((item, index) => {
    const id = item.getAttribute('data-id');
    const nombreElement = item.querySelector('[data-tooltip]');
    const nombre = nombreElement ? nombreElement.getAttribute('data-tooltip') : `Archivo ${index + 1}`;

    if (id && id.length > 10) {
        archivos.push({
            numero: index + 1,
            nombre: nombre,
            id: id,
            url: `https://drive.google.com/uc?export=view&id=${id}`
        });
    }
});

console.log('='.repeat(60));
console.log('📸 IMÁGENES ENCONTRADAS:', archivos.length);
console.log('='.repeat(60));

archivos.forEach(archivo => {
    console.log(`\n${archivo.numero}. ${archivo.nombre}`);
    console.log(`   ID: ${archivo.id}`);
});

console.log('\n' + '='.repeat(60));
console.log('📋 COPIA ESTA TABLA:');
console.log('='.repeat(60) + '\n');

archivos.forEach(archivo => {
    console.log(`| ${archivo.numero} | ${archivo.nombre} | ${archivo.id} |`);
});

// También copiar al portapapeles (si funciona)
const textoIDs = archivos.map(a => a.id).join('\n');
console.log('\n📋 IDs (uno por línea):\n');
console.log(textoIDs);
```

### Paso 4: Copia los IDs
El script te mostrará todos los IDs. Cópialos.

### Paso 5: Repite para Carpeta de Mujeres
https://drive.google.com/drive/folders/18yPMUBAetCwRzCp4e9u9yGahJmrl9Tnv

---

## Método 2: Manual (1 minuto por imagen)

Si el script no funciona:

### Carpeta Hombres (7 imágenes):

1. Abre la carpeta
2. Haz clic en cada imagen
3. Presiona **Shift + I** (para "Información")
4. Copia el ID que aparece
5. O mira la URL: `https://drive.google.com/file/d/ESTE_ES_EL_ID/view`

Copia los 7 IDs aquí:

```
Hombre 1: _____________________
Hombre 2: _____________________
Hombre 3: _____________________
Hombre 4: _____________________
Hombre 5: _____________________
Hombre 6: _____________________
Hombre 7: _____________________
```

### Carpeta Mujeres (10 imágenes):

```
Mujer 1: _____________________
Mujer 2: _____________________
Mujer 3: _____________________
Mujer 4: _____________________
Mujer 5: _____________________
Mujer 6: _____________________
Mujer 7: _____________________
Mujer 8: _____________________
Mujer 9: _____________________
Mujer 10: _____________________
```

---

## Método 3: Compartir Acceso Temporal (30 segundos)

**Opción más rápida:**

1. Abre cada carpeta
2. Compartir → Agregar persona → `tu-email-aqui@gmail.com`
3. Rol: **Editor** (temporal)
4. Yo accedo con API, extraigo los IDs
5. Removes mi acceso

¿Cuál método prefieres?

---

## 🎯 Cuando tengas los IDs

Envíamelos en cualquier formato (lista, tabla, etc.) y yo actualizo el `productos.json` inmediatamente.

**Formato que necesito:**

```
Hombre 1: 1ABC123XYZ
Hombre 2: 2DEF456UVW
...
```

O simplemente pégalos todos juntos y yo los organizo.
