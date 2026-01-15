document.addEventListener("DOMContentLoaded", () => {
  const materias = document.querySelectorAll(".materia");
  const aprobadasGuardadas = JSON.parse(localStorage.getItem("aprobadas")) || [];

  materias.forEach(materia => {
    const id = materia.dataset.id;

    if (aprobadasGuardadas.includes(id)) {
      materia.classList.add("aprobada");
    }

    materia.addEventListener("click", () => {
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
  const idsAprobadas = Array.from(
    document.querySelectorAll(".materia.aprobada")
  ).map(m => m.dataset.id);

  materias.forEach(materia => {
    const correlativas = materia.dataset.correlativas;

    if (!correlativas) {
      materia.classList.remove("bloqueada");
      return;
    }

    const idsNecesarios = correlativas.split(",");
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
  const ids = Array.from(
    document.querySelectorAll(".materia.aprobada")
  ).map(m => m.dataset.id);

  localStorage.setItem("aprobadas", JSON.stringify(ids));
}
function actualizarProgreso() {
  const total = document.querySelectorAll(".materia").length;
  const aprobadas = document.querySelectorAll(".materia.aprobada").length;

  document.getElementById("contador").textContent =
    `${aprobadas} / ${total}`;

  const porcentaje = Math.round((aprobadas / total) * 100);
  document.getElementById("porcentaje").textContent = `${porcentaje}%`;
}
