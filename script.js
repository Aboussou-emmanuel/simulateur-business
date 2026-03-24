// 1. "Base de données" des secteurs avec marges et exemples concrets
const businessData = {
    "e-commerce": {
        margin: 0.35, // 35% de marge nette moyenne
        fixedCosts: 45000, // Frais de livraison, pub, emballage
        avgTicket: 15000,
        suggestions: [
            { minCap: 0, activity: "Dropshipping de gadgets tech ou accessoires de mode." },
            { minCap: 500000, activity: "Vente de mèches ou de vêtements avec stock local à Abidjan." },
            { minCap: 2000000, activity: "Marque de cosmétiques personnalisée (Private Label)." }
        ]
    },
    "service": {
        margin: 0.85, // Très peu de charges variables
        fixedCosts: 25000, // Internet, abonnements logiciels
        avgTicket: 60000,
        suggestions: [
            { minCap: 0, activity: "Freelance en Design UI/UX ou Développement Web." },
            { minCap: 300000, activity: "Agence de Social Media Management avec petite équipe." },
            { minCap: 1000000, activity: "Cabinet de conseil en stratégie digitale pour PME." }
        ]
    },
    "restauration": {
        margin: 0.45,
        fixedCosts: 120000, // Loyer, gaz, électricité
        avgTicket: 4500,
        suggestions: [
            { minCap: 0, activity: "Vente de repas en ligne (Cloud Kitchen) via WhatsApp." },
            { minCap: 800000, activity: "Ouverture d'un kiosque moderne (Fast-food) de quartier." },
            { minCap: 5000000, activity: "Restaurant physique avec service en salle et livraison." }
        ]
    }
};

// 2. Fonction principale de calcul
function updateSimulation() {
    // Récupération des données du formulaire
    const budget = parseFloat(document.getElementById('budget').value) || 0;
    const type = document.getElementById('business-type').value;
    const volume = parseInt(document.getElementById('sales-volume').value);

    // Mise à jour de l'affichage du volume (curseur)
    document.getElementById('sales-value').innerText = volume;

    const config = businessData[type];

    // Calculs financiers
    const chiffreAffaire = volume * config.avgTicket;
    const chargesVariables = chiffreAffaire * (1 - config.margin);
    const profitMensuel = chiffreAffaire - chargesVariables - config.fixedCosts;

    // Affichage du profit avec formatage monétaire
    const profitEl = document.getElementById('monthly-profit');
    profitEl.innerText = new Intl.NumberFormat('fr-FR').format(profitMensuel) + " FCFA";

    // Couleur du profit (rouge si négatif)
    profitEl.style.color = profitMensuel > 0 ? "#10b981" : "#ef4444";

    // Calcul du ROI (Délai de rentabilité)
    const roiEl = document.getElementById('roi-delay');
    if (profitMensuel > 0) {
        const mois = Math.ceil(budget / profitMensuel);
        roiEl.innerText = mois + " mois";
        generateAdvice(budget, config, profitMensuel);
    } else {
        roiEl.innerText = "Jamais";
        document.getElementById('advice-box').innerHTML = "<strong>Attention :</strong> Vos charges sont plus élevées que vos revenus. Augmentez le volume de ventes !";
    }
}

// 3. Fonction pour générer le conseil d'activité précis
function generateAdvice(budget, config, profit) {
    let activityFound = "Projet générique";

    // On parcourt les suggestions pour trouver la plus adaptée au budget
    // On trie par capital minimum du plus grand au plus petit
    const sortedSuggestions = config.suggestions.sort((a, b) => b.minCap - a.minCap);

    for (let item of sortedSuggestions) {
        if (budget >= item.minCap) {
            activityFound = item.activity;
            break;
        }
    }

    const adviceBox = document.getElementById('advice-box');
    adviceBox.innerHTML = `
        <p>💡 <strong>Activité recommandée :</strong> ${activityFound}</p>
        <p style="margin-top:10px; font-size: 0.85rem; color: #94a3b8;">
            Avec un bénéfice de ${new Intl.NumberFormat('fr-FR').format(profit)} FCFA, 
            c'est une option solide pour votre budget.
        </p>
    `;
}

// 4. Écouteurs d'événements (Mise à jour automatique)
document.getElementById('budget').addEventListener('input', updateSimulation);
document.getElementById('business-type').addEventListener('change', updateSimulation);
document.getElementById('sales-volume').addEventListener('input', updateSimulation);

// Lancement d'un calcul initial à vide
updateSimulation();