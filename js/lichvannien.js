
import {readData} from "../scripts/firebaseService.js";
import {convertSolar2Lunar,jdFromDate,getNapAm} from "./doiamduong.js";
import {fillCanChiThang} from "./thangam.js";

const Can=["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
const Chi=["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const CAN_KEY=["giap","at","binh","dinh","mau","ky","canh","tan","nham","quy"];
const CHI_KEY=["ti","suu","dan","mao","thin","ty","ngo","mui","than","dau","tuat","hoi"];

let dataLich=null;

async function loadData(){
    if (dataLich) return dataLich;
    dataLich=await readData("lichvannien");
    if (!dataLich) throw new Error("Không tìm thấy dữ liệu lichvannien trên Firebase");
    return dataLich;
}

function fillTiet(year,month,day){
    if (!dataLich?.["24tiet"]) return;

    const date=new Date(Date.UTC(year,month-1,day,17,0,0));
    let found=null;

    for (const key of Object.keys(dataLich["24tiet"])) {
        const item=dataLich["24tiet"][key];
        if (!item?.batdau || !item?.ketthuc) continue;

        const start=new Date(item.batdau);
        const end=new Date(item.ketthuc);

        if (date>=start && date<=end) {
            found=item;
            break;
        }
    }

    if (!found) {
        console.warn("⚠️ Không tìm thấy 24 tiết khí:",year,month,day);
        setText("tiet","--");
        return;
    }

    setText("tiet",found.ten);
    
}


function fillSao(year,month,day){
    if (!dataLich?.["28sao"]) return;
    const start=new Date(2023,11,6);
    const current=new Date(year,month-1,day);
    const diff=Math.round((current-start)/86400000);
    const saoIndex=((6-(diff%28))+28)%28;
    const data=Array.isArray(dataLich["28sao"])?dataLich["28sao"]:Object.values(dataLich["28sao"]);
    const item=data.find(sao=>Number(sao.ID)===saoIndex);
    if (!item) {
        console.warn("⚠️ Không tìm thấy 28 sao:",saoIndex);
        setText("sao_ten","--");
        setText("sao_nguhanh","--");
        setText("sao_cathung","--");
        setText("sao_nen","--");
        setText("sao_khongnen","--");
        setText("sao_ngoaile","--");
        return;
    }
    setText("sao_ten",item.Ten);
    setText("sao_nguhanh",item.nguhanh);
    setText("sao_cathung",item.cathung);
    setText("sao_nen",item.nen);
    setText("sao_khongnen",item.khongnen);
    setText("sao_ngoaile",item.ngoaile);
    
}


function fillGioHoangHac(){
    const hoangList=document.getElementById("gio_hoangdao");
    const hacList=document.getElementById("gio_hacdao");
    if (!hoangList || !hacList) return;
    hoangList.innerHTML="";
    hacList.innerHTML="";

    if (!dataLich?.["giohoangdao"] || !dataLich?.["giohacdao"]) return;

    const chiNgay=document.getElementById("chiamngay")?.textContent.trim();
    if (!chiNgay || chiNgay==="--") return;

    const chiKey={"Tý":"ti","Sửu":"suu","Dần":"dan","Mão":"mao","Thìn":"thin","Tỵ":"ty","Ngọ":"ngo","Mùi":"mui","Thân":"than","Dậu":"dau","Tuất":"tuat","Hợi":"hoi"};
    const key=chiKey[chiNgay];
    if (!key) return;

    const hoang=dataLich["giohoangdao"][key];
    const hac=dataLich["giohacdao"][key];

    if (!hoang || !hac) {
        console.warn("⚠️ Không tìm thấy giờ Hoàng/Hắc đạo:",key);
        return;
    }

    for(let i=1;i<=6;i++){
        hoangList.innerHTML+=`<tr><td>${hoang["gio"+i]||"--"}</td><td>${hoang["tengio"+i]||"--"}</td></tr>`;
        hacList.innerHTML+=`<tr><td>${hac["gio"+i]||"--"}</td><td>${hac["tengio"+i]||"--"}</td></tr>`;
    }

    }

function fillHyTai(){
    if (!dataLich?.["hytai"]) return;

    const canNgay=document.getElementById("canamngay")?.textContent.trim();
    if (!canNgay || canNgay==="--") return;

    const canKey={"Giáp":"giap","Ất":"at","Bính":"binh","Đinh":"dinh","Mậu":"mau","Kỷ":"ky","Canh":"canh","Tân":"tan","Nhâm":"nham","Quý":"quy"};
    const key=canKey[canNgay];

    if (!key) {
        console.warn("⚠️ Không xác định được Can ngày:",canNgay);
        return;
    }

    const data=dataLich["hytai"][key];

    if (!data) {
        console.warn("⚠️ Không tìm thấy Hỷ - Tài:",key);
        return;
    }

    setText("hythan",data.hythan);
    setText("taithan",data.taithan);
    setText("loc",data.loc);
    setText("quyam",data.quyam);
    setText("quyduong",data.quyduong);

    
}

function fillNgayXungTuoi(){
    if (!dataLich?.["ngayxungtuoi"]) return;

    const canNgay=document.getElementById("canamngay")?.textContent.trim();
    const chiNgay=document.getElementById("chiamngay")?.textContent.trim();
    if (!canNgay || !chiNgay || canNgay==="--" || chiNgay==="--") return;

    const canKey={"Giáp":"giap","Ất":"at","Bính":"binh","Đinh":"dinh","Mậu":"mau","Kỷ":"ky","Canh":"canh","Tân":"tan","Nhâm":"nham","Quý":"quy"};
    const chiKey={"Tý":"ti","Sửu":"suu","Dần":"dan","Mão":"mao","Thìn":"thin","Tỵ":"ty","Ngọ":"ngo","Mùi":"mui","Thân":"than","Dậu":"dau","Tuất":"tuat","Hợi":"hoi"};

    const key=(canKey[canNgay]||"")+(chiKey[chiNgay]||"");
    if (!key) return;

    const data=dataLich["ngayxungtuoi"][key];

    if (!data) {
        console.warn("⚠️ Không tìm thấy ngày xung tuổi:",key);
        setText("tuoixung","--");
        return;
    }

    setText("tuoixung",data.tuoixung||"--");
    
}

function fillSaoTot(){
    const list=document.getElementById("saotot_chitiet");
    if (!list) return;
    list.innerHTML="";
    if (!dataLich?.["saotot"]) return;
    const canNgay=document.getElementById("canamngay")?.textContent.trim();
    const chiNgay=document.getElementById("chiamngay")?.textContent.trim();
    const thangAm=document.getElementById("am-month")?.textContent.trim();
    if (!canNgay || !chiNgay || !thangAm || canNgay==="--" || chiNgay==="--" || thangAm==="--") return;
    const canKey={"Giáp":"giap","Ất":"at","Bính":"binh","Đinh":"dinh","Mậu":"mau","Kỷ":"ky","Canh":"canh","Tân":"tan","Nhâm":"nham","Quý":"quy"};
    const chiKey={"Tý":"ti","Sửu":"suu","Dần":"dan","Mão":"mao","Thìn":"thin","Tỵ":"ty","Ngọ":"ngo","Mùi":"mui","Thân":"than","Dậu":"dau","Tuất":"tuat","Hợi":"hoi"};
    const match=thangAm.match(/\d+/);
    const thang=match?parseInt(match[0]):0;
    if (!thang) return;
    const keyCan=thang+(canKey[canNgay]||"");
    const keyChi=thang+(chiKey[chiNgay]||"");
    const dataCan=dataLich["saotot"][keyCan];
    const dataChi=dataLich["saotot"][keyChi];
    const addSao=data=>{
        if (!data) return;
        for(let i=1;i<=7;i++){
            const sao=data["sao"+i];
            const ghichu=data["ghichusao"+i]||"--";
            if (!sao) continue;
            list.innerHTML+=`<tr><td>${sao}</td><td>${ghichu}</td></tr>`;
        }
    };
    addSao(dataCan);
    addSao(dataChi);
    
}

function fillSaoXau(){
    const list=document.getElementById("saoxau_chitiet");
    if (!list) return;
    list.innerHTML="";
    if (!dataLich?.["saoxau"]) return;
    const canNgay=document.getElementById("canamngay")?.textContent.trim();
    const chiNgay=document.getElementById("chiamngay")?.textContent.trim();
    const thangAm=document.getElementById("am-month")?.textContent.trim();
    if (!canNgay || !chiNgay || !thangAm || canNgay==="--" || chiNgay==="--" || thangAm==="--") return;
    const canKey={"Giáp":"giap","Ất":"at","Bính":"binh","Đinh":"dinh","Mậu":"mau","Kỷ":"ky","Canh":"canh","Tân":"tan","Nhâm":"nham","Quý":"quy"};
    const chiKey={"Tý":"ti","Sửu":"suu","Dần":"dan","Mão":"mao","Thìn":"thin","Tỵ":"ty","Ngọ":"ngo","Mùi":"mui","Thân":"than","Dậu":"dau","Tuất":"tuat","Hợi":"hoi"};
    const match=thangAm.match(/\d+/);
    const thang=match?parseInt(match[0]):0;
    if (!thang) return;
    const keyCan=thang+(canKey[canNgay]||"");
    const keyChi=thang+(chiKey[chiNgay]||"");
    const dataCan=dataLich["saoxau"][keyCan];
    const dataChi=dataLich["saoxau"][keyChi];
    const addSao=data=>{
        if (!data) return;
        for(let i=1;i<=9;i++){
            const sao=data["sao"+i];
            const ghichu=data["ghichusao"+i]||"--";
            if (!sao) continue;
            list.innerHTML+=`<tr><td>${sao}</td><td>${ghichu}</td></tr>`;
        }
    };
    addSao(dataCan);
    addSao(dataChi);
    
}

function fillBachThan(){
    if (!dataLich?.["bachthan"]) return;
    const canNgay=document.getElementById("canamngay")?.textContent.trim();
    const chiNgay=document.getElementById("chiamngay")?.textContent.trim();
    if (!canNgay || !chiNgay || canNgay==="--" || chiNgay==="--") return;
    const canKey={"Giáp":"giap","Ất":"at","Bính":"binh","Đinh":"dinh","Mậu":"mau","Kỷ":"ky","Canh":"canh","Tân":"tan","Nhâm":"nham","Quý":"quy"};
    const chiKey={"Tý":"ti","Sửu":"suu","Dần":"dan","Mão":"mao","Thìn":"thin","Tỵ":"ty","Ngọ":"ngo","Mùi":"mui","Thân":"than","Dậu":"dau","Tuất":"tuat","Hợi":"hoi"};
    const key=(canKey[canNgay]||"")+(chiKey[chiNgay]||"");
    if (!key) return;
    const data=dataLich["bachthan"][key];
    if (!data) {
        console.warn("⚠️ Không tìm thấy Bách thần:",key);
        setText("bachthan_noingu","--");
        setText("bachthan_dongtho","--");
        setText("bachthan_ynghia","--");
        return;
    }
    setText("bachthan_noingu",data.noingu||"--");
    setText("bachthan_dongtho",data.dongtho||"--");
    setText("bachthan_ynghia",data.ynghia||"--");
    
}

function fillDongCong(){
    if (!dataLich?.["dongcong"]) return;
    const chiNgay=document.getElementById("chiamngay")?.textContent.trim();
    const thangAm=document.getElementById("am-month")?.textContent.trim();
    const truc=document.getElementById("truc")?.textContent.trim();
    if (!chiNgay || !thangAm || !truc || chiNgay==="--" || thangAm==="--" || truc==="--") return;
    const chiKey={"Tý":"ti","Sửu":"suu","Dần":"dan","Mão":"mao","Thìn":"thin","Tỵ":"ty","Ngọ":"ngo","Mùi":"mui","Thân":"than","Dậu":"dau","Tuất":"tuat","Hợi":"hoi"};
    const trucKey={"Kiến":"kien","Trừ":"tru","Mãn":"man","Bình":"binh","Định":"dinh","Chấp":"chap","Phá":"pha","Nguy":"nguy","Thành":"thanh","Thu":"thu","Khai":"khai","Bế":"be"};
    const match=thangAm.match(/\d+/);
    const thang=match?parseInt(match[0]):0;
    if (!thang) return;
    const key=(thang)+(chiKey[chiNgay]||"")+(trucKey[truc]||"");
    if (!key) return;
    const data=dataLich["dongcong"][key];
    if (!data) {
        console.warn("⚠️ Không tìm thấy Đổng Công:",key);
        setText("dongcong_noidung","--");
        return;
    }
    setText("dongcong_noidung",data.noidung||"--");
    
}

function fillThaiAt(){
    if (!dataLich?.["giothaiat"]) return;
    const canNgay=document.getElementById("canamngay")?.textContent.trim();
    if (!canNgay || canNgay==="--") return;
    const canKey={"Giáp":"giap","Ất":"at","Bính":"binh","Đinh":"dinh","Mậu":"mau","Kỷ":"ky","Canh":"canh","Tân":"tan","Nhâm":"nham","Quý":"quy"};
    const key=canKey[canNgay];
    if (!key) return;
    const data=dataLich["giothaiat"][key];
    if (!data) {
        console.warn("⚠️ Không tìm thấy Thái Ất:",key);
        setText("thaivat_can","--");
        setText("giothaiat","--");
        return;
    }
    setText("thaivat_can",data.canamngay||"--");
    setText("giothaiat",data.gio||"--");
    
}

function fillNamXungTuoi(){
    if (!dataLich?.["namxungtuoi"]) return;
    const canNam=document.getElementById("canamnam")?.textContent.trim();
    const chiNam=document.getElementById("chinamnam")?.textContent.trim();
    if (!canNam || !chiNam || canNam==="--" || chiNam==="--") return;
    const canKey={"Giáp":"giap","Ất":"at","Bính":"binh","Đinh":"dinh","Mậu":"mau","Kỷ":"ky","Canh":"canh","Tân":"tan","Nhâm":"nham","Quý":"quy"};
    const chiKey={"Tý":"ti","Sửu":"suu","Dần":"dan","Mão":"mao","Thìn":"thin","Tỵ":"ty","Ngọ":"ngo","Mùi":"mui","Thân":"than","Dậu":"dau","Tuất":"tuat","Hợi":"hoi"};
    const key=(canKey[canNam]||"")+(chiKey[chiNam]||"");
    if (!key) return;
    const data=dataLich["namxungtuoi"][key];
    if (!data) {
        console.warn("⚠️ Không tìm thấy năm xung tuổi:",key);
        setText("namxungtuoi","--");
        return;
    }
    const tuoi=[];
    for(let i=1;i<=6;i++){
        if (data["tuoi"+i]) tuoi.push(data["tuoi"+i]);
    }
    setText("namxungtuoi",tuoi.length?tuoi.join(", "):"--");
    
}

function fillThangXungTuoi(){
    if (!dataLich?.["thangxungtuoi"]) return;
    const canThang=document.getElementById("canamthang")?.textContent.trim();
    const chiThang=document.getElementById("chiamthang")?.textContent.trim();
    if (!canThang || !chiThang || canThang==="--" || chiThang==="--") return;
    const canKey={"Giáp":"giap","Ất":"at","Bính":"binh","Đinh":"dinh","Mậu":"mau","Kỷ":"ky","Canh":"canh","Tân":"tan","Nhâm":"nham","Quý":"quy"};
    const chiKey={"Tý":"ti","Sửu":"suu","Dần":"dan","Mão":"mao","Thìn":"thin","Tỵ":"ty","Ngọ":"ngo","Mùi":"mui","Thân":"than","Dậu":"dau","Tuất":"tuat","Hợi":"hoi"};
    const key=(canKey[canThang]||"")+(chiKey[chiThang]||"");
    if (!key) return;
    const data=dataLich["thangxungtuoi"][key];
    if (!data) {
        console.warn("⚠️ Không tìm thấy tháng xung tuổi:",key);
        setText("thangxungtuoi","--");
        return;
    }
    const tuoi=[];
    for(let i=1;i<=6;i++){
        if (data["tuoi"+i]) tuoi.push(data["tuoi"+i]);
    }
    setText("thangxungtuoi",tuoi.length?tuoi.join(", "):"--");
    
}

function fillHuongNamTotXau(){
    if (!dataLich?.["huongnamtotxau"]) return;
    const chiNam=document.getElementById("chinamnam")?.textContent.trim();
    if (!chiNam || chiNam==="--") return;
    const chiKey={"Tý":"ti","Sửu":"suu","Dần":"dan","Mão":"mao","Thìn":"thin","Tỵ":"ty","Ngọ":"ngo","Mùi":"mui","Thân":"than","Dậu":"dau","Tuất":"tuat","Hợi":"hoi"};
    const key=chiKey[chiNam];
    if (!key) return;
    const data=dataLich["huongnamtotxau"][key];
    if (!data) {
        console.warn("⚠️ Không tìm thấy hướng năm tốt xấu:",key);
        setText("huongnamtot","--");
        setText("huongnamxau","--");
        return;
    }
    setText("huongnamtot",data.huongnamtot||"--");
    setText("huongnamxau",data.huongnamxau||"--");
    
}

function fillTruc(){
    if (!dataLich?.["12truc"]) return;

    const chiNgay=document.getElementById("chiamngay")?.textContent.trim();
    const chiThang=document.getElementById("chiamthang")?.textContent.trim();

    if (!chiNgay || !chiThang || chiNgay==="--" || chiThang==="--") return;

    const chiKey={"Tý":"ti","Sửu":"suu","Dần":"dan","Mão":"mao","Thìn":"thin","Tỵ":"ty","Ngọ":"ngo","Mùi":"mui","Thân":"than","Dậu":"dau","Tuất":"tuat","Hợi":"hoi"};
const key=(chiKey[chiThang]||"")+(chiKey[chiNgay]||"");
    const item=dataLich["12truc"][key];
    if (!item) {
        console.warn("⚠️ Không tìm thấy 12truc:",key);
        return;
    }

    setText("truc",item.truc);
    setText("truc_nen",item.nen);
    setText("truc_khongnen",item.khongnen);
    setText("truc_info",item.nen);

    
}


function getCanChiNam(year){
    const canIndex=(year+6)%10;
    const chiIndex=(year+8)%12;
    return {
        can:Can[canIndex],
        chi:Chi[chiIndex],
        canKey:CAN_KEY[canIndex],
        chiKey:CHI_KEY[chiIndex],
        napAm:getNapAm(Can[canIndex],Chi[chiIndex])
    };
}

function getCanChiNgay(jd){
    const canIndex=(jd+9)%10;
    const chiIndex=(jd+1)%12;
    return {
        can:Can[canIndex],
        chi:Chi[chiIndex],
        canKey:CAN_KEY[canIndex],
        chiKey:CHI_KEY[chiIndex],
        napAm:getNapAm(Can[canIndex],Chi[chiIndex])
    };
}

function getCanChiGio(hour,canNgayIndex){
    const chiIndex=Math.floor((hour+1)/2)%12;
    const canIndex=(canNgayIndex*2+chiIndex)%10;
    return {
        can:Can[canIndex],
        chi:Chi[chiIndex],
        napAm:getNapAm(Can[canIndex],Chi[chiIndex])
    };
}

function setText(id,value){
    const el=document.getElementById(id);
    if (el) el.textContent=value ?? "--";
}

function resetOutput(){
    [
        "ngayam","am-date","am-month","am-year",
        "canamnam","chinamnam","napamnam",
        "canamthang","chiamthang","napamthang",
        "canamngay","chiamngay","napamngay",
        "canamgio","chiamgio","napamgio"
    ].forEach(id=>setText(id,"--"));
}



async function xemLich(){
    const inputDate=document.getElementById("inputDate");
    const inputHour=document.getElementById("inputHour");
    if (!inputDate) return;

    const dateValue=inputDate.value;
    if (!dateValue) {
        alert("Vui lòng chọn ngày.");
        return;
    }

    const parts=dateValue.split("-");
    if (parts.length!==3) return;

    const year=Number(parts[0]);
    const month=Number(parts[1]);
    const day=Number(parts[2]);

    const hour=inputHour ? Number(inputHour.value) : 0;

    if (!year || !month || !day) {
        alert("Ngày không hợp lệ.");
        return;
    }

    try {
        await loadData();

        const lunar=convertSolar2Lunar(day,month,year,7);
        const lunarDay=lunar[0];
        const lunarMonth=lunar[1];
        const lunarYear=lunar[2];

        const jd=jdFromDate(day,month,year);
        const nam=getCanChiNam(lunarYear);
        const ngay=getCanChiNgay(jd);
        const gio=getCanChiGio(hour,Can.indexOf(ngay.can));

        setText("ngayam",`${day}/${month}/${year}`);
        setText("am-date",lunarDay);
        setText("am-month",lunarMonth);
        setText("am-year",lunarYear);

        setText("canamnam",nam.can);
        setText("chinamnam",nam.chi);
        setText("napamnam",nam.napAm);

        setText("canamngay",ngay.can);
        setText("chiamngay",ngay.chi);
        setText("napamngay",ngay.napAm);

        setText("canamgio",gio.can);
        setText("chiamgio",gio.chi);
        setText("napamgio",gio.napAm);

        fillCanChiThang();
	fillTiet(year,month,day);
	fillSao(year,month,day);
	fillGioHoangHac();
	fillHyTai();
	fillNgayXungTuoi();
	fillSaoTot();
	fillSaoXau();
	fillBachThan();
	fillTruc();
	fillDongCong();
	fillThaiAt();
	fillNamXungTuoi();
	fillThangXungTuoi();
	fillHuongNamTotXau();
	

        
    } catch(error) {
        console.error("❌ Lỗi xem lịch:",error);
        alert("Không thể tính lịch. Vui lòng kiểm tra Console.");
    }
}



export async function init(){
    resetOutput();
    await loadData();
    const inputDate=document.getElementById("inputDate");
    const inputHour=document.getElementById("inputHour");
    const now=new Date();
    if(inputDate) inputDate.value=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    if(inputHour) inputHour.value=now.getHours();
    const btn=document.getElementById("btnXem");
    if(btn) btn.onclick=xemLich;
    let lastDate=inputDate?.value||"";
    let lastHour=inputHour?.value||"";

setInterval(()=>{
    const date=inputDate?.value||"";
    const hour=inputHour?.value||"";
    if(date!==lastDate || hour!==lastHour){
        lastDate=date;
        lastHour=hour;
        if(date) xemLich();
    }
},300);
	await xemLich();
}