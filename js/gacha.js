/* =========================================================
   D&E // TERMINAL V6
   GACHA / LOOT SYSTEM
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       LOOT TABLE
       ===================================================== */

    const lootTable = [

        {
            name: "Zardzewiały Sztylet",
            icon: "🗡️",
            type: "weapon",
            tier: "tier-common",
            dropChance: 25,
            dmgBonus: 15,
            hpBonus: 0,
            dpsBonus: 0,
            critBonus: 0,
            lifestealBonus: 0
        },

        {
            name: "Skórzana Kurta",
            icon: "🧥",
            type: "armor",
            tier: "tier-common",
            dropChance: 20,
            dmgBonus: 0,
            hpBonus: 50,
            dpsBonus: 0,
            critBonus: 0,
            lifestealBonus: 0
        },

        {
            name: "Stalowy Miecz",
            icon: "⚔️",
            type: "weapon",
            tier: "tier-rare",
            dropChance: 15,
            dmgBonus: 40,
            hpBonus: 0,
            dpsBonus: 5,
            critBonus: 0,
            lifestealBonus: 0
        },

        {
            name: "Kolczuga Strażnika",
            icon: "🛡️",
            type: "armor",
            tier: "tier-rare",
            dropChance: 15,
            dmgBonus: 10,
            hpBonus: 150,
            dpsBonus: 0,
            critBonus: 0,
            lifestealBonus: 0
        },

        {
            name: "Oko Proroka",
            icon: "🧿",
            type: "amulet",
            tier: "tier-rare",
            dropChance: 10,
            dmgBonus: 0,
            hpBonus: 100,
            dpsBonus: 30,
            critBonus: 2,
            lifestealBonus: 0
        },

        {
            name: "Ostrze Mrozu",
            icon: "❄️",
            type: "weapon",
            tier: "tier-epic",
            dropChance: 7,
            dmgBonus: 150,
            hpBonus: 0,
            dpsBonus: 15,
            critBonus: 3,
            lifestealBonus: 0
        },

        {
            name: "Pancerz Cienia",
            icon: "🥋",
            type: "armor",
            tier: "tier-epic",
            dropChance: 5,
            dmgBonus: 40,
            hpBonus: 600,
            dpsBonus: 0,
            critBonus: 0,
            lifestealBonus: 1
        },

        {
            name: "Wampiryczny Sygnet",
            icon: "💍",
            type: "ring",
            tier: "tier-epic",
            dropChance: 1.5,
            dmgBonus: 30,
            hpBonus: 0,
            dpsBonus: 0,
            critBonus: 4,
            lifestealBonus: 2
        },

        {
            name: "Topór z Rubieży",
            icon: "🪓",
            type: "weapon",
            tier: "tier-legendary",
            dropChance: 1,
            dmgBonus: 500,
            hpBonus: 100,
            dpsBonus: 50,
            critBonus: 5,
            lifestealBonus: 1
        },

        {
            name: "Kryształowy Hełm",
            icon: "🪖",
            type: "head",
            tier: "tier-legendary",
            dropChance: 0.4,
            dmgBonus: 80,
            hpBonus: 1500,
            dpsBonus: 0,
            critBonus: 3,
            lifestealBonus: 0
        },

        {
            name: "Puszka Tiger Bez Cukru",
            icon: "🧊",
            type: "amulet",
            tier: "tier-mythic",
            dropChance: 0.08,
            dmgBonus: 999,
            hpBonus: 999,
            dpsBonus: 999,
            critBonus: 10,
            lifestealBonus: 5
        },

        {
            name: "Miecz Nieskończoności",
            icon: "🌌",
            type: "weapon",
            tier: "tier-mythic",
            dropChance: 0.02,
            dmgBonus: 3000,
            hpBonus: 0,
            dpsBonus: 500,
            critBonus: 15,
            lifestealBonus: 3
        }
    ];

    /* =====================================================
       GACHA CONFIG
       ===================================================== */

    const GACHA_CONFIG = {
        cost: 500,

        /*
         * Wartości statystyk mogą się wylosować
         * w przedziale 80%-120% wartości bazowej.
         */
        statMinMultiplier: 0.80,
        statMaxMultiplier: 1.20
    };

    /* =====================================================
       HELPERS
       ===================================================== */

    function safeNumber(
        value,
        fallback = 0
    ) {
        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : fallback;
    }

    function randomBetween(
        min,
        max
    ) {
        return min +
            Math.random() *
            (max - min);
    }

    function randomizeStat(
        value
    ) {
        const base =
            safeNumber(value, 0);

        if (base <= 0) {
            return 0;
        }

        return Math.max(
            1,
            Math.floor(
                base *
                randomBetween(
                    GACHA_CONFIG.statMinMultiplier,
                    GACHA_CONFIG.statMaxMultiplier
                )
            )
        );
    }

    /* =====================================================
       TOTAL DROP CHANCE
       ===================================================== */

    function getTotalDropChance() {

        return lootTable.reduce(
            (
                total,
                item
            ) => {
                return total +
                    Math.max(
                        0,
                        safeNumber(
                            item.dropChance
                        )
                    );
            },
            0
        );
    }

    /* =====================================================
       ROLL LOOT
       ===================================================== */

    function rollLoot() {

        const totalChance =
            getTotalDropChance();

        if (
            totalChance <= 0
        ) {
            return null;
        }

        /*
         * Używamy pełnego zakresu tabeli,
         * zamiast zakładać, że suma zawsze = 100.
         */

        let roll =
            Math.random() *
            totalChance;

        for (
            const item
            of lootTable
        ) {

            const chance =
                Math.max(
                    0,
                    safeNumber(
                        item.dropChance
                    )
                );

            roll -=
                chance;

            if (
                roll <= 0
            ) {
                return item;
            }
        }

        /*
         * Fallback
         */

        return lootTable[
            lootTable.length - 1
        ];
    }

    /* =====================================================
       CREATE ITEM FROM LOOT
       ===================================================== */

    function createRolledItem(
        baseItem
    ) {

        if (
            !baseItem
        ) {
            return null;
        }

        const item = {
            ...baseItem,

            id: undefined,

            upgradeLevel: 0,

            dmgBonus:
                randomizeStat(
                    baseItem.dmgBonus
                ),

            hpBonus:
                randomizeStat(
                    baseItem.hpBonus
                ),

            dpsBonus:
                randomizeStat(
                    baseItem.dpsBonus
                ),

            /*
             * Crit i Lifesteal również mogą
             * mieć niewielką zmienność.
             */
            critBonus:
                baseItem.critBonus > 0
                    ? Number(
                        (
                            baseItem.critBonus *
                            randomBetween(
                                0.9,
                                1.1
                            )
                        ).toFixed(1)
                    )
                    : 0,

            lifestealBonus:
                baseItem.lifestealBonus > 0
                    ? Number(
                        (
                            baseItem.lifestealBonus *
                            randomBetween(
                                0.9,
                                1.1
                            )
                        ).toFixed(1)
                    )
                    : 0
        };

        return item;
    }

    /* =====================================================
       OPEN EGG
       ===================================================== */

    window.openEgg =
        function openEgg() {

            if (
                !window.gameData
            ) {
                console.error(
                    "gameData nie istnieje."
                );

                return false;
            }

            const cost =
                GACHA_CONFIG.cost;

            const gold =
                safeNumber(
                    window.gameData.gold,
                    0
                );

            /*
             * CHECK GOLD
             */

            if (
                gold < cost
            ) {

                if (
                    typeof window.logMessage ===
                    "function"
                ) {

                    window.logMessage(
                        `
                        ❌ Masz za mało złota.
                        Wymagane:
                        <span class="text-gold">
                            ${cost} 🪙
                        </span>
                        `
                    );
                }

                return false;
            }

            /*
             * PAY
             */

            window.gameData.gold =
                gold -
                cost;

            if (
                typeof window.updateStatusUI ===
                "function"
            ) {

                window.updateStatusUI();
            }

            /*
             * EGG ANIMATION
             */

            const egg =
                document.getElementById(
                    "main-egg"
                );

            if (egg) {

                egg.style.transform =
                    "scale(1.12) rotate(10deg)";

                egg.style.filter =
                    "drop-shadow(0 0 30px rgba(251,191,36,0.45))";

                window.setTimeout(
                    () => {

                        egg.style.transform =
                            "";

                        egg.style.filter =
                            "";

                    },
                    250
                );
            }

            /*
             * ROLL
             */

            const item =
                rollItem();

            /*
             * SAVE
             */

            if (
                typeof window.saveGame ===
                "function"
            ) {

                window.saveGame();
            }

            return item;
        };

    /* =====================================================
       ROLL ITEM
       ===================================================== */

    window.rollItem =
        function rollItem() {

            const baseItem =
                rollLoot();

            if (
                !baseItem
            ) {

                console.error(
                    "Loot table jest pusta."
                );

                return null;
            }

            /*
             * Stwórz indywidualną wersję itemu.
             */

            const winner =
                createRolledItem(
                    baseItem
                );

            if (
                !winner
            ) {
                return null;
            }

            /*
             * GIVE ITEM
             */

            let givenItem =
                winner;

            if (
                typeof window.giveItem ===
                "function"
            ) {

                givenItem =
                    window.giveItem(
                        winner
                    );
            }

            /*
             * GACHA RESULT UI
             */

            showGachaResult(
                winner
            );

            /*
             * LOG
             */

            if (
                typeof window.logMessage ===
                "function"
            ) {

                const tierName =
                    getTierName(
                        winner.tier
                    );

                window.logMessage(
                    `
                    ✨ Wylosowano:
                    <span class="${winner.tier}">
                        ${winner.name}
                    </span>
                    <span class="text-dim">
                        [${tierName}]
                    </span>
                    `
                );
            }

            /*
             * SAVE
             */

            if (
                typeof window.saveGame ===
                "function"
            ) {

                window.saveGame();
            }

            return givenItem;
        };

    /* =====================================================
       GACHA RESULT
       ===================================================== */

    function showGachaResult(
        item
    ) {

        const result =
            document.getElementById(
                "gacha-result"
            );

        if (
            !result ||
            !item
        ) {
            return;
        }

        const tier =
            getTierName(
                item.tier
            );

        let stats = "";

        if (
            item.dmgBonus > 0
        ) {

            stats += `
                <span class="text-red">
                    +${item.dmgBonus} DMG
                </span>
            `;
        }

        if (
            item.dpsBonus > 0
        ) {

            stats += `
                <span class="text-yellow">
                    +${item.dpsBonus} DPS
                </span>
            `;
        }

        if (
            item.hpBonus > 0
        ) {

            stats += `
                <span class="text-green">
                    +${item.hpBonus} HP
                </span>
            `;
        }

        if (
            item.critBonus > 0
        ) {

            stats += `
                <span class="text-purple">
                    +${item.critBonus}% KRYT
                </span>
            `;
        }

        if (
            item.lifestealBonus > 0
        ) {

            stats += `
                <span class="text-red">
                    +${item.lifestealBonus}% LIFESTEAL
                </span>
            `;
        }

        result.innerHTML = `
            <div
                class="${item.tier}"
                style="
                    font-size: 4rem;
                    margin-bottom: 10px;
                    border: none !important;
                    box-shadow: none !important;
                "
            >
                ${item.icon}
            </div>

            <div
                class="${item.tier}"
                style="
                    font-size: 1.3rem;
                    font-weight: bold;
                "
            >
                ${item.name}
            </div>

            <div class="text-dim mt-10">
                ${tier}
            </div>

            <div
                class="mt-10"
                style="
                    display:flex;
                    flex-wrap:wrap;
                    justify-content:center;
                    gap:8px;
                "
            >
                ${stats}
            </div>
        `;

        /*
         * Animation
         */

        result.style.transform =
            "scale(0.95)";

        result.style.opacity =
            "0";

        window.requestAnimationFrame(
            () => {

                result.style.transition =
                    "opacity 0.2s ease, transform 0.2s ease";

                result.style.opacity =
                    "1";

                result.style.transform =
                    "scale(1)";
            }
        );
    }

    /* =====================================================
       TIER NAME
       ===================================================== */

    function getTierName(
        tier
    ) {

        const names = {
            "tier-common":
                "COMMON",

            "tier-rare":
                "RARE",

            "tier-epic":
                "EPIC",

            "tier-legendary":
                "LEGENDARY",

            "tier-mythic":
                "MYTHIC"
        };

        return (
            names[tier] ||
            "UNKNOWN"
        );
    }

    /* =====================================================
       GET LOOT TABLE
       ===================================================== */

    window.getLootTable =
        function getLootTable() {

            return lootTable.map(
                item => ({
                    ...item
                })
            );
        };

    /* =====================================================
       DEBUG:
       FREE ROLL
       ===================================================== */

    window.debugRollItem =
        function debugRollItem() {

            const item =
                rollItem();

            return item;
        };

    /* =====================================================
       DEBUG:
       GIVE SPECIFIC ITEM
       ===================================================== */

    window.debugGiveLoot =
        function debugGiveLoot(
            itemName
        ) {

            const baseItem =
                lootTable.find(
                    item =>
                        item.name ===
                        itemName
                );

            if (
                !baseItem
            ) {

                console.warn(
                    "Nie znaleziono itemu:",
                    itemName
                );

                return null;
            }

            const item =
                createRolledItem(
                    baseItem
                );

            if (
                typeof window.giveItem ===
                "function"
            ) {

                return window.giveItem(
                    item
                );
            }

            return item;
        };

})();