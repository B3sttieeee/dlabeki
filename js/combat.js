// js/combat.js

// Baza przeciwników
const monsterList = [
    { name: "Goblin Zwiadowca", baseHp: 50, rewardMultiplier: 1 },
    { name: "Szkielet Wojownik", baseHp: 150, rewardMultiplier: 2.5 },
    { name: "Ork Rębacz", baseHp: 400, rewardMultiplier: 5 },
    { name: "Mroczny Kultysta", baseHp: 1000, rewardMultiplier: 12 },
    { name: "Mityczny Smok (BOSS)", baseHp: 5000, rewardMultiplier: 50 }
];

let currentMonsterIndex = 0;
let currentMonsterLevel = 1;
let monsterMaxHp = 50;
let monsterCurrentHp = 50;

function spawnMonster() {
    // Jeśli pokonamy wszystkie z listy, lecimy od nowa, ale potwory mają wyższy poziom (Level)
    if (currentMonsterIndex >= monsterList.length) {
        currentMonsterIndex = 0;
        currentMonsterLevel++;
    }

    const template = monsterList[currentMonsterIndex];
    
    // Obliczanie statystyk moba na podstawie jego poziomu
    monsterMaxHp = Math.floor(template.baseHp * Math.pow(1.5, currentMonsterLevel - 1));
    monsterCurrentHp = monsterMaxHp;

    // Aktualizacja interfejsu (w HTML trzeba by lekko poprawić wyświetlanie nazwy)
    document.querySelector('.monster-card h3').innerText = `${template.name} (Lv. ${currentMonsterLevel})`;
    updateHpBar();
    
    logToBattle(`🦇 Pojawił się: ${template.name}!`);
}

function attackMonster() {
    // Obrażenia to nasz stały dmg + lekka losowość (np. szansa na krytyka)
    let damage = window.playerDmg;
    
    // 10% szansy na cios krytyczny (2x obrażenia)
    const isCrit = Math.random() < 0.1;
    if (isCrit) {
        damage *= 2;
        logToBattle(`<span style="color: #ff5722;">💥 KRYTYK! Zadasz ${damage} DMG!</span>`);
    } else {
        // Zwykłe wahanie obrażeń +/- 10%
        const variance = Math.floor(damage * 0.1);
        damage = damage - variance + Math.floor(Math.random() * (variance * 2 + 1));
    }

    monsterCurrentHp -= damage;
    if (monsterCurrentHp <= 0) {
        monsterCurrentHp = 0;
        updateHpBar();
        monsterDefeated();
    } else {
        updateHpBar();
        // Animacja otrzymania ciosu przez potwora
        const card = document.querySelector('.monster-card');
        card.style.transform = 'translateX(5px)';
        setTimeout(() => { card.style.transform = 'translateX(-5px)'; }, 50);
        setTimeout(() => { card.style.transform = 'translateX(0)'; }, 100);
    }
}

function updateHpBar() {
    const percent = (monsterCurrentHp / monsterMaxHp) * 100;
    const bar = document.getElementById('monster-hp');
    bar.style.width = percent + '%';
    
    // Zmiana koloru paska, gdy potwór ma mało życia
    if (percent < 25) {
        bar.style.background = '#f44336'; // Czerwony
    } else if (percent < 50) {
        bar.style.background = '#ff9800'; // Pomarańczowy
    } else {
        bar.style.background = '#4caf50'; // Zielony
    }
}

function monsterDefeated() {
    const template = monsterList[currentMonsterIndex];
    // Złoto za pokonanie to stała wartość x mnożnik potwora x poziom
    const reward = Math.floor((Math.random() * 20 + 20) * template.rewardMultiplier * currentMonsterLevel);
    
    window.gold += reward;
    updateUI();
    saveGame();
    
    logToBattle(`🏆 Pokonano ${template.name}! Zdobywasz <span style="color:#ffd700">${reward} 🪙</span>`);
    
    currentMonsterIndex++;
    
    // Pojawienie się nowego potwora po 1 sekundzie
    setTimeout(() => {
        spawnMonster();
    }, 1000);
}

// Konieczne jest wywołanie pierwszego potwora przy starcie
// Musimy to podpiąć pod window.onload w core.js lub wywołać tu po załadowaniu skryptu
document.addEventListener('DOMContentLoaded', () => {
    spawnMonster();
});