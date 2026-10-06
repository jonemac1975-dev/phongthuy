//======================================================
// ADMIN
//======================================================

import {readData,writeData} from "../scripts/firebaseService.js";

//======================================================
// CHUYỂN TAB
//======================================================

document.querySelectorAll(".admin-tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
        const tabName=tab.dataset.tab;
        document.querySelectorAll(".admin-tab").forEach(item=>item.classList.remove("active"));
        document.querySelectorAll(".admin-tab-content").forEach(content=>content.classList.remove("active"));
        tab.classList.add("active");
        const content=document.getElementById("tab-"+tabName);
        if (content) content.classList.add("active");
    });
});

//======================================================
// DANH MỤC
//======================================================

const danhMucTen=document.getElementById("danhmuc-ten");
const danhMucSave=document.getElementById("danhmuc-save");
const danhMucList=document.getElementById("danhmuc-list");
let danhMucEditId=null;

async function loadDanhMuc(){
    const data=await readData("/admin/danhmuc");
    danhMucList.innerHTML="";
    if (!data) return;
    let stt=1;
    Object.entries(data).forEach(([id,item])=>{
        const tr=document.createElement("tr");
        tr.innerHTML=`
            <td>${stt++}</td>
            <td>${item.ten||""}</td>
            <td>
                <button onclick="editDanhMuc('${id}')">Sửa</button>
                <button onclick="deleteDanhMuc('${id}')">Xóa</button>
            </td>
        `;
        danhMucList.appendChild(tr);
    });
}

const taiLieuDanhMuc=document.getElementById("tailieu-danhmuc");

async function loadTaiLieuDanhMuc(){
    if (!taiLieuDanhMuc) return;
    const data=await readData("/admin/danhmuc");
    taiLieuDanhMuc.innerHTML=`<option value="">-- Chọn danh mục --</option>`;
    if (!data) return;
    Object.entries(data).forEach(([id,item])=>{
        const option=document.createElement("option");
        option.value=id;
        option.textContent=item.ten||"";
        taiLieuDanhMuc.appendChild(option);
    });
}


const taiLieuTen=document.getElementById("tailieu-ten");
const taiLieuLink=document.getElementById("tailieu-link");
const taiLieuSave=document.getElementById("tailieu-save");
const taiLieuList=document.getElementById("tailieu-list");
let taiLieuEditId=null;

async function loadTaiLieu(){
    const data=await readData("/admin/tailieu");
    taiLieuList.innerHTML="";
    if (!data) return;
    let stt=1;
    Object.entries(data).forEach(([id,item])=>{
        const tr=document.createElement("tr");
        tr.innerHTML=`
            <td>${stt++}</td>
            <td>${item.ten||""}</td>
            <td><a href="${item.link||"#"}" target="_blank">${item.link||""}</a></td>
            <td>
                <button onclick="editTaiLieu('${id}')">Sửa</button>
                <button onclick="deleteTaiLieu('${id}')">Xóa</button>
            </td>
        `;
        taiLieuList.appendChild(tr);
    });
}

taiLieuSave.addEventListener("click",async()=>{
    const danhmuc=taiLieuDanhMuc.value;
    const ten=taiLieuTen.value.trim();
    const link=taiLieuLink.value.trim();

    if (!danhmuc){
        alert("⚠️ Anh chưa chọn danh mục!");
        taiLieuDanhMuc.focus();
        return;
    }

    if (!ten){
        alert("⚠️ Anh chưa nhập tên tài liệu!");
        taiLieuTen.focus();
        return;
    }

    if (!link){
        alert("⚠️ Anh chưa nhập Link GG!");
        taiLieuLink.focus();
        return;
    }

    const data=await readData("/admin/tailieu")||{};

    if (taiLieuEditId){
        data[taiLieuEditId]={
            danhmuc:danhmuc,
            ten:ten,
            link:link
        };
        await writeData("/admin/tailieu",data);
        taiLieuEditId=null;
        taiLieuSave.textContent="Lưu";
        taiLieuDanhMuc.value="";
        taiLieuTen.value="";
        taiLieuLink.value="";
        const cancel=document.getElementById("tailieu-cancel");
        if (cancel) cancel.remove();
        await loadTaiLieu();
        alert("✅ Đã cập nhật tài liệu!");
        return;
    }

    const id="tl_"+Date.now();
    data[id]={
        danhmuc:danhmuc,
        ten:ten,
        link:link
    };

    await writeData("/admin/tailieu",data);
    taiLieuDanhMuc.value="";
    taiLieuTen.value="";
    taiLieuLink.value="";
    await loadTaiLieu();
    alert("✅ Đã lưu tài liệu!");
});

window.editTaiLieu=async function(id){
    const data=await readData("/admin/tailieu");
    if (!data||!data[id]) return;

    taiLieuEditId=id;
    taiLieuDanhMuc.value=data[id].danhmuc||"";
    taiLieuTen.value=data[id].ten||"";
    taiLieuLink.value=data[id].link||"";
    taiLieuSave.textContent="Lưu thay đổi";
    taiLieuDanhMuc.focus();

    if (!document.getElementById("tailieu-cancel")){
        const cancel=document.createElement("button");
        cancel.id="tailieu-cancel";
        cancel.type="button";
        cancel.textContent="Hủy sửa";
        cancel.style.marginLeft="8px";
        taiLieuSave.parentElement.appendChild(cancel);

        cancel.addEventListener("click",()=>{
            taiLieuEditId=null;
            taiLieuDanhMuc.value="";
            taiLieuTen.value="";
            taiLieuLink.value="";
            taiLieuSave.textContent="Lưu";
            cancel.remove();
        });
    }
};

window.deleteTaiLieu=async function(id){
    const data=await readData("/admin/tailieu");
    if (!data||!data[id]) return;

    const ok=confirm(`⚠️ Anh có chắc muốn xóa tài liệu "${data[id].ten}" không?`);
    if (!ok) return;

    delete data[id];
    await writeData("/admin/tailieu",data);

    if (taiLieuEditId===id){
        taiLieuEditId=null;
        taiLieuDanhMuc.value="";
        taiLieuTen.value="";
        taiLieuLink.value="";
        taiLieuSave.textContent="Lưu";
        const cancel=document.getElementById("tailieu-cancel");
        if (cancel) cancel.remove();
    }

    await loadTaiLieu();
    alert("✅ Đã xóa tài liệu!");
};

danhMucSave.addEventListener("click",async()=>{
    const ten=danhMucTen.value.trim();
    if (!ten){
        alert("⚠️ Anh chưa nhập tên danh mục!");
        danhMucTen.focus();
        return;
    }

    const data=await readData("/admin/danhmuc")||{};

    if (danhMucEditId){
        data[danhMucEditId].ten=ten;
        await writeData("/admin/danhmuc",data);
        danhMucEditId=null;
        danhMucSave.textContent="Lưu";
        danhMucTen.value="";
        const cancel=document.getElementById("danhmuc-cancel");
        if (cancel) cancel.remove();
        await loadDanhMuc();
        alert("✅ Đã cập nhật danh mục!");
        return;
    }

    const id="dm_"+Date.now();
    data[id]={ten};
    await writeData("/admin/danhmuc",data);
    danhMucTen.value="";
    await loadDanhMuc();
    alert("✅ Đã lưu danh mục!");
});

window.editDanhMuc=async function(id){
    const data=await readData("/admin/danhmuc");
    if (!data||!data[id]) return;

    danhMucEditId=id;
    danhMucTen.value=data[id].ten||"";
    danhMucTen.focus();
    danhMucSave.textContent="Lưu thay đổi";

    if (!document.getElementById("danhmuc-cancel")){
        const cancel=document.createElement("button");
        cancel.id="danhmuc-cancel";
        cancel.type="button";
        cancel.textContent="Hủy sửa";
        cancel.style.marginLeft="8px";
        danhMucSave.parentElement.appendChild(cancel);

        cancel.addEventListener("click",()=>{
            danhMucEditId=null;
            danhMucTen.value="";
            danhMucSave.textContent="Lưu";
            cancel.remove();
        });
    }
};

window.deleteDanhMuc=async function(id){
    const data=await readData("/admin/danhmuc");
    if (!data||!data[id]) return;

    const ok=confirm(`⚠️ Anh có chắc muốn xóa danh mục "${data[id].ten}" không?`);
    if (!ok) return;

    delete data[id];
    await writeData("/admin/danhmuc",data);

    if (danhMucEditId===id){
        danhMucEditId=null;
        danhMucTen.value="";
        danhMucSave.textContent="Lưu";
        const cancel=document.getElementById("danhmuc-cancel");
        if (cancel) cancel.remove();
    }

    await loadDanhMuc();
    alert("✅ Đã xóa danh mục!");
};

loadDanhMuc();
loadTaiLieuDanhMuc();
loadTaiLieu();

const adminChangePassword=document.getElementById("admin-change-password");

async function hashPassword(password){
    const hashBuffer=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(password));
    return Array.from(new Uint8Array(hashBuffer)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

adminChangePassword.addEventListener("click",async()=>{
    const currentPassword=prompt("🔐 Nhập mật khẩu hiện tại:");
    if (currentPassword===null) return;

    const currentHash=await hashPassword(currentPassword);
    const adminHash=await readData("/admin/passwordHash");

    if (currentHash!==adminHash){
        alert("❌ Mật khẩu hiện tại không đúng!");
        return;
    }

    const newPassword=prompt("🔑 Nhập mật khẩu mới:");
    if (newPassword===null) return;

    if (newPassword.length<6){
        alert("⚠️ Mật khẩu mới phải có ít nhất 6 ký tự!");
        return;
    }

    const confirmPassword=prompt("🔑 Nhập lại mật khẩu mới:");
    if (confirmPassword===null) return;

    if (newPassword!==confirmPassword){
        alert("❌ Hai mật khẩu mới không giống nhau!");
        return;
    }

    const newHash=await hashPassword(newPassword);
    await writeData("/admin/passwordHash",newHash);

    alert("✅ Đổi mật khẩu thành công!");
});