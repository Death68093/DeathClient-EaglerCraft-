//all versions
const versionData = {
    "1.8": ["0.0.1-indev", "1.8.9-beta"],
    "1.12": []
};
const menu = document.getElementById("version-menu");

for (const majorVersion in versionData) {
    const block = document.createElement("div");
    block.className = "version-block";

    const title = document.createElement("h2");
    title.textContent = `Version ${majorVersion}`;
    block.appendChild(title);

    versionData[majorVersion].forEach(v => {
        const btn = document.createElement("button");
        
        if(v.toLowerCase().includes("beta")) {
            btn.innerHTML = `${v} <span style="color: red; font-size: 0.8em;">(BETA)</span>`;
        } else {
            btn.textContent = v;
        }

        btn.onclick = () => {
            // Format the current version data so the modal menu can read it
            const versionDataObj = {
                name: v,
                isBeta: v.toLowerCase().includes("beta"),
                hasJS: true,   // Assuming all your versions have a JS file
                hasWASM: true, // Set to true if it has a WASM file
                urlJS: `versions/${majorVersion}/legit/${v}/index.html`,
                urlWASM: `versions/${majorVersion}/legit/${v}/wasm.html` // Change this if your WASM file is named differently
            };
            
            // Send the data to the modal. "false" means they didn't use the "Play Latest" button.
            handleVersionSelect(versionDataObj, false);
        };
        block.appendChild(btn);
    });

    menu.appendChild(block);
}