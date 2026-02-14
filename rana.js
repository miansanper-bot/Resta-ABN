function renderFrog() {
    const svg = document.getElementById('svgLine');
    if (!svg) return;
    svg.innerHTML = '';
    
    const W = svg.clientWidth || 800;
    const mX = 60;
    const Y_BASE = 180; 
    const RANGO = MIN - SUB;
    const getX = v => mX + ((v - SUB) / RANGO) * (W - 2 * mX);
    const modoReto = document.getElementById('chkManual').checked;

    // --- MARCADORES (Cajas Negras) ---
    const drawCounter = (x, y, label, value) => {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let txtLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txtLabel.setAttribute("x", x); txtLabel.setAttribute("y", y - 10);
        txtLabel.setAttribute("text-anchor", "middle"); txtLabel.setAttribute("font-size", "12");
        txtLabel.textContent = label;
        group.appendChild(txtLabel);

        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x - 40); rect.setAttribute("y", y);
        rect.setAttribute("width", "80"); rect.setAttribute("height", "35");
        rect.setAttribute("rx", "5"); rect.setAttribute("fill", "#000");
        group.appendChild(rect);

        let txtVal = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txtVal.setAttribute("x", x); txtVal.setAttribute("y", y + 24);
        txtVal.setAttribute("text-anchor", "middle"); txtVal.setAttribute("fill", "#FFF");
        txtVal.setAttribute("font-size", "18"); txtVal.setAttribute("font-family", "monospace");
        txtVal.textContent = value;
        group.appendChild(txtVal);
        svg.appendChild(group);
    };

    // Marcador de posición (Siempre visible)
    drawCounter(W/2 - 60, 40, "ESTOY EN:", frogPos);

    // Marcador de lo que falta (SOLO si NO hay reto)
    if (!modoReto) {
        drawCounter(W/2 + 60, 40, "ME FALTAN:", (MIN - frogPos));
    }

    // Línea de la recta (Fina)
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", mX); line.setAttribute("y1", Y_BASE);
    line.setAttribute("x2", W - mX); line.setAttribute("y2", Y_BASE);
    line.setAttribute("stroke", "#333"); line.setAttribute("stroke-width", "2");
    svg.appendChild(line);

    drawMark(svg, SUB, Y_BASE);
    drawMark(svg, MIN, Y_BASE);

    let currentVal = SUB;
    frogHistory.forEach((s, i) => {
        let xStart = getX(currentVal);
        let xEnd = getX(currentVal + s);
        let color = s >= 100 ? '#f1c40f' : (s >= 10 ? '#EB5757' : '#2D9CDB');
        let alturaArco = Math.min(60, s * 0.3 + 15);

        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${xStart} ${Y_BASE} Q ${(xStart + xEnd) / 2} ${Y_BASE - alturaArco * 2} ${xEnd} ${Y_BASE}`);
        path.setAttribute("stroke", color); path.setAttribute("fill", "none"); path.setAttribute("stroke-width", "3");
        svg.appendChild(path);

        let tSalto = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tSalto.setAttribute("x", (xStart + xEnd) / 2); tSalto.setAttribute("y", Y_BASE - alturaArco - 8);
        tSalto.setAttribute("text-anchor", "middle"); tSalto.setAttribute("fill", color);
        tSalto.setAttribute("font-size", "14"); tSalto.textContent = "+" + s;
        svg.appendChild(tSalto);

        let nivel = (i % 3) + 1;
        let tLlegada = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tLlegada.setAttribute("x", xEnd); tLlegada.setAttribute("y", Y_BASE + (22 * nivel));
        tLlegada.setAttribute("text-anchor", "middle"); tLlegada.setAttribute("font-size", "13");
        tLlegada.textContent = currentVal + s;
        svg.appendChild(tLlegada);
        currentVal += s;
    });

    let rana = document.createElementNS("http://www.w3.org/2000/svg", "text");
    rana.setAttribute("x", getX(frogPos)); rana.setAttribute("y", Y_BASE - 5);
    rana.setAttribute("text-anchor", "middle"); rana.setAttribute("font-size", "35");
    rana.textContent = "🐸";
    svg.appendChild(rana);

    updateFrogControls();
}

function updateFrogControls() {
    const contenedor = document.getElementById('frog-controls');
    const modoReto = document.getElementById('chkManual').checked;
    if (!contenedor) return;
    contenedor.innerHTML = '';

    if (!modoReto) {
        const btns = [
            {v: 1, bg: '#2D9CDB', col: 'white'}, 
            {v: 10, bg: '#EB5757', col: 'white'}, 
            {v: 100, bg: '#f1c40f', col: 'black'}
        ];
        btns.forEach(b => {
            let el = document.createElement('button');
            el.innerText = "+" + b.v;
            el.style.cssText = `background:${b.bg}; color:${b.col}; border:none; padding:12px 25px; border-radius:8px; font-weight:bold; cursor:pointer; box-shadow:0 3px #999;`;
            el.onclick = () => jump(b.v);
            contenedor.appendChild(el);
        });
    } else {
        let wrapper = document.createElement('div');
        wrapper.style.cssText = "display:flex; flex-direction:column; align-items:center; gap:10px;";
        let inputRow = document.createElement('div');
        inputRow.style.display = "flex"; inputRow.style.gap = "10px";
        let inp = document.createElement('input');
        inp.type = 'number'; inp.id = 'valSaltoManual'; inp.placeholder = "Salto";
        inp.style.cssText = "padding:10px; width:100px; font-size:1.2rem; border:2px solid #333; border-radius:5px; text-align:center;";
        let btnOk = document.createElement('button');
        btnOk.innerText = "SALTAR";
        btnOk.style.cssText = "padding:10px 20px; background:#27AE60; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;";
        btnOk.onclick = () => {
            let n = parseInt(document.getElementById('valSaltoManual').value);
            if (!isNaN(n) && n > 0) { jump(n); document.getElementById('valSaltoManual').value = ''; }
        };
        inputRow.appendChild(inp); inputRow.appendChild(btnOk);
        wrapper.appendChild(inputRow);
        let keyRow = document.createElement('div');
        keyRow.style.cssText = "display:flex; gap:5px; margin-top:5px;";
        "1234567890".split('').forEach(num => {
            let k = document.createElement('button');
            k.innerText = num;
            k.style.cssText = "width:40px; height:45px; background:#444; color:white; border:none; border-radius:5px; font-size:1.2rem; cursor:pointer;";
            k.onclick = () => document.getElementById('valSaltoManual').value += num;
            keyRow.appendChild(k);
        });
        let kDel = document.createElement('button');
        kDel.innerText = "⌫";
        kDel.style.cssText = "width:50px; height:45px; background:#E74C3C; color:white; border:none; border-radius:5px; font-size:1.2rem; cursor:pointer;";
        kDel.onclick = () => {
            let v = document.getElementById('valSaltoManual').value;
            document.getElementById('valSaltoManual').value = v.substring(0, v.length - 1);
        };
        keyRow.appendChild(kDel);
        wrapper.appendChild(keyRow);
        contenedor.appendChild(wrapper);
    }
    
    let reset = document.createElement('button');
    reset.innerText = "Reiniciar";
    reset.style.cssText = "margin-left: 20px; padding: 10px; background: #eee; border: 1px solid #ccc; cursor: pointer; border-radius: 5px;";
    reset.onclick = resetFrog;
    contenedor.appendChild(reset);
}

function jump(n) {
    const modoReto = document.getElementById('chkManual').checked;
    const falta = MIN - frogPos;
    if (!modoReto) {
        if (n === 1 && falta >= 10) { showMsg('msg-frog', 'err', "Usa saltos de 10 o 100."); return; }
        if (n === 10 && falta >= 100) { showMsg('msg-frog', 'err', "Usa saltos de 100."); return; }
    }
    if (frogPos + n <= MIN) {
        frogPos += n; frogHistory.push(n);renderFrog();
        if (frogPos === MIN) { showMsg('msg-frog', 'ok', '¡Excelente!'); fireConfetti(); }
    } else { showMsg('msg-frog', 'err', '¡Te pasas!'); }
}

function resetFrog() {
    frogPos = SUB; frogHistory = []; renderFrog();
}

function drawMark(svg, val, y) {
    let x = (60 + ((val - SUB) / (MIN - SUB)) * (svg.clientWidth - 120)) || 60;
    let t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", x); t.setAttribute("y", y + 25); t.setAttribute("text-anchor", "middle");
    t.setAttribute("font-size", "14"); t.textContent = val;
    svg.appendChild(t);
}