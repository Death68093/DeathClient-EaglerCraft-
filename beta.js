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
        nofall: {
            enabled: false,
        }
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
        var newSpeed = parseFloat(args[1]);
        if (!isNaN(newSpeed)) {
            config.hacks.speed.speed = newSpeed;
            mod.displayToChat(`[DC] Speed Set to: ${newSpeed}`)
        } else {
            config.hacks.speed.enabled = !config.hacks.speed.enabled;
            var t = config.hacks.speed.enabled ? "Enabled" : "Disabled";
            mod.displayToChat(`[DC] Speed ${t}`)
        }
    };

    // === JUMP === //
    if (msg.startsWith(".jump")) {
        var newJump = parseFloat(args[1]);
        if (!isNaN(newJump)) {
            config.hacks.jump.jump = newJump;
            mod.displayToChat(`[DC] Jump Set to: ${newJump}`)
        } else {
            config.hacks.jump.enabled = !config.hacks.jump.enabled;
            var t = config.hacks.jump.enabled ? "Enabled" : "Disabled";
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
            var t = config.hacks.step.enabled ? "Enabled" : "Disabled";
            mod.displayToChat(`[DC] Step ${t}`)
        }
    };

    // === NOFALL === //
    if (msg.startsWith(".nofall")) {
        config.hacks.nofall.enabled = !config.hacks.nofall.enabled;
        var t = config.hacks.nofall.enabled ? "Enabled" : "Disabled";
        mod.displayToChat(`[DC] NoFall ${t}`)
    }
});

// ==== Hack Functions ==== //
function step() {
    if(!config.hacks.step.enabled) {
        mod.player.stepHeight = 0.5;
        return;
    }
    mod.player.stepHeight = config.hacks.step.stepHeight;
}

function speedHack() {
    if (!config.hacks.speed.enabled) return;
    // Move player along X/Z based on motion direction
    let yaw = mod.player.rotationYaw * Math.PI / 180;
    let forward = config.hacks.speed.speed;
    mod.player.motionX += -Math.sin(yaw) * forward;
    mod.player.motionZ += Math.cos(yaw) * forward;
}

function jumpHack() {
    if (!config.hacks.jump.enabled) return;
    if (mod.player.onGround) {
        mod.player.motionY = config.hacks.jump.jump;
    }
}

function nofallHack() {
    if (!config.hacks.nofall.enabled) return;
    if (mod.player.fallDistance > 2) {
        mod.player.motionY = 0;
        mod.player.fallDistance = 0;
    }
}

// ==== Update Event ==== //
mod.addEventListener("update", () => {
    step();
    speedHack();
    jumpHack();
    nofallHack();
});

