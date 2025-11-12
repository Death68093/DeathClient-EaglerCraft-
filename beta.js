ModAPI.require("player");

ModAPI.meta.title("DeathClient")
ModAPI.meta.version("V1.0")
ModAPI.meta.credits("Created By: Death68093")
ModAPI.meta.description("Hack your way to the top with this W client!\n Yes, I named this after myself...")
// ModAPI.meta.config(configFn: Function)
ModAPI.addCredit("DeathClient", "Death68093", " - Sexiest mod ever!")

const player = ModAPI.player.getCorrective();
var settings = ModAPI.settings
const items = ModAPI.items

function step() {
    ModAPI.player.stepHeight = 2;
}
function spider() {
    if (ModAPI.player.isCollidedHorizontally) {
        ModAPI.player.motionY = 0.2
    }
}
(function vClip() {
    ModAPI.addEventListener("sendChatMessage", (e) => {
        var str = e.message.toLowerCase();

        if (str.startsWith(".vclip")) {
            e.preventDefault = true;
            var yOffset = 1;
            var args = str.split(" ");
            if (args[1]) {
                yOffset = parseFloat(args[1]) || 0
                if (yOffset > 10) {
                    ModAPI.displayToChat("[DC] You may only clip < 10 blocks");
                };
            }
            ModAPI.player.setPosition(
                ModAPI.player.posX,
                ModAPI.player.posY + yOffset,
                ModAPI.player.posZ
            );
        };
    });
})();
ModAPI.addEventListener("update", spider);
ModAPI.addEventListener("update", step);
