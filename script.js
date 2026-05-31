let movimientos = [];
 
// Cargar datos guardados
const datosGuardados = localStorage.getItem("movimientos_v2");
if (datosGuardados) {
  movimientos = JSON.parse(datosGuardados);
  mostrarMovimientos();
  calcularBalance();
  actualizarGrafico();
}
 
let grafico;
 
// ── Agregar movimiento ──────────────────────────────────────
function agregarMovimiento() {
  const descripcion = document.getElementById("descripcion").value.trim();
  const monto = Number(document.getElementById("monto").value);
  const tipo = document.getElementById("tipo").value;
 
  if (descripcion === "" || monto <= 0) {
    mostrarToast("Completá todos los campos correctamente", "error");
    return;
  }
 
  const movimiento = { descripcion, monto, tipo };
  movimientos.push(movimiento);
 
  guardarDatos();
  mostrarMovimientos();
  calcularBalance();
  actualizarGrafico();
  limpiarFormulario();
 
  mostrarToast(tipo === "ingreso" ? "Ingreso agregado ✓" : "Gasto registrado ✓");
}
 
// ── Mostrar lista ───────────────────────────────────────────
function mostrarMovimientos() {
  const lista = document.getElementById("listaMovimientos");
  lista.innerHTML = "";
 
  if (movimientos.length === 0) {
    const li = document.createElement("li");
    li.classList.add("empty-state");
    li.textContent = "Sin movimientos aún";
    lista.appendChild(li);
    return;
  }
 
  // Mostrar en orden inverso (último primero)
  [...movimientos].reverse().forEach((movimiento) => {
    const li = document.createElement("li");
    li.classList.add(movimiento.tipo);
    li.innerHTML = `
      <span class="li-desc">${movimiento.descripcion}</span>
      <span class="li-monto ${movimiento.tipo === "ingreso" ? "ing" : "gas"}">
        ${movimiento.tipo === "ingreso" ? "+" : "-"}$${movimiento.monto.toLocaleString()}
      </span>
    `;
    lista.appendChild(li);
  });
}
 
// ── Calcular balance y stats ────────────────────────────────
function calcularBalance() {
  let total = 0;
  let ingresos = 0;
  let gastos = 0;
 
  movimientos.forEach((movimiento) => {
    if (movimiento.tipo === "ingreso") {
      total += movimiento.monto;
      ingresos += movimiento.monto;
    } else {
      total -= movimiento.monto;
      gastos += movimiento.monto;
    }
  });
 
  const balanceEl = document.getElementById("balance");
  balanceEl.innerText = (total < 0 ? "-" : "") + "$" + Math.abs(total).toLocaleString();
 
  // Color dinámico según valor
  balanceEl.className = total > 0 ? "positivo" : total < 0 ? "negativo" : "neutro";
 
  // Actualizar tarjetas de stats
  document.getElementById("totalIngresos").textContent = "$" + ingresos.toLocaleString();
  document.getElementById("totalGastos").textContent = "$" + gastos.toLocaleString();
}
 
// ── Gráfico ─────────────────────────────────────────────────
function actualizarGrafico() {
  let ingresos = 0;
  let gastos = 0;
 
  movimientos.forEach((movimiento) => {
    if (movimiento.tipo === "ingreso") {
      ingresos += movimiento.monto;
    } else {
      gastos += movimiento.monto;
    }
  });
 
  const ctx = document.getElementById("miGrafico");
 
  if (grafico) {
    grafico.destroy();
  }
 
  grafico = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Ingresos", "Gastos"],
      datasets: [{
        data: [ingresos || 1, gastos || 1],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: { size: 13 },
            padding: 16
          }
        }
      }
    }
  });
}
 
// ── Toast de notificación ───────────────────────────────────
function mostrarToast(mensaje, tipo) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.className = "toast" + (tipo === "error" ? " error" : "");
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2200);
}
 
// ── Limpiar formulario ──────────────────────────────────────
function limpiarFormulario() {
  document.getElementById("descripcion").value = "";
  document.getElementById("monto").value = "";
}
 
// ── Guardar en localStorage ─────────────────────────────────
function guardarDatos() {
  localStorage.setItem("movimientos_v2", JSON.stringify(movimientos));
}
 
// ── Limpiar historial ───────────────────────────────────────
function limpiarHistorial() {
  if (movimientos.length === 0) return;
 
  movimientos = [];
  localStorage.removeItem("movimientos_v2");
 
  mostrarMovimientos();
  calcularBalance();
  actualizarGrafico();
  mostrarToast("Historial limpiado");
}