const mod = ModAPI
mod.meta.title("DeathClient")
mod.meta.description("The best hacked client on EaglerForge!")
mod.meta.credits("DeathClient", "By Death68093\n - Creator of everything...")
mod.meta.version("V1.0")

mod.require("player")

// ==== Config ==== //
var config = {
    hacks: {
        speed: {
            speed: 2,
            enabled: false
        },
        jump: {
            jump: 2,
            enabled: false
        },
        fly: {
            speed: 10,
            enabled: false
        },
        vclip: {
            maxDist: 10,
        },
        step: {
            stepHeight: 0.5,
            enabled: false
        }
    },
};

// ==== Commands ==== //
mod.addEventListener("sendchatmessage", (e) => {
    var raw = e.message || "";
    var msg = raw.toLowerCase();

    
    if (msg.startsWith(".")) {
        e.PreventDefault = true;
    } else {
        return; // not a command
    }

    var parts = msg.slice(1).split(/\s+/);
    var cmd = parts.shift();
    var arg = parts[0];

    function parseArgNumber(a, fallback) {
        if (typeof a === "undefined") return null;
        var n = parseFloat(a);
        return isNaN(n) ? null : n;
    }

    if (cmd === "speed") {
        var n = parseArgNumber(arg);
        if (n !== null) {
            config.hacks.speed.speed = n;
            mod.displayChatMessage(`[DC] Speed Set to: ${n}`)
        } else {
            config.hacks.speed.enabled = !config.hacks.speed.enabled;
            mod.displayChatMessage(`[DC] Speed ${config.hacks.speed.enabled ? "Enabled" : "Disabled"}`)
        }
    }

    if (cmd === "jump") {
        var n = parseArgNumber(arg);
        if (n !== null) {
            config.hacks.jump.jump = n;
            mod.displayChatMessage(`[DC] Jump Set to: ${n}`)
        } else {
            config.hacks.jump.enabled = !config.hacks.jump.enabled;
            mod.displayChatMessage(`[DC] Jump ${config.hacks.jump.enabled ? "Enabled" : "Disabled"}`)
        }
    }

    if (cmd === "step") {
        var n = parseArgNumber(arg);
        if (n !== null) {
            config.hacks.step.stepHeight = n;
            mod.displayChatMessage(`[DC] Step Height Set to: ${n}`)
        } else {
            config.hacks.step.enabled = !config.hacks.step.enabled;
            mod.displayChatMessage(`[DC] Step ${config.hacks.step.enabled ? "Enabled" : "Disabled"}`)
        }
    }
});

function stepe() {
    if (!mod.player) return;
    if (!config.hacks.step.enabled) {
        mod.player.stepHeight = 0.5;
        return;
    }
    mod.player.stepHeight = config.hacks.step.stepHeight;
}
ModAPI.addEventListener("update", stepe);
