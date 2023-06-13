const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');

// Verificar si la carpeta de uploads existe, si no, crearla
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

function saveFile(file) {
  const filePath = path.join(uploadDir, file.originalname);

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, file.buffer, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(filePath);
      }
    });
  });
}

function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  saveFile,
  deleteFile,
};
