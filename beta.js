const mod = ModAPI
mod.meta.title("DeathClient")
mod.meta.description("The best hacked client on EaglerForge!")
mod.meta.credits("By Death68093\n - Creator of Everything...")
mod.meta.version("V1.0")

mod.require("player")
mod.require("world")

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
        },
         esp: {
            enabled: false,
            target: null
        },
    },
};

// ==== Commands ==== //
mod.addEventListener("sendchatmessage", (e) => {
    var msg = e.message.toLowerCase();
    var args = msg.split(" ");
    if (msg.startsWith(".")) { 
        e.preventDefault = true;
    };

    // === SPEED === //
    if (msg.startsWith(".speed")) {
        var newSpeed = parseFloat(args[1]) || 2
        if (!isNaN(newSpeed)) {
            config.hacks.speed.speed = newSpeed;
            mod.displayToChat(`[DC] Speed Set to: ${newSpeed}`)
        } else {
            config.hacks.speed.enabled = !config.hacks.speed.enabled;
            var t = "Enabled"
            if (config.hacks.speed.enabled) {
                t = "Enabled";
            } else {
                t = "Disabled";
            };
            mod.displayToChat(`[DC] Speed ${t}`)
        }
    };

    // === JUMP === //
    if (msg.startsWith(".jump")) {
        var newJump = parseFloat(args[1]) || 2
        if (!isNaN(newJump)) {
            config.hacks.jump.jump = newJump;
            mod.displayToChat(`[DC] Jump Set to: ${newJump}`)
        } else {
            config.hacks.jump.enabled = !config.hacks.jump.enabled;
            var t = "Enabled"
            if (config.hacks.jump.enabled) {
                t = "Enabled";
            } else {
                t = "Disabled";
            };
            mod.displayToChat(`[DC] Jump ${t}`)
        }
    };

    // === STEP === //
    if (msg.startsWith(".step")) {
        var sub = args[1];
        var newStep = parseFloat(args[2]);
        if (sub === "height" && !isNaN(newStep)) {
            config.hacks.step.stepHeight = newStep;
            mod.displayToChat(`[DC] Step height set to: ${newStep}`)
        } else {
            config.hacks.step.enabled = !config.hacks.step.enabled;
            var t = "Enabled"
            if (config.hacks.step.enabled) {
                t = "Enabled";
            } else {
                t = "Disabled";
            };
            mod.displayToChat(`[DC] Step ${t}`)
        }
    };

});

function step() {
    if(!config.hacks.step.enabled) {
        mod.player.stepHeight = 0.5;
        return
    };
    mod.player.stepHeight = config.hacks.step.stepHeight;
}
mod.addEventListener("update", step);



mod.addEventListener("sendchatmessage", (e) => {
    const msg = e.message.toLowerCase();
    const args = msg.split(" ");
    if (!msg.startsWith(".")) return;
    e.preventDefault = true;

    if (msg.startsWith(".esp")) {
        const sub = args[1];
        const target = args[2];

        if (sub === "enable") {
            config.hacks.esp.enabled = true;
            config.hacks.esp.target = target || null;
            mod.displayToChat(`[DC] ESP Enabled${target ? " for " + target : ""}`);
        } 
        else if (sub === "disable") {
            config.hacks.esp.enabled = false;
            config.hacks.esp.target = null;
            mod.displayToChat("[DC] ESP Disabled");
        } 
        else {
            mod.displayToChat("[DC] Usage: .esp <enable|disable> [specific_target]");
        }
    }
});

// === KEYBIND (Z) === //
mod.addEventListener("keydown", (e) => {
    if (e.key === "z") {
        config.hacks.esp.enabled = !config.hacks.esp.enabled;
        mod.displayToChat(`[DC] ESP ${config.hacks.esp.enabled ? "Enabled" : "Disabled"}`);
    }
});

// === ESP DRAW === //
function drawESP() {
    if (!config.hacks.esp.enabled) return;
    const players = mod.world.players;
    for (let i = 0; i < players.length; i++) {
        const p = players[i];
        if (p === mod.player) continue;

        if (config.hacks.esp.target && p.name.toLowerCase() !== config.hacks.esp.target.toLowerCase()) continue;

        const pos = p.pos;
        const color = [1, 0, 0, 1]; // red box
        mod.drawBox(pos.x - 0.5, pos.y, pos.z - 0.5, pos.x + 0.5, pos.y + 1.8, pos.z + 0.5, color);
    }
}
mod.addEventListener("render3d", drawESP);

