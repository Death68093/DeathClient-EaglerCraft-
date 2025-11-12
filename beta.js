ModAPI.meta.title("DeathClient");
ModAPI.meta.description("Hack your way to the top!");
ModAPI.meta.credits("By Death68093");

ModAPI.require("player");

var config = {
    step: {
        height: 0.5,
        enabled: false
    },
    speed: {
        speed: 2,
        enabled: false
    }.
};

// Vclip
(function VClipExploit() {
    ModAPI.addEventListener("sendchatmessage", (ev) => {
        var msg = (ev.message || "").toLowerCase();
        if (!msg.startsWith(".vclip")) return;

        ev.preventDefault = true;
        var parts = msg.split(/\s+/);
        var yOffset = parseFloat(parts[1]);
        if (isNaN(yOffset)) yOffset = 1;

        var force = parts.includes("--force");

        if (!force && Math.abs(yOffset) > 10) {
            ModAPI.displayToChat("[DC] You can only clip up to 10 blocks! use the --force flag to ignore!");
            return;
        }

        ModAPI.player.setPosition(
            ModAPI.player.posX,
            ModAPI.player.posY + yOffset,
            ModAPI.player.posZ
        );

        ModAPI.displayToChat("[DC] VClipped " + yOffset + " blocks.");
    });
})();

// HighStep
function step() {
    if (!config.step.enabled) return;
    ModAPI.player.stepHeight = config.step.height;
}

// ==== COMMANDS ==== //

// .step Command
ModAPI.addEventListener("sendchatmessage", (ev) => {
    var msg = (ev.message || "").toLowerCase();
    if (!msg.startsWith(".step")) return;

    ev.preventDefault = true;
    var args = msg.split(/\s+/);
    var sub = args[1];

    if (sub === "enable") {
        config.step.enabled = true;
        ModAPI.displayToChat("[DC] Step enabled");
        return;
    }

    if (sub === "disable") {
        config.step.enabled = false;
        ModAPI.displayToChat("[DC] Step disabled");
        return;
    }

    if (sub === "height") {
        var h = parseFloat(args[2]);
        if (!isNaN(h)) {
            config.step.height = h;
            ModAPI.displayToChat("[DC] Step height set to " + config.step.height);
        } else {
            ModAPI.displayToChat("[DC] Invalid height. Usage: .step height <number>");
        }
        return;
    }

    // no subcommand -> toggle
    config.step.enabled = !config.step.enabled;
    ModAPI.displayToChat("[DC] Step " + (config.step.enabled ? "enabled" : "disabled"));
});

// .tp Command
ModAPI.addEventListener("sendchatmessage", (ev) => {
    var msg = (ev.message || "").toLowerCase();
    if (!msg.startsWith(".tp")) return;
    ev.preventDefault = true;

    var args = msg.split(/\s+/);
    var force = args.includes("--force");

    // coords: .tp x y z [--force]
    if (args[1] && args[2] && args[3]) {
        var x = parseFloat(args[1]);
        var y = parseFloat(args[2]);
        var z = parseFloat(args[3]);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            ModAPI.displayToChat("[DC] Invalid coordinates!");
            return;
        }

        var dx = x - ModAPI.player.posX;
        var dy = y - ModAPI.player.posY;
        var dz = z - ModAPI.player.posZ;
        var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (!force && distance > 10) {
            ModAPI.displayToChat("[DC] You can only teleport up to 10 blocks! Use --force to override.");
            return;
        }

        ModAPI.player.setPosition(x, y, z);
        ModAPI.displayToChat(`[DC] Teleported to coordinates: ${x}, ${y}, ${z}` + (force ? " (force)" : ""));
        return;
    }

    // player: .tp <playerName>
    if (args[1]) {
        var targetName = args[1];
        var target = (ModAPI.world && ModAPI.world.players)
            ? ModAPI.world.players.find(p => p.name && p.name.toLowerCase() === targetName)
            : null;

        if (!target) {
            ModAPI.displayToChat("[DC] Player not found!");
            return;
        }

        ModAPI.player.setPosition(target.posX, target.posY, target.posZ);
        ModAPI.displayToChat(`[DC] Teleported to player: ${target.name}`);
        return;
    }

    ModAPI.displayToChat("[DC] Usage: .tp <x> <y> <z> [--force] OR .tp <player>");
});

var flyConfig = {
    enabled: false,
    speed: 200 // adjust as needed
};

// Fly logic
function fly() {
    if (!flyConfig.enabled) return;

    var input = ModAPI.player.input || { forward: 0, back: 0, left: 0, right: 0, up: 0, down: 0 };

    // horizontal movement
    ModAPI.player.motionX = (input.right - input.left) * flyConfig.speed;
    ModAPI.player.motionZ = (input.forward - input.back) * flyConfig.speed;

    // vertical movement
    ModAPI.player.motionY = (input.up - input.down) * flyConfig.speed;
}

// Speed command
ModAPI.addEventListener("sendchatmessage", (ev) => {
    
};

// Update events
ModAPI.addEventListener("update", fly);

// Fly and Speed commands
ModAPI.addEventListener("sendchatmessage", (ev) => {
    var msg = (ev.message || "").toLowerCase();
    var args = msg.split(/\s+/);

    // Fly command
    if (msg.startsWith(".fly")) {
        ev.preventDefault = true;
        var sub = args[1];

        if (sub === "enable") {
            flyConfig.enabled = true;
            ModAPI.displayToChat("[DC] Fly enabled");
        } else if (sub === "disable") {
            flyConfig.enabled = false;
            ModAPI.displayToChat("[DC] Fly disabled");
        } else if (sub === "speed") {
            var s = parseFloat(args[2]);
            if (!isNaN(s)) {
                flyConfig.speed = s;
                ModAPI.displayToChat("[DC] Fly speed set to " + flyConfig.speed);
            } else {
                ModAPI.displayToChat("[DC] Invalid speed. Usage: .fly speed <number>");
            }
        } else {
            flyConfig.enabled = !flyConfig.enabled;
            ModAPI.displayToChat("[DC] Fly " + (flyConfig.enabled ? "enabled" : "disabled"));
        }
    }

    // Speed command
    if (msg.startsWith(".speed")) {
        ev.preventDefault = true;
        var num = parseFloat(args[1]);
        if (!isNaN(num)) {
            applySpeed(num);
            ModAPI.displayToChat("[DC] Speed increased by " + num);
        } else {
            ModAPI.displayToChat("[DC] Usage: .speed <number>");
        }
    }
});


// .help Command
ModAPI.addEventListener("sendchatmessage", (ev) => {
    var msg = (ev.message || "").toLowerCase();
    if (!msg.startsWith(".help")) return;
    ev.preventDefault = true;

    var commands = [
        ".vclip <blocks> [--force] - Teleport vertically",
        ".step enable|disable|height <value> - Toggle or set step height",
        ".tp <x> <y> <z> [--force] - Teleport to coordinates",
        ".tp <player> - Teleport to a player",
        ".help - Show this help message"
    ];

    ModAPI.displayToChat("[DC] Available Commands:");
    commands.forEach(cmd => ModAPI.displayToChat(cmd));
});



ModAPI.addEventListener("update", step);
ModAPI.addEventListener("update", speed);
