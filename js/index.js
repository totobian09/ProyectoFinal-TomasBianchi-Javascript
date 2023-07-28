let estudiantes = [];

const getElemById = (id) => document.getElementById(id);
const nombreEstudianteInput = getElemById("nombreEstudiante");
const notaEstudianteInput = getElemById("notaEstudiante");
const agregarEstudianteBtn = getElemById("agregarEstudiante");
const limpiarListaBtn = getElemById("limpiarLista");
const calcularResultadosBtn = getElemById("calcularResultados");
const eliminarUltimoEstudianteBtn = getElemById("eliminarUltimoEstudiante");
const eliminarListaCompletaBtn = getElemById("eliminarListaCompleta");
const cargarListaEstudiantesBtn = getElemById("cargarListaEstudiantes");
const resultadosDiv = getElemById("resultados");
const estudiantesIngresadosOl = getElemById("estudiantesIngresados");

agregarEstudianteBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const nombreEstudiante = nombreEstudianteInput.value;
  const notaEstudiante = parseFloat(notaEstudianteInput.value);

  if (notaEstudiante < 0 || notaEstudiante > 10 || isNaN(notaEstudiante)) {
    mostrarMensajeError("Ingrese un número válido entre 0 y 10.", notaEstudianteInput);
    return;
  }

  const estudiante = { nombre: nombreEstudiante, nota: notaEstudiante };
  estudiantes.push(estudiante);

  const nuevoEstudianteLi = document.createElement("li");
  nuevoEstudianteLi.textContent = `${nombreEstudiante}: ${notaEstudiante}`;
  estudiantesIngresadosOl.appendChild(nuevoEstudianteLi);

  nombreEstudianteInput.value = "";
  notaEstudianteInput.value = "";

  guardarListaEstudiantes();

  console.log("Estudiantes:", estudiantes);
});

limpiarListaBtn.addEventListener("click", (event) => {
  event.preventDefault();

  estudiantes = [];
  estudiantesIngresadosOl.innerHTML = "";
  nombreEstudianteInput.value = "";
  notaEstudianteInput.value = "";
  resultadosDiv.innerHTML = "";

  guardarListaEstudiantes();

  console.log("Estudiantes:", estudiantes);
});

calcularResultadosBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (estudiantes.length === 0) {
    mostrarMensajeError("No se ha ingresado ningún estudiante.");
    return;
  }

  const promedioGeneral = calcularPromedioGeneral();
  const porcentajeDesaprobados = calcularPorcentaje(0, 4);
  const porcentajeAprobados = calcularPorcentaje(4, 7);
  const porcentajePromocionados = calcularPorcentaje(7, 11);

  resultadosDiv.innerHTML = `
    <p>Promedio general: ${promedioGeneral.toFixed(2)}</p>
    <p>Porcentaje de desaprobados: ${porcentajeDesaprobados.toFixed(2)}%</p>
    <p>Porcentaje de aprobados: ${porcentajeAprobados.toFixed(2)}%</p>
    <p>Porcentaje de promocionados: ${porcentajePromocionados.toFixed(2)}%</p>
  `;
});

eliminarUltimoEstudianteBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (estudiantes.length === 0) {
    mostrarMensajeError("No hay estudiantes para eliminar.");
    return;
  }

  estudiantes.pop();
  estudiantesIngresadosOl.removeChild(estudiantesIngresadosOl.lastChild);

  guardarListaEstudiantes();

  console.log("Estudiantes:", estudiantes);
});

eliminarListaCompletaBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (estudiantes.length === 0) {
    mostrarMensajeError("No hay estudiantes para eliminar.");
    return;
  }

  estudiantes = [];
  estudiantesIngresadosOl.innerHTML = "";
  nombreEstudianteInput.value = "";
  notaEstudianteInput.value = "";
  resultadosDiv.innerHTML = "";

  guardarListaEstudiantes();

  console.log("Estudiantes:", estudiantes);
});

cargarListaEstudiantesBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/estudiantes");
    const data = await response.json();

    if (data.length === 0) {
      mostrarMensajeError("El archivo JSON no contiene datos.");
      return;
    }

    estudiantes = data;
    estudiantesIngresadosOl.innerHTML = "";

    data.forEach((estudiante) => {
      const nuevoEstudianteLi = document.createElement("li");
      nuevoEstudianteLi.textContent = `${estudiante.nombre}: ${estudiante.nota}`;
      estudiantesIngresadosOl.appendChild(nuevoEstudianteLi);
    });

    mostrarMensajeError("Lista de estudiantes cargada con éxito.", null, true);

    console.log("Estudiantes:", estudiantes);
  } catch (error) {
    mostrarMensajeError("Error al cargar la lista de estudiantes.");
    console.error(error);
  }
});

const calcularPromedioGeneral = () => estudiantes.reduce((sum, estudiante) => sum + estudiante.nota, 0) / estudiantes.length;

const calcularPorcentaje = (min, max) => ((estudiantes.filter((estudiante) => estudiante.nota >= min && estudiante.nota < max).length) / estudiantes.length) * 100;

function mostrarMensajeError(mensaje, input, exito = false) {
  const errorDiv = getElemById("errorDiv");
  errorDiv.textContent = mensaje;
  errorDiv.classList.add(exito ? "exito-animation" : "error-animation");

  if (input) {
    input.focus();
  }

  setTimeout(() => {
    errorDiv.classList.remove("exito-animation", "error-animation");
    errorDiv.textContent = "";
  }, 3000);
}

function guardarListaEstudiantes() {
  fetch("http://localhost:3000/guardarEstudiantes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(estudiantes),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al guardar la lista de estudiantes.");
      }
    })
    .catch((error) => console.error(error));
}

cargarListaEstudiantes();
