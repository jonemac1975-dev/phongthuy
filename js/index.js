import {readData} from "../scripts/firebaseService.js";
const MODULE_PATH = "./pages/";
const MODULE_CACHE = {};
const contentArea = document.getElementById("content-area");

const modules = {
    lichvannien: "lichvannien.html",
    banmenh: "banmenh.html",
    duongtrachhuyenkhong: "duongtrachhuyenkhong.html",
    khaimon: "khaimon.html",
    duongtrachtamyeu: "duongtrachtamyeu.html",
    admin: "admin.html",
    tailieu: "tailieu.html"
    
};

async function loadModule(name){
    if (!contentArea) return;
    const file = modules[name];
if (name === "lichvannien") {
    if (!document.querySelector('link[href="./css/lichvannien.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./css/lichvannien.css";
        document.head.appendChild(link);
    }
}

if (name === "banmenh") {
    if (!document.querySelector('link[href="./css/banmenh.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./css/banmenh.css";
        document.head.appendChild(link);
    }
}

if (name === "duongtrachhuyenkhong") {
    if (!document.querySelector('link[href="./css/duongtrachhuyenkhong.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./css/duongtrachhuyenkhong.css";
        document.head.appendChild(link);
    }
}

if (name === "khaimon") {
    if (!document.querySelector('link[href="./css/khaimon.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./css/khaimon.css";
        document.head.appendChild(link);
    }
}

if (name === "duongtrachtamyeu") {
    if (!document.querySelector('link[href="./css/duongtrachtamyeu.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./css/duongtrachtamyeu.css";
        document.head.appendChild(link);
    }
}

if (name === "admin") {
    if (!document.querySelector('link[href="./css/admin.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./css/admin.css";
        document.head.appendChild(link);
    }
}

if (name === "tailieu") {
    if (!document.querySelector('link[href="./css/tailieu.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./css/tailieu.css";
        document.head.appendChild(link);
    }
}

    if (!file) {
        contentArea.innerHTML = `
            <div class="content-placeholder">
                <div class="placeholder-icon">📚</div>
                <h3>Tài liệu tham khảo</h3>
                <p>Nội dung đang được xây dựng.</p>
                <button class="back-button" id="content-back">← Quay lại</button>
            </div>
        `;
        bindBackButton();
        return;
    }

    contentArea.innerHTML = `
        <div class="content-placeholder">
            <div class="placeholder-icon">⏳</div>
            <h3>Đang tải...</h3>
            <p>Vui lòng chờ một chút.</p>
        </div>
    `;

    try {
        if (!MODULE_CACHE[name]) {
            const response = await fetch(MODULE_PATH + file);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            MODULE_CACHE[name] = await response.text();

        }
        contentArea.innerHTML = `
    <div class="module-content">
        <button class="back-button" id="content-back">← Quay lại</button>
        ${MODULE_CACHE[name]}
    </div>
`;
bindBackButton();

if (name === "lichvannien") {
    
    const module = await import("./lichvannien.js");
    if (typeof module.init === "function") {
          await module.init();
    }
}

if (name === "banmenh") {
    const module = await import("./banmenh.js");
    if (typeof module.init === "function") {
        await module.init();
    }
}

if (name === "duongtrachhuyenkhong") {
    const module = await import("./duongtrachhuyenkhong.js");
    if (typeof module.init === "function") {
        await module.init();
    }
}

if (name === "khaimon") {
    const module = await import("./khaimon.js");
    if (typeof module.init === "function") {
        await module.init();
    }
}

if (name === "duongtrachtamyeu") {
    const module = await import("./duongtrachtamyeu.js");
    if (typeof module.init === "function") {
        await module.init();
    }
}

if (name === "admin") {
    const module = await import("./admin.js");
    if (typeof module.init === "function") {
        await module.init();
    }
}

if (name === "tailieu") {
    const module = await import("./tailieu.js");
    if (typeof module.init === "function") {
        await module.init();
    }
}
window.scrollTo({top:contentArea.offsetTop - 20,behavior:"smooth"});
    } catch (error) {
        console.error("Lỗi tải module:",error);
        contentArea.innerHTML = `
            <div class="content-placeholder">
                <div class="placeholder-icon">⚠️</div>
                <h3>Không thể tải nội dung</h3>
                <p>Vui lòng kiểm tra lại file module.</p>
                <button class="back-button" id="content-back">← Quay lại</button>
            </div>
        `;
        bindBackButton();
    }
}

function bindBackButton(){
    const button = document.getElementById("content-back");
    if (button) button.addEventListener("click",showHome);
}

function showHome(){
    contentArea.innerHTML = `
        <div class="content-placeholder">
            <div class="placeholder-icon">☯</div>
            <h3>Chọn một công cụ</h3>
            <p>Nội dung sẽ được hiển thị tại đây.</p>
        </div>
    `;
    window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll(".tool-card").forEach(card=>{
    card.addEventListener("click",()=>{
        const name = card.dataset.module;
        loadModule(name);
    });
});


document.querySelectorAll(".footer-item").forEach(item=>{
item.addEventListener("click",async()=>{
        const type = item.dataset.footer;
        if (type === "info") {
            contentArea.innerHTML = `
                <div class="content-placeholder">
                    <div class="placeholder-icon">ℹ️</div>
                    <h3>Thông tin</h3>
                    <p>Trang phong thủy thông dụng.</p>
                    <button class="back-button" id="content-back">← Quay lại</button>
                </div>
            `;
            bindBackButton();
        }
        if (type === "contact") {
            contentArea.innerHTML = `
                <div class="content-placeholder">
                    <div class="placeholder-icon">✉️</div>
                    <h3>Liên hệ</h3>
                    <p>Thông tin liên hệ sẽ được cập nhật.</p>
                    <button class="back-button" id="content-back">← Quay lại</button>
                </div>
            `;
            bindBackButton();
        }
        if (type === "admin") {
    const password=prompt("🔐 Nhập mật khẩu Admin:");
    if (password===null) return;
    const hashBuffer=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(password));
    const hash=Array.from(new Uint8Array(hashBuffer)).map(b=>b.toString(16).padStart(2,"0")).join("");
    
    const adminHash=await readData("/admin/passwordHash");
    console.log("🔥 ADMIN HASH FIREBASE:",adminHash);
    if (hash!==adminHash) {
        alert("❌ Mật khẩu không đúng!");
        return;
    }
    loadModule("admin");
}
    });
});

