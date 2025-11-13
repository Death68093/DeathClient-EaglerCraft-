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
        var newStep = parseFloat(args[2]) || 2
        if (args[1] == "height" && !isNaN(newStep)) {
            config.hacks.step.step = newStep;
            mod.displayToChat(`[DC] Step Set to: ${newStep}`)
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



function stepe() {
    if(!config.hacks.step.enabled) {
        mod.player.stepHeight = 0.5;
        return
    };
    mod.player.stepHeight = config.hacks.step.stepHeight;
}
ModAPI.addEventListener("update", stepHackUpdateCode);
