document.addEventListener("DOMContentLoaded", () => {
  const materias = document.querySelectorAll(".materia");

  // Cargar progreso guardado
  const aprobadasGuardadas =
    JSON.parse(localStorage.getItem("aprobadas")) || [];

  materias.forEach(materia => {
    const id = materia.dataset.id;

    // restaurar aprobadas
    if (aprobadasGuardadas.includes(id)) {
      materia.classList.add("aprobada");
    }

    // click SIEMPRE permitido, el bloqueo se evalúa después
   materia.addEventListener("click", (e) => {
  if (materia.classList.contains("bloqueada")) return;

  if (e.shiftKey) {
    materia.classList.toggle("final");
    materia.classList.remove("aprobada");
  } else {
    materia.classList.toggle("aprobada");
    materia.classList.remove("final");
  }

  guardarProgreso();
  actualizarBloqueos();
  actualizarProgreso();
});

  });

  actualizarBloqueos();
  actualizarProgreso();
});

function actualizarBloqueos() {
  const materias = document.querySelectorAll(".materia");
  const idsAprobadas = Array.from(
    document.querySelectorAll(".materia.aprobada")
  ).map(m => m.dataset.id);

  materias.forEach(materia => {
    const correlativas = materia.dataset.correlativas;

    // 👇 CLAVE: si no tiene correlativas, JAMÁS se bloquea
    if (!correlativas) {
      materia.classList.remove("bloqueada");
      return;
    }

    const idsNecesarios = correlativas.split(",");
    const habilitada = idsNecesarios.every(id =>
      idsAprobadas.includes(id)
    );

    if (habilitada) {
      materia.classList.remove("bloqueada");
    } else {
      materia.classList.add("bloqueada");
      materia.classList.remove("aprobada");
    }
  });
}

function guardarProgreso() {
  const ids = Array.from(
    document.querySelectorAll(".materia.aprobada")
  ).map(m => m.dataset.id);

  localStorage.setItem("aprobadas", JSON.stringify(ids));
}
function actualizarProgreso() {
  const total = document.querySelectorAll(".materia").length;

  const regulares = document.querySelectorAll(".materia.aprobada").length;
  const finales = document.querySelectorAll(".materia.final").length;

  // contador principal (finales)
  document.getElementById("contador").textContent =
    `${finales} / ${total}`;

  const porcentajeFinales = Math.round((finales / total) * 100);
  document.getElementById("porcentaje").textContent =
    `${porcentajeFinales}%`;

  // porcentaje de regulares
  const porcentajeRegulares = Math.round((regulares / total) * 100);
  document.getElementById("porcentaje-regulares").textContent =
    `${porcentajeRegulares}%`;
}

