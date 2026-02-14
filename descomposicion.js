/**
 * MÓDULO: Resta por Descomposición Posicional (ABN)
 * Nota: La variable inputActivoId y estadoDesp se gestionan de forma global en main.js
 */

function renderDescomposicion() {
    const contenedor = document.getElementById('desc-content');
    if (!contenedor) return;
    
    // 1. Limpieza del contenedor
    contenedor.innerHTML = '';

    // 2. Creación de la estructura de la tabla
    const tabla = document.createElement('div');
    tabla.className = 'tabla-desc';
    tabla.style.cssText = "display: inline-grid; grid-template-columns: auto auto 1fr; gap: 15px; align-items: center; font-size: 1.8rem;";

    // Fila 1: Minuendo (MIN)
    tabla.appendChild(createRow(MIN, 'f1', false));
    // Fila 2: Sustraendo (SUB) con signo menos
    tabla.appendChild(createRow(SUB, 'f2', true));

    // Separador visual
    const sep = document.createElement('div');
    sep.style.cssText = "grid-column: span 3; border-bottom: 3px solid #333; margin: 10px 0;";
    tabla.appendChild(sep);

    // Fila Resultado
    tabla.appendChild(createResultRow());

    contenedor.appendChild(tabla);

    // 3. Añadir el Teclado Lineal
    const teclado = createTecladoLineal();
    contenedor.appendChild(teclado);

    // --- 4. PERSISTENCIA REAL: Restaurar valores y estilos ---
    const idsPosibles = ['f1c', 'f1d', 'f1u', 'f2c', 'f2d', 'f2u', 'frc', 'frd', 'fru', 'f-total'];
    
    idsPosibles.forEach(id => {
        const input = document.getElementById(id);
        if (input && estadoDesp[id] !== undefined) {
            input.value = estadoDesp[id];
            // Si el valor existe, restauramos el color de validación exitosa
            input.style.borderColor = "#27AE60";
            input.style.backgroundColor = "#e8f5e9";
        }
    });

    // Restaurar el texto del resultado acumulado si existe
    if (estadoDesp['f-total']) {
        const txtRes = document.getElementById('res-final-txt');
        if (txtRes) txtRes.innerText = estadoDesp['f-total'];
    }

    // 5. Manejo del foco (Solo si no hay nada empezado)
    if (Object.keys(estadoDesp).length === 0) {
        const primera = MIN >= 100 ? 'f1c' : (MIN >= 10 ? 'f1d' : 'f1u');
        seleccionarCaja(primera);
    } else {
        // Si ya hay datos, mantenemos el ID nulo para que el usuario elija dónde seguir
        inputActivoId = null;
    }
}

function createRow(num, prefijo, conSigno) {
    const fragment = document.createDocumentFragment();
    const dNum = document.createElement('div');
    dNum.style.fontWeight = 'bold';
    dNum.innerHTML = conSigno ? `<span style="color:#e74c3c">−</span> ${num}` : num;
    fragment.appendChild(dNum);

    const dIgual = document.createElement('div');
    dIgual.innerText = '=';
    fragment.appendChild(dIgual);

    const dInputs = document.createElement('div');
    dInputs.style.display = 'flex'; dInputs.style.gap = '8px'; dInputs.style.alignItems = 'center';

    if (MIN >= 100) {
        dInputs.appendChild(createInput(`${prefijo}c`, 'var(--centena)'));
        dInputs.appendChild(createSymbol('+'));
    }
    if (MIN >= 10) {
        dInputs.appendChild(createInput(`${prefijo}d`, 'var(--decena)'));
        dInputs.appendChild(createSymbol('+'));
    }
    dInputs.appendChild(createInput(`${prefijo}u`, 'var(--unidad)'));
    
    fragment.appendChild(dInputs);
    return fragment;
}

function createResultRow() {
    const fragment = document.createDocumentFragment();
    const dRes = document.createElement('div');
    dRes.id = 'res-final-txt';
    dRes.style.cssText = "color:#27AE60; font-weight:bold;";
    dRes.innerText = "?";
    fragment.appendChild(dRes);

    fragment.appendChild(createSymbol('='));

    const dInputs = document.createElement('div');
    dInputs.style.cssText = "display:flex; gap:8px; align-items:center;";
    if (MIN >= 100) {
        dInputs.appendChild(createInput('frc', 'var(--centena)'));
        dInputs.appendChild(createSymbol('+'));
    }
    if (MIN >= 10) {
        dInputs.appendChild(createInput('frd', 'var(--decena)'));
        dInputs.appendChild(createSymbol('+'));
    }
    dInputs.appendChild(createInput('fru', 'var(--unidad)'));
    
    dInputs.appendChild(createSymbol('='));
    const finalInp = createInput('f-total', '#333');
    finalInp.style.borderColor = "var(--desp)";
    finalInp.style.width = "100px";
    dInputs.appendChild(finalInp);

    fragment.appendChild(dInputs);
    return fragment;
}

function createInput(id, color) {
    const inp = document.createElement('input');
    inp.id = id;
    inp.className = 'caja-abn';
    inp.readOnly = true;
    inp.style.cssText = `width:75px; height:60px; border:3px solid #ccc; border-radius:10px; text-align:center; font-size:1.4rem; font-weight:bold; background:white; cursor:pointer; color:${color}; transition: 0.3s;`;
    inp.onclick = () => seleccionarCaja(id);
    return inp;
}

function createSymbol(char) {
    const s = document.createElement('span');
    s.innerText = char;
    s.style.cssText = "font-size:1.2rem; color:#999; font-weight:bold;";
    return s;
}

function createTecladoLineal() {
    const cont = document.createElement('div');
    cont.style.cssText = "margin-top:20px; display:flex; gap:6px; justify-content:center; flex-wrap:wrap;";
    
    "1234567890".split('').forEach(num => {
        const btn = document.createElement('button');
        btn.innerText = num;
        btn.className = 'btn-main';
        btn.style.cssText = "background:#444; width:50px; height:55px; font-size:1.5rem;";
        btn.onclick = () => { 
            if(inputActivoId) {
                const el = document.getElementById(inputActivoId);
                if(el) el.value += num;
            }
        };
        cont.appendChild(btn);
    });

    const del = document.createElement('button');
    del.innerText = "⌫";
    del.className = 'btn-main';
    del.style.cssText = "background:#E74C3C; width:65px; height:55px;";
    del.onclick = () => { 
        if(inputActivoId) {
            const el = document.getElementById(inputActivoId);
            if(el) el.value = el.value.slice(0, -1);
        }
    };
    cont.appendChild(del);

    const ok = document.createElement('button');
    ok.innerText = "OK";
    ok.className = 'btn-main';
    ok.style.cssText = "background:#27AE60; width:100px; height:55px;";
    ok.onclick = validarPaso;
    cont.appendChild(ok);

    return cont;
}

function seleccionarCaja(id) {
    if (inputActivoId) {
        const prev = document.getElementById(inputActivoId);
        if (prev) {
            // Si estaba validado, vuelve a su color verde, si no a blanco
            prev.style.backgroundColor = (estadoDesp[inputActivoId] !== undefined) ? "#e8f5e9" : "white";
        }
    }
    inputActivoId = id;
    const current = document.getElementById(id);
    if (current) current.style.backgroundColor = "#e3f2fd";
}

function validarPaso() {
    const el = document.getElementById(inputActivoId);
    if (!el || el.value === "") return;
    const val = parseInt(el.value);
    let correcto = false;

    // Validación flexible
    if (inputActivoId.startsWith('f1')) { 
        const c = parseInt(document.getElementById('f1c')?.value || 0);
        const d = parseInt(document.getElementById('f1d')?.value || 0);
        const u = parseInt(document.getElementById('f1u')?.value || 0);
        if ((c + d + u) <= MIN) correcto = true;
    } 
    else if (inputActivoId.startsWith('f2')) {
        const c = parseInt(document.getElementById('f2c')?.value || 0);
        const d = parseInt(document.getElementById('f2d')?.value || 0);
        const u = parseInt(document.getElementById('f2u')?.value || 0);
        if ((c + d + u) <= SUB) correcto = true;
    }
    else if (inputActivoId.startsWith('fr')) {
        const pos = inputActivoId.slice(-1);
        const v1 = parseInt(document.getElementById(`f1${pos}`)?.value || 0);
        const v2 = parseInt(document.getElementById(`f2${pos}`)?.value || 0);
        if (val === (v1 - v2)) correcto = true;
    }
    else if (inputActivoId === 'f-total') {
        if (val === (MIN - SUB)) {
            const s1 = (parseInt(document.getElementById('f1c')?.value||0)+parseInt(document.getElementById('f1d')?.value||0)+parseInt(document.getElementById('f1u')?.value||0));
            const s2 = (parseInt(document.getElementById('f2c')?.value||0)+parseInt(document.getElementById('f2d')?.value||0)+parseInt(document.getElementById('f2u')?.value||0));
            if(s1 === MIN && s2 === SUB) {
                correcto = true;
                document.getElementById('res-final-txt').innerText = val;
                fireConfetti();
                showMsg('msg-desc', 'ok', '¡Excelente! Has descompuesto y restado correctamente.');
            } else {
                showMsg('msg-desc', 'err', 'La suma de las partes no coincide con el número original.');
                return;
            }
        }
    }

    if (correcto) {
        el.style.borderColor = "#27AE60";
        el.style.backgroundColor = "#e8f5e9";
        // Guardar en la memoria global de main.js
        estadoDesp[inputActivoId] = el.value;
    } else {
        el.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 400 });
        setTimeout(() => { el.value = ''; }, 400);
    }
}