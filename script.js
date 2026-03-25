// DONNÉES DES SECTEURS
const businessData = {
    "e-commerce": {
        margin: 0.35,
        fixedCosts: 45000,
        avgTicket: 15000,
        suggestions: [
            { minCap: 0, activity: "Vente d'accessoires via WhatsApp & réseaux sociaux." },
            { minCap: 300000, activity: "E-commerce avec stock de vêtements ou cosmétiques." },
            { minCap: 1500000, activity: "Création d'une marque propre (Private Label) Import-Export." }
        ]
    },
    "service": {
        margin: 0.85,
        fixedCosts: 20000,
        avgTicket: 50000,
        suggestions: [
            { minCap: 0, activity: "Freelance Design / Community Management." },
            { minCap: 200000, activity: "Agence de services digitaux pour PME locales." },
            { minCap: 1000000, activity: "Cabinet de conseil ou formation spécialisée." }
        ]
    },
    "restauration": {
        margin: 0.45,
        fixedCosts: 150000,
        avgTicket: 4000,
        suggestions: [
            { minCap: 0, activity: "Cuisine à domicile (Cloud Kitchen) sur commande." },
            { minCap: 600000, activity: "Kiosque de fast-food moderne ou Food-truck." },
            { minCap: 4000000, activity: "Restaurant physique avec salle climatisée." }
        ]
    }
};

// ÉLÉMENTS DU DOM
const startBtn = document.getElementById('start-btn');
const simulatorSection = document.getElementById('simulateur');
const budgetInput = document.getElementById('budget');
const typeSelect = document.getElementById('business-type');
const volumeInput = document.getElementById('sales-volume');
const volumeValue = document.getElementById('sales-value');

// 1. GESTION DE L'AFFICHAGE DU SIMULATEUR
startBtn.addEventListener('click', () => {
    simulatorSection.style.display = 'block';
    simulatorSection.classList.add('fade-in');

    // Scroll fluide
    simulatorSection.scrollIntoView({ behavior: 'smooth' });

    // Désactivation du bouton pour éviter les doublons
    startBtn.innerText = "Simulateur Actif";
    startBtn.style.opacity = "0.5";
    startBtn.style.pointerEvents = "none";
});

// 2. FONCTION DE CALCUL
function calculate() {
    const budget = parseFloat(budgetInput.value) || 0;
    const type = typeSelect.value;
    const volume = parseInt(volumeInput.value);

    // Maj affichage curseur
    volumeValue.innerText = volume;

    const data = businessData[type];

    // Formules
    const ca = volume * data.avgTicket;
    const profit = (ca * data.margin) - data.fixedCosts;

    // Affichage Profit
    const profitEl = document.getElementById('monthly-profit');
    profitEl.innerText = new Intl.NumberFormat('fr-FR').format(Math.round(profit)) + " FCFA";
    profitEl.style.color = profit > 0 ? "#10b981" : "#ef4444";

    // Affichage ROI
    const roiEl = document.getElementById('roi-delay');
    if (profit > 0) {
        const mois = Math.ceil(budget / profit);
        roiEl.innerText = mois + " mois";
        updateAdvice(budget, data, profit);
    } else {
        roiEl.innerText = "N/A";
        document.getElementById('advice-box').innerHTML = "🚨 <strong>Attention :</strong> Le volume de ventes est trop faible pour couvrir vos charges fixes.";
    }
}

// 3. GÉNÉRATION DU CONSEIL PERSONNALISÉ
function updateAdvice(budget, data, profit) {
    let bestMatch = data.suggestions[0].activity;

    // On trie pour prendre la plus grosse activité possible avec le budget
    const sorted = [...data.suggestions].sort((a, b) => b.minCap - a.minCap);

    for (let item of sorted) {
        if (budget >= item.minCap) {
            bestMatch = item.activity;
            break;
        }
    }

    document.getElementById('advice-box').innerHTML = `
        <p>💡 <strong>Opportunité identifiée :</strong> ${bestMatch}</p>
        <p style="margin-top:10px; font-size: 0.85rem; color: #94a3b8;">
            Ce modèle permet d'atteindre votre seuil de rentabilité rapidement avec vos ressources actuelles.
        </p>
    `;
}

// ÉCOUTEURS
[budgetInput, typeSelect, volumeInput].forEach(el => {
    el.addEventListener('input', calculate);
});

// Initialisation au chargement
calculate();