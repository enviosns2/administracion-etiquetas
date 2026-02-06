const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'dist');
const dest = path.join(__dirname, '..', 'backend', 'dist');

async function copy() {
  try {
    if (!fs.existsSync(src)) {
      console.error('Directorio de origen no encontrado:', src);
      process.exit(1);
    }

    // Si existe destino, eliminarlo primero
    if (fs.existsSync(dest)) {
      await fs.promises.rm(dest, { recursive: true, force: true });
    }

    // Usar fs.cp si está disponible (Node 16.7+), si no, hacer copia recursiva manual
    if (fs.cp) {
      await fs.promises.cp(src, dest, { recursive: true });
    } else {
      // Copia recursiva manual
      await copyRecursive(src, dest);
    }

    console.log('Copia de dist a backend/dist completada.');
  } catch (err) {
    console.error('Error al copiar dist a backend/dist:', err);
    process.exit(1);
  }
}

async function copyRecursive(srcDir, destDir) {
  await fs.promises.mkdir(destDir, { recursive: true });
  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

copy();
