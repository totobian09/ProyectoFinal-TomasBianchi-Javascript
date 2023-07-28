const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para analizar los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para guardar los datos en el archivo JSON
app.post('/guardarEstudiantes', (req, res) => {
  const estudiantes = req.body;

  fs.writeFileSync('json/index.json', JSON.stringify(estudiantes, null, 2));

  res.status(200).send('Estudiantes guardados correctamente.');
});

// Ruta para obtener la lista de estudiantes desde el archivo JSON
app.get('/estudiantes', (req, res) => {
  try {
    const estudiantesGuardados = fs.readFileSync('json/index.json', 'utf8');
    const estudiantes = JSON.parse(estudiantesGuardados);
    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).send('Error al cargar la lista de estudiantes.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
