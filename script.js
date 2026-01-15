document.addEventListener("DOMContentLoaded", () => {
  const materias = document.querySelectorAll(".materia");

  // Cargar progreso guardado
  const aprobadasGuardadas = JSON.parse(localStorage.getItem("aprobadas")) || [];

  materias.forEach(materia => {
    const id = materia.dataset.id;

    if (aprobadasGuardadas.includes(id)) {
      materia.classList.add("aprobada");
    }

    materia.addEventListener("click", () => {
      // No permitir click si está bloqueada
      if (materia.classList.contains("bloqueada")) return;

      materia.classList.toggle("aprobada");
      guardarProgreso();
      actualizarBloqueos();
    });
  });

  actualizarBloqueos();
});

function actualizarBloqueos() {
  const materias = document.querySelectorAll(".materia");

  materias.forEach(materia => {
    const correlativas = materia.dataset.correlativas;

    if (!correlativas) {
      materia.classList.remove("bloqueada");
      return;
    }

    const idsNecesarios = correlativas.split(",");
    const aprobadas = document.querySelectorAll(".materia.aprobada");
    const idsAprobadas = Array.from(aprobadas).map(m => m.dataset.id);

    const habilitada = idsNecesarios.every(id => idsAprobadas.includes(id));

    if (habilitada) {
      materia.classList.remove("bloqueada");
    } else {
      materia.classList.add("bloqueada");
      materia.classList.remove("aprobada");
    }
  });
}

function guardarProgreso() {
  const aprobadas = document.querySelectorAll(".materia.aprobada");
  const ids = Array.from(aprobadas).map(m => m.dataset.id);
  localStorage.setItem("aprobadas", JSON.stringify(ids));
}

.materia.bloqueada {
  background-color: #bbb;
  cursor: not-allowed;
  opacity: 0.6;
}

.materia.aprobada {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}
