/**
 * MÓDULO: Resta por Descomposición Posicional (ABN)
 * ARCHIVO COMPLETO - NO CORTAR
 */

function renderDescomposicion() {
    const contenedor = document.getElementById('desc-content');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';

    const tabla = document.createElement('div');
    tabla.className = 'tabla-desc';
    // Estructura ultra-compacta para iPhone
    tabla.style.cssText = "display: inline-grid; grid-template-columns: auto auto 1fr; gap: 4px; align-items: center; width: 100%; max-width: 380px; margin: 0 auto;";

    tabla.appendChild(createRow(MIN, 'f1', false));
    tabla.appendChild(createRow(SUB, 'f2', true));

    const sep = document.createElement('div');
    sep.style.cssText = "grid-column: span 3; border-bottom: 2px solid #333; margin: 8px 0;";
    tabla.appendChild(sep);

    tabla.appendChild(createResultRow());
    contenedor.appendChild(tabla);

    // Renderizamos el teclado
    const teclado = createTecladoLineal();
    contenedor.appendChild(teclado);

    // PERSISTENCIA
    const idsPosibles = ['f1c', 'f1d', 'f1u', 'f2c', 'f2d', 'f2u', 'frc', 'frd', 'fru', 'f-total'];
    idsPosibles.forEach(id => {
        const input = document.getElementById(id);
        if (input && estadoDesp[id] !== undefined) {
            input.value = estadoDesp[id];
            input.style.borderColor = "#27AE60";
            input.style.backgroundColor = "#e8f5e9";
        }
    });

    if (estadoDesp['f-total']) {
        const txtRes = document.getElementById('res-final-txt');
        if (txtRes) txtRes.innerText = estadoDesp['f-total'];
    }

    if (Object.keys(estadoDesp).length === 0) {
        const primera = MIN >= 100 ? 'f1c' : (MIN >= 10 ? 'f1d' : 'f1u');
        seleccionarCaja(primera);
    }
}

function createRow(num, prefijo, conSigno) {
    const fragment = document.createDocumentFragment();
    const dNum = document.createElement('div');
    dNum.style.cssText = "font-weight: bold; min-width: 35px; text-align: right; font-size: 1.1rem;";
    dNum.innerHTML = conSigno ? `<span style="color:#e74c3c">−</span>${num}` : num;
    fragment.appendChild(dNum);

    const dIgual = document.createElement('div');
    dIgual.innerText = '=';
    fragment.appendChild(dIgual);

    const dInputs = document.createElement('div');
    dInputs.style.cssText = "display: flex; gap: 3px; align-items: center;";

    if (MIN >= 100) {
        dInputs.appendChild(createInput(`${prefijo}c`, 'var(--centena)', 43)); 
        dInputs.appendChild(createSymbol('+'));
    }
    if (MIN >= 10) {
        dInputs.appendChild(createInput(`${prefijo}d`, 'var(--decena)', 38)); 
        dInputs.appendChild(createSymbol('+'));
    }
    dInputs.appendChild(createInput(`${prefijo}u`, 'var(--unidad)', 32)); 
    
    fragment.appendChild(dInputs);
    return fragment;
}

function createResultRow() {
    const fragment = document.createDocumentFragment();
    const dRes = document.createElement('div');
    dRes.id = 'res-final-txt';
    dRes.style.cssText = "color:#27AE60; font-weight:bold; text-align: right; font-size: 1.1rem;";
    dRes.innerText = "?";
    fragment.appendChild(dRes);

    fragment.appendChild(createSymbol('='));

    const dInputs = document.createElement('div');
    dInputs.style.cssText = "display:flex; gap:3px; align-items:center;";
    if (MIN >= 100) {
        dInputs.appendChild(createInput('frc', 'var(--centena)', 43));
        dInputs.appendChild(createSymbol('+'));
    }
    if (MIN >= 10) {
        dInputs.appendChild(createInput('frd', 'var(--decena)', 38));
        dInputs.appendChild(createSymbol('+'));
    }
    dInputs.appendChild(createInput('fru', 'var(--unidad)', 32));
    
    dInputs.appendChild(createSymbol('='));
    const finalInp = createInput('f-total', '#333', 48); 
    finalInp.style.borderColor = "var(--desp)";
    dInputs.appendChild(finalInp);

    fragment.appendChild(dInputs);
    return fragment;
}

function createInput(id, color, width) {
    const inp = document.createElement('input');
    inp.id = id;
    inp.className = 'caja-abn';
    inp.readOnly = true;
    inp.style.cssText = `width: ${width}px; height: 42px; border: 2px solid #ccc; border-radius: 6px; text-align: center; font-size: 1.1rem; font-weight: bold; background: white; cursor: pointer; color: ${color}; padding: 0;`;
    inp.onclick = () => seleccionarCaja(id);
    return inp;
}

function createSymbol(char) {
    const s = document.createElement('span');
    s.innerText = char;
    s.style.cssText = "font-size: 0.8rem; color: #aaa; font-weight: bold; width: 8px; text-align: center;";
    return s;
}

function createTecladoLineal() {
    const cont = document.createElement('div');
    cont.style.cssText = "margin-top: 15px; display: flex; gap: 3px; justify-content: center; flex-wrap: wrap; width: 100%;";
    
    "1234567890".split('').forEach(num => {
        const btn = document.createElement('button');
        btn.innerText = num;
        btn.className = 'btn-main';
        btn.style.cssText = "background: #444; width: 33px; height: 42px; font-size: 1.2rem; padding: 0;";
        btn.onclick = () => { 
            if(inputActivoId) {
                const el = document.getElementById(inputActivoId);
                if(el) {
                    el.value += num;
                    showMsg('msg-desc', 'info', `Pulsa OK`);
                }
            }
        };
        cont.appendChild(btn);
    });

    const del = document.createElement('button');
    del.innerText = "⌫";
    del.className = 'btn-main';
    del.style.cssText = "background: #E74C3C; width: 42px; height: 42px; padding: 0;";
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
    ok.style.cssText = "background: #27AE60; width: 50px; height: 42px; padding: 0;";
    ok.onclick = validarPaso;
    cont.appendChild(ok);

    return cont;
}

function seleccionarCaja(id) {
    if (inputActivoId) {
        const prev = document.getElementById(inputActivoId);
        if (prev) {
            prev.style.backgroundColor = (estadoDesp[inputActivoId] !== undefined) ? "#e8f5e9" : "white";
        }
    }
    inputActivoId = id;
    const current = document.getElementById(id);
    if (current) {
        current.style.backgroundColor = "#e3f2fd";
        showMsg('msg-desc', 'info', 'Escribe y pulsa OK');
    }
}

function validarPaso() {
    const el = document.getElementById(inputActivoId);
    if (!el || el.value === "") return;
    const val = parseInt(el.value);
    let correcto = false;

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
                showMsg('msg-desc', 'ok', '¡Excelente! Todo correcto.');
            } else {
                showMsg('msg-desc', 'err', 'La suma no coincide con el original.');
                return;
            }
        }
    }

    if (correcto) {
        el.style.borderColor = "#27AE60";
        el.style.backgroundColor = "#e8f5e9";
        estadoDesp[inputActivoId] = el.value;
        showMsg('msg-desc', 'ok', '¡Muy bien!');
    } else {
        el.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 400 });
        setTimeout(() => { el.value = ''; }, 400);
        showMsg('msg-desc', 'err', '¡Prueba otra vez!');
    }
}