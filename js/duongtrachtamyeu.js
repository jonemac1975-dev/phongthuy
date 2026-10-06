import {readData} from "../scripts/firebaseService.js";

let dataCuatoa=null;
let dataCuabep=null;
let dataToabep=null;

async function loadData(){
    if(dataCuatoa && dataCuabep && dataToabep) return;
    [dataCuatoa,dataCuabep,dataToabep]=await Promise.all([
        readData("/duongtrachtamyeu/cuatoa"),
        readData("/duongtrachtamyeu/cuabep"),
        readData("/duongtrachtamyeu/toabep")
    ]);
    if(!dataCuatoa || !dataCuabep || !dataToabep) throw new Error("Không tìm thấy dữ liệu Dương Trạch Tam Yếu trên Firebase");
}

function setHTML(id,value){
    const el=document.getElementById(id);
    if(el) el.innerHTML=value??"";
}

function renderText(value){
    if(!value) return "";
    if(Array.isArray(value)) return value.join("<br>");
    return String(value).replace(/\n/g,"<br>");
}

function clearResult(){
    setHTML("cucnha","");
    setHTML("chinhbep","");
    setHTML("toanhabep","");
    setHTML("cucnha_text","");
    setHTML("kieunha","");
    setHTML("diengiai","");
    setHTML("chinhbep_text","");
    setHTML("chugiai","");
    setHTML("toanhabep_text","");
    setHTML("ynghia","");
}

async function xem(){
    const selCua=document.getElementById("cua");
    const selToa=document.getElementById("toa");
    const selBep=document.getElementById("bep");

    if(!selCua || !selToa || !selBep) return;

    if(!selCua.value || !selToa.value || !selBep.value){
        alert("Vui lòng chọn đủ Cửa – Tọa – Bếp");
        return;
    }

    const cua=selCua.value;
    const toa=selToa.value;
    const bep=selBep.value;

    const keyCuabep=`${cua}_${bep}`;
    const keyCuatoa=`${cua}_${toa}`;
    const keyToabep=`${toa}_${bep}`;

    console.log("KEY:",keyCuatoa,keyCuabep,keyToabep);

    await loadData();

    const cuabep=dataCuabep?.[keyCuabep];
    const cuatoa=dataCuatoa?.[keyCuatoa];
    const toabep=dataToabep?.[keyToabep];

    if(!cuatoa || !cuabep || !toabep){
        alert("Không có dữ liệu cho tổ hợp này");
        clearResult();
        return;
    }

    setHTML("cucnha",cuatoa.cucnha);
    setHTML("chinhbep",cuabep.chinhbep);
    setHTML("toanhabep",toabep.toanhabep);

    setHTML("cucnha_text",cuatoa.cucnha);
    setHTML("kieunha",cuatoa.kieunha);
    setHTML("diengiai",renderText(cuatoa.diengiai));

    setHTML("chinhbep_text",cuabep.chinhbep);
    setHTML("chugiai",renderText(cuabep.chugiai));

    setHTML("toanhabep_text",toabep.toanhabep);
    setHTML("ynghia",renderText(toabep.ynghia));
}

export async function init(){
    const selCua=document.getElementById("cua");
    const selToa=document.getElementById("toa");
    const selBep=document.getElementById("bep");
    const btn=document.getElementById("btnXem");

    if(!selCua || !selToa || !selBep || !btn) return;

    clearResult();

    btn.addEventListener("click",xem);
}