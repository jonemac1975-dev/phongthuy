import {readData} from "../scripts/firebaseService.js";

export async function init(){
    const list=document.getElementById("tailieu-list");
    if (!list) return;

    list.innerHTML=`<div class="tailieu-loading">Đang tải danh mục...</div>`;

    try {
        const danhMuc=await readData("/admin/danhmuc");
        const taiLieu=await readData("/admin/tailieu");

        list.innerHTML="";

        if (!danhMuc){
            list.innerHTML=`<div class="tailieu-empty">Chưa có danh mục tài liệu.</div>`;
            return;
        }

        Object.entries(danhMuc).forEach(([danhMucId,danhMucItem])=>{
            const danhMucBox=document.createElement("div");
            danhMucBox.className="tailieu-category";

            const danhMucButton=document.createElement("button");
            danhMucButton.className="tailieu-category-title";
            danhMucButton.type="button";
            danhMucButton.textContent=danhMucItem.ten||"Danh mục";

            const taiLieuList=document.createElement("div");
            taiLieuList.className="tailieu-items";
            taiLieuList.style.display="none";

            if (taiLieu){
                Object.entries(taiLieu).forEach(([taiLieuId,taiLieuItem])=>{
                    if (taiLieuItem.danhmuc!==danhMucId) return;

                    const link=document.createElement("a");
                    link.className="tailieu-item";
                    link.href=taiLieuItem.link||"#";
                    link.target="_blank";
                    link.rel="noopener noreferrer";
                    link.textContent="+ "+(taiLieuItem.ten||"Tài liệu");

                    taiLieuList.appendChild(link);
                });
            }

            if (!taiLieuList.children.length){
                const empty=document.createElement("div");
                empty.className="tailieu-item-empty";
                empty.textContent="Chưa có tài liệu trong danh mục này.";
                taiLieuList.appendChild(empty);
            }

            danhMucButton.addEventListener("click",()=>{
                const isOpen=taiLieuList.style.display!=="none";
                taiLieuList.style.display=isOpen?"none":"block";
            });

            danhMucBox.appendChild(danhMucButton);
            danhMucBox.appendChild(taiLieuList);
            list.appendChild(danhMucBox);
        });
    } catch(error){
        console.error("Lỗi tải tài liệu:",error);
        list.innerHTML=`<div class="tailieu-empty">⚠️ Không thể tải danh mục tài liệu.</div>`;
    }
}