// Globale Variablen für Charts
let charts = {};

// --- 1. NAVIGATION ---
function showSection(id) {
    document.querySelectorAll('.container').forEach(c => c.style.display = 'none');
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
    }
}

function toggleSubmenu(id) {
    const sub = document.getElementById(id);
    if (sub) {
        sub.style.display = (sub.style.display === 'none') ? 'block' : 'none';
    }
}

// HILFSFUNKTION FÜR STANDARD-CHARTS (AfA)
function renderAfaChart(canvasId, labels, data, labelName) {
    if (charts[canvasId]) charts[canvasId].destroy();
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{ label: labelName, data: data, borderColor: '#4caf50', tension: 0.1, fill: false }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

// --- 2. ABSCHREIBUNGS-FUNKTIONEN ---

function calcAnlagen() {
    let ak = parseFloat(document.getElementById('ak').value) || 0;
    let rw = parseFloat(document.getElementById('rw').value) || 0;
    let nd = parseInt(document.getElementById('nd').value) || 1;
    let afa = (ak - rw) / nd;
    let values = []; let labels = [];
    for(let i=0; i<=nd; i++) {
        labels.push("J. " + i);
        values.push(ak - (i * afa));
    }
    document.getElementById('ergebnis-anlagen').innerHTML = `<h3>Jährliche AfA: ${afa.toFixed(2)} €</h3>`;
    renderAfaChart('chartAnlagen', labels, values, 'Restbuchwert');
}

function calcGeo() {
    let ak = parseFloat(document.getElementById('ak-geo').value) || 0;
    let nd = parseInt(document.getElementById('nd-geo').value) || 1;
    let s = parseFloat(document.getElementById('satz-geo').value) / 100 || 0;
    let values = [ak]; let labels = ["J. 0"];
    let akt = ak;
    for(let i=1; i<=nd; i++) {
        akt -= (akt * s);
        labels.push("J. " + i);
        values.push(akt);
    }
    document.getElementById('ergebnis-geo').innerHTML = `<h3>Endwert: ${akt.toFixed(2)} €</h3>`;
    renderAfaChart('chartGeo', labels, values, 'Restbuchwert (Geo)');
}

function calcArith() {
    let ak = parseFloat(document.getElementById('ak-arith').value) || 0;
    let rw = parseFloat(document.getElementById('rw-arith').value) || 0;
    let nd = parseInt(document.getElementById('nd-arith').value) || 1;
    let sumG = (nd * (nd + 1)) / 2;
    let d = (ak - rw) / sumG;
    let values = [ak]; let labels = ["Start"];
    let akt = ak;
    for(let i=nd; i>=1; i--) {
        akt -= (i * d);
        labels.push("J. " + (nd - i + 1));
        values.push(akt);
    }
    document.getElementById('ergebnis-arith').innerHTML = `<h3>Degressionsbetrag (d): ${d.toFixed(2)} €</h3>`;
    renderAfaChart('chartArith', labels, values, 'Restbuchwert (Arith)');
}

function calcLeistung() {
    let ak = parseFloat(document.getElementById('ak-leistung').value) || 0;
    let rw = parseFloat(document.getElementById('rw-leistung').value) || 0;
    let ges = parseFloat(document.getElementById('ges-leistung').value) || 1;
    let akt = parseFloat(document.getElementById('akt-leistung').value) || 0;
    let afa = ((ak - rw) / ges) * akt;
    document.getElementById('ergebnis-leistung').innerHTML = `<h3>AfA dieses Jahr: ${afa.toFixed(2)} €</h3>`;
}

// --- 3. KAPITAL & ZINSEN ---

function calcZinsen() {
    let anl = parseFloat(document.getElementById('anl-vermoegen').value) || 0;
    let uml = parseFloat(document.getElementById('uml-vermoegen').value) || 0;
    let abz = parseFloat(document.getElementById('abzug-kapital').value) || 0;
    let z = parseFloat(document.getElementById('zins-satz').value) || 0;
    let kap = (anl + uml) - abz;
    document.getElementById('ergebnis-zinsen').innerHTML = `<h3>Kalk. Zinsen: ${(kap * (z / 100)).toLocaleString()} €</h3>`;
}

function calcWACC() {
    let ek = parseFloat(document.getElementById('ek').value) || 0;
    let fk = parseFloat(document.getElementById('fk').value) || 0;
    let rek = parseFloat(document.getElementById('rek').value) / 100 || 0;
    let rfk = parseFloat(document.getElementById('rfk').value) / 100 || 0;
    let s = parseFloat(document.getElementById('steuersatz').value) / 100 || 0;
    let gk = ek + fk;
    if(gk === 0) return;
    let wacc = (ek/gk * rek) + (fk/gk * rfk * (1 - s));
    document.getElementById('ergebnis-wacc').innerHTML = `<h3>WACC: ${(wacc * 100).toFixed(2)} %</h3>`;
}

function calcCAPM() {
    let rf = parseFloat(document.getElementById('rf').value) / 100 || 0;
    let rm = parseFloat(document.getElementById('rm').value) / 100 || 0;
    let b = parseFloat(document.getElementById('beta').value) || 0;
    let rek = rf + b * (rm - rf);
    document.getElementById('ergebnis-capm').innerHTML = `<h3>rEK: ${(rek * 100).toFixed(2)} %</h3>`;
}

// --- 4. DECKUNGSBEITRAG & NEON CHART ---

function calcDB() {
    let p = parseFloat(document.getElementById('vp').value) || 0;
    let kv = parseFloat(document.getElementById('kv').value) || 0;
    let kf = parseFloat(document.getElementById('kf').value) || 0;
    let ist = parseFloat(document.getElementById('ist-menge').value) || 0;
    
    let db = p - kv;
    let xBE = (db > 0) ? kf / db : 0;
    let erfolg = (db * ist) - kf;

    document.getElementById('ergebnis-db').innerHTML = `
        <table style="width:100%; border-collapse: collapse; margin-top: 15px; color: white;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #444;">Stück-Deckungsbeitrag:</td><td style="text-align:right;"><b>${db.toFixed(2)} €</b></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #444;">Break-Even-Menge:</td><td style="text-align:right;"><b>${Math.ceil(xBE)} Stück</b></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #444;">Betriebserfolg:</td><td style="text-align:right;"><b style="color:#3f3;">${erfolg.toLocaleString()} €</b></td></tr>
        </table>
    `;

    let maxM = Math.ceil(Math.max(ist, xBE) * 1.5);
    if (charts['dbChart']) charts['dbChart'].destroy();
    
    const ctx = document.getElementById('dbChart').getContext('2d');
    charts['dbChart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [0, maxM],
            datasets: [
                { label: 'Erlöse', data: [{x:0,y:0},{x:maxM,y:maxM*p}], borderColor: '#3f3', borderWidth: 3, pointRadius: 0 },
                { label: 'Kosten', data: [{x:0,y:kf},{x:maxM,y:kf+maxM*kv}], borderColor: '#f33', borderWidth: 3, pointRadius: 0 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { 
                x: { type: 'linear', grid: { color: '#444' }, ticks: { color: '#ccc' } },
                y: { grid: { color: '#444' }, ticks: { color: '#ccc' } }
            },
            plugins: { legend: { labels: { color: 'white' } } }
        }
    });
}

// --- 5. PROFI PDF EXPORT ---

function exportDBPDF() {
    if (!window.jspdf) {
        alert("Fehler: PDF-Bibliothek nicht geladen!");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const date = new Date().toLocaleDateString('de-DE');
    const canvas = document.getElementById('dbChart');

    if (!canvas || !charts['dbChart']) {
        alert("Bitte berechnen Sie zuerst die Werte!");
        return;
    }

    // Farben für Export auf Schwarz setzen (damit man auf Weiß was sieht)
    const activeChart = charts['dbChart'];
    const oldTickX = activeChart.options.scales.x.ticks.color;
    activeChart.options.scales.x.ticks.color = '#000000';
    activeChart.options.scales.y.ticks.color = '#000000';
    activeChart.options.plugins.legend.labels.color = '#000000';
    activeChart.update('none');

    const chartImg = canvas.toDataURL('image/png', 1.0);

    // Zurück auf Neon/Weiß für die App
    activeChart.options.scales.x.ticks.color = oldTickX;
    activeChart.options.scales.y.ticks.color = oldTickX;
    activeChart.options.plugins.legend.labels.color = 'white';
    activeChart.update('none');

    // PDF AUFBAU
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Wirtschaftlichkeitsanalyse", 15, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Erstellt am: ${date} | Modul: Deckungsbeitragsrechnung`, 15, 27);
    doc.line(15, 30, 195, 30);

    // Diagramm einfügen
    doc.addImage(chartImg, 'PNG', 15, 40, 180, 100);

    // Daten schreiben
    let currentY = 155;
    const vp = parseFloat(document.getElementById('vp').value) || 0;
    const kv = parseFloat(document.getElementById('kv').value) || 0;
    const kf = parseFloat(document.getElementById('kf').value) || 0;
    const ist = parseFloat(document.getElementById('ist-menge').value) || 0;
    const db = vp - kv;
    const xBE = (db > 0) ? kf / db : 0;
    const erfolg = (db * ist) - kf;

    // BLOCK 1: EINGABEWERTE
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204);
    doc.text("Eingabeparameter", 15, currentY);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    currentY += 10;

    const inputData = [
        ["Verkaufspreis pro Einheit:", vp.toFixed(2) + " €"],
        ["Variable Kosten pro Einheit:", kv.toFixed(2) + " €"],
        ["Fixkosten (Gesamtperiode):", kf.toLocaleString() + " €"],
        ["Geplante Absatzmenge:", ist.toLocaleString() + " Stk."]
    ];

    inputData.forEach(row => {
        doc.text(row[0], 20, currentY);
        doc.text(row[1], 110, currentY);
        currentY += 7;
    });

    // BLOCK 2: ANALYSE-ERGEBNISSE
    currentY += 12;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204);
    doc.text("Analyse-Ergebnisse", 15, currentY);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    currentY += 10;

    const resultData = [
        ["Stück-Deckungsbeitrag (db):", db.toFixed(2) + " €"],
        ["Gewinnschwelle (Break-Even):", Math.ceil(xBE) + " Stück"],
        ["Break-Even-Umsatz:", (xBE * vp).toLocaleString() + " €"],
        ["Sicherheitsabstand:", (((ist - xBE) / ist) * 100).toFixed(2) + " %"]
    ];

    resultData.forEach(row => {
        doc.text(row[0], 20, currentY);
        doc.text(row[1], 110, currentY);
        currentY += 7;
    });

    // HIGHLIGHT: BETRIERBSERFOLG
    currentY += 8;
    doc.setFillColor(242, 242, 242); 
    doc.rect(15, currentY, 180, 12, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Voraussichtlicher Betriebserfolg:", 20, currentY + 8);
    doc.text(erfolg.toLocaleString() + " €", 110, currentY + 8);

    doc.save(`Analysebericht_${date}.pdf`);
}

// Leert alle Eingabefelder beim Neuladen der Seite
window.addEventListener('load', () => {
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    console.log("Alle Eingabefelder wurden beim Start zurückgesetzt.");
});