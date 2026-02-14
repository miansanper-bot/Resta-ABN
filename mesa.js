function renderMesa() {
    const zL = document.getElementById('zone-left');
    const zR = document.getElementById('zone-right');
    if (!zL || !zR) return;

    zL.innerHTML = ''; zR.innerHTML = '';

    // Dibujar bloques usando los datos globales mesaLeft y mesaRight
    const draw = (data, container, side) => {
        for (let i = 0; i < data.c; i++) createBlock(container, 'c', side);
        for (let i = 0; i < data.d; i++) createBlock(container, 'd', side);
        for (let i = 0; i < data.u; i++) createBlock(container, 'u', side);
    };

    draw(mesaLeft, zL, 'L');
    draw(mesaRight, zR, 'R');

    const valL = (mesaLeft.c * 100) + (mesaLeft.d * 10) + mesaLeft.u;
    const valR = (mesaRight.c * 100) + (mesaRight.d * 10) + mesaRight.u;
    
    document.getElementById('val-left').innerText = valL;
    document.getElementById('goal-right').innerText = `${valR} / ${SUB}`;

    if (valR === SUB && SUB > 0) {
        showMsg('msg-mesa', 'ok', '¡Hecho! Objetivo alcanzado.');
        fireConfetti();
    }
}

function createBlock(container, type, side) {
    const div = document.createElement('div');
    div.className = 'b-' + (type === 'c' ? '100' : (type === 'd' ? '10' : '1'));
    if (type === 'c') div.innerText = '100';
    
    div.onclick = () => {
        const valPiez = type === 'c' ? 100 : (type === 'd' ? 10 : 1);
        if (side === 'L') {
            const actualR = (mesaRight.c * 100) + (mesaRight.d * 10) + mesaRight.u;
            if (actualR + valPiez <= SUB) {
                mesaLeft[type]--; mesaRight[type]++;
            } else {
                showMsg('msg-mesa', 'err', 'Te pasas del objetivo.');
            }
        } else {
            mesaRight[type]--; mesaLeft[type]++;
        }
        renderMesa();
    };
    container.appendChild(div);
}

function breakBlock(type) {
    if (type === 'c' && mesaLeft.c > 0) {
        mesaLeft.c--; mesaLeft.d += 10;
    } else if (type === 'd' && mesaLeft.d > 0) {
        mesaLeft.d--; mesaLeft.u += 10;
    }
    renderMesa();
}