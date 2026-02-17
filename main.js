// --- DECLARACIONES GLOBALES (Persistencia entre módulos) ---
var estadoDesp = {}; 
var inputActivoId = null; 

let MIN, SUB, activeTabName = "Mesa";
let mesaLeft = {c:0, d:0, u:0}, mesaRight = {c:0, d:0, u:0};
let frogPos, frogHistory = [];
let abnSub, abnMin, activeAbnInput = null;

function initGame() {
    const newMin = parseInt(document.getElementById('inpMin').value);
    const newSub = parseInt(document.getElementById('inpSub').value);
    
    if(newSub >= newMin) { 
        alert("El sustraendo debe ser menor"); 
        return; 
    }

    MIN = newMin;
    SUB = newSub;

    // Reset de memoria
    estadoDesp = {}; 
    inputActivoId = null;
    
    // Inicialización de otros módulos
    mesaLeft = { c: Math.floor(MIN/100), d: Math.floor((MIN%100)/10), u: MIN%10 };
    mesaRight = { c:0, d:0, u:0 };
    renderMesa();
    resetFrog();
    
    abnSub = SUB; abnMin = MIN;
    const abnBody = document.getElementById('abn-body');
    if(abnBody) {
        abnBody.innerHTML = `<tr style="background:#eee"><td>-</td><td>${SUB}</td><td>${MIN}</td></tr>`;
        addAbnRow();
    }

    // Ocultar mensajes
    document.querySelectorAll('.msg-box').forEach(m => m.style.display='none');
    document.getElementById('prof-bubble').style.display = 'none';
    
    // Si estamos en la pestaña de descomposición, forzamos el redibujado
    if(activeTabName === 'Desp') renderDescomposicion();
}

function randomize() {
    // 1. Leemos el límite que has elegido en el menú (10, 20, 99 o 999)
    const limite = parseInt(document.getElementById('selNivel').value);

    // 2. Generamos el Minuendo (m)
    // Hacemos que sea al menos la mitad del límite para que las restas sean interesantes
    // (Ej: Si es nivel 100, buscará números entre 10 y 100, no sacará un 3)
    let minRango = limite > 10 ? 10 : 2; 
    let m = Math.floor(Math.random() * (limite - minRango)) + minRango;

    // 3. Generamos el Sustraendo (s)
    // Tiene que ser siempre menor que 'm' (entre 1 y m-1)
    let s = Math.floor(Math.random() * (m - 1)) + 1;

    // 4. Lo mandamos a las casillas y arrancamos
    document.getElementById('inpMin').value = m;
    document.getElementById('inpSub').value = s;
    initGame();
}

function showTab(idx, name) {
    activeTabName = name;
    document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === idx));
    document.querySelectorAll('.view-section').forEach((v, i) => v.classList.toggle('active', i === idx));
    
    if(name === 'Rana') renderFrog();
    if(name === 'Desp') renderDescomposicion(); 
    if(name === 'Mesa') renderMesa();
}

function refreshView() {
    if(activeTabName === 'Rana') renderFrog();
    if(activeTabName === 'ABN') initGame();
}

function askProfesor() {
    const txt = document.getElementById('prof-text');
    const bubble = document.getElementById('prof-bubble');
    bubble.style.display = 'block';

    if (activeTabName === "Desp") {
        if (!inputActivoId) {
            txt.innerText = "¿Por dónde quieres empezar? Elige una casilla blanca para descomponer los números.";
            return;
        }

        const tipo = inputActivoId.slice(-1); // 'c', 'd' o 'u'
        const fila = inputActivoId.startsWith('f1') ? 'minuendo' : (inputActivoId.startsWith('f2') ? 'sustraendo' : 'resultado');
        
        // A) Ayuda para Descomponer (Filas f1 y f2)
        if (inputActivoId.startsWith('f1') || inputActivoId.startsWith('f2')) {
            const numActual = inputActivoId.startsWith('f1') ? MIN : SUB;
            const sujeto = inputActivoId.startsWith('f1') ? "primer número" : "segundo número";
            
            if (tipo === 'c') {
                txt.innerHTML = `Mira el <b>${numActual}</b> (${sujeto}). ¿Cuántas <b>centenas</b> (puntos amarillos) tiene? <br>Recuerda que cada una vale 100.`;
            } else if (tipo === 'd') {
                txt.innerHTML = `En el <b>${numActual}</b>, ¿cuántas <b>decenas</b> (palillos rojos) hay? <br>¡Cada una vale 10 unidades!`;
            } else {
                txt.innerHTML = `¿Cuántas <b>unidades</b> sueltas (puntos azules) ves en el <b>${numActual}</b>?`;
            }
        } 
        // B) Ayuda para Restar (Fila fr)
        else if (inputActivoId.startsWith('fr')) {
            const v1 = parseInt(document.getElementById(`f1${tipo}`)?.value || 0);
            const v2 = parseInt(document.getElementById(`f2${tipo}`)?.value || 0);
            const nombreTipo = tipo === 'c' ? 'Centenas' : (tipo === 'd' ? 'Decenas' : 'Unidades');

            if (v1 < v2) {
                txt.innerHTML = `⚠️ ¡Atención! No puedes quitarle <b>${v2}</b> a <b>${v1}</b>. <br>Vuelve a la <b>Mesa</b> y "rompe" una pieza mayor para tener más ${nombreTipo}, o cambia tu descomposición.`;
            } else {
                txt.innerHTML = `¡A restar ${nombreTipo}! <br>A <b>${v1}</b> le quitamos <b>${v2}</b>. ¿Cuánto te queda?`;
            }
        }
        // C) Ayuda Resultado Final
        else if (inputActivoId === 'f-total') {
            txt.innerHTML = "¡Ya casi! Ahora suma los tres resultados que has obtenido (las casillas verdes) para saber el total.";
        }
    } else if(activeTabName === "Rana") {
        let faltan = MIN - frogPos;
        if(faltan >= 100) txt.innerText = `Estamos a ${faltan} de distancia. ¡Un salto amarillo de 100 nos vendría genial!`;
        else if(faltan >= 10) txt.innerText = `Faltan ${faltan}. Los saltos rojos de 10 son perfectos ahora.`;
        else if(faltan > 0) txt.innerText = `¡Ya casi! Solo quedan ${faltan} unidades. Usa el salto azul.`;
        else txt.innerText = "¡Meta lograda!";
    } else if(activeTabName === "Mesa") {
        const uMin = MIN % 10;
        const uSub = SUB % 10;
        if (uMin < uSub) {
            txt.innerHTML = `💡 <b>Truco:</b> El minuendo tiene menos unidades que el sustraendo. <br>¡Pulsa una <b>Decena</b> para "romperla" en 10 unidades!`;
        } else {
            txt.innerText = "Arrastra las piezas o pulsa sobre ellas para moverlas y realizar la resta.";
        }
    } else {
        txt.innerText = "Escribe cuánto quieres quitar en cada paso. ¡Tú puedes!";
    }
}

function showMsg(id, type, txt) {
    const el = document.getElementById(id);
    if(!el) return;
    el.className = 'msg-box ' + (type==='err'?'is-error':'is-success');
    el.innerText = txt;
    el.style.display = 'block';
}

function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    let p = Array.from({length:100}, () => ({x:Math.random()*canvas.width, y:Math.random()*canvas.height, c:`hsl(${Math.random()*360},70%,50%)`, v:Math.random()*5+3}));
    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        p.forEach(i => { ctx.fillStyle=i.c; ctx.fillRect(i.x, i.y+=i.v, 6, 6); if(i.y>canvas.height) i.y=-10; });
        requestAnimationFrame(draw);
    }
    draw();
    setTimeout(() => { p=[]; ctx.clearRect(0,0,canvas.width,canvas.height); }, 3000);
}

function abrirGuia() {
    document.getElementById('guia-modal').style.display = 'block';
    // Bloqueamos el scroll del fondo para que no se mueva la app mientras leemos
    document.body.style.overflow = 'hidden'; 
}

function cerrarGuia() {
    document.getElementById('guia-modal').style.display = 'none';
    // Devolvemos el scroll
    document.body.style.overflow = 'auto';
}
window.onload = randomize;