import {readData} from "../scripts/firebaseService.js";

let dataKhaiMon=null;

async function loadData(){
    if(dataKhaiMon) return dataKhaiMon;
    dataKhaiMon=await Promise.all([
        readData("/khaimon/cuuvan"),
        readData("/khaimon/khaimon")
    ]);
    if(!dataKhaiMon[0] || !dataKhaiMon[1]) throw new Error("Không tìm thấy dữ liệu khaimon trên Firebase");
    return dataKhaiMon;
}

const HOA_GIAP=[
    ["Giáp Tý","giapti"],["Ất Sửu","atsuu"],["Bính Dần","binhdan"],["Đinh Mão","dinhmao"],["Mậu Thìn","mauthin"],["Kỷ Tỵ","kyty"],["Canh Ngọ","canhngo"],["Tân Mùi","tanmui"],["Nhâm Thân","nhamthan"],["Quý Dậu","quydau"],
    ["Giáp Tuất","giaptuat"],["Ất Hợi","athoi"],["Bính Tý","binhti"],["Đinh Sửu","dinhsuu"],["Mậu Dần","maudan"],["Kỷ Mão","kymao"],["Canh Thìn","canhthin"],["Tân Tỵ","tanty"],["Nhâm Ngọ","nhamngo"],["Quý Mùi","quymui"],
    ["Giáp Thân","giapthan"],["Ất Dậu","atdau"],["Bính Tuất","binhtuat"],["Đinh Hợi","dinhhoi"],["Mậu Tý","mauti"],["Kỷ Sửu","kysuu"],["Canh Dần","canhdan"],["Tân Mão","tanmao"],["Nhâm Thìn","nhamthin"],["Quý Tỵ","quyty"],
    ["Giáp Ngọ","giapngo"],["Ất Mùi","atmui"],["Bính Thân","binhthan"],["Đinh Dậu","dinhdau"],["Mậu Tuất","mautuat"],["Kỷ Hợi","kyhoi"],["Canh Tý","canhti"],["Tân Sửu","tansuu"],["Nhâm Dần","nhamdan"],["Quý Mão","quymao"],
    ["Giáp Thìn","giapthin"],["Ất Tỵ","atty"],["Bính Ngọ","binhngo"],["Đinh Mùi","dinhmui"],["Mậu Thân","mauthan"],["Kỷ Dậu","kydau"],["Canh Tuất","canhtuat"],["Tân Hợi","tanhoi"],["Nhâm Tý","nhamti"],["Quý Sửu","quysuu"],
    ["Giáp Dần","giapdan"],["Ất Mão","atmao"],["Bính Thìn","binhthin"],["Đinh Tỵ","dinhty"],["Mậu Ngọ","maungo"],["Kỷ Mùi","kymui"],["Canh Ngọ","canhngo"],["Tân Dậu","tandau"],["Nhâm Tuất","nhamtuat"],["Quý Hợi","quyhoi"]
];

const CUU_CUNG=["ton","ly","khon","chan","trung","doai","cans","kham","can"];
const CUU_VAN_IDS=["tonv","tonn","tont","tonlmq","lyv","lyn","lyt","lylmq","khonv","khonn","khont","khonlmq","chanv","chann","chant","chanlmq","tcv","tcn","tct","tclmq","doaiv","doain","doait","doailmq","cansv","cansn","canst","canslmq","khamv","khamn","khamt","khamlmq","canv","cann","cant","canlmq"];

function setText(id,value){
    const el=document.getElementById(id);
    if(el) el.textContent=value??"";
}

function clearIds(ids){
    ids.forEach(id=>setText(id,""));
}

function initCuuVanDropdown(dataCuuVan){
    const namSel=document.getElementById("namSelect");
    const thangSel=document.getElementById("thangSelect");
    if(!namSel || !thangSel) return;

    namSel.innerHTML="";
    thangSel.innerHTML="";

    for(let y=2024;y<=2043;y++) namSel.add(new Option(y,y));
    for(let m=1;m<=12;m++) thangSel.add(new Option(m,m));

    namSel.value=2024;
    thangSel.value=1;

    const load=()=>{
const key=`${thangSel.value}_${namSel.value}`;
        const data=dataCuuVan?.[key];
        if(!data){
            clearIds(CUU_VAN_IDS);
            return;
        }
        CUU_VAN_IDS.forEach(id=>setText(id,data[id]));
    };

    namSel.addEventListener("change",load);
    thangSel.addEventListener("change",load);
    load();
}

function initKhaiMonDropdown(dataKhaiMon){
    const toaSel=document.getElementById("toaSelect");
    const cuaSel=document.getElementById("cuaSelect");
    if(!toaSel || !cuaSel) return;

    toaSel.innerHTML="";
    cuaSel.innerHTML="";

    HOA_GIAP.forEach(([label,value])=>{
        toaSel.add(new Option(label,value));
        cuaSel.add(new Option(label,value));
    });

    toaSel.selectedIndex=0;
    cuaSel.selectedIndex=0;

    const load=()=>{
const key=`${toaSel.value}_${cuaSel.value}`;
        const data=dataKhaiMon?.[key];
        if(!data){
            clearIds(CUU_CUNG);
            return;
        }
        CUU_CUNG.forEach(id=>setText(id,data[id]));
    };

    toaSel.addEventListener("change",load);
    cuaSel.addEventListener("change",load);
    load();
}

export async function init(){
    const [dataCuuVan,dataKhaiMon]=await loadData();
    initCuuVanDropdown(dataCuuVan);
    initKhaiMonDropdown(dataKhaiMon);
}