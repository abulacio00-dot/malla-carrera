document.addEventListener("DOMContentLoaded", () => {
  const materias = document.querySelectorAll(".materia");

  const datosGuardados =
    JSON.parse(localStorage.getItem("materias")) || [];

  datosGuardados.forEach(dato => {
    const materia = document.querySelector(
      `.materia[data-id="${dato.id}"]`
    );
    if (!materia) return;

    if (dato.aprobada) materia.classList.add("aprobada");
    if (dato.final) materia.classList.add("final");
    if (dato.nota) materia.dataset.nota = dato.nota;
  });

  materias.forEach(materia => {
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

      let timer;

materia.addEventListener("touchstart", () => {
  timer = setTimeout(() => {
    cambiarEstadoFinal(materia);
  }, 600); // 0.6 segundos
});

materia.addEventListener("touchend", () => {
  clearTimeout(timer); // si levantás antes de 0.6s, no hace nada
    });

    materia.addEventListener("dblclick", () => {
      const notaActual = materia.dataset.nota || "";
      const nota = prompt("Ingresar nota final:", notaActual);

      if (nota !== null) {
        materia.dataset.nota = nota;
        guardarProgreso();
        actualizarProgreso();

      }
    });
  });

  actualizarBloqueos();
  actualizarProgreso();
});


function actualizarBloqueos() {
  const materias = document.querySelectorAll(".materia");
  const idsAprobadas = Array.from(
    document.querySelectorAll(".materia.aprobada, .materia.final")
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
  const datos = Array.from(document.querySelectorAll(".materia")).map(m => ({
    id: m.dataset.id,
    aprobada: m.classList.contains("aprobada"),
    final: m.classList.contains("final"),
    nota: m.dataset.nota || ""
  }));

  localStorage.setItem("materias", JSON.stringify(datos));
}

function actualizarProgreso() {
  const total = document.querySelectorAll(".materia").length;

  const regulares = document.querySelectorAll(".materia.aprobada").length;
  const finales = document.querySelectorAll(".materia.final").length;

  // regulares reales = verdes + azules
  const regularesTotales = regulares + finales;

  const porcentajeRegulares = Math.round(
    (regularesTotales / total) * 100
  );

  const porcentajeFinales = Math.round(
    (finales / total) * 100
  );

  // textos
  document.getElementById("contador").textContent =
    `${finales} / ${total}`;

  document.getElementById("porcentaje").textContent =
    `${porcentajeFinales}%`;

  document.getElementById("porcentaje-regulares").textContent =
    `${porcentajeRegulares}%`;

  // barras visuales
  document.getElementById("barra-regulares").style.width =
    `${porcentajeRegulares}%`;

  document.getElementById("barra-finales").style.width =
    `${porcentajeFinales}%`;

  document.getElementById("texto-regulares").textContent =
    `${porcentajeRegulares}%`;

  document.getElementById("texto-finales").textContent =
    `${porcentajeFinales}%`;
    const finalesConNota = Array.from(
    document.querySelectorAll(".materia.final")
  ).filter(m => m.dataset.nota);

  if (finalesConNota.length === 0) {
    document.getElementById("promedio").textContent = "—";
  } else {
    const suma = finalesConNota.reduce(
      (acc, m) => acc + Number(m.dataset.nota),
      0
    );

    const promedio = (suma / finalesConNota.length).toFixed(2);
    document.getElementById("promedio").textContent = promedio;
  }

}

function cambiarEstadoFinal(materia) {
  materia.classList.remove("regular");
  materia.classList.add("final");
  guardarProgreso();       // actualiza almacenamiento si lo usás
  actualizarProgreso();    // actualiza el dashboard
}
