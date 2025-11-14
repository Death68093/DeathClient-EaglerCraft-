const mod = ModAPI;
mod.meta.title("GetPlayer");
mod.meta.description("Just tells you everything about the player");
mod.meta.credits("By Death68093\n - Creator of Everything...");
mod.meta.version("V1.0");

mod.require("player");

mod.addEventListener("sendchatmessage", (e) => {
    const msg = (e.message || "").toLowerCase();
    if (!msg.startsWith(".")) return;

    e.preventDefault = true;

    if (msg.startsWith(".player")) {
        mod.displayToChat("[DC] Player Data:");

        // Use corrective proxy to safely access all properties
        const player = mod.player.getCorrective();

        for (let key in player) {
            let val = player[key];

            // Skip functions
            if (typeof val === "function") continue;

            try {
                // Some values may throw when accessed
                mod.displayToChat(`${key}: ${val}`);
            } catch (err) {
                mod.displayToChat(`${key}: <unavailable>`);
            }
        }
    }
});
