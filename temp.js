const mod = ModAPI;
mod.meta.title("GetPlayer");
mod.meta.description("Just tells you everything about the player");
mod.meta.credits("By Death68093\n - Creator of Everything...");
mod.meta.version("V1.0");

mod.require("player");

mod.addEventListener("sendchatmessage", (e) => {
    const msg = e.message.toLowerCase();
    if (!msg.startsWith(".")) return;

    e.preventDefault = true;

    if (msg.startsWith(".player")) {
        mod.displayToChat("[DC] Player Data:");

        for (let key in mod.player) {
            let val = mod.player[key];

            // functions can't be printed
            if (typeof val === "function") continue;

            try {
                mod.displayToChat(`${key}: ${val}`);
            } catch (err) {
                mod.displayToChat(`${key}: <unavailable>`);
            }
        }
    }
});
