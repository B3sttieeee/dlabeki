/* =========================================================
   PIXEL REALMS ONLINE
   INVENTORY / EQUIPMENT / FORGE SYSTEM
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       GLOBAL STATE
       ===================================================== */
    window.inventory = Array.isArray(window.inventory) ? window.inventory : [];
    window.equipped = {
        head: null,
        armor: null,
        weapon: null,
        amulet: null,
        ring: null,
        ...(window.equipped || {})
    };

    window.totalDmg = Number(window.totalDmg) || 10;
    window.totalDps = Number(window.totalDps) || 0;
    window.totalCrit = Number(window.totalCrit) || 5;
    window.totalLifesteal = Number(window.totalLifesteal) || 0;
    window.totalArmor = Number(window.totalArmor) || 0;
    window.totalDodge = Number(window.totalDodge) || 0;
    window.totalAttackSpeed = Number(window.totalAttackSpeed) || 0;
    window.totalGoldBonus = Number(window.totalGoldBonus) || 0;
    window.totalExpBonus = Number(window.totalExpBonus) || 0;
    window.totalBossDamage = Number(window.totalBossDamage) || 0;
    window.totalLootBonus = Number(window.totalLootBonus) || 0;
    window.playerMaxHp = Number(window.playerMaxHp) || 100;
    window.playerCurrentHp = Number(window.playerCurrentHp) || 100;

    let inspectedItem = null;

    /* =====================================================
       STORAGE
       ===================================================== */
    const STORAGE_KEYS = {
        inventory: "pixel_realms_inventory_v1",
        equipped: "pixel_realms_equipped_v1",
        legacyInventory: "nasa_inv_v6",
        legacyEquipped: "nasa_eq_v6"
    };

    /* =====================================================
       EQUIPMENT TYPES
       ===================================================== */
    const EQUIPMENT_TYPES = ["head", "armor", "weapon", "amulet", "ring"];

    const SLOT_ICONS = {
        head: "🪖",
        armor: "🛡️",
        weapon: "⚔️",
        amulet: "🧿",
        ring: "💍"
    };

    /* =====================================================
       RARITY
       ===================================================== */
    const RARITY_INFO = {
        "tier-common": { name: "COMMON", color: "var(--text-dim)", upgradeBonus: 1.10 },
        "tier-rare": { name: "RARE", color: "var(--blue)", upgradeBonus: 1.11 },
        "tier-epic": { name: "EPIC", color: "var(--xp-purple)", upgradeBonus: 1.12 },
        "tier-legendary": { name: "LEGENDARY", color: "var(--gold)", upgradeBonus: 1.13 },
        "tier-mythic": { name: "MYTHIC", color: "var(--hp-red)", upgradeBonus: 1.15 }
    };

    const SCALABLE_STATS = ["dmgBonus", "dpsBonus", "hpBonus", "critBonus", "lifestealBonus", "armorBonus", "dodgeBonus", "attackSpeedBonus", "goldBonus", "expBonus", "bossDamageBonus", "lootBonus"];
    const INTEGER_STATS = ["dmgBonus", "dpsBonus", "hpBonus", "armorBonus", "goldBonus", "expBonus", "bossDamageBonus", "lootBonus"];

    /* =====================================================
       HELPERS
       ===================================================== */
    function safeNumber(value, fallback = 0) {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function getGameData() {
        if (!window.gameData || typeof window.gameData !== "object") {
            window.gameData = {};
        }
        return window.gameData;
    }

    function notify(message) {
        if (typeof window.logMessage === "function") {
            window.logMessage(message);
        } else {
            console.log(message);
        }
    }

    function getUniqueItemId() {
        return Date.now() + "_" + Math.random().toString(36).slice(2, 12);
    }

    function getUpgradeLevel(item) {
        return Math.max(0, Math.floor(safeNumber(item?.upgradeLevel, 0)));
    }

    function getRarityInfo(item) {
        return RARITY_INFO[item?.tier] || RARITY_INFO["tier-common"];
    }

    function getRarityName(item) {
        return getRarityInfo(item).name;
    }

    function getRarityUpgradeMultiplier(item) {
        if (item?.upgradeData?.baseIncrease) {
            return safeNumber(item.upgradeData.baseIncrease, getRarityInfo(item).upgradeBonus);
        }
        return getRarityInfo(item).upgradeBonus;
    }

    function getUpgradeMultiplier(item) {
        const level = getUpgradeLevel(item);
        if (level <= 0) return 1;
        const perLevel = getRarityUpgradeMultiplier(item);
        return Math.pow(perLevel, level);
    }

    function getItemStat(item, stat) {
        if (!item) return 0;
        const value = safeNumber(item[stat], 0);
        if (value <= 0) return 0;
        const multiplier = getUpgradeMultiplier(item);
        const result = value * multiplier;

        if (INTEGER_STATS.includes(stat)) {
            return Math.floor(result);
        }
        return Number(result.toFixed(2));
    }

    function getRawItemStat(item, stat) {
        if (!item) return 0;
        return safeNumber(item[stat], 0);
    }

    function getUpgradeCost(item) {
        const level = getUpgradeLevel(item);
        const rarity = item?.tier || "tier-common";

        const rarityMultiplier = {
            "tier-common": 1,
            "tier-rare": 1.5,
            "tier-epic": 2.5,
            "tier-legendary": 4,
            "tier-mythic": 7
        }[rarity] || 1;

        const levelMultiplier = Math.pow(1.32, level);
        const gold = Math.floor((250 * rarityMultiplier) * levelMultiplier);
        const iron = Math.max(5, Math.floor((8 * rarityMultiplier) * (1 + level * 0.28)));
        const mithril = level >= 10 ? Math.floor((level - 8) * 0.5) : 0;

        return { gold, iron, mithril };
    }

    function getMaxUpgrade(item) {
        return Math.max(1, Math.floor(safeNumber(item?.upgradeData?.maxLevel, 50)));
    }

    function normalizeItem(item) {
        if (!item || typeof item !== "object") return null;

        const normalized = {
            ...item,
            id: item.id ?? getUniqueItemId(),
            name: typeof item.name === "string" ? item.name : "Nieznany przedmiot",
            displayName: typeof item.displayName === "string" ? item.displayName : (typeof item.name === "string" ? item.name : "Nieznany przedmiot"),
            type: typeof item.type === "string" ? item.type : "weapon",
            slot: typeof item.slot === "string" ? item.slot : (typeof item.type === "string" ? item.type : "weapon"),
            tier: typeof item.tier === "string" ? item.tier : "tier-common",
            icon: typeof item.icon === "string" ? item.icon : "❔",
            upgradeLevel: Math.max(0, Math.floor(safeNumber(item.upgradeLevel, 0))),
            quality: safeNumber(item.quality, 1),
            qualityPercent: safeNumber(item.qualityPercent, Math.floor(safeNumber(item.quality, 1) * 100)),
            power: safeNumber(item.power, 0),
            dmgBonus: safeNumber(item.dmgBonus, 0),
            dpsBonus: safeNumber(item.dpsBonus, 0),
            hpBonus: safeNumber(item.hpBonus, 0),
            critBonus: safeNumber(item.critBonus, 0),
            lifestealBonus: safeNumber(item.lifestealBonus, 0),
            armorBonus: safeNumber(item.armorBonus, 0),
            dodgeBonus: safeNumber(item.dodgeBonus, 0),
            attackSpeedBonus: safeNumber(item.attackSpeedBonus, 0),
            goldBonus: safeNumber(item.goldBonus, 0),
            expBonus: safeNumber(item.expBonus, 0),
            bossDamageBonus: safeNumber(item.bossDamageBonus, 0),
            lootBonus: safeNumber(item.lootBonus, 0),
            affixes: Array.isArray(item.affixes) ? item.affixes : []
        };

        if (!normalized.upgradeData || typeof normalized.upgradeData !== "object") {
            normalized.upgradeData = {
                maxLevel: 50,
                baseIncrease: getRarityUpgradeMultiplier(normalized),
                scalableStats: [...SCALABLE_STATS]
            };
        } else {
            normalized.upgradeData = {
                maxLevel: safeNumber(normalized.upgradeData.maxLevel, 50),
                baseIncrease: safeNumber(normalized.upgradeData.baseIncrease, getRarityUpgradeMultiplier(normalized)),
                scalableStats: Array.isArray(normalized.upgradeData.scalableStats) ? normalized.upgradeData.scalableStats : [...SCALABLE_STATS]
            };
        }

        normalized.power = calculateItemPower(normalized);
        return normalized;
    }

    /* =====================================================
       ITEM POWER
       ===================================================== */
    function calculateItemPower(item) {
        if (!item) return 0;
        let power = 0;

        power += getItemStat(item, "dmgBonus");
        power += getItemStat(item, "dpsBonus") * 1.35;
        power += getItemStat(item, "hpBonus") * 0.10;
        power += getItemStat(item, "critBonus") * 25;
        power += getItemStat(item, "lifestealBonus") * 30;
        power += getItemStat(item, "armorBonus") * 2;
        power += getItemStat(item, "dodgeBonus") * 18;
        power += getItemStat(item, "attackSpeedBonus") * 14;
        power += getItemStat(item, "goldBonus") * 7;
        power += getItemStat(item, "expBonus") * 7;
        power += getItemStat(item, "bossDamageBonus") * 12;
        power += getItemStat(item, "lootBonus") * 10;

        const quality = safeNumber(item.quality, 1);
        power *= Math.max(0.5, quality);

        const upgrade = getUpgradeLevel(item);
        power *= Math.pow(1.02, upgrade);

        return Math.floor(power);
    }

    function getPrestigeMultiplier() {
        const prestige = Math.max(0, safeNumber(getGameData().prestige, 0));
        return 1 + prestige * 0.5;
    }

    /* =====================================================
       INVENTORY ACTIONS
       ===================================================== */
    function giveItem(item) {
        const normalized = normalizeItem(item);
        if (!normalized) {
            console.warn("giveItem(): invalid item", item);
            return null;
        }

        normalized.id = getUniqueItemId();
        normalized.upgradeLevel = 0;
        normalized.power = calculateItemPower(normalized);

        window.inventory.push(normalized);
        saveInventory();
        renderInventory();
        updateInventoryCounter();

        return normalized;
    }

    function equipItem(itemId) {
        const index = window.inventory.findIndex(item => String(item.id) === String(itemId));
        if (index === -1) {
            notify("❌ Nie znaleziono przedmiotu.");
            return false;
        }

        const item = window.inventory[index];
        const slotType = item.slot || item.type;

        if (!EQUIPMENT_TYPES.includes(slotType)) {
            notify("❌ Ten przedmiot nie może być wyposażony.");
            return false;
        }

        const oldItem = window.equipped[slotType];
        if (oldItem) window.inventory.push(oldItem);

        window.inventory.splice(index, 1);
        window.equipped[slotType] = item;
        inspectedItem = item;

        recalculatePlayerStats();
        saveInventory();
        renderInventory();
        inspectItem(item);

        notify(`✅ Założono: ${item.displayName || item.name}`);
        return true;
    }

    function unequipItem(type) {
        if (!EQUIPMENT_TYPES.includes(type)) return false;
        const item = window.equipped[type];
        if (!item) return false;

        window.inventory.push(item);
        window.equipped[type] = null;

        if (inspectedItem && inspectedItem.id === item.id) inspectedItem = null;

        recalculatePlayerStats();
        saveInventory();
        renderInventory();
        updateInventoryCounter();

        notify(`↩️ Zdjęto: ${item.displayName || item.name}`);
        return true;
    }

    function unequipAll() {
        for (const type of EQUIPMENT_TYPES) {
            if (window.equipped[type]) {
                window.inventory.push(window.equipped[type]);
                window.equipped[type] = null;
            }
        }
        inspectedItem = null;
        recalculatePlayerStats();
        saveInventory();
        renderInventory();
        inspectItem(null);
        notify("↩️ Zdjęto całe wyposażenie.");
    }

    /* =====================================================
       RECALCULATE PLAYER STATS
       ===================================================== */
    function recalculatePlayerStats() {
        const g = getGameData();
        const skills = g.skills || {};

        let rawDmg = safeNumber(g.baseDmg, 10) + (safeNumber(skills.dmg) * 10);
        let rawDps = safeNumber(g.baseDps, 0);
        let rawHp = 100 + (safeNumber(skills.hp) * 20);
        let rawCrit = 5 + (safeNumber(skills.crit) * 2);
        let rawLifesteal = safeNumber(skills.lifesteal, 0);
        let rawArmor = 0;
        let rawDodge = 0;
        let rawAttackSpeed = 0;
        let rawGoldBonus = 0;
        let rawExpBonus = 0;
        let rawBossDamage = 0;
        let rawLootBonus = 0;

        for (const type of EQUIPMENT_TYPES) {
            const item = window.equipped[type];
            if (!item) continue;

            rawDmg += getItemStat(item, "dmgBonus");
            rawDps += getItemStat(item, "dpsBonus");
            rawHp += getItemStat(item, "hpBonus");
            rawCrit += getItemStat(item, "critBonus");
            rawLifesteal += getItemStat(item, "lifestealBonus");
            rawArmor += getItemStat(item, "armorBonus");
            rawDodge += getItemStat(item, "dodgeBonus");
            rawAttackSpeed += getItemStat(item, "attackSpeedBonus");
            rawGoldBonus += getItemStat(item, "goldBonus");
            rawExpBonus += getItemStat(item, "expBonus");
            rawBossDamage += getItemStat(item, "bossDamageBonus");
            rawLootBonus += getItemStat(item, "lootBonus");
        }

        const prestige = getPrestigeMultiplier();
        rawDmg *= prestige;
        rawDps *= prestige;
        rawHp *= prestige;

        window.totalDmg = Math.max(1, Math.floor(rawDmg));
        window.totalDps = Math.max(0, Math.floor(rawDps));
        window.playerMaxHp = Math.max(1, Math.floor(rawHp));
        window.totalCrit = clamp(Number(rawCrit.toFixed(2)), 0, 100);
        window.totalLifesteal = clamp(Number(rawLifesteal.toFixed(2)), 0, 100);
        window.totalArmor = Math.max(0, Number(rawArmor.toFixed(2)));
        window.totalDodge = clamp(Number(rawDodge.toFixed(2)), 0, 75);
        window.totalAttackSpeed = Number(rawAttackSpeed.toFixed(2));
        window.totalGoldBonus = Math.max(0, Number(rawGoldBonus.toFixed(2)));
        window.totalExpBonus = Math.max(0, Number(rawExpBonus.toFixed(2)));
        window.totalBossDamage = Math.max(0, Number(rawBossDamage.toFixed(2)));
        window.totalLootBonus = Math.max(0, Number(rawLootBonus.toFixed(2)));

        if (!Number.isFinite(window.playerCurrentHp)) window.playerCurrentHp = window.playerMaxHp;
        window.playerCurrentHp = clamp(window.playerCurrentHp, 0, window.playerMaxHp);

        updateAdvancedStatsUI();
        if (typeof window.updateStatusUI === "function") window.updateStatusUI();
        updateCombatStatsUI();
    }

    function updateCombatStatsUI() {
        const values = {
            "combat-dmg": Math.floor(window.totalDmg),
            "combat-dps": Math.floor(window.totalDps),
            "combat-crit": `${window.totalCrit}%`,
            "combat-lifesteal": `${window.totalLifesteal}%`
        };

        Object.entries(values).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    }

    function updateAdvancedStatsUI() {
        const panel = document.getElementById("advanced-stats");
        if (!panel) return;

        panel.innerHTML = `
            <div>❤️ HP: <strong style="float:right;color:var(--hp-red);">${Math.floor(window.playerMaxHp)}</strong></div>
            <div>⚔ DMG: <strong style="float:right;color:var(--text-main);">${Math.floor(window.totalDmg)}</strong></div>
            <div>⚡ DPS: <strong style="float:right;color:var(--iron);">${Math.floor(window.totalDps)}</strong></div>
            <div>🎯 KRYT: <strong style="float:right;color:var(--gold);">${window.totalCrit}%</strong></div>
            <div>🩸 LIFESTEAL: <strong style="float:right;color:var(--hp-red);">${window.totalLifesteal}%</strong></div>
            <div>🛡 ARMOR: <strong style="float:right;color:var(--iron);">${window.totalArmor}</strong></div>
            <div>💨 DODGE: <strong style="float:right;color:var(--mithril);">${window.totalDodge}%</strong></div>
            <div>⚡ ATK SPEED: <strong style="float:right;color:var(--gold);">+${window.totalAttackSpeed}%</strong></div>
            <div>🪙 GOLD: <strong style="float:right;color:var(--gold);">+${window.totalGoldBonus}%</strong></div>
            <div>✨ EXP: <strong style="float:right;color:var(--xp-purple);">+${window.totalExpBonus}%</strong></div>
            <div>☠ BOSS: <strong style="float:right;color:var(--hp-red);">+${window.totalBossDamage}%</strong></div>
            <div>🎁 LOOT: <strong style="float:right;color:var(--mithril);">+${window.totalLootBonus}%</strong></div>
            <div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--panel-border);">
                ✦ PRESTIŻ: <strong style="float:right;color:var(--xp-purple);">+${safeNumber(getGameData().prestige) * 50}%</strong>
            </div>
        `;
    }

    /* =====================================================
       RENDER INVENTORY
       ===================================================== */
    function renderInventory() {
        for (const type of EQUIPMENT_TYPES) {
            const slot = document.getElementById(`slot-${type}`);
            if (!slot) continue;

            const item = window.equipped[type];
            if (item) {
                slot.innerHTML = `
                    <span>${item.icon || "❔"}</span>
                    <small style="position:absolute; right:3px; bottom:3px; color:var(--gold); font-size:10px; background:#000; padding:2px 4px; border:1px solid var(--panel-border);">+${getUpgradeLevel(item)}</small>
                `;
                slot.className = ["equipment-slot", item.tier || ""].filter(Boolean).join(" ");
                slot.title = `${item.displayName || item.name} | Power ${item.power || 0}`;
                slot.onclick = () => inspectItem(item);
            } else {
                slot.innerHTML = SLOT_ICONS[type];
                slot.className = "equipment-slot";
                slot.title = "Pusty slot";
                slot.onclick = null;
            }
        }

        const grid = document.getElementById("inventory-grid");
        if (!grid) return;

        grid.innerHTML = "";
        updateInventoryCounter();

        if (!window.inventory.length) {
            grid.innerHTML = `
                <div class="inventory-empty" style="grid-column: 1 / -1; text-align:center; padding:40px 0; color:var(--text-dim);">
                    <div style="font-size:48px; margin-bottom:10px;">🎒</div>
                    <strong style="display:block; margin-bottom:5px; font-family:var(--font-pixel); font-size:10px;">PLECAK JEST PUSTY</strong>
                    <span style="font-size:16px;">Otwórz skrzynię, aby zdobyć przedmiot.</span>
                </div>
            `;
            return;
        }

        window.inventory.forEach(item => {
            if (!item) return;

            const div = document.createElement("div");
            div.className = ["item-card", item.tier || ""].filter(Boolean).join(" ");
            div.dataset.itemId = item.id;
            
            // Stylizacja samej komórki
            div.style.background = "#0d121c";
            div.style.border = "2px solid " + getRarityInfo(item).color;
            div.style.height = "60px";
            div.style.display = "flex";
            div.style.alignItems = "center";
            div.style.justifyContent = "center";
            div.style.position = "relative";
            div.style.cursor = "pointer";

            if (safeNumber(item.quality, 1) >= 1.15) div.classList.add("high-quality");

            div.innerHTML = `
                <div style="font-size:34px;">${item.icon || "❔"}</div>
                ${getUpgradeLevel(item) > 0 ? `<div style="position:absolute; right:2px; bottom:2px; font-size:10px; color:var(--gold); background:#000; padding:1px 3px;">+${getUpgradeLevel(item)}</div>` : ""}
                ${item.affixes?.length ? `<div style="position:absolute; left:2px; top:2px; font-size:8px; color:var(--gold);">◆</div>` : ""}
            `;

            div.title = `${item.displayName || item.name}\n${getRarityName(item)}\nPower: ${item.power || 0}\nQuality: ${item.qualityPercent || 100}%`;
            div.onclick = () => inspectItem(item);
            div.ondblclick = () => equipItem(item.id);
            grid.appendChild(div);
        });
    }

    function updateInventoryCounter() {
        const counter = document.getElementById("inventory-count");
        if (counter) counter.textContent = window.inventory.length;
    }

    /* =====================================================
       INSPECT ITEM
       ===================================================== */
    function inspectItem(item) {
        inspectedItem = item || null;
        const panel = document.getElementById("inspect-panel");
        if (!panel) return;

        if (!item) {
            panel.innerHTML = `
                <div class="empty-state">
                    <div style="font-size:50px; margin-bottom:10px;">🔨</div>
                    <strong style="display:block; font-family:var(--font-pixel); font-size:10px; margin-bottom:10px;">NIE WYBRANO PRZEDMIOTU</strong>
                    <span style="font-size:16px;">Kliknij przedmiot w plecaku.</span>
                </div>
            `;
            return;
        }

        const level = getUpgradeLevel(item);
        const maxLevel = getMaxUpgrade(item);
        const rarity = getRarityName(item);
        const color = getRarityInfo(item).color;
        const cost = getUpgradeCost(item);
        const currentMultiplier = getUpgradeMultiplier(item);
        const nextMultiplier = getRarityUpgradeMultiplier(item);
        const power = calculateItemPower(item);

        const statRows = [];
        addStatRow(statRows, "⚔", "DMG", getItemStat(item, "dmgBonus"), "var(--text-main)");
        addStatRow(statRows, "⚡", "DPS", getItemStat(item, "dpsBonus"), "var(--iron)");
        addStatRow(statRows, "❤️", "HP", getItemStat(item, "hpBonus"), "var(--hp-red)");
        addStatRow(statRows, "🎯", "KRYT", getItemStat(item, "critBonus"), "var(--gold)", "%");
        addStatRow(statRows, "🩸", "LIFESTEAL", getItemStat(item, "lifestealBonus"), "var(--hp-red)", "%");
        addStatRow(statRows, "🛡", "ARMOR", getItemStat(item, "armorBonus"), "var(--iron)");
        addStatRow(statRows, "💨", "DODGE", getItemStat(item, "dodgeBonus"), "var(--mithril)", "%");
        addStatRow(statRows, "⚡", "ATK SPEED", getItemStat(item, "attackSpeedBonus"), "var(--gold)", "%");
        addStatRow(statRows, "🪙", "GOLD", getItemStat(item, "goldBonus"), "var(--gold)", "%");
        addStatRow(statRows, "✨", "EXP", getItemStat(item, "expBonus"), "var(--xp-purple)", "%");
        addStatRow(statRows, "☠", "BOSS DMG", getItemStat(item, "bossDamageBonus"), "var(--hp-red)", "%");
        addStatRow(statRows, "🎁", "LOOT", getItemStat(item, "lootBonus"), "var(--mithril)", "%");

        const nextStats = getUpgradePreview(item);

        let affixHtml = "";
        if (Array.isArray(item.affixes) && item.affixes.length) {
            affixHtml = `
                <div style="margin-top:12px; padding-top:10px; border-top:1px dashed var(--panel-border);">
                    <div style="font-family:var(--font-pixel); font-size:8px; color:var(--text-dim); margin-bottom:7px;">SPECJALNE BONUSY</div>
                    ${item.affixes.map(affix => `<div style="color:var(--gold); margin-bottom:4px; font-size:16px;">◆ ${affix.name}</div>`).join("")}
                </div>
            `;
        }

        let buttonHtml = isMax ? 
            `<button class="pixel-button secondary" disabled style="width:100%; margin-top:10px; opacity:0.5;">★ MAKSYMALNY POZIOM ★</button>` : 
            `<button class="pixel-button gold" onclick="forgeItem()" style="width:100%; margin-top:10px;">
                🔨 ULEPSZ DO +${level + 1}<br>
                <span style="font-family:var(--font-text); font-size:16px; margin-top:5px; display:block;">
                    ${cost.gold} 🪙 | ${cost.iron} 🔩 ${cost.mithril > 0 ? `| ${cost.mithril} 💎` : ""}
                </span>
            </button>`;

        panel.innerHTML = `
            <div style="text-align:center; border-bottom:2px solid var(--panel-border); padding-bottom:15px; margin-bottom:15px;">
                <div style="font-size:60px; margin-bottom:10px;">${item.icon}</div>
                <div style="color:${color}; font-family:var(--font-pixel); font-size:12px; margin-bottom:5px;">
                    ${item.displayName || item.name} ${level > 0 ? `+${level}` : ""}
                </div>
                <div style="color:${color}; font-family:var(--font-pixel); font-size:8px;">${rarity}</div>
                
                <div style="margin-top:10px; font-size:18px; color:var(--text-dim);">
                    POWER: <strong style="color:var(--gold);">${power}</strong>
                </div>
                <div style="font-size:16px; color:var(--text-dim);">
                    JAKOŚĆ: <strong style="color:${getQualityColor(item.qualityPercent)};">${item.qualityPercent}%</strong>
                </div>
            </div>

            <div style="text-align:left; font-size:18px;">
                ${statRows.join("")}
                ${affixHtml}
            </div>

            <div style="padding:10px; background:rgba(0,0,0,0.3); border:2px solid var(--panel-border); margin:15px 0; font-size:16px; text-align:left;">
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:var(--text-dim);">ULEPSZENIE</span>
                    <strong style="color:var(--gold);">+${level} / +${maxLevel}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:5px;">
                    <span style="color:var(--text-dim);">BONUS / LV</span>
                    <strong style="color:var(--green);">+${((nextMultiplier - 1) * 100).toFixed(0)}%</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:5px;">
                    <span style="color:var(--text-dim);">AKTUALNY MNOŻNIK</span>
                    <strong style="color:var(--mithril);">×${currentMultiplier.toFixed(2)}</strong>
                </div>
            </div>

            ${nextStats ? `
                <div style="padding:10px; border:2px dashed var(--green); background:rgba(46, 204, 113, 0.05); margin-bottom:15px; font-size:16px; text-align:left;">
                    <div style="font-family:var(--font-pixel); font-size:8px; color:var(--green); margin-bottom:10px;">NASTĘPNY POZIOM</div>
                    ${renderUpgradePreview(nextStats)}
                </div>
            ` : ""}

            ${buttonHtml}

            <button class="pixel-button secondary" style="width:100%; margin-top:10px;" onclick="autoEquipBest('${item.slot || item.type}')">
                ⚔ ZAŁÓŻ NAJLEPSZY ${String(item.slot || item.type).toUpperCase()}
            </button>
        `;
    }

    function addStatRow(rows, icon, name, value, color, suffix = "") {
        if (safeNumber(value, 0) <= 0) return;
        rows.push(`
            <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid rgba(255,255,255,.05);">
                <span>${icon} ${name}</span>
                <strong style="color:${color};">+${value}${suffix}</strong>
            </div>
        `);
    }

    function getQualityColor(quality) {
        const q = safeNumber(quality, 100);
        if (q >= 115) return "var(--hp-red)";
        if (q >= 105) return "var(--gold)";
        if (q >= 95) return "var(--green)";
        if (q >= 90) return "var(--blue)";
        return "var(--text-dim)";
    }

    function getUpgradePreview(item) {
        if (!item) return null;
        const level = getUpgradeLevel(item);
        const max = getMaxUpgrade(item);
        if (level >= max) return null;

        const multiplier = getRarityUpgradeMultiplier(item);
        const preview = {};

        SCALABLE_STATS.forEach(stat => {
            const current = getItemStat(item, stat);
            if (current <= 0) return;
            const next = current * multiplier;
            preview[stat] = {
                current,
                next: INTEGER_STATS.includes(stat) ? Math.floor(next) : Number(next.toFixed(2))
            };
        });

        return preview;
    }

    function renderUpgradePreview(preview) {
        const names = {
            dmgBonus: ["⚔", "DMG", "var(--text-main)"],
            dpsBonus: ["⚡", "DPS", "var(--iron)"],
            hpBonus: ["❤️", "HP", "var(--hp-red)"],
            critBonus: ["🎯", "KRYT", "var(--gold)"],
            lifestealBonus: ["🩸", "LIFESTEAL", "var(--hp-red)"],
            armorBonus: ["🛡", "ARMOR", "var(--iron)"],
            dodgeBonus: ["💨", "DODGE", "var(--mithril)"],
            attackSpeedBonus: ["⚡", "ATK SPEED", "var(--gold)"],
            goldBonus: ["🪙", "GOLD", "var(--gold)"],
            expBonus: ["✨", "EXP", "var(--xp-purple)"],
            bossDamageBonus: ["☠", "BOSS DMG", "var(--hp-red)"],
            lootBonus: ["🎁", "LOOT", "var(--mithril)"]
        };

        return Object.entries(preview).map(([stat, data]) => {
            const info = names[stat];
            if (!info) return "";
            const isPercent = ["critBonus", "lifestealBonus", "dodgeBonus", "attackSpeedBonus", "goldBonus", "expBonus", "bossDamageBonus", "lootBonus"].includes(stat);
            const suffix = isPercent ? "%" : "";

            return `
                <div style="display:flex; justify-content:space-between; margin-top:4px;">
                    <span>${info[0]} ${info[1]}</span>
                    <span>
                        <span style="color:var(--text-dim); text-decoration:line-through; margin-right:5px;">${data.current}${suffix}</span>
                        → <strong style="color:${info[2]};">${data.next}${suffix}</strong>
                    </span>
                </div>
            `;
        }).join("");
    }

    /* =====================================================
       FORGE ITEM
       ===================================================== */
    function forgeItem() {
        if (!inspectedItem) {
            notify("❌ Nie wybrano przedmiotu.");
            return false;
        }

        const item = inspectedItem;
        const gameData = getGameData();
        const currentLevel = getUpgradeLevel(item);
        const maxLevel = getMaxUpgrade(item);

        if (currentLevel >= maxLevel) {
            notify("★ Ten przedmiot ma maksymalny poziom.");
            return false;
        }

        const cost = getUpgradeCost(item);
        const gold = safeNumber(gameData.gold, 0);
        const iron = safeNumber(gameData.iron, 0);
        const mithril = safeNumber(gameData.mithril, 0);

        if (gold < cost.gold) { notify(`❌ Potrzebujesz ${cost.gold} 🪙.`); return false; }
        if (iron < cost.iron) { notify(`❌ Potrzebujesz ${cost.iron} 🔩.`); return false; }
        if (mithril < cost.mithril) { notify(`❌ Potrzebujesz ${cost.mithril} 💎.`); return false; }

        let success = false;
        if (typeof window.applyLootUpgrade === "function") {
            success = window.applyLootUpgrade(item);
        } else {
            const multiplier = getRarityUpgradeMultiplier(item);
            SCALABLE_STATS.forEach(stat => {
                const current = safeNumber(item[stat], 0);
                if (current <= 0) return;
                const next = current * multiplier;
                item[stat] = INTEGER_STATS.includes(stat) ? Math.floor(next) : Number(next.toFixed(2));
            });
            item.upgradeLevel = currentLevel + 1;
            item.power = calculateItemPower(item);
            success = true;
        }

        if (!success) {
            notify("❌ Nie udało się ulepszyć przedmiotu.");
            return false;
        }

        gameData.gold = gold - cost.gold;
        gameData.iron = iron - cost.iron;
        gameData.mithril = mithril - cost.mithril;

        recalculatePlayerStats();
        saveInventory();
        if (typeof window.saveGame === "function") window.saveGame();

        renderInventory();
        updateInventoryCounter();
        inspectItem(item);
        if (typeof window.updateStatusUI === "function") window.updateStatusUI();

        notify(`🔨 ${item.displayName || item.name} ulepszony do +${item.upgradeLevel}!`);
        return true;
    }

    /* =====================================================
       REMOVE / SALVAGE / COMPARE / SORT (Narzędzia)
       ===================================================== */
    function removeItem(itemId) {
        const index = window.inventory.findIndex(item => String(item.id) === String(itemId));
        if (index === -1) return false;
        const item = window.inventory[index];
        window.inventory.splice(index, 1);
        if (inspectedItem && inspectedItem.id === item.id) inspectItem(null);

        saveInventory();
        renderInventory();
        updateInventoryCounter();
        notify(`🗑️ Usunięto: ${item.displayName || item.name}`);
        return true;
    }

    function salvageItem(itemId) {
        const index = window.inventory.findIndex(item => String(item.id) === String(itemId));
        if (index === -1) return false;

        const item = window.inventory[index];
        const level = getUpgradeLevel(item);
        const power = calculateItemPower(item);

        const gold = Math.max(10, Math.floor(power * 0.25));
        const iron = Math.max(1, Math.floor(5 + level * 2));

        window.inventory.splice(index, 1);
        const g = getGameData();
        g.gold = safeNumber(g.gold) + gold;
        g.iron = safeNumber(g.iron) + iron;

        if (inspectedItem && inspectedItem.id === item.id) inspectItem(null);

        saveInventory();
        renderInventory();
        updateInventoryCounter();
        if (typeof window.updateStatusUI === "function") window.updateStatusUI();

        notify(`♻️ Rozmontowano ${item.displayName || item.name}: +${gold} 🪙 +${iron} 🔩`);
        return true;
    }

    function sortInventory(mode = "power") {
        const rarityOrder = { "tier-common": 0, "tier-rare": 1, "tier-epic": 2, "tier-legendary": 3, "tier-mythic": 4 };

        if (mode === "name") {
            window.inventory.sort((a, b) => String(a.displayName || a.name).localeCompare(String(b.displayName || b.name), "pl"));
        } else if (mode === "rarity") {
            window.inventory.sort((a, b) => (rarityOrder[b.tier] || 0) - (rarityOrder[a.tier] || 0));
        } else if (mode === "level") {
            window.inventory.sort((a, b) => getUpgradeLevel(b) - getUpgradeLevel(a));
        } else {
            window.inventory.sort((a, b) => calculateItemPower(b) - calculateItemPower(a));
        }

        renderInventory();
        saveInventory();
    }

    function compareItems(newItem, oldItem) {
        if (!newItem) return null;
        const result = {};
        SCALABLE_STATS.forEach(stat => {
            const newValue = getItemStat(newItem, stat);
            const oldValue = oldItem ? getItemStat(oldItem, stat) : 0;
            result[stat] = newValue - oldValue;
        });
        result.power = calculateItemPower(newItem) - (oldItem ? calculateItemPower(oldItem) : 0);
        return result;
    }

    function autoEquipBest(type) {
        if (!EQUIPMENT_TYPES.includes(type)) {
            notify("❌ Nieprawidłowy slot.");
            return false;
        }

        const available = window.inventory.filter(item => item && (item.slot === type || item.type === type));
        if (available.length === 0) {
            notify(`❌ Nie masz itemu dla slotu ${type}.`);
            return false;
        }

        available.sort((a, b) => calculateItemPower(b) - calculateItemPower(a));
        return equipItem(available[0].id);
    }

    function findItem(itemId) {
        return window.inventory.find(item => String(item.id) === String(itemId)) || null;
    }

    function getEquippedItem(type) {
        if (!EQUIPMENT_TYPES.includes(type)) return null;
        return window.equipped[type] || null;
    }

    function getInventoryCount() {
        return Array.isArray(window.inventory) ? window.inventory.length : 0;
    }

    function getEquippedCount() {
        return EQUIPMENT_TYPES.filter(type => Boolean(window.equipped[type])).length;
    }

    /* =====================================================
       MIGRATION FROM OLD SAVE
       ===================================================== */
    function migrateLegacySave() {
        const newInventory = localStorage.getItem(STORAGE_KEYS.inventory);
        const newEquipped = localStorage.getItem(STORAGE_KEYS.equipped);

        if (newInventory || newEquipped) return;

        const oldInventory = localStorage.getItem(STORAGE_KEYS.legacyInventory);
        const oldEquipped = localStorage.getItem(STORAGE_KEYS.legacyEquipped);

        if (oldInventory) {
            try {
                const parsed = JSON.parse(oldInventory);
                if (Array.isArray(parsed)) {
                    window.inventory = parsed.map(normalizeItem).filter(Boolean);
                }
            } catch (error) { console.warn("Nie udało się zmigrować starego inventory.", error); }
        }

        if (oldEquipped) {
            try {
                const parsed = JSON.parse(oldEquipped);
                if (parsed && typeof parsed === "object") {
                    for (const type of EQUIPMENT_TYPES) {
                        window.equipped[type] = normalizeItem(parsed[type]);
                    }
                }
            } catch (error) { console.warn("Nie udało się zmigrować starego equipment.", error); }
        }

        saveInventory();
    }

    /* =====================================================
       LOAD & SAVE
       ===================================================== */
    function saveInventory() {
        try {
            localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(window.inventory));
            localStorage.setItem(STORAGE_KEYS.equipped, JSON.stringify(window.equipped));
            return true;
        } catch (error) {
            console.error("Błąd zapisu inventory:", error);
            notify("❌ Nie udało się zapisać ekwipunku.");
            return false;
        }
    }

    function loadInventory() {
        migrateLegacySave();

        try {
            const savedInventory = localStorage.getItem(STORAGE_KEYS.inventory);
            const savedEquipped = localStorage.getItem(STORAGE_KEYS.equipped);

            if (savedInventory) {
                const parsed = JSON.parse(savedInventory);
                if (Array.isArray(parsed)) window.inventory = parsed.map(normalizeItem).filter(Boolean);
            }

            if (savedEquipped) {
                const parsed = JSON.parse(savedEquipped);
                if (parsed && typeof parsed === "object") {
                    for (const type of EQUIPMENT_TYPES) {
                        window.equipped[type] = normalizeItem(parsed[type]);
                    }
                }
            }
        } catch (error) {
            console.error("Błąd ładowania inventory:", error);
            window.inventory = [];
            window.equipped = { head: null, armor: null, weapon: null, amulet: null, ring: null };
            notify("⚠️ Uszkodzony zapis ekwipunku. Utworzono pusty plecak.");
        }

        // --- FIRST BOOT TEST ITEMS (Generuje itemy jeśli masz absolutnie pusty zapis) ---
        if (window.inventory.length === 0 && !window.equipped.weapon) {
            createTestItem("weapon", "Zardzewiały Miecz");
            createTestItem("armor", "Skórzana Kurta");
        }

        recalculatePlayerStats();
        renderInventory();
        updateInventoryCounter();
    }

    function clearInventory() {
        const accepted = window.confirm("Usunąć cały ekwipunek?");
        if (!accepted) return false;

        window.inventory = [];
        window.equipped = { head: null, armor: null, weapon: null, amulet: null, ring: null };
        inspectedItem = null;

        saveInventory();
        recalculatePlayerStats();
        renderInventory();
        inspectItem(null);
        updateInventoryCounter();

        notify("🗑️ Ekwipunek został wyczyszczony.");
        return true;
    }

    /* =====================================================
       DEBUG ITEM
       ===================================================== */
    function createTestItem(type = "weapon", name = "Testowy Przedmiot") {
        const icons = { head: "🪖", armor: "🛡️", weapon: "⚔️", amulet: "🧿", ring: "💍" };

        const item = normalizeItem({
            name,
            displayName: name,
            icon: icons[type] || "❔",
            type,
            slot: type,
            tier: "tier-epic",
            quality: 1.05,
            qualityPercent: 105,
            dmgBonus: type === "weapon" ? 150 : type === "ring" ? 30 : 0,
            dpsBonus: type === "weapon" ? 25 : type === "amulet" ? 30 : 0,
            hpBonus: type === "armor" ? 500 : type === "head" ? 250 : 0,
            critBonus: type === "weapon" ? 3 : type === "ring" ? 5 : 0,
            lifestealBonus: type === "amulet" ? 3 : type === "ring" ? 2 : 0,
            armorBonus: type === "armor" ? 30 : type === "head" ? 15 : 0,
            dodgeBonus: type === "ring" ? 3 : 0,
            attackSpeedBonus: type === "weapon" ? 3 : 0,
            goldBonus: type === "ring" ? 5 : 0,
            expBonus: type === "amulet" ? 5 : 0,
            bossDamageBonus: type === "weapon" ? 5 : 0,
            lootBonus: type === "ring" ? 5 : 0,
            upgradeLevel: 0,
            affixes: [{ id: "debug_affix", name: "Furia Bojowa", rarity: "offensive" }]
        });

        return giveItem(item);
    }

    /* =====================================================
       GLOBAL EXPORTS
       ===================================================== */
    window.giveItem = giveItem;
    window.equipItem = equipItem;
    window.unequipItem = unequipItem;
    window.unequipAll = unequipAll;
    window.recalculatePlayerStats = recalculatePlayerStats;
    window.renderInventory = renderInventory;
    window.inspectItem = inspectItem;
    window.forgeItem = forgeItem;
    window.saveInventory = saveInventory;
    window.loadInventory = loadInventory;
    window.clearInventory = clearInventory;
    window.removeItem = removeItem;
    window.findItem = findItem;
    window.getEquippedItem = getEquippedItem;
    window.getInventoryCount = getInventoryCount;
    window.getEquippedCount = getEquippedCount;
    window.getItemPower = calculateItemPower;
    window.autoEquipBest = autoEquipBest;
    window.compareItems = compareItems;
    window.sortInventory = sortInventory;
    window.salvageItem = salvageItem;
    window.createTestItem = createTestItem;

    /* =====================================================
       INITIAL LOAD
       ===================================================== */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => { loadInventory(); }, { once: true });
    } else {
        loadInventory();
    }
})();
