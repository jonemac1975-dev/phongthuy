import { getNapAm } from "./doiamduong.js";

const Can = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
const Chi = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

function fillCanChiThang() {
    const eCanNam = document.getElementById("canamnam");
    const eThangAm = document.getElementById("am-month");
    if (!eCanNam || !eThangAm) return;

    const canNam = eCanNam.textContent.trim();
    const lunarMonthText = eThangAm.textContent.trim();
    if (!canNam || !lunarMonthText || lunarMonthText === "--") return;

    const canNamIndex = Can.indexOf(canNam);
    if (canNamIndex < 0) return;

    const m = parseInt(lunarMonthText);
    if (isNaN(m) || m < 1 || m > 12) return;

    const canIndex = (canNamIndex * 2 + m + 1) % 10;
    const chiIndex = (2 + m - 1) % 12;

    const canThang = Can[canIndex];
    const chiThang = Chi[chiIndex];
    const napThang = getNapAm(canThang, chiThang);

    const outCanThang = document.getElementById("canamthang");
    const outChiThang = document.getElementById("chiamthang");
    const outNapThang = document.getElementById("napamthang");

    if (outCanThang) outCanThang.textContent = canThang;
    if (outChiThang) outChiThang.textContent = chiThang;
    if (outNapThang) outNapThang.textContent = napThang;
}

export { fillCanChiThang };