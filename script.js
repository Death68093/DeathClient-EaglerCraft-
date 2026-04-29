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
            window.location.href = `versions/${majorVersion}/legit/${v}/index.html`;
        };
        block.appendChild(btn);
    });

    menu.appendChild(block);
}