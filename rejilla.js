function addAbnRow() {
    let tr = document.createElement('tr');
    let manual = document.getElementById('chkManual').checked;
    tr.innerHTML = `<td><input class="abn-input" readonly onclick="setAbnFocus(this)"></td>
                    <td><input class="abn-input ${manual?'':'readonly'}" readonly onclick="setAbnFocus(this)"></td>
                    <td><input class="abn-input ${manual?'':'readonly'}" readonly onclick="setAbnFocus(this)"></td>`;
    document.getElementById('abn-body').appendChild(tr);
    setAbnFocus(tr.cells[0].firstChild);
}

function setAbnFocus(el) {
    if(el.classList.contains('readonly')) return;
    document.querySelectorAll('.abn-input').forEach(i => i.classList.remove('active'));
    el.classList.add('active'); activeAbnInput = el;
}

function kp(v) {
    if(!activeAbnInput) return;
    if(v==='del') { activeAbnInput.value = ''; return; }
    if(v==='ok') {
        let row = activeAbnInput.parentElement.parentElement;
        let inputs = Array.from(row.querySelectorAll('input'));
        let val = parseInt(inputs[0].value);
        let manual = document.getElementById('chkManual').checked;

        if(!manual) {
            if(isNaN(val) || val > abnSub) return;
            abnSub -= val; abnMin -= val;
            inputs[1].value = abnSub; inputs[2].value = abnMin;
            inputs.forEach(i => i.classList.add('readonly'));
            if(abnSub > 0) addAbnRow(); else { showMsg('msg-abn','ok','¡Genial!'); fireConfetti(); }
        } else {
            // Lógica Reto Mental
            let idx = inputs.indexOf(activeAbnInput);
            if(idx === 0) setAbnFocus(inputs[1]);
            else if(idx === 1) setAbnFocus(inputs[2]);
            else {
                if(parseInt(inputs[1].value) === (abnSub-val) && parseInt(inputs[2].value) === (abnMin-val)) {
                    abnSub -= val; abnMin -= val;
                    inputs.forEach(i => i.classList.add('readonly'));
                    if(abnSub > 0) addAbnRow(); else { showMsg('msg-abn','ok','¡Perfecto!'); fireConfetti(); }
                } else showMsg('msg-abn','err','Error en el cálculo');
            }
        }
        return;
    }
    activeAbnInput.value += v;
}