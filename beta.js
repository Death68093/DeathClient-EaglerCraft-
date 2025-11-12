ModAPI.meta.title("DeathClient");
ModAPI.meta.description("Hack your way to the top!");
ModAPI.meta.credits("By Death68093");
ModAPI.meta.version("v1.0");
ModAPI.require("player");

var config = {
    step: {
        height: 0.5,
        enabled: false
    },
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
    }
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
        };

        ModAPI.player.setPosition(
            ModAPI.player.posX,
            ModAPI.player.posY + yOffset,
            ModAPI.player.posZ
        );

        ModAPI.displayToChat("[DC] VClipped " + yOffset + " blocks.");
    });
})();

// Waypoints
(function Waypoints() {

    ModAPI.dedicatedServer.appendCode(async ()=>{ //The mods should probably be running on the server
        function initDB(dbName, storeName) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName, 2);
        
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName);
                    }
                    resolve(db);
                };
        
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    resolve(db);
                };
        
                request.onerror = (event) => {
                    reject('Error opening database: ' + event.target.errorCode);
                };
            });
        }        
        function storeString(dbName, storeName, key, value) {
            return initDB(dbName, storeName).then((db) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(storeName, 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const putRequest = store.put(value, key);
        
                    putRequest.onsuccess = () => {
                        resolve('String stored successfully.');
                    };
        
                    putRequest.onerror = (event) => {
                        reject('Error storing string: ' + event.target.errorCode);
                    };
                });
            });
        }        
        function retrieveString(dbName, storeName, key) {
            return initDB(dbName, storeName).then((db) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(storeName, 'readonly');
                    const store = transaction.objectStore(storeName);
                    const getRequest = store.get(key);
        
                    getRequest.onsuccess = () => {
                        if (getRequest.result !== undefined) {
                            resolve(getRequest.result);
                        } else {
                            resolve('');
                        }
                    };
        
                    getRequest.onerror = (event) => {
                        resolve('');
                    };
                });
            });
        }        
        

        var data = {};
        try {
            data = JSON.parse(await retrieveString("waypoints_db", "waypoints", "waypoints"));
        } catch(e) {
            //didn't ask
        }

        async function saveData() {
            await storeString("waypoints_db", "waypoints", "waypoints", JSON.stringify(data));
        }
        

        ModAPI.addEventListener("processcommand", (e)=>{
            if (!ModAPI.reflect.getClassById("net.minecraft.entity.player.EntityPlayerMP").instanceOf(e.sender.getRef())) {
                return;
            }

            if (e.command.toLowerCase().startsWith("/setwp ") && e.sender.canCommandSenderUseCommand(2, ModAPI.util.str("setwp"))) {
                e.preventDefault = true;
                var pos = e.sender.getPosition();
                var name = ModAPI.util.unstring(e.sender.getName().getRef());
                var waypointId = e.command.split(" ")[1] || "waypoint";
                waypointId = waypointId.replace(/[^a-zA-Z0-9_]/gm, "_");
                if (!data[name]) {
                    data[name] = {};
                }
                data[name][waypointId] = [pos.x,pos.y,pos.z,e.sender.dimension];
                saveData();
                e.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str("Set waypoint "+waypointId+".")));
            }
            if (e.command.toLowerCase().startsWith("/wp ") && e.sender.canCommandSenderUseCommand(2, ModAPI.util.str("wp"))) {
                e.preventDefault = true;
                var name = ModAPI.util.unstring(e.sender.getName().getRef());
                var waypointId = e.command.split(" ")[1];
                if (waypointId && Array.isArray(data?.[name]?.[waypointId])) {

                    // Wildly important! regular setPosition triggers minecraft's built in anti-cheat and teleports you back in the same tick.
                    if (data?.[name]?.[waypointId]?.[3] && (data?.[name]?.[waypointId]?.[3] !== e.sender.dimension)) {
                        e.sender.travelToDimension(data?.[name]?.[waypointId]?.[3]);
                    }
                    
                    e.sender.setPositionAndUpdate(...data?.[name]?.[waypointId]);

                    e.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str("Teleported to waypoint " + waypointId + ".")));
                } else {
                    e.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str("No such waypoint.")));
                }
            }
            if (e.command.toLowerCase().startsWith("/remwp ") && e.sender.canCommandSenderUseCommand(2, ModAPI.util.str("remwp"))) {
                e.preventDefault = true;
                var name = ModAPI.util.unstring(e.sender.getName().getRef());
                var waypointId = e.command.split(" ")[1] || "waypoint";
                if (!data[name]) {
                    data[name] = {};
                }
                delete data[name][waypointId];
                saveData();
                e.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str("Removed waypoint "+waypointId+".")));
            }
            if ((e.command.toLowerCase() === "/listwp") && e.sender.canCommandSenderUseCommand(2, ModAPI.util.str("listwp"))) {
                e.preventDefault = true;
                var name = ModAPI.util.unstring(e.sender.getName().getRef());
                if (!data[name]) {
                    data[name] = {};
                }
                e.sender.addChatMessage(ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0](ModAPI.util.str("Your waypoints: " + Object.keys(data[name]).join(", "))));
            }
        });
    });
})();

// Veinminer
(function TreeChopperMod() {
    
    globalThis.VEINMINERCONF = {
        doLogs: true,
        doOres: true,
        doGravel: false,
        doClay: false,
    };
    try {
        Object.assign(conf, JSON.parse(localStorage.getItem("trc_mod::conf") || "{}"));
    } catch (error) {
        //swallow
    }
    ModAPI.meta.config(() => {
        var conf = document.createElement("div");
        conf.innerHTML = `
        <h1>Vein Miner Settings&nbsp;<a href="javascript:void(0)" onclick="this.parentElement.parentElement.remove()" style="color:red">[X]</a></h1>
        <sub>Refresh page to apply settings</sub><br>
        <label>Veinmine Logs: </label><input type=checkbox ${VEINMINERCONF.doLogs ? "checked" : ""} oninput="VEINMINERCONF.doLogs = this.checked; this.parentElement.__save();"></input><br>
        <label>Veinmine Ores: </label><input type=checkbox ${VEINMINERCONF.doOres ? "checked" : ""} oninput="VEINMINERCONF.doOres = this.checked; this.parentElement.__save();"></input><br>
        <label>Veinmine Gravel: </label><input type=checkbox ${VEINMINERCONF.doGravel ? "checked" : ""} oninput="VEINMINERCONF.doGravel = this.checked; this.parentElement.__save();"></input><br>
        <label>Veinmine Clay: </label><input type=checkbox ${VEINMINERCONF.doClay ? "checked" : ""} oninput="VEINMINERCONF.doClay = this.checked; this.parentElement.__save();"></input><br>
        `;
        conf.style = "position: fixed; background-color: white; color: black; width: 100vw; height: 100vh; z-index: 256;top:0;left:0;";
        conf.__save = () => localStorage.setItem("trc_mod::conf", JSON.stringify(VEINMINERCONF));
        document.body.appendChild(conf);
    });

    ModAPI.dedicatedServer.appendCode(`globalThis.VEINMINERCONF = ${JSON.stringify(VEINMINERCONF)};`);

    ModAPI.dedicatedServer.appendCode(function () {
        ModAPI.addEventListener("bootstrap", () => {
            const axes = [ModAPI.items.iron_axe, ModAPI.items.stone_axe, ModAPI.items.golden_axe, ModAPI.items.wooden_axe, ModAPI.items.diamond_axe].map(x => x.getRef());
            const logs = ["log", "log2"].map(x => ModAPI.blocks[x].getRef());
            const targettedBlockIds = [];
            if (VEINMINERCONF.doLogs) {
                targettedBlockIds.push("log", "log2");
            }
            if (VEINMINERCONF.doOres) {
                targettedBlockIds.push("coal_ore", "gold_ore", "iron_ore", "lapis_ore", "quartz_ore", "diamond_ore", "emerald_ore", "redstone_ore", "lit_redstone_ore");
            }
            if (VEINMINERCONF.doGravel) {
                targettedBlockIds.push("gravel");
            }
            if (VEINMINERCONF.doClay) {
                targettedBlockIds.push("clay");
            }
            console.log(targettedBlockIds);
            const valid_log_blocks = targettedBlockIds.map(x => ModAPI.blocks[x].getRef());

            function stringifyBlockPos(blockPos) {
                return blockPos.x + "," + blockPos.y + "," + blockPos.z;
            }
            function getNeighbors(blockPos) {
                return [
                    //direct neighbors
                    blockPos.down(1),
                    blockPos.up(1),
                    blockPos.north(1),
                    blockPos.south(1),
                    blockPos.east(1),
                    blockPos.west(1),

                    //edges
                    blockPos.down(1).north(1),
                    blockPos.down(1).south(1),
                    blockPos.down(1).east(1),
                    blockPos.down(1).west(1),
                    blockPos.up(1).north(1),
                    blockPos.up(1).south(1),
                    blockPos.up(1).east(1),
                    blockPos.up(1).west(1),
                    blockPos.north(1).east(1),
                    blockPos.north(1).west(1),
                    blockPos.south(1).east(1),
                    blockPos.south(1).west(1),

                    //corners
                    blockPos.down(1).north(1).east(1),
                    blockPos.down(1).north(1).west(1),
                    blockPos.down(1).south(1).east(1),
                    blockPos.down(1).south(1).west(1),
                    blockPos.up(1).north(1).east(1),
                    blockPos.up(1).north(1).west(1),
                    blockPos.up(1).south(1).east(1),
                    blockPos.up(1).south(1).west(1),
                ];
            }
            async function getBlockGraph(blockPos, getBlockState, targetType) {
                const closed = [stringifyBlockPos(blockPos)];
                const logs = [];
                const open = [...getNeighbors(blockPos)];
                const maxIters = 120;
                var i = 0;
                while (open.length > 0 && i < maxIters) {
                    const target = open.pop();

                    closed.push(stringifyBlockPos(target));

                    i++;
                    const iBlockState = await getBlockState(target.getRef());
                    if (iBlockState.block.getRef() === targetType) {
                        logs.push(target);
                        open.push(...getNeighbors(target).filter(x => !closed.includes(stringifyBlockPos(x))));
                    }
                }
                return logs;
            }

            valid_log_blocks.forEach(b => {
                const originalHarvest = b.$harvestBlock;
                b.$harvestBlock = function ($theWorld, $player, $blockpos, $blockstate, $tileentity, ...args) {
                    const blockState = ModAPI.util.wrap($blockstate);
                    const player = ModAPI.util.wrap($player);
                    if (player.isSneaking() && !ModAPI.util.isCritical() && !(logs.includes(blockState.block.getRef()) && !axes.includes(player.inventory.mainInventory[player.inventory.currentItem]?.getCorrective()?.item?.getRef()))) {
                        ModAPI.promisify(async () => {
                            var world = ModAPI.util.wrap($theWorld);
                            var harvestCall = ModAPI.promisify(ModAPI.is_1_12 ? player.interactionManager.tryHarvestBlock : player.theItemInWorldManager.tryHarvestBlock);
                            const blocks = await getBlockGraph(ModAPI.util.wrap($blockpos), ModAPI.promisify(world.getBlockState), b);
                            for (let i = 0; i < blocks.length; i++) {
                                await harvestCall(blocks[i].getRef());
                            }
                        })();
                    }
                    originalHarvest.apply(this, [$theWorld, $player, $blockpos, $blockstate, $tileentity, ...args]);
                }
            });
        });
    });
})();
