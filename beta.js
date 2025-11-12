ModAPI.meta.title("DeathClient");
ModAPI.meta.description("Hack your way to the top!");
ModAPI.meta.credits("By Death68093");
ModAPI.meta.version("v1.0");
ModAPI.require("player");

var config = {
    step: { height: 0.5, enabled: false },
    speed: { speed: 2, enabled: false },
    jump: { jump: 2, enabled: false },
    fly: { speed: 10, enabled: false }
};

// ==== VCLIP ====
(function VClipExploit() {
    ModAPI.addEventListener("sendchatmessage", (ev) => {
        var msg = (ev.message || "").toLowerCase();
        if (!msg.startsWith(".vclip")) return;
        ev.preventDefault = true;

        var parts = msg.split(/\s+/);
        var yOffset = parseFloat(parts[1]) || 1;
        var force = parts.includes("--force");

        if (!force && Math.abs(yOffset) > 10) {
            ModAPI.displayToChat("[DC] You can only clip up to 10 blocks! Use --force to override!");
            return;
        }

        ModAPI.player.setPosition(ModAPI.player.posX, ModAPI.player.posY + yOffset, ModAPI.player.posZ);
        ModAPI.displayToChat("[DC] VClipped " + yOffset + " blocks.");
    });
})();

// ==== WAYPOINTS ====
(function Waypoints() {
    ModAPI.dedicatedServer.appendCode(async () => {

        function initDB(dbName, storeName) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName, 2);
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName);
                    resolve(db);
                };
                request.onsuccess = (event) => resolve(event.target.result);
                request.onerror = (event) => reject('Error opening DB: ' + event.target.errorCode);
            });
        }

        function storeString(dbName, storeName, key, value) {
            return initDB(dbName, storeName).then(db => new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const putReq = store.put(value, key);
                putReq.onsuccess = () => resolve();
                putReq.onerror = (e) => reject('Error storing: ' + e.target.errorCode);
            }));
        }

        function retrieveString(dbName, storeName, key) {
            return initDB(dbName, storeName).then(db => new Promise((resolve) => {
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const getReq = store.get(key);
                getReq.onsuccess = () => resolve(getReq.result || '');
                getReq.onerror = () => resolve('');
            }));
        }

        var data = {};
        try { data = JSON.parse(await retrieveString("waypoints_db", "waypoints", "waypoints")); } catch(e){}

        async function saveData() { await storeString("waypoints_db", "waypoints", "waypoints", JSON.stringify(data)); }

        ModAPI.addEventListener("processcommand", (e) => {
            if (!ModAPI.reflect.getClassById("net.minecraft.entity.player.EntityPlayerMP").instanceOf(e.sender.getRef())) return;

            const name = ModAPI.util.unstring(e.sender.getName().getRef());

            // SET WP
            if (e.command.toLowerCase().startsWith("/setwp ") && e.sender.canCommandSenderUseCommand(2, ModAPI.util.str("setwp"))) {
                e.preventDefault = true;
                const pos = e.sender.getPosition();
                var waypointId = (e.command.split(" ")[1] || "waypoint").replace(/[^a-zA-Z0-9_]/gm, "_");
                if (!data[name]) data[name] = {};
                data[name][waypointId] = [pos.x,pos.y,pos.z,e.sender.dimension];
                saveData();
                e.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str("Set waypoint " + waypointId + ".")));
            }

            // TELEPORT TO WP
            if (e.command.toLowerCase().startsWith("/wp ") && e.sender.canCommandSenderUseCommand(2, ModAPI.util.str("wp"))) {
                e.preventDefault = true;
                const wpId = e.command.split(" ")[1];
                if (wpId && Array.isArray(data?.[name]?.[wpId])) {
                    if (data[name][wpId][3] !== e.sender.dimension) e.sender.travelToDimension(data[name][wpId][3]);
                    e.sender.setPositionAndUpdate(...data[name][wpId]);
                    e.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str("Teleported to waypoint " + wpId + ".")));
                } else e.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str("No such waypoint.")));
            }

            // REMOVE WP
            if (e.command.toLowerCase().startsWith("/remwp ") && e.sender.canCommandSenderUseCommand(2, ModAPI.util.str("remwp"))) {
                e.preventDefault = true;
                const wpId = (e.command.split(" ")[1] || "waypoint");
                if (!data[name]) data[name] = {};
                delete data[name][wpId];
                saveData();
                e.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str("Removed waypoint " + wpId + ".")));
            }

            // LIST WPs
            if (e.command.toLowerCase() === "/listwp" && e.sender.canCommandSenderUseCommand(2, ModAPI.util.str("listwp"))) {
                e.preventDefault = true;
                if (!data[name]) data[name] = {};
                e.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str("Your waypoints: " + Object.keys(data[name]).join(", "))));
            }
        });
    });
})();

// ==== VEINMINER ====
(function TreeChopperMod() {
    globalThis.VEINMINERCONF = { doLogs: true, doOres: true, doGravel: false, doClay: false };
    try { Object.assign(VEINMINERCONF, JSON.parse(localStorage.getItem("trc_mod::conf") || "{}")); } catch(e){}

    ModAPI.meta.config(() => {
        var conf = document.createElement("div");
        conf.innerHTML = `
        <h1>Vein Miner Settings&nbsp;<a href="javascript:void(0)" onclick="this.parentElement.parentElement.remove()" style="color:red">[X]</a></h1>
        <sub>Refresh page to apply settings</sub><br>
        <label>Veinmine Logs: </label><input type=checkbox ${VEINMINERCONF.doLogs ? "checked" : ""} oninput="VEINMINERCONF.doLogs=this.checked; this.parentElement.__save();"><br>
        <label>Veinmine Ores: </label><input type=checkbox ${VEINMINERCONF.doOres ? "checked" : ""} oninput="VEINMINERCONF.doOres=this.checked; this.parentElement.__save();"><br>
        <label>Veinmine Gravel: </label><input type=checkbox ${VEINMINERCONF.doGravel ? "checked" : ""} oninput="VEINMINERCONF.doGravel=this.checked; this.parentElement.__save();"><br>
        <label>Veinmine Clay: </label><input type=checkbox ${VEINMINERCONF.doClay ? "checked" : ""} oninput="VEINMINERCONF.doClay=this.checked; this.parentElement.__save();"><br>
        `;
        conf.style = "position: fixed; background-color: white; color: black; width: 100vw; height: 100vh; z-index: 256; top:0; left:0;";
        conf.__save = () => localStorage.setItem("trc_mod::conf", JSON.stringify(VEINMINERCONF));
        document.body.appendChild(conf);
    });

    ModAPI.dedicatedServer.appendCode(`globalThis.VEINMINERCONF = ${JSON.stringify(VEINMINERCONF)};`);

    ModAPI.dedicatedServer.appendCode(function() {
        ModAPI.addEventListener("bootstrap", () => {
            const axes = [ModAPI.items.iron_axe, ModAPI.items.stone_axe, ModAPI.items.golden_axe, ModAPI.items.wooden_axe, ModAPI.items.diamond_axe].map(x => x.getRef());
            const targettedBlockIds = [];
            if (VEINMINERCONF.doLogs) targettedBlockIds.push("log","log2");
            if (VEINMINERCONF.doOres) targettedBlockIds.push("coal_ore","gold_ore","iron_ore","lapis_ore","quartz_ore","diamond_ore","emerald_ore","redstone_ore","lit_redstone_ore");
            if (VEINMINERCONF.doGravel) targettedBlockIds.push("gravel");
            if (VEINMINERCONF.doClay) targettedBlockIds.push("clay");
            const validBlocks = targettedBlockIds.map(x => ModAPI.blocks[x].getRef());

            function getNeighbors(pos) {
                return [
                    pos.up(1), pos.down(1), pos.north(1), pos.south(1), pos.east(1), pos.west(1),
                    pos.up(1).north(1), pos.up(1).south(1), pos.up(1).east(1), pos.up(1).west(1),
                    pos.down(1).north(1), pos.down(1).south(1), pos.down(1).east(1), pos.down(1).west(1)
                ];
            }

            async function getBlockGraph(blockPos, getBlockState, targetType) {
                const closed = [JSON.stringify(blockPos)];
                const logs = [];
                const open = [...getNeighbors(blockPos)];
                const maxIters = 120;
                let i = 0;
                while(open.length>0 && i<maxIters) {
                    const target = open.pop();
                    closed.push(JSON.stringify(target));
                    i++;
                    const state = await getBlockState(target.getRef());
                    if(state.block.getRef()===targetType) {
                        logs.push(target);
                        open.push(...getNeighbors(target).filter(x=>!closed.includes(JSON.stringify(x))));
                    }
                }
                return logs;
            }

            validBlocks.forEach(b => {
                const original = b.$harvestBlock;
                b.$harvestBlock = function($w,$p,$pos,$state,$tile,...args) {
                    const player = ModAPI.util.wrap($p);
                    if(player.isSneaking()) {
                        ModAPI.promisify(async()=>{
                            const blocks = await getBlockGraph(ModAPI.util.wrap($pos), ModAPI.promisify(ModAPI.util.wrap($w).getBlockState), b);
                            for(const bl of blocks) await ModAPI.promisify(player.interactionManager.tryHarvestBlock)(bl.getRef());
                        })();
                    }
                    original.apply(this,[$w,$p,$pos,$state,$tile,...args]);
                }
            });
        });
    });
})();
