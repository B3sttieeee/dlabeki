// js/combat.js

const enemyNames = ["Cyber-Zwiadowca", "Zainfekowany Mechanik", "Strażnik Rdzenia", "Opancerzony Behemot", "Wirujący Koszmar"];
let enemyHp = 100;
let enemyMaxHp = 100;
let enemyDmg = 10;
let dungeonLevel = 1;
let enemyAttackTimer = 0;

function spawnMonster() {
    dungeonLevel = window.gameData.highestDungeon;
    
    // Skalowanie na GRIND (Mnożnik x1.15 na poziom, rośnie do absurdalnych wartości z czasem)
    const scaleFactor = Math.pow(1.15, dungeonLevel - 1);
    
    enemyMaxHp = Math.floor(100 * scaleFactor);
    enemyHp = enemyMaxHp;
    
    // Wróg bije coraz mocniej
    enemyDmg = Math.floor(8 * scaleFactor);

    const randomName = enemyNames[(dungeonLevel - 1) % enemyNames.length];
    const isBoss = dungeonLevel % 10 === 0;
    
    if (isBoss) {
        enemyMaxHp *= 3; 
        enemyHp = enemyMaxHp;
        enemyDmg *= 1.5;
    }

    const displayLevel = isBoss ? `BOSS LVL.${dungeonLevel}` : `LVL.${dungeonLevel}`;
    const displayName = isBoss ? `☠️ ${randomName} ☠️` : randomName;

    document.getElementById('dungeon-level').innerText = displayLevel;
    document.getElementById('monster-name').innerText = displayName;
    document.getElementById('monster-name').style.color = isBoss ? '#ef4444' : '#fbbf24';
    
    updateEnemyHpUI();
}

function playerAttack() {
    if(window.isDead) return;
    dealDamageToEnemy(window.totalDmg, true);
}

function autoAttack(dps) {
    if (enemyHp > 0 && !window.isDead) dealDamageToEnemy(dps, false);
}

// WRÓG ATAKUJE
function enemyAttack() {
    enemyAttackTimer++;
    // Wróg bije co 2 sekundy (2 "tyki" interwału z core.js)
    if (enemyAttackTimer >= 2 && enemyHp > 0) {
        enemyAttackTimer = 0;
        
        // Wahadło obrażeń wroga +/- 15%
        let finalHit = Math.floor(enemyDmg * (0.85 + Math.random() * 0.3));
        if (finalHit < 1) finalHit = 1;
        
        damagePlayer(finalHit);
        
        // Wizualny efekt na ekranie gdy obrywasz
        if(!window.isDead) {
            document.body.style.boxShadow = "inset 0 0 50px rgba(239, 68, 68, 0.4)";
            setTimeout(() => document.body.style.boxShadow = "none", 150);
        }
    }
}

function dealDamageToEnemy(amount, isManualClick) {
    if (enemyHp <= 0) return; 

    let finalDmg = amount;
    let isCrit = false;
    
    if (isManualClick && Math.random() < (window.totalCrit / 100)) {
        finalDmg = Math.floor(finalDmg * 2.5); // Krytyk to x2.5 DMG!
        isCrit = true;
    }

    enemyHp -= finalDmg;
    
    // LIFESTEAL (Leczenie gracza)
    if (window.totalLifesteal > 0 && isManualClick) {
        let healAmount = finalDmg * (window.totalLifesteal / 100);
        healPlayer(healAmount);
    }

    if (isManualClick) {
        const msg = isCrit ? `<span class="text-purple text-bold">💥 KRYTYK! Zadasz ${finalDmg} DMG!</span>` : `Zadajesz ${finalDmg} DMG.`;
        logMessage(msg);
    }

    if (enemyHp <= 0) {
        enemyHp = 0;
        updateEnemyHpUI();
        defeatMonster();
    } else {
        updateEnemyHpUI();
        if (isManualClick) playHitAnimation();
    }
}

function updateEnemyHpUI() {
    const percent = Math.max(0, (enemyHp / enemyMaxHp) * 100);
    document.getElementById('monster-hp').style.width = percent + '%';
    document.getElementById('current-hp').innerText = Math.floor(enemyHp);
    document.getElementById('max-hp').innerText = Math.floor(enemyMaxHp);
}

function playHitAnimation() {
    const card = document.querySelector('.target-lock');
    card.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
    setTimeout(() => card.style.transform = 'translate(0, 0)', 50);
}

function defeatMonster() {
    // EXP
    const expGain = Math.floor(20 * Math.pow(1.2, dungeonLevel - 1));
    gainExp(expGain);

    // ZŁOTO
    const reward = Math.floor((Math.random() * 20 + 30) * Math.pow(1.2, dungeonLevel - 1));
    window.gameData.gold += reward;
    updateStatsUI();
    
    logMessage(`🏆 Cel Zniszczony! Zdobywasz <span class="text-gold">${reward} 🪙</span> oraz ${expGain} EXP.`);
    
    window.gameData.highestDungeon++;
    saveGame(); 

    setTimeout(() => {
        spawnMonster();
    }, 1000);
}