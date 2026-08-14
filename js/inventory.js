/* =========================================================
   PLAYER INVENTORY / EQUIPMENT / FORGE SYSTEM
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       GLOBAL STATE
       ===================================================== */

    window.inventory = Array.isArray(window.inventory)
        ? window.inventory
        : [];

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

    window.playerMaxHp = Number(window.playerMaxHp) || 100;
    window.playerCurrentHp = Number(window.playerCurrentHp) || 100;

    let inspectedItem = null;

    /* =====================================================
       STORAGE
       ===================================================== */

    const STORAGE_KEYS = {
        inventory: "nasa_inv_v6",
        equipped: "nasa_eq_v6"
    };

    /* =====================================================
       EQUIPMENT
       ===================================================== */

    const EQUIPMENT_TYPES = [
        "head",
        "armor",
        "weapon",
        "amulet",
        "ring"
    ];

    const SLOT_ICONS = {
        head: "🪖",
        armor: "👕",
        weapon: "🗡️",
        amulet: "🧿",
        ring: "💍"
    };

    /* =====================================================
       BASIC HELPERS
       ===================================================== */

    function getGameData() {
        if (!window.gameData || typeof window.gameData !== "object") {
            window.gameData = {};
        }

        return window.gameData;
    }

    function getSkills() {
        const skills = getGameData().skills || {};

        return {
            dmg: safeNumber(skills.dmg),
            dps: safeNumber(skills.dps),
            hp: safeNumber(skills.hp),
            crit: safeNumber(skills.crit),
            lifesteal: safeNumber(skills.lifesteal)
        };
    }

    function safeNumber(value, fallback = 0) {
        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : fallback;
    }

    function clamp(value, min, max) {
        return Math.min(
            Math.max(value, min),
            max
        );
    }

    function getUniqueItemId() {
        return (
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 11)
        );
    }

    /* =====================================================
       ITEM HELPERS
       ===================================================== */

    function getUpgradeLevel(item) {
        return Math.max(
            0,
            Math.floor(
                safeNumber(item?.upgradeLevel, 0)
            )
        );
    }

    function getUpgradeMultiplier(item) {
        const level = getUpgradeLevel(item);

        /*
         * +10% bazowych statystyk za każdy poziom
         *
         * +0 = x1.00
         * +1 = x1.10
         * +2 = x1.20
         * +3 = x1.30
         */

        return 1 + (level * 0.10);
    }

    function getItemStat(item, stat) {
        if (!item) return 0;

        const baseValue = safeNumber(
            item[stat],
            0
        );

        if (baseValue <= 0) {
            return 0;
        }

        return Math.floor(
            baseValue *
            getUpgradeMultiplier(item)
        );
    }

    function getUpgradeCost(item) {
        const level = getUpgradeLevel(item);

        /*
         * Koszt:
         *
         * +1 = 500 gold / 10 iron
         * +2 = 1000 / 20
         * +3 = 1500 / 30
         */

        return {
            gold: 500 * (level + 1),
            iron: 10 * (level + 1)
        };
    }

    function normalizeItem(item) {
        if (!item || typeof item !== "object") {
            return null;
        }

        return {
            ...item,

            id: item.id ?? getUniqueItemId(),

            name:
                typeof item.name === "string"
                    ? item.name
                    : "Nieznany przedmiot",

            type:
                typeof item.type === "string"
                    ? item.type
                    : "weapon",

            tier:
                typeof item.tier === "string"
                    ? item.tier
                    : "tier-common",

            icon:
                typeof item.icon === "string"
                    ? item.icon
                    : "❔",

            upgradeLevel: Math.max(
                0,
                Math.floor(
                    safeNumber(
                        item.upgradeLevel,
                        0
                    )
                )
            ),

            dmgBonus: safeNumber(
                item.dmgBonus,
                0
            ),

            dpsBonus: safeNumber(
                item.dpsBonus,
                0
            ),

            hpBonus: safeNumber(
                item.hpBonus,
                0
            ),

            critBonus: safeNumber(
                item.critBonus,
                0
            ),

            lifestealBonus: safeNumber(
                item.lifestealBonus,
                0
            )
        };
    }

    /* =====================================================
       PLAYER / GAME HELPERS
       ===================================================== */

    function getPrestigeMultiplier() {
        const prestige = Math.max(
            0,
            safeNumber(
                getGameData().prestige,
                0
            )
        );

        /*
         * Każdy Prestige = +50%
         */

        return 1 + (prestige * 0.5);
    }

    function refreshPlayerUI() {
        if (
            typeof updateStatusUI ===
            "function"
        ) {
            updateStatusUI();
        }

        if (
            typeof renderInventory ===
            "function"
        ) {
            renderInventory();
        }
    }

    function notify(message) {
        if (
            typeof logMessage ===
            "function"
        ) {
            logMessage(message);
        }
    }

    /* =====================================================
       GIVE ITEM
       ===================================================== */

    function giveItem(item) {
        const newItem =
            normalizeItem(item);

        if (!newItem) {
            console.warn(
                "giveItem(): nieprawidłowy item.",
                item
            );

            return null;
        }

        /*
         * Każdy nowy item dostaje nowe ID
         */

        newItem.id =
            getUniqueItemId();

        /*
         * Wszystkie świeżo zdobyte itemy
         * zaczynają od +0
         */

        newItem.upgradeLevel = 0;

        window.inventory.push(
            newItem
        );

        saveInventory();
        renderInventory();

        return newItem;
    }

    /* =====================================================
       EQUIP ITEM
       ===================================================== */

    function equipItem(itemId) {

        const index =
            window.inventory.findIndex(
                item =>
                    String(item.id) ===
                    String(itemId)
            );

        if (index === -1) {
            console.warn(
                "Nie znaleziono itemu:",
                itemId
            );

            return false;
        }

        const item =
            window.inventory[index];

        if (
            !item.type ||
            !EQUIPMENT_TYPES.includes(
                item.type
            )
        ) {
            notify(
                "❌ Nieprawidłowy typ przedmiotu."
            );

            return false;
        }

        /*
         * Jeżeli slot był zajęty,
         * poprzedni item wraca do inventory
         */

        const oldItem =
            window.equipped[item.type];

        if (oldItem) {
            window.inventory.push(
                oldItem
            );
        }

        /*
         * Usuwamy nowy item z inventory
         */

        window.inventory.splice(
            index,
            1
        );

        /*
         * Zakładamy item
         */

        window.equipped[item.type] =
            item;

        inspectedItem = item;

        recalculatePlayerStats();
        saveInventory();
        renderInventory();
        inspectItem(item);

        notify(
            `✅ Założono: ${item.name}`
        );

        return true;
    }

    /* =====================================================
       UNEQUIP ITEM
       ===================================================== */

    function unequipItem(type) {

        if (
            !EQUIPMENT_TYPES.includes(
                type
            )
        ) {
            return false;
        }

        const item =
            window.equipped[type];

        if (!item) {
            return false;
        }

        /*
         * Przedmiot wraca do inventory
         */

        window.inventory.push(
            item
        );

        /*
         * Slot pusty
         */

        window.equipped[type] =
            null;

        if (
            inspectedItem &&
            inspectedItem.id === item.id
        ) {
            inspectedItem = null;
        }

        recalculatePlayerStats();
        saveInventory();
        renderInventory();

        notify(
            `↩️ Zdjęto: ${item.name}`
        );

        return true;
    }

    /* =====================================================
       RECALCULATE PLAYER STATS
       ===================================================== */

    function recalculatePlayerStats() {

        const gameData =
            getGameData();

        const skills =
            getSkills();

        /* -----------------------------------------------
           BASE STATS
           ----------------------------------------------- */

        let rawDmg =
            safeNumber(
                gameData.baseDmg,
                10
            ) +
            (
                skills.dmg *
                10
            );

        let rawDps =
            safeNumber(
                gameData.baseDps,
                0
            ) +
            skills.dps;

        let rawHp =
            100 +
            (
                skills.hp *
                20
            );

        let rawCrit =
            5 +
            (
                skills.crit *
                2
            );

        let rawLifesteal =
            skills.lifesteal;

        /* -----------------------------------------------
           EQUIPMENT
           ----------------------------------------------- */

        for (
            const type
            of EQUIPMENT_TYPES
        ) {

            const item =
                window.equipped[type];

            if (!item) {
                continue;
            }

            /*
             * DMG
             */

            rawDmg +=
                getItemStat(
                    item,
                    "dmgBonus"
                );

            /*
             * DPS
             */

            rawDps +=
                getItemStat(
                    item,
                    "dpsBonus"
                );

            /*
             * HP
             */

            rawHp +=
                getItemStat(
                    item,
                    "hpBonus"
                );

            /*
             * CRIT
             *
             * Crit nie jest mnożony
             * przez upgrade.
             */

            rawCrit +=
                safeNumber(
                    item.critBonus,
                    0
                );

            /*
             * LIFESTEAL
             *
             * Lifesteal nie jest mnożony
             * przez upgrade.
             */

            rawLifesteal +=
                safeNumber(
                    item.lifestealBonus,
                    0
                );
        }

        /* -----------------------------------------------
           PRESTIGE
           ----------------------------------------------- */

        const prestigeMultiplier =
            getPrestigeMultiplier();

        window.totalDmg =
            Math.max(
                0,
                Math.floor(
                    rawDmg *
                    prestigeMultiplier
                )
            );

        window.totalDps =
            Math.max(
                0,
                Math.floor(
                    rawDps *
                    prestigeMultiplier
                )
            );

        window.playerMaxHp =
            Math.max(
                1,
                Math.floor(
                    rawHp *
                    prestigeMultiplier
                )
            );

        window.totalCrit =
            clamp(
                Number(
                    rawCrit.toFixed(2)
                ),
                0,
                100
            );

        window.totalLifesteal =
            clamp(
                Number(
                    rawLifesteal.toFixed(2)
                ),
                0,
                100
            );

        /* -----------------------------------------------
           CURRENT HP
           ----------------------------------------------- */

        if (
            !Number.isFinite(
                window.playerCurrentHp
            )
        ) {
            window.playerCurrentHp =
                window.playerMaxHp;
        }

        window.playerCurrentHp =
            clamp(
                window.playerCurrentHp,
                0,
                window.playerMaxHp
            );

        /* -----------------------------------------------
           UI
           ----------------------------------------------- */

        updateAdvancedStatsUI();

        if (
            typeof updateStatusUI ===
            "function"
        ) {
            updateStatusUI();
        }
    }

    /* =====================================================
       ADVANCED STATS UI
       ===================================================== */

    function updateAdvancedStatsUI() {

        const panel =
            document.getElementById(
                "advanced-stats"
            );

        if (!panel) {
            return;
        }

        panel.innerHTML = `
            <span class="text-accent text-bold">
                SUMA STATYSTYK:
            </span>

            <br>

            Max HP:
            <span class="text-green">
                ${window.playerMaxHp}
            </span>

            <br>

            DMG:
            <span class="text-red">
                ${window.totalDmg}
            </span>

            <br>

            DPS:
            <span class="text-yellow">
                ${window.totalDps}
            </span>

            <br>

            Kryt:
            <span>
                ${window.totalCrit}%
            </span>

            <br>

            Lifesteal:
            <span>
                ${window.totalLifesteal}%
            </span>
        `;
    }

    /* =====================================================
       RENDER INVENTORY
       ===================================================== */

    function renderInventory() {

        /* -----------------------------------------------
           EQUIPMENT SLOTS
           ----------------------------------------------- */

        for (
            const type
            of EQUIPMENT_TYPES
        ) {

            const slot =
                document.getElementById(
                    `slot-${type}`
                );

            if (!slot) {
                continue;
            }

            const item =
                window.equipped[type];

            if (item) {

                slot.innerHTML =
                    item.icon ||
                    "❔";

                slot.className =
                    [
                        "gear-slot",
                        item.tier || ""
                    ]
                        .filter(Boolean)
                        .join(" ");

                /*
                 * Klik = inspect
                 *
                 * Nie zdejmujemy automatycznie.
                 */

                slot.onclick = () => {
                    inspectItem(item);
                };

                slot.title =
                    `${item.name} +${getUpgradeLevel(item)}`;

            } else {

                slot.innerHTML =
                    SLOT_ICONS[type];

                slot.className =
                    "gear-slot";

                slot.onclick =
                    null;

                slot.title =
                    "Pusty slot";
            }
        }

        /* -----------------------------------------------
           INVENTORY GRID
           ----------------------------------------------- */

        const grid =
            document.getElementById(
                "inventory-grid"
            );

        if (!grid) {
            return;
        }

        grid.innerHTML = "";

        if (
            !Array.isArray(
                window.inventory
            ) ||
            window.inventory.length === 0
        ) {

            grid.innerHTML = `
                <div class="inventory-empty text-dim">
                    🎒 Ekwipunek jest pusty.
                </div>
            `;

            return;
        }

        /*
         * Renderowanie itemów
         */

        window.inventory.forEach(
            item => {

                if (!item) {
                    return;
                }

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    [
                        "item-card",
                        item.tier || ""
                    ]
                        .filter(Boolean)
                        .join(" ");

                div.innerHTML = `
                    <div class="item-icon">
                        ${
                            item.icon ||
                            "❔"
                        }
                    </div>

                    ${
                        getUpgradeLevel(item) > 0
                            ? `
                                <div class="item-upgrade">
                                    +${getUpgradeLevel(item)}
                                </div>
                              `
                            : ""
                    }
                `;

                div.title =
                    item.name ||
                    "Przedmiot";

                /*
                 * Klik:
                 * inspect
                 */

                div.onclick = () => {
                    inspectItem(item);
                };

                /*
                 * Dwuklik:
                 * equip
                 */

                div.ondblclick = () => {
                    equipItem(item.id);
                };

                grid.appendChild(
                    div
                );
            }
        );
    }

    /* =====================================================
       INSPECT ITEM
       ===================================================== */

    function inspectItem(item) {

        inspectedItem =
            item || null;

        const panel =
            document.getElementById(
                "inspect-panel"
            );

        if (!panel) {
            return;
        }

        if (!item) {

            panel.innerHTML = `
                <p class="text-dim">
                    Wybierz przedmiot.
                </p>
            `;

            return;
        }

        const upgradeLevel =
            getUpgradeLevel(item);

        const multiplier =
            getUpgradeMultiplier(item);

        const cost =
            getUpgradeCost(item);

        const rarity =
            String(
                item.tier ||
                "tier-common"
            )
                .replace(
                    "tier-",
                    ""
                )
                .toUpperCase();

        /* -----------------------------------------------
           ITEM STATS
           ----------------------------------------------- */

        let stats = "";

        const dmg =
            getItemStat(
                item,
                "dmgBonus"
            );

        const dps =
            getItemStat(
                item,
                "dpsBonus"
            );

        const hp =
            getItemStat(
                item,
                "hpBonus"
            );

        const crit =
            safeNumber(
                item.critBonus,
                0
            );

        const lifesteal =
            safeNumber(
                item.lifestealBonus,
                0
            );

        if (dmg > 0) {

            stats += `
                <div>
                    DMG:
                    <span class="text-red">
                        +${dmg}
                    </span>
                </div>
            `;
        }

        if (dps > 0) {

            stats += `
                <div>
                    DPS:
                    <span class="text-yellow">
                        +${dps}
                    </span>
                </div>
            `;
        }

        if (hp > 0) {

            stats += `
                <div>
                    HP:
                    <span class="text-green">
                        +${hp}
                    </span>
                </div>
            `;
        }

        if (crit > 0) {

            stats += `
                <div>
                    Kryt:
                    <span>
                        +${crit}%
                    </span>
                </div>
            `;
        }

        if (lifesteal > 0) {

            stats += `
                <div>
                    Lifesteal:
                    <span>
                        +${lifesteal}%
                    </span>
                </div>
            `;
        }

        if (!stats) {

            stats = `
                <div class="text-dim">
                    Brak dodatkowych statystyk.
                </div>
            `;
        }

        /* -----------------------------------------------
           PANEL
           ----------------------------------------------- */

        panel.innerHTML = `

            <div class="inspect-icon ${item.tier || ""}">
                ${item.icon || "❔"}
            </div>

            <h3 class="${item.tier || ""} text-bold mb-10">
                ${item.name}

                ${
                    upgradeLevel > 0
                        ? ` +${upgradeLevel}`
                        : ""
                }
            </h3>

            <p class="text-dim mb-20">
                Rzadkość:
                ${rarity}
            </p>

            <div
                class="text-left mb-20"
                style="
                    background:#111;
                    padding:12px;
                    border:1px solid #333;
                    border-radius:8px;
                    line-height:1.8;
                "
            >
                ${stats}
            </div>

            <div class="text-dim mb-10">
                Mnożnik ulepszenia:
                ×${multiplier.toFixed(2)}
            </div>

            <div class="text-dim mb-15">
                Poziom ulepszenia:
                <strong>
                    +${upgradeLevel}
                </strong>
            </div>

            <button
                class="upgrade-btn"
                onclick="forgeItem()"
            >

                ⚒️ ULEPSZ

                ${
                    upgradeLevel > 0
                        ? ` (+${upgradeLevel + 1})`
                        : ""
                }

                <br>

                <span
                    class="text-dim"
                    style="font-size:0.9rem;"
                >
                    Koszt:
                    ${cost.gold} 🪙
                    |
                    ${cost.iron} 🔩
                </span>

            </button>

        `;
    }

    /* =====================================================
       FORGE / UPGRADE
       ===================================================== */

    function forgeItem() {

        if (!inspectedItem) {

            notify(
                "❌ Nie wybrano przedmiotu."
            );

            return false;
        }

        const item =
            inspectedItem;

        const gameData =
            getGameData();

        const upgradeLevel =
            getUpgradeLevel(item);

        const cost =
            getUpgradeCost(item);

        const gold =
            safeNumber(
                gameData.gold,
                0
            );

        const iron =
            safeNumber(
                gameData.iron,
                0
            );

        /* -----------------------------------------------
           CHECK GOLD
           ----------------------------------------------- */

        if (gold < cost.gold) {

            notify(
                `❌ Potrzebujesz ${cost.gold} 🪙.`
            );

            return false;
        }

        /* -----------------------------------------------
           CHECK IRON
           ----------------------------------------------- */

        if (iron < cost.iron) {

            notify(
                `❌ Potrzebujesz ${cost.iron} 🔩.`
            );

            return false;
        }

        /* -----------------------------------------------
           REMOVE RESOURCES
           ----------------------------------------------- */

        gameData.gold =
            gold -
            cost.gold;

        gameData.iron =
            iron -
            cost.iron;

        /* -----------------------------------------------
           UPGRADE
           ----------------------------------------------- */

        item.upgradeLevel =
            upgradeLevel + 1;

        /* -----------------------------------------------
           RECALCULATE
           ----------------------------------------------- */

        recalculatePlayerStats();

        /* -----------------------------------------------
           SAVE
           ----------------------------------------------- */

        saveInventory();

        /* -----------------------------------------------
           RENDER
           ----------------------------------------------- */

        renderInventory();
        inspectItem(item);

        if (
            typeof updateStatusUI ===
            "function"
        ) {
            updateStatusUI();
        }

        /* -----------------------------------------------
           LOG
           ----------------------------------------------- */

        notify(
            `⚒️ Kuźnia: ${item.name} ulepszony do +${item.upgradeLevel}!`
        );

        return true;
    }

    /* =====================================================
       SAVE INVENTORY
       ===================================================== */

    function saveInventory() {

        try {

            localStorage.setItem(
                STORAGE_KEYS.inventory,
                JSON.stringify(
                    window.inventory
                )
            );

            localStorage.setItem(
                STORAGE_KEYS.equipped,
                JSON.stringify(
                    window.equipped
                )
            );

            return true;

        } catch (error) {

            console.error(
                "Błąd zapisu ekwipunku:",
                error
            );

            notify(
                "❌ Nie udało się zapisać ekwipunku."
            );

            return false;
        }
    }

    /* =====================================================
       LOAD INVENTORY
       ===================================================== */

    function loadInventory() {

        try {

            const savedInventory =
                localStorage.getItem(
                    STORAGE_KEYS.inventory
                );

            const savedEquipped =
                localStorage.getItem(
                    STORAGE_KEYS.equipped
                );

            /* -------------------------------------------
               INVENTORY
               ------------------------------------------- */

            if (savedInventory) {

                const parsedInventory =
                    JSON.parse(
                        savedInventory
                    );

                if (
                    Array.isArray(
                        parsedInventory
                    )
                {

                    window.inventory =
                        parsedInventory
                            .map(
                                normalizeItem
                            )
                            .filter(Boolean);
                }
            }

            /* -------------------------------------------
               EQUIPPED
               ------------------------------------------- */

            if (savedEquipped) {

                const parsedEquipped =
                    JSON.parse(
                        savedEquipped
                    );

                if (
                    parsedEquipped &&
                    typeof parsedEquipped ===
                        "object"
                ) {

                    for (
                        const type
                        of EQUIPMENT_TYPES
                    ) {

                        window.equipped[type] =
                            normalizeItem(
                                parsedEquipped[type]
                            );
                    }
                }
            }

        } catch (error) {

            console.error(
                "Błąd ładowania ekwipunku:",
                error
            );

            /*
             * Bezpieczny fallback
             */

            window.inventory = [];

            window.equipped = {
                head: null,
                armor: null,
                weapon: null,
                amulet: null,
                ring: null
            };

            notify(
                "⚠️ Nie udało się wczytać ekwipunku."
            );
        }

        recalculatePlayerStats();
        renderInventory();
    }

    /* =====================================================
       CLEAR INVENTORY
       ===================================================== */

    function clearInventory() {

        window.inventory = [];

        window.equipped = {
            head: null,
            armor: null,
            weapon: null,
            amulet: null,
            ring: null
        };

        inspectedItem = null;

        saveInventory();

        recalculatePlayerStats();
        renderInventory();

        inspectItem(null);

        notify(
            "🗑️ Ekwipunek został wyczyszczony."
        );
    }

    /* =====================================================
       DROP ITEM
       ===================================================== */

    function removeItem(itemId) {

        const index =
            window.inventory.findIndex(
                item =>
                    String(item.id) ===
                    String(itemId)
            );

        if (index === -1) {
            return false;
        }

        const item =
            window.inventory[index];

        window.inventory.splice(
            index,
            1
        );

        if (
            inspectedItem &&
            inspectedItem.id === item.id
        ) {
            inspectedItem = null;
            inspectItem(null);
        }

        saveInventory();
        renderInventory();

        notify(
            `🗑️ Usunięto: ${item.name}`
        );

        return true;
    }

    /* =====================================================
       UNEQUIP ALL
       ===================================================== */

    function unequipAll() {

        for (
            const type
            of EQUIPMENT_TYPES
        ) {

            const item =
                window.equipped[type];

            if (item) {

                window.inventory.push(
                    item
                );

                window.equipped[type] =
                    null;
            }
        }

        inspectedItem = null;

        recalculatePlayerStats();
        saveInventory();
        renderInventory();
        inspectItem(null);

        notify(
            "↩️ Zdjęto cały ekwipunek."
        );
    }

    /* =====================================================
       GET TOTAL ITEM COUNT
       ===================================================== */

    function getInventoryCount() {

        return Array.isArray(
            window.inventory
        )
            ? window.inventory.length
            : 0;
    }

    /* =====================================================
       GET EQUIPPED COUNT
       ===================================================== */

    function getEquippedCount() {

        let count = 0;

        for (
            const type
            of EQUIPMENT_TYPES
        ) {

            if (
                window.equipped[type]
            ) {
                count++;
            }
        }

        return count;
    }

    /* =====================================================
       FIND ITEM
       ===================================================== */

    function findItem(itemId) {

        return (
            window.inventory.find(
                item =>
                    String(item.id) ===
                    String(itemId)
            ) ||
            null
        );
    }

    /* =====================================================
       GET EQUIPPED ITEM
       ===================================================== */

    function getEquippedItem(type) {

        if (
            !EQUIPMENT_TYPES.includes(
                type
            )
        ) {
            return null;
        }

        return (
            window.equipped[type] ||
            null
        );
    }

    /* =====================================================
       GET ITEM TOTAL POWER
       ===================================================== */

    function getItemPower(item) {

        if (!item) {
            return 0;
        }

        const dmg =
            getItemStat(
                item,
                "dmgBonus"
            );

        const dps =
            getItemStat(
                item,
                "dpsBonus"
            );

        const hp =
            getItemStat(
                item,
                "hpBonus"
            );

        const crit =
            safeNumber(
                item.critBonus
            );

        const lifesteal =
            safeNumber(
                item.lifestealBonus
            );

        /*
         * Prosty Power Score
         */

        return Math.floor(
            dmg +
            (dps * 1.2) +
            (hp * 0.15) +
            (crit * 10) +
            (lifesteal * 12)
        );
    }

    /* =====================================================
       AUTO EQUIP BEST ITEM
       ===================================================== */

    function autoEquipBest(type) {

        if (
            !EQUIPMENT_TYPES.includes(
                type
            )
        ) {
            return false;
        }

        const available =
            window.inventory.filter(
                item =>
                    item &&
                    item.type === type
            );

        if (
            available.length === 0
        ) {

            notify(
                `❌ Brak przedmiotów typu: ${type}.`
            );

            return false;
        }

        available.sort(
            (
                a,
                b
            ) =>
                getItemPower(b) -
                getItemPower(a)
        );

        return equipItem(
            available[0].id
        );
    }

    /* =====================================================
       DEBUG / TEST ITEM
       ===================================================== */

    function createTestItem(
        type = "weapon",
        name = "Testowy Miecz"
    ) {

        const testItem = {

            name: name,

            type: type,

            tier: "tier-epic",

            icon:
                type === "weapon"
                    ? "🗡️"
                    : type === "head"
                    ? "🪖"
                    : type === "armor"
                    ? "👕"
                    : type === "amulet"
                    ? "🧿"
                    : "💍",

            dmgBonus:
                type === "weapon"
                    ? 50
                    : 0,

            dpsBonus:
                type === "weapon"
                    ? 10
                    : 0,

            hpBonus:
                type === "armor"
                    ? 100
                    : type === "head"
                    ? 50
                    : 0,

            critBonus:
                type === "ring"
                    ? 5
                    : type === "weapon"
                    ? 2
                    : 0,

            lifestealBonus:
                type === "amulet"
                    ? 3
                    : 0,

            upgradeLevel: 0
        };

        return giveItem(
            testItem
        );
    }

    /* =====================================================
       GLOBAL EXPORTS
       ===================================================== */

    window.giveItem =
        giveItem;

    window.equipItem =
        equipItem;

    window.unequipItem =
        unequipItem;

    window.recalculatePlayerStats =
        recalculatePlayerStats;

    window.renderInventory =
        renderInventory;

    window.inspectItem =
        inspectItem;

    window.forgeItem =
        forgeItem;

    window.saveInventory =
        saveInventory;

    window.loadInventory =
        loadInventory;

    window.clearInventory =
        clearInventory;

    window.removeItem =
        removeItem;

    window.unequipAll =
        unequipAll;

    window.findItem =
        findItem;

    window.getEquippedItem =
        getEquippedItem;

    window.getInventoryCount =
        getInventoryCount;

    window.getEquippedCount =
        getEquippedCount;

    window.getItemPower =
        getItemPower;

    window.autoEquipBest =
        autoEquipBest;

    window.createTestItem =
        createTestItem;

    /* =====================================================
       INITIALIZATION
       ===================================================== */

    loadInventory();

})();