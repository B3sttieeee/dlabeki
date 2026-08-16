/* =========================================================
   PIXEL REALMS ONLINE
   GACHA / LOOT / CHESTS / AFFIX SYSTEM
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       GACHA CONFIG
       ===================================================== */

    const GACHA_CONFIG = {

        defaultChest: "basic",

        chests: {

            basic: {
                name: "Skrzynia Wędrowca",
                icon: "🎁",
                cost: 500,
                tierBonus: 0
            },

            rare: {
                name: "Skrzynia Bohatera",
                icon: "💎",
                cost: 2500,
                tierBonus: 1
            },

            ancient: {
                name: "Starożytna Skrzynia",
                icon: "🏛️",
                cost: 10000,
                tierBonus: 2
            },

            hell: {
                name: "Piekielna Skrzynia",
                icon: "🔥",
                cost: 50000,
                tierBonus: 3
            },

            boss: {
                name: "Skrzynia Bossa",
                icon: "☠️",
                cost: 0,
                tierBonus: 4,
                guaranteedRare: true
            }
        },

        statRoll: {
            min: 0.80,
            max: 1.20
        },

        upgrade: {
            /*
             * Bazowy wzrost statystyk za poziom.
             *
             * +0 = x1.00
             * +1 = x1.10
             * +2 = x1.22
             * +3 = x1.34
             * itd.
             */

            normalMultiplier: 1.10,

            /*
             * Dodatkowy bonus dla rzadkich itemów.
             */

            rareBonus: 0.01,
            epicBonus: 0.02,
            legendaryBonus: 0.03,
            mythicBonus: 0.05,

            maxUpgrade: 50
        }
    };

    /* =====================================================
       RARITY
       ===================================================== */

    const RARITIES = {

        "tier-common": {
            name: "COMMON",
            weight: 1,
            color: "#78869d",
            minQuality: 0.85,
            maxQuality: 1.00
        },

        "tier-rare": {
            name: "RARE",
            weight: 1,
            color: "#4da6ff",
            minQuality: 0.90,
            maxQuality: 1.05
        },

        "tier-epic": {
            name: "EPIC",
            weight: 1,
            color: "#b36cff",
            minQuality: 0.95,
            maxQuality: 1.10
        },

        "tier-legendary": {
            name: "LEGENDARY",
            weight: 1,
            color: "#ffd166",
            minQuality: 1.00,
            maxQuality: 1.15
        },

        "tier-mythic": {
            name: "MYTHIC",
            weight: 1,
            color: "#ff5f6d",
            minQuality: 1.05,
            maxQuality: 1.25
        }
    };

    /* =====================================================
       LOOT TABLE
       ===================================================== */

    const lootTable = [

        /* =================================================
           COMMON
           ================================================= */

        {
            name: "Zardzewiały Sztylet",
            icon: "🗡️",
            type: "weapon",
            slot: "weapon",
            tier: "tier-common",
            dropChance: 14,

            dmgBonus: 15,
            dpsBonus: 0,
            hpBonus: 0,
            critBonus: 0,
            lifestealBonus: 0,

            armorBonus: 0,
            dodgeBonus: 0,
            attackSpeedBonus: 0,
            goldBonus: 0,
            expBonus: 0,
            bossDamageBonus: 0,
            lootBonus: 0
        },

        {
            name: "Drewniany Młot",
            icon: "🔨",
            type: "weapon",
            slot: "weapon",
            tier: "tier-common",
            dropChance: 10,

            dmgBonus: 22,
            dpsBonus: 0,
            hpBonus: 20,
            critBonus: 0,
            lifestealBonus: 0,

            armorBonus: 2,
            dodgeBonus: 0,
            attackSpeedBonus: -2,
            goldBonus: 0,
            expBonus: 0,
            bossDamageBonus: 0,
            lootBonus: 0
        },

        {
            name: "Skórzana Kurta",
            icon: "🧥",
            type: "armor",
            slot: "armor",
            tier: "tier-common",
            dropChance: 12,

            dmgBonus: 0,
            dpsBonus: 0,
            hpBonus: 50,
            critBonus: 0,
            lifestealBonus: 0,

            armorBonus: 5,
            dodgeBonus: 1,
            attackSpeedBonus: 0,
            goldBonus: 0,
            expBonus: 0,
            bossDamageBonus: 0,
            lootBonus: 0
        },

        {
            name: "Czapka Leśnika",
            icon: "🧢",
            type: "head",
            slot: "head",
            tier: "tier-common",
            dropChance: 7,

            dmgBonus: 5,
            dpsBonus: 0,
            hpBonus: 40,
            critBonus: 1,
            lifestealBonus: 0,

            armorBonus: 3,
            dodgeBonus: 1,
            attackSpeedBonus: 0,
            goldBonus: 2,
            expBonus: 0,
            bossDamageBonus: 0,
            lootBonus: 0
        },

        {
            name: "Miedziany Pierścień",
            icon: "💍",
            type: "ring",
            slot: "ring",
            tier: "tier-common",
            dropChance: 6,

            dmgBonus: 8,
            dpsBonus: 2,
            hpBonus: 0,
            critBonus: 1,
            lifestealBonus: 0,

            armorBonus: 0,
            dodgeBonus: 0,
            attackSpeedBonus: 1,
            goldBonus: 3,
            expBonus: 0,
            bossDamageBonus: 0,
            lootBonus: 0
        },

        /* =================================================
           RARE
           ================================================= */

        {
            name: "Stalowy Miecz",
            icon: "⚔️",
            type: "weapon",
            slot: "weapon",
            tier: "tier-rare",
            dropChance: 10,

            dmgBonus: 40,
            dpsBonus: 5,
            hpBonus: 0,
            critBonus: 1,
            lifestealBonus: 0,

            armorBonus: 0,
            dodgeBonus: 0,
            attackSpeedBonus: 2,
            goldBonus: 0,
            expBonus: 0,
            bossDamageBonus: 2,
            lootBonus: 0
        },

        {
            name: "Kolczuga Strażnika",
            icon: "🛡️",
            type: "armor",
            slot: "armor",
            tier: "tier-rare",
            dropChance: 9,

            dmgBonus: 10,
            dpsBonus: 0,
            hpBonus: 150,
            critBonus: 0,
            lifestealBonus: 0,

            armorBonus: 15,
            dodgeBonus: 2,
            attackSpeedBonus: -1,
            goldBonus: 0,
            expBonus: 0,
            bossDamageBonus: 0,
            lootBonus: 2
        },

        {
            name: "Oko Proroka",
            icon: "🧿",
            type: "amulet",
            slot: "amulet",
            tier: "tier-rare",
            dropChance: 7,

            dmgBonus: 0,
            dpsBonus: 30,
            hpBonus: 100,
            critBonus: 2,
            lifestealBonus: 0,

            armorBonus: 0,
            dodgeBonus: 2,
            attackSpeedBonus: 2,
            goldBonus: 0,
            expBonus: 5,
            bossDamageBonus: 0,
            lootBonus: 2
        },

        {
            name: "Pierścień Poszukiwacza",
            icon: "💠",
            type: "ring",
            slot: "ring",
            tier: "tier-rare",
            dropChance: 4,

            dmgBonus: 15,
            dpsBonus: 8,
            hpBonus: 0,
            critBonus: 2,
            lifestealBonus: 1,

            armorBonus: 0,
            dodgeBonus: 1,
            attackSpeedBonus: 1,
            goldBonus: 8,
            expBonus: 3,
            bossDamageBonus: 0,
            lootBonus: 5
        },

        /* =================================================
           EPIC
           ================================================= */

        {
            name: "Ostrze Mrozu",
            icon: "❄️",
            type: "weapon",
            slot: "weapon",
            tier: "tier-epic",
            dropChance: 5,

            dmgBonus: 150,
            dpsBonus: 15,
            hpBonus: 0,
            critBonus: 3,
            lifestealBonus: 0,

            armorBonus: 0,
            dodgeBonus: 0,
            attackSpeedBonus: 4,
            goldBonus: 0,
            expBonus: 2,
            bossDamageBonus: 5,
            lootBonus: 0
        },

        {
            name: "Pancerz Cienia",
            icon: "🥋",
            type: "armor",
            slot: "armor",
            tier: "tier-epic",
            dropChance: 4,

            dmgBonus: 40,
            dpsBonus: 0,
            hpBonus: 600,
            critBonus: 0,
            lifestealBonus: 1,

            armorBonus: 35,
            dodgeBonus: 4,
            attackSpeedBonus: 0,
            goldBonus: 0,
            expBonus: 0,
            bossDamageBonus: 0,
            lootBonus: 4
        },

        {
            name: "Wampiryczny Sygnet",
            icon: "💍",
            type: "ring",
            slot: "ring",
            tier: "tier-epic",
            dropChance: 3,

            dmgBonus: 30,
            dpsBonus: 0,
            hpBonus: 0,
            critBonus: 4,
            lifestealBonus: 2,

            armorBonus: 0,
            dodgeBonus: 3,
            attackSpeedBonus: 3,
            goldBonus: 0,
            expBonus: 0,
            bossDamageBonus: 3,
            lootBonus: 0
        },

        {
            name: "Serce Puszczy",
            icon: "💚",
            type: "amulet",
            slot: "amulet",
            tier: "tier-epic",
            dropChance: 2,

            dmgBonus: 25,
            dpsBonus: 25,
            hpBonus: 350,
            critBonus: 1,
            lifestealBonus: 3,

            armorBonus: 5,
            dodgeBonus: 3,
            attackSpeedBonus: 2,
            goldBonus: 5,
            expBonus: 5,
            bossDamageBonus: 0,
            lootBonus: 8
        },

        {
            name: "Runiczny Hełm",
            icon: "🪖",
            type: "head",
            slot: "head",
            tier: "tier-epic",
            dropChance: 2,

            dmgBonus: 35,
            dpsBonus: 10,
            hpBonus: 400,
            critBonus: 3,
            lifestealBonus: 0,

            armorBonus: 20,
            dodgeBonus: 3,
            attackSpeedBonus: 1,
            goldBonus: 4,
            expBonus: 4,
            bossDamageBonus: 2,
            lootBonus: 3
        },

        /* =================================================
           LEGENDARY
           ================================================= */

        {
            name: "Topór z Rubieży",
            icon: "🪓",
            type: "weapon",
            slot: "weapon",
            tier: "tier-legendary",
            dropChance: 1.5,

            dmgBonus: 500,
            dpsBonus: 50,
            hpBonus: 100,
            critBonus: 5,
            lifestealBonus: 1,

            armorBonus: 0,
            dodgeBonus: 0,
            attackSpeedBonus: 3,
            goldBonus: 5,
            expBonus: 5,
            bossDamageBonus: 10,
            lootBonus: 5
        },

        {
            name: "Kryształowy Hełm",
            icon: "🪖",
            type: "head",
            slot: "head",
            tier: "tier-legendary",
            dropChance: 0.7,

            dmgBonus: 80,
            dpsBonus: 0,
            hpBonus: 1500,
            critBonus: 3,
            lifestealBonus: 0,

            armorBonus: 50,
            dodgeBonus: 5,
            attackSpeedBonus: 0,
            goldBonus: 8,
            expBonus: 8,
            bossDamageBonus: 5,
            lootBonus: 8
        },

        {
            name: "Pancerz Króla",
            icon: "👑",
            type: "armor",
            slot: "armor",
            tier: "tier-legendary",
            dropChance: 0.5,

            dmgBonus: 100,
            dpsBonus: 30,
            hpBonus: 2500,
            critBonus: 2,
            lifestealBonus: 2,

            armorBonus: 80,
            dodgeBonus: 6,
            attackSpeedBonus: 2,
            goldBonus: 10,
            expBonus: 10,
            bossDamageBonus: 8,
            lootBonus: 10
        },

        {
            name: "Amulet Smoczego Oka",
            icon: "🐉",
            type: "amulet",
            slot: "amulet",
            tier: "tier-legendary",
            dropChance: 0.45,

            dmgBonus: 150,
            dpsBonus: 75,
            hpBonus: 1000,
            critBonus: 7,
            lifestealBonus: 3,

            armorBonus: 10,
            dodgeBonus: 6,
            attackSpeedBonus: 5,
            goldBonus: 10,
            expBonus: 10,
            bossDamageBonus: 15,
            lootBonus: 10
        },

        /* =================================================
           MYTHIC
           ================================================= */

        {
            name: "Puszka Tiger Bez Cukru",
            icon: "🧊",
            type: "amulet",
            slot: "amulet",
            tier: "tier-mythic",
            dropChance: 0.08,

            dmgBonus: 999,
            hpBonus: 999,
            dpsBonus: 999,
            critBonus: 10,
            lifestealBonus: 5,

            armorBonus: 20,
            dodgeBonus: 10,
            attackSpeedBonus: 10,
            goldBonus: 25,
            expBonus: 25,
            bossDamageBonus: 25,
            lootBonus: 25
        },

        {
            name: "Miecz Nieskończoności",
            icon: "🌌",
            type: "weapon",
            slot: "weapon",
            tier: "tier-mythic",
            dropChance: 0.04,

            dmgBonus: 3000,
            hpBonus: 0,
            dpsBonus: 500,
            critBonus: 15,
            lifestealBonus: 3,

            armorBonus: 0,
            dodgeBonus: 5,
            attackSpeedBonus: 10,
            goldBonus: 15,
            expBonus: 15,
            bossDamageBonus: 30,
            lootBonus: 15
        },

        {
            name: "Korona Bogów",
            icon: "👑",
            type: "head",
            slot: "head",
            tier: "tier-mythic",
            dropChance: 0.02,

            dmgBonus: 1000,
            hpBonus: 5000,
            dpsBonus: 250,
            critBonus: 12,
            lifestealBonus: 5,

            armorBonus: 100,
            dodgeBonus: 12,
            attackSpeedBonus: 8,
            goldBonus: 30,
            expBonus: 30,
            bossDamageBonus: 25,
            lootBonus: 30
        }
    ];

    /* =====================================================
       AFFIX POOL
       ===================================================== */

    const AFFIX_POOL = [

        {
            id: "of_fury",
            name: "Furii",
            rarity: "offensive",

            minTier: 1,

            stats: {
                dmgBonus: [10, 45],
                dpsBonus: [5, 30]
            }
        },

        {
            id: "of_hunter",
            name: "Łowcy",
            rarity: "offensive",

            minTier: 1,

            stats: {
                critBonus: [1, 5],
                bossDamageBonus: [2, 10]
            }
        },

        {
            id: "of_vampire",
            name: "Wampira",
            rarity: "sustain",

            minTier: 2,

            stats: {
                lifestealBonus: [1, 4]
            }
        },

        {
            id: "of_guardian",
            name: "Strażnika",
            rarity: "defensive",

            minTier: 1,

            stats: {
                hpBonus: [30, 250],
                armorBonus: [5, 20]
            }
        },

        {
            id: "of_shadow",
            name: "Cienia",
            rarity: "utility",

            minTier: 2,

            stats: {
                dodgeBonus: [1, 5],
                attackSpeedBonus: [1, 4]
            }
        },

        {
            id: "of_merchant",
            name: "Kupca",
            rarity: "economy",

            minTier: 2,

            stats: {
                goldBonus: [5, 20],
                lootBonus: [3, 12]
            }
        },

        {
            id: "of_scholar",
            name: "Uczonego",
            rarity: "progression",

            minTier: 2,

            stats: {
                expBonus: [5, 20]
            }
        },

        {
            id: "of_doom",
            name: "Zagłady",
            rarity: "boss",

            minTier: 3,

            stats: {
                bossDamageBonus: [8, 25],
                dmgBonus: [50, 300]
            }
        }
    ];

    /* =====================================================
       RARITY HELPERS
       ===================================================== */

    function getTierIndex(
        tier
    ) {

        const map = {
            "tier-common": 0,
            "tier-rare": 1,
            "tier-epic": 2,
            "tier-legendary": 3,
            "tier-mythic": 4
        };

        return (
            map[tier] ??
            0
        );
    }

    function getTierName(
        tier
    ) {

        return (
            RARITIES[tier]?.name ||
            "UNKNOWN"
        );
    }

    function getTierQuality(
        tier
    ) {

        const rarity =
            RARITIES[tier] ||
            RARITIES["tier-common"];

        return randomBetween(
            rarity.minQuality,
            rarity.maxQuality
        );
    }

    /* =====================================================
       SAFE NUMBER
       ===================================================== */

    function safeNumber(
        value,
        fallback = 0
    ) {

        const number =
            Number(value);

        return Number.isFinite(
            number
        )
            ? number
            : fallback;
    }

    function randomBetween(
        min,
        max
    ) {

        return (
            min +
            (
                Math.random() *
                (
                    max - min
                )
            )
        );
    }

    /* =====================================================
       RANDOM STAT
       ===================================================== */

    function randomizeStat(
        value,
        quality = 1
    ) {

        const base =
            safeNumber(
                value,
                0
            );

        if (
            base <= 0
        ) {
            return 0;
        }

        return Math.max(
            1,
            Math.floor(
                base *
                randomBetween(
                    GACHA_CONFIG
                        .statRoll
                        .min,

                    GACHA_CONFIG
                        .statRoll
                        .max
                ) *
                quality
            )
        );
    }

    /* =====================================================
       ROLL AFFIX
       ===================================================== */

    function rollAffixes(
        item
    ) {

        const tier =
            getTierIndex(
                item.tier
            );

        const possible =
            AFFIX_POOL.filter(
                affix =>
                    affix.minTier <=
                    tier
            );

        if (
            possible.length === 0
        ) {
            return [];
        }

        /*
         * Ilość affixów:
         *
         * Common      0-1
         * Rare        1
         * Epic        1-2
         * Legendary  2
         * Mythic     2-3
         */

        let count = 0;

        if (
            tier === 0
        ) {

            count =
                Math.random() <
                0.30
                    ? 1
                    : 0;

        } else if (
            tier === 1
        ) {

            count =
                1;

        } else if (
            tier === 2
        ) {

            count =
                Math.random() <
                0.5
                    ? 1
                    : 2;

        } else if (
            tier === 3
        ) {

            count =
                2;

        } else {

            count =
                Math.random() <
                0.5
                    ? 2
                    : 3;
        }

        const selected =
            [];

        const pool =
            [...possible];

        while (
            selected.length <
                count &&
            pool.length > 0
        ) {

            const index =
                Math.floor(
                    Math.random() *
                    pool.length
                );

            const affix =
                pool.splice(
                    index,
                    1
                )[0];

            selected.push(
                affix
            );
        }

        return selected;
    }

    /* =====================================================
       APPLY AFFIX
       ===================================================== */

    function applyAffix(
        item,
        affix
    ) {

        if (
            !affix ||
            !affix.stats
        ) {
            return;
        }

        Object.entries(
            affix.stats
        ).forEach(
            ([
                stat,
                range
            ]) => {

                const value =
                    Math.floor(
                        randomBetween(
                            range[0],
                            range[1]
                        )
                    );

                item[stat] =
                    safeNumber(
                        item[stat],
                        0
                    ) +
                    value;
            }
        );
    }

    /* =====================================================
       CREATE ROLLED ITEM
       ===================================================== */

    function createRolledItem(
        baseItem,
        chestType = "basic"
    ) {

        if (
            !baseItem
        ) {
            return null;
        }

        const chest =
            GACHA_CONFIG
                .chests[
                    chestType
                ] ||
            GACHA_CONFIG.chests.basic;

        /*
         * Clone
         */

        const item = {
            ...baseItem
        };

        /*
         * ID is assigned by inventory.js.
         */

        delete item.dropChance;

        /*
         * Upgrade state
         */

        item.upgradeLevel = 0;

        /*
         * Quality
         */

        const quality =
            getTierQuality(
                item.tier
            );

        item.quality =
            Number(
                quality.toFixed(3)
            );

        /*
         * Quality display
         */

        item.qualityPercent =
            Math.floor(
                quality *
                100
            );

        /*
         * Base stats
         */

        const statKeys = [
            "dmgBonus",
            "dpsBonus",
            "hpBonus"
        ];

        statKeys.forEach(
            stat => {

                item[stat] =
                    randomizeStat(
                        baseItem[stat],
                        quality
                    );
            }
        );

        /*
         * Percentage stats
         */

        item.critBonus =
            Number(
                (
                    safeNumber(
                        baseItem.critBonus
                    ) *
                    randomBetween(
                        0.9,
                        1.1
                    ) *
                    quality
                ).toFixed(2)
            );

        item.lifestealBonus =
            Number(
                (
                    safeNumber(
                        baseItem.lifestealBonus
                    ) *
                    randomBetween(
                        0.9,
                        1.1
                    ) *
                    quality
                ).toFixed(2)
            );

        item.armorBonus =
            randomizeStat(
                baseItem.armorBonus,
                quality
            );

        item.dodgeBonus =
            Number(
                (
                    safeNumber(
                        baseItem.dodgeBonus
                    ) *
                    randomBetween(
                        0.9,
                        1.1
                    ) *
                    quality
                ).toFixed(2)
            );

        item.attackSpeedBonus =
            Number(
                (
                    safeNumber(
                        baseItem.attackSpeedBonus
                    ) *
                    randomBetween(
                        0.9,
                        1.1
                    ) *
                    quality
                ).toFixed(2)
            );

        item.goldBonus =
            randomizeStat(
                baseItem.goldBonus,
                quality
            );

        item.expBonus =
            randomizeStat(
                baseItem.expBonus,
                quality
            );

        item.bossDamageBonus =
            randomizeStat(
                baseItem.bossDamageBonus,
                quality
            );

        item.lootBonus =
            randomizeStat(
                baseItem.lootBonus,
                quality
            );

        /*
         * AFFIXES
         */

        item.affixes =
            [];

        const affixes =
            rollAffixes(
                item
            );

        affixes.forEach(
            affix => {

                applyAffix(
                    item,
                    affix
                );

                item.affixes.push({
                    id:
                        affix.id,

                    name:
                        affix.name,

                    rarity:
                        affix.rarity
                });
            }
        );

        /*
         * Prefix / display name
         */

        if (
            item.affixes.length > 0
        ) {

            const prefix =
                item.affixes[
                    0
                ].name;

            item.displayName =
                `${item.name} ${prefix}`;

        } else {

            item.displayName =
                item.name;
        }

        /*
         * Gacha metadata
         */

        item.source =
            "gacha";

        item.sourceChest =
            chestType;

        item.chestName =
            chest.name;

        item.createdAt =
            Date.now();

        /*
         * Upgrade configuration
         */

        item.upgradeData = {

            maxLevel:
                GACHA_CONFIG
                    .upgrade
                    .maxUpgrade,

            baseIncrease:
                getUpgradeBonusForTier(
                    item.tier
                ),

            /*
             * Wszystkie statystyki,
             * które mają skalować się
             * wraz z ulepszaniem.
             */

            scalableStats: [
                "dmgBonus",
                "dpsBonus",
                "hpBonus",
                "critBonus",
                "lifestealBonus",
                "armorBonus",
                "dodgeBonus",
                "attackSpeedBonus",
                "goldBonus",
                "expBonus",
                "bossDamageBonus",
                "lootBonus"
            ]
        };

        /*
         * Łączna moc itemu.
         */

        item.power =
            calculateItemPower(
                item
            );

        return item;
    }

    /* =====================================================
       UPGRADE BONUS
       ===================================================== */

    function getUpgradeBonusForTier(
        tier
    ) {

        switch (
            tier
        ) {

            case "tier-mythic":
                return 1 +
                    GACHA_CONFIG
                        .upgrade
                        .normalMultiplier +
                    GACHA_CONFIG
                        .upgrade
                        .mythicBonus;

            case "tier-legendary":
                return 1 +
                    GACHA_CONFIG
                        .upgrade
                        .normalMultiplier +
                    GACHA_CONFIG
                        .upgrade
                        .legendaryBonus;

            case "tier-epic":
                return 1 +
                    GACHA_CONFIG
                        .upgrade
                        .normalMultiplier +
                    GACHA_CONFIG
                        .upgrade
                        .epicBonus;

            case "tier-rare":
                return 1 +
                    GACHA_CONFIG
                        .upgrade
                        .normalMultiplier +
                    GACHA_CONFIG
                        .upgrade
                        .rareBonus;

            default:
                return 1 +
                    GACHA_CONFIG
                        .upgrade
                        .normalMultiplier;
        }
    }

    /* =====================================================
       ITEM POWER
       ===================================================== */

    function calculateItemPower(
        item
    ) {

        let power = 0;

        power +=
            safeNumber(
                item.dmgBonus
            );

        power +=
            safeNumber(
                item.dpsBonus
            ) *
            1.3;

        power +=
            safeNumber(
                item.hpBonus
            ) *
            0.10;

        power +=
            safeNumber(
                item.critBonus
            ) *
            20;

        power +=
            safeNumber(
                item.lifestealBonus
            ) *
            25;

        power +=
            safeNumber(
                item.armorBonus
            ) *
            2;

        power +=
            safeNumber(
                item.dodgeBonus
            ) *
            15;

        power +=
            safeNumber(
                item.attackSpeedBonus
            ) *
            12;

        power +=
            safeNumber(
                item.goldBonus
            ) *
            8;

        power +=
            safeNumber(
                item.expBonus
            ) *
            8;

        power +=
            safeNumber(
                item.bossDamageBonus
            ) *
            12;

        power +=
            safeNumber(
                item.lootBonus
            ) *
            10;

        return Math.floor(
            power
        );
    }

    /* =====================================================
       UPGRADE PREVIEW
       ===================================================== */

    window.getItemUpgradePreview =
        function getItemUpgradePreview(
            item
        ) {

            if (
                !item
            ) {
                return null;
            }

            const level =
                safeNumber(
                    item.upgradeLevel,
                    0
                );

            const config =
                item.upgradeData ||
                {};

            const bonus =
                safeNumber(
                    config.baseIncrease,
                    1.10
                );

            const scalable =
                Array.isArray(
                    config.scalableStats
                )
                    ? config.scalableStats
                    : [];

            const preview = {
                level: level + 1,
                multiplier: bonus,
                stats: {}
            };

            scalable.forEach(
                stat => {

                    const current =
                        safeNumber(
                            item[stat],
                            0
                        );

                    preview.stats[stat] =
                        Math.floor(
                            current *
                            bonus
                        );
                }
            );

            return preview;
        };

    /* =====================================================
       APPLY ITEM UPGRADE
       ===================================================== */

    window.applyLootUpgrade =
        function applyLootUpgrade(
            item
        ) {

            if (
                !item
            ) {
                return false;
            }

            const currentLevel =
                Math.max(
                    0,
                    Math.floor(
                        safeNumber(
                            item.upgradeLevel,
                            0
                        )
                    )
                );

            const maxLevel =
                safeNumber(
                    item.upgradeData
                        ?.maxLevel,
                    50
                );

            if (
                currentLevel >=
                maxLevel
            ) {

                return false;
            }

            const multiplier =
                safeNumber(
                    item.upgradeData
                        ?.baseIncrease,
                    1.10
                );

            const scalableStats =
                Array.isArray(
                    item.upgradeData
                        ?.scalableStats
                )
                    ? item.upgradeData
                        .scalableStats
                    : [];

            scalableStats.forEach(
                stat => {

                    const current =
                        safeNumber(
                            item[stat],
                            0
                        );

                    if (
                        current <= 0
                    ) {
                        return;
                    }

                    item[stat] =
                        Number(
                            (
                                current *
                                multiplier
                            ).toFixed(
                                2
                            )
                        );

                    /*
                     * Całkowite statystyki:
                     * DMG/HP/DPS = integer.
                     * Procenty mogą zostać dziesiętne.
                     */

                    if (
                        [
                            "dmgBonus",
                            "dpsBonus",
                            "hpBonus",
                            "armorBonus",
                            "goldBonus",
                            "expBonus",
                            "bossDamageBonus",
                            "lootBonus"
                        ].includes(
                            stat
                        )
                    ) {

                        item[stat] =
                            Math.floor(
                                item[stat]
                            );
                    }
                }
            );

            item.upgradeLevel =
                currentLevel + 1;

            item.power =
                calculateItemPower(
                    item
                );

            return true;
        };

    /* =====================================================
       ROLL TABLE
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
       RARITY FILTER
       ===================================================== */

    function getEligibleLoot(
        chestType
    ) {

        const chest =
            GACHA_CONFIG
                .chests[
                    chestType
                ] ||
            GACHA_CONFIG.chests.basic;

        let minimumTier =
            0;

        /*
         * Rare chest
         */

        if (
            chestType ===
            "rare"
        ) {
            minimumTier = 1;
        }

        /*
         * Ancient
         */

        if (
            chestType ===
            "ancient"
        ) {
            minimumTier = 2;
        }

        /*
         * Hell
         */

        if (
            chestType ===
            "hell"
        ) {
            minimumTier = 3;
        }

        /*
         * Boss
         *
         * Zawsze minimum Rare.
         */

        if (
            chestType ===
            "boss"
        ) {
            minimumTier = 1;
        }

        return lootTable.filter(
            item =>
                getTierIndex(
                    item.tier
                ) >=
                minimumTier
        );
    }

    /* =====================================================
       BOSS SAFE ROLL
       ===================================================== */

    function rollLoot(
        chestType = "basic"
    ) {

        let pool =
            getEligibleLoot(
                chestType
            );

        if (
            pool.length === 0
        ) {
            pool =
                [
                    ...lootTable
                ];
        }

        /*
         * Dla mocniejszych skrzyń
         * większa szansa na wysokie rarity.
         */

        const weighted =
            pool.map(
                item => {

                    let weight =
                        safeNumber(
                            item.dropChance
                        );

                    const tier =
                        getTierIndex(
                            item.tier
                        );

                    /*
                     * Boost zależny
                     * od rodzaju skrzyni.
                     */

                    switch (
                        chestType
                    ) {

                        case "rare":
                            weight *=
                                1 +
                                tier *
                                0.25;
                            break;

                        case "ancient":
                            weight *=
                                1 +
                                tier *
                                0.50;
                            break;

                        case "hell":
                            weight *=
                                1 +
                                tier *
                                0.80;
                            break;

                        case "boss":
                            weight *=
                                1 +
                                tier *
                                1.25;
                            break;
                    }

                    return {
                        item,
                        weight
                    };
                }
            );

        /*
         * Boss:
         * minimum epic, jeśli mamy
         * szczęście albo losowanie.
         */

        if (
            chestType ===
            "boss"
        ) {

            const rareRoll =
                Math.random();

            if (
                rareRoll <
                0.15
            ) {

                const mythics =
                    pool.filter(
                        item =>
                            getTierIndex(
                                item.tier
                            ) >= 4
                    );

                if (
                    mythics.length
                ) {

                    return mythics[
                        Math.floor(
                            Math.random() *
                            mythics.length
                        )
                    ];
                }
            }
        }

        const total =
            weighted.reduce(
                (
                    sum,
                    entry
                ) =>
                    sum +
                    entry.weight,
                0
            );

        if (
            total <= 0
        ) {

            return pool[0];
        }

        let roll =
            Math.random() *
            total;

        for (
            const entry
            of weighted
        ) {

            roll -=
                entry.weight;

            if (
                roll <= 0
            ) {

                return entry.item;
            }
        }

        return pool[
            pool.length - 1
        ];
    }

    /* =====================================================
       OPEN CHEST
       ===================================================== */

    window.openChest =
        function openChest(
            type = "basic"
        ) {

            const chest =
                GACHA_CONFIG
                    .chests[type];

            if (
                !chest
            ) {

                console.warn(
                    "Nieznany typ skrzyni:",
                    type
                );

                return null;
            }

            if (
                !window.gameData
            ) {

                return null;
            }

            const cost =
                safeNumber(
                    chest.cost,
                    0
                );

            /*
             * Boss chest może być
             * darmowa z boss kill.
             */

            if (
                cost > 0 &&
                safeNumber(
                    window.gameData.gold
                ) < cost
            ) {

                if (
                    typeof window.logMessage ===
                    "function"
                ) {

                    window.logMessage(
                        `
                        ❌ Brakuje Ci
                        <span class="text-gold">
                            ${cost} 🪙
                        </span>.
                        `
                    );
                }

                return null;
            }

            /*
             * PAY
             */

            if (
                cost > 0
            ) {

                window.gameData.gold -=
                    cost;
            }

            /*
             * CHEST ANIMATION
             */

            animateChest();

            /*
             * ROLL
             */

            const winner =
                window.rollItem(
                    type
                );

            if (
                typeof window.updateStatusUI ===
                "function"
            ) {

                window.updateStatusUI();
            }

            if (
                typeof window.saveGame ===
                "function"
            ) {

                window.saveGame();
            }

            return winner;
        };

    /* =====================================================
       OLD API
       openEgg()
       ===================================================== */

    window.openEgg =
        function openEgg() {

            return window.openChest(
                "basic"
            );
        };

    /* =====================================================
       ROLL ITEM
       ===================================================== */

    window.rollItem =
        function rollItem(
            chestType = "basic"
        ) {

            const baseItem =
                rollLoot(
                    chestType
                );

            if (
                !baseItem
            ) {

                console.error(
                    "Brak itemu w loot table."
                );

                return null;
            }

            const winner =
                createRolledItem(
                    baseItem,
                    chestType
                );

            if (
                !winner
            ) {
                return null;
            }

            /*
             * GIVE
             */

            let result =
                winner;

            if (
                typeof window.giveItem ===
                "function"
            ) {

                result =
                    window.giveItem(
                        winner
                    );
            }

            /*
             * UI
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

                const rarity =
                    getTierName(
                        winner.tier
                    );

                window.logMessage(
                    `
                    🎁 Wylosowano
                    <span class="${winner.tier}">
                        ${winner.displayName}
                    </span>
                    |
                    <span class="text-dim">
                        ${rarity}
                    </span>
                    |
                    Power:
                    <span class="text-gold">
                        ${winner.power}
                    </span>
                    `
                );
            }

            if (
                typeof window.saveGame ===
                "function"
            ) {

                window.saveGame();
            }

            return result;
        };

    /* =====================================================
       ANIMATION
       ===================================================== */

    function animateChest() {

        const chest =
            document.getElementById(
                "main-egg"
            );

        if (
            !chest
        ) {
            return;
        }

        chest.style.transform =
            "scale(1.12) rotate(8deg)";

        chest.style.filter =
            "drop-shadow(0 0 30px rgba(255,209,102,.55))";

        setTimeout(
            () => {

                chest.style.transform =
                    "";

                chest.style.filter =
                    "";

            },
            250
        );
    }

    /* =====================================================
       SHOW RESULT
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

        const tierName =
            getTierName(
                item.tier
            );

        let statsHtml =
            "";

        const stats = [

            [
                "⚔",
                "DMG",
                item.dmgBonus,
                "text-red"
            ],

            [
                "⚡",
                "DPS",
                item.dpsBonus,
                "text-blue"
            ],

            [
                "❤️",
                "HP",
                item.hpBonus,
                "text-green"
            ],

            [
                "🎯",
                "KRYT",
                item.critBonus,
                "text-gold"
            ],

            [
                "🩸",
                "LIFESTEAL",
                item.lifestealBonus,
                "text-purple"
            ],

            [
                "🛡",
                "ARMOR",
                item.armorBonus,
                "text-blue"
            ],

            [
                "💨",
                "UNIK",
                item.dodgeBonus,
                "text-cyan"
            ],

            [
                "⚡",
                "AS",
                item.attackSpeedBonus,
                "text-gold"
            ],

            [
                "🪙",
                "GOLD",
                item.goldBonus,
                "text-gold"
            ],

            [
                "✨",
                "EXP",
                item.expBonus,
                "text-purple"
            ],

            [
                "☠",
                "BOSS",
                item.bossDamageBonus,
                "text-red"
            ],

            [
                "🎁",
                "LOOT",
                item.lootBonus,
                "text-cyan"
            ]
        ];

        stats.forEach(
            stat => {

                if (
                    safeNumber(
                        stat[2]
                    ) <= 0
                ) {
                    return;
                }

                statsHtml += `
                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            gap:12px;
                            padding:3px 0;
                        "
                    >
                        <span>
                            ${stat[0]}
                            ${stat[1]}
                        </span>

                        <strong class="${stat[3]}">
                            +${stat[2]}
                        </strong>
                    </div>
                `;
            }
        );

        let affixHtml =
            "";

        if (
            Array.isArray(
                item.affixes
            ) &&
            item.affixes.length > 0
        ) {

            affixHtml = `
                <div
                    style="
                        margin-top:10px;
                        padding-top:10px;
                        border-top:1px solid var(--border);
                    "
                >

                    <div
                        class="text-dim"
                        style="
                            font-size:13px;
                            margin-bottom:6px;
                        "
                    >
                        BONUSY
                    </div>

                    ${item.affixes
                        .map(
                            affix => `
                                <div class="text-gold">
                                    ◆ ${affix.name}
                                </div>
                            `
                        )
                        .join("")
                    }

                </div>
            `;
        }

        result.innerHTML = `

            <div
                style="
                    font-size:72px;
                    line-height:1;
                    margin-bottom:14px;
                "
            >
                ${item.icon}
            </div>

            <div
                class="${item.tier}"
                style="
                    font-family:var(--font-pixel);
                    font-size:11px;
                    line-height:1.7;
                    margin-bottom:7px;
                "
            >
                ${item.displayName}
            </div>

            <div
                class="${item.tier}"
                style="
                    margin-bottom:6px;
                "
            >
                ${tierName}
            </div>

            <div
                class="text-dim"
                style="
                    font-size:15px;
                    margin-bottom:9px;
                "
            >
                Jakość:
                <strong class="text-gold">
                    ${item.qualityPercent}%
                </strong>

                <br>

                Power:
                <strong class="text-gold">
                    ${item.power}
                </strong>
            </div>

            <div
                style="
                    width:100%;
                    max-width:280px;
                    text-align:left;
                    padding:10px;
                    background:#080d14;
                    border:1px solid var(--border);
                "
            >
                ${statsHtml}
                ${affixHtml}
            </div>

            <div
                class="text-dim"
                style="
                    margin-top:10px;
                    font-size:13px;
                "
            >
                ULEPSZENIE:
                +${item.upgradeLevel}
            </div>
        `;

        result.style.opacity =
            "0";

        result.style.transform =
            "scale(.92)";

        requestAnimationFrame(
            () => {

                result.style.transition =
                    "opacity .2s ease, transform .2s ease";

                result.style.opacity =
                    "1";

                result.style.transform =
                    "scale(1)";
            }
        );
    }

    /* =====================================================
       DEBUG
       ===================================================== */

    window.debugRollItem =
        function debugRollItem(
            chestType = "basic"
        ) {

            return window.rollItem(
                chestType
            );
        };

    window.debugGiveLoot =
        function debugGiveLoot(
            itemName
        ) {

            const base =
                lootTable.find(
                    item =>
                        item.name ===
                        itemName
                );

            if (
                !base
            ) {

                console.warn(
                    "Nie znaleziono itemu:",
                    itemName
                );

                return null;
            }

            const item =
                createRolledItem(
                    base,
                    "basic"
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
       GET CHESTS
       ===================================================== */

    window.getGachaChests =
        function getGachaChests() {

            return {
                ...GACHA_CONFIG.chests
            };
        };

    /* =====================================================
       GET ITEM POWER
       ===================================================== */

    window.getLootItemPower =
        function getLootItemPower(
            item
        ) {

            return calculateItemPower(
                item
            );
        };

})();
