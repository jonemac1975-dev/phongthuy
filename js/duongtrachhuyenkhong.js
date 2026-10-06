import {readData} from "../scripts/firebaseService.js";
import {convertSolar2Lunar,jdFromDate} from "./doiamduong.js";

export async function init(){
    const $ = id => document.getElementById(id);
    const setText = (id,v) => {
        const el = $(id);
        if(el) el.textContent = v ?? "--";
    };

const [duongtrachAll,vanbanAll,cachcucAll,longvanAll,molongAll,thansatAll] = await Promise.all([
    readData("/duongtrachhuyenkhong/duongtrach"),
    readData("/duongtrachhuyenkhong/vanbban"),
    readData("/duongtrachhuyenkhong/cachcuc"),
    readData("/duongtrachhuyenkhong/longvan"),
    readData("/duongtrachhuyenkhong/molong"),
    readData("/duongtrachhuyenkhong/thansat")
]);

    const Can = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
    const Chi = ["Tí","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const huongKey = {"Tý":"ti","Tỵ":"ty"};
const getHuongKey = s => huongKey[s] || s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");

    const inputDate = $("solarDate");
    const inputHour = $("solarHour");
    const selHuong = $("huong");
    const btnXem = $("btnXem");

const compassDisc = $("dthk-compass-disc");
const compassDeg = $("dthk-compass-deg");
const compassMountain = $("dthk-compass-mountain");

const compassDirections = {
    nham:{name:"Sơn Nhâm",deg:345},
    ti:{name:"Sơn Tý",deg:0},
    quy:{name:"Sơn Quý",deg:15},
    suu:{name:"Sơn Sửu",deg:30},
    can:{name:"Sơn Cấn",deg:45},
    dan:{name:"Sơn Dần",deg:60},
    giap:{name:"Sơn Giáp",deg:75},
    mao:{name:"Sơn Mão",deg:90},
    at:{name:"Sơn Ất",deg:105},
    thin:{name:"Sơn Thìn",deg:120},
    ton:{name:"Sơn Tốn",deg:135},
    ty:{name:"Sơn Tỵ",deg:150},
    binh:{name:"Sơn Bính",deg:165},
    ngo:{name:"Sơn Ngọ",deg:180},
    dinh:{name:"Sơn Đinh",deg:195},
    mui:{name:"Sơn Mùi",deg:210},
    khon:{name:"Sơn Khôn",deg:225},
    than:{name:"Sơn Thân",deg:240},
    canh:{name:"Sơn Canh",deg:255},
    dau:{name:"Sơn Dậu",deg:270},
    tan:{name:"Sơn Tân",deg:285},
    tuat:{name:"Sơn Tuất",deg:300},
    can_:{name:"Sơn Càn",deg:315},
    hoi:{name:"Sơn Hợi",deg:330}
};

if(selHuong){
    selHuong.addEventListener("change",()=>{
        const key=getHuongKey(selHuong.value);
        const data=compassDirections[key];
        if(!data)return;
        if(compassDisc) compassDisc.style.transform=`rotate(${180-data.deg}deg)`;
        if(compassDeg) compassDeg.textContent=`${data.deg}°`;
        if(compassMountain) compassMountain.textContent=data.name;
    });
}
    const t = new Date();
    if(inputDate) inputDate.value = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;

    if(!btnXem) return;

    btnXem.addEventListener("click",()=>{
        if(!inputDate.value || !selHuong?.value) return;

        const [y,m,d] = inputDate.value.split("-").map(Number);
        const hour = Number(inputHour?.value || 0);

        const lunar = convertSolar2Lunar(d,m,y,7);
        const jd = jdFromDate(d,m,y);

        const canNam = Can[(lunar[2]+6)%10];
        const chiNam = Chi[(lunar[2]+8)%12];
        const canTh = Can[(lunar[2]*12+lunar[1]+3)%10];
        const chiTh = Chi[(lunar[1]+1)%12];
        const canNg = Can[(jd+9)%10];
        const chiNg = Chi[(jd+1)%12];
        const chiGio = Chi[Math.floor((hour+1)/2)%12];
        const canGio = Can[((Can.indexOf(canNg)*2)+Math.floor((hour+1)/2))%10];

        setText("ngayam",`${lunar[0]}/${lunar[1]}/${lunar[2]}`);
        setText("canchinam",`${canNam} ${chiNam}`);
        setText("canchithang",`${canTh} ${chiTh}`);
        setText("canchingay",`${canNg} ${chiNg}`);
        setText("canchigio",`${canGio} ${chiGio}`);

const dth = duongtrachAll?.[getHuongKey(selHuong.value)];
        if(dth){
            setText("sontoa",dth.sontoa);
            setText("sonhuong",dth.sonhuong);
            setText("cungtoa",dth.cungtoa);
            setText("cunghuong",dth.cunghuong);
            setText("phuongtoa",dth.phuongtoa);
            setText("phuonghuong",dth.phuonghuong);
            setText("dotoa",dth.dotoa);
            setText("dohuong",dth.dohuong);
            setText("longtoa",dth.longtoa);
            setText("longhuong",dth.longhuong);
            setText("phucduc",dth.phucduc);
            setText("monphai",dth.monphai);
            setText("montrai",dth.montrai);
            setText("batsat",dth.batsat);
            setText("tulo",dth.tulo);
            setText("kiepsat",dth.kiepsat);
        }

const vb = vanbanAll?.[getHuongKey(selHuong.value)];
if(vb){
    const cung = ["tc","tb","t","d","n","b","db","tn","dn"];
    cung.forEach(c=>{
        [1,2,3].forEach(i=>{
            const id = `${c}${i}`;
            const el = $(id);
            if(!el) return;
            const v = vb[id];
            let color = "#222";
            if(v===9) color="#c62828";
            if(v===1) color="#2e7d32";
            if(v===2) color="#1565c0";
            el.innerHTML = `<strong style="color:${color}">${v ?? "--"}</strong>`;
        });
    });

const cc = cachcucAll?.[getHuongKey(selHuong.value)];
if(cc){
    setText("cc1",cc.cc1);
    setText("ghichucc1",cc.ghichucc1);
    setText("cc2",cc.cc2);
    setText("ghichucc2",cc.ghichucc2);
    setText("cc3",cc.cc3);
    setText("ghichucc3",cc.ghichucc3);
}
const longvanKey = `${chiNam}${selHuong.value}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const lv = longvanAll?.[longvanKey];
if(lv){
    setText("tenvantoa",lv.tenvantoa);
    setText("thovantoa",lv.thovantoa);
    setText("ynghiatoa",lv.ynghiatoa);
    setText("tenvanhuong",lv.tenvanhuong);
    setText("thovanhuong",lv.thovanhuong);
    setText("ynghiahuong",lv.ynghiahuong);
}else{
    setText("tenvantoa","--");
    setText("thovantoa","--");
    setText("ynghiatoa","--");
    setText("tenvanhuong","--");
    setText("thovanhuong","--");
    setText("ynghiahuong","--");
}
const mo = molongAll?.[lunar[2]];
if(mo){
    for(let i=1;i<=5;i++){
        setText(`mo${i}`,mo[`mo${i}`]);
        setText(`nh${i}`,mo[`nh${i}`]);
        setText(`tch${i}`,mo[`tch${i}`]);
    }
}
const ts = Object.values(thansatAll || {}).filter(t => t.namam === lunar[2]);
for(const t of ts){
    const huong = getHuongKey(t.tenhuong);
    setText(`ts_${huong}_cat`,t.saocat);
    setText(`ts_${huong}_hung`,t.saohung);
}
}
    });
}