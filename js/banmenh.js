
import {readData} from "../scripts/firebaseService.js";
import {convertSolar2Lunar,jdFromDate} from "./doiamduong.js";
import "./thangam.js";

export async function init(){
    const inputDate=document.getElementById("solarDate");
    const inputHour=document.getElementById("solarHour");
    const btnXem=document.getElementById("btnXem");
    const gioitinh=document.getElementById("gioitinh");

    if(!inputDate||!inputHour||!btnXem||!gioitinh)return;

    function setText(id,value){
        const el=document.getElementById(id);
        if(el)el.textContent=value??"--";
    }

    const Can=["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
    const Chi=["Tí","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

    const napAm={
        "Giáp Tí":"Hải Trung Kim","Ất Sửu":"Hải Trung Kim",
        "Bính Dần":"Lư Trung Hỏa","Đinh Mão":"Lư Trung Hỏa",
        "Mậu Thìn":"Đại Lâm Mộc","Kỷ Tỵ":"Đại Lâm Mộc",
        "Canh Ngọ":"Lộ Bàng Thổ","Tân Mùi":"Lộ Bàng Thổ",
        "Nhâm Thân":"Kiếm Phong Kim","Quý Dậu":"Kiếm Phong Kim",
        "Giáp Tuất":"Sơn Đầu Hỏa","Ất Hợi":"Sơn Đầu Hỏa",
        "Bính Tí":"Giản Hạ Thủy","Đinh Sửu":"Giản Hạ Thủy",
        "Mậu Dần":"Thành Đầu Thổ","Kỷ Mão":"Thành Đầu Thổ",
        "Canh Thìn":"Bạch Lạp Kim","Tân Tỵ":"Bạch Lạp Kim",
        "Nhâm Ngọ":"Dương Liễu Mộc","Quý Mùi":"Dương Liễu Mộc",
        "Giáp Thân":"Tuyền Trung Thủy","Ất Dậu":"Tuyền Trung Thủy",
        "Bính Tuất":"Ốc Thượng Thổ","Đinh Hợi":"Ốc Thượng Thổ",
        "Mậu Tí":"Tích Lịch Hỏa","Kỷ Sửu":"Tích Lịch Hỏa",
        "Canh Dần":"Tùng Bách Mộc","Tân Mão":"Tùng Bách Mộc",
        "Nhâm Thìn":"Trường Lưu Thủy","Quý Tỵ":"Trường Lưu Thủy",
        "Giáp Ngọ":"Sa Trung Kim","Ất Mùi":"Sa Trung Kim",
        "Bính Thân":"Sơn Hạ Hỏa","Đinh Dậu":"Sơn Hạ Hỏa",
        "Mậu Tuất":"Bình Địa Mộc","Kỷ Hợi":"Bình Địa Mộc",
        "Canh Tí":"Bích Thượng Thổ","Tân Sửu":"Bích Thượng Thổ",
        "Nhâm Dần":"Kim Bạch Kim","Quý Mão":"Kim Bạch Kim",
        "Giáp Thìn":"Phúc Đăng Hỏa","Ất Tỵ":"Phúc Đăng Hỏa",
        "Bính Ngọ":"Thiên Hà Thủy","Đinh Mùi":"Thiên Hà Thủy",
        "Mậu Thân":"Đại Dịch Thổ","Kỷ Dậu":"Đại Dịch Thổ",
        "Canh Tuất":"Thoa Xuyến Kim","Tân Hợi":"Thoa Xuyến Kim",
        "Nhâm Tí":"Tang Đố Mộc","Quý Sửu":"Tang Đố Mộc",
        "Giáp Dần":"Đại Khê Thủy","Ất Mão":"Đại Khê Thủy",
        "Bính Thìn":"Sa Trung Thổ","Đinh Tỵ":"Sa Trung Thổ",
        "Mậu Ngọ":"Thiên Thượng Hỏa","Kỷ Mùi":"Thiên Thượng Hỏa",
        "Canh Thân":"Thạch Lựu Mộc","Tân Dậu":"Thạch Lựu Mộc",
        "Nhâm Tuất":"Đại Hải Thủy","Quý Hợi":"Đại Hải Thủy"
    };

    const key=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"");

    function tinhMenhQuai(namSinh,gioiTinh){
        let tong=String(namSinh).split("").reduce((a,b)=>a+Number(b),0);
        while(tong>9)tong=String(tong).split("").reduce((a,b)=>a+Number(b),0);
        let so;
        if(namSinh<2000){
            so=gioiTinh==="nam"?11-tong:4+tong;
        }else{
            so=gioiTinh==="nam"?9-tong:6+tong;
        }
        while(so>9)so-=9;
        if(so===0)so=9;

        const bang={
            1:{menh:"Khảm",nguhanh:"Thủy",phuong:"Bắc",so:1},
            2:{menh:"Khôn",nguhanh:"Thổ",phuong:"Tây Nam",so:2},
            3:{menh:"Chấn",nguhanh:"Mộc",phuong:"Đông",so:3},
            4:{menh:"Tốn",nguhanh:"Mộc",phuong:"Đông Nam",so:4},
            5:gioiTinh==="nam"?{menh:"Khôn",nguhanh:"Thổ",phuong:"Tây Nam",so:2}:{menh:"Cấn",nguhanh:"Thổ",phuong:"Đông Bắc",so:8},
            6:{menh:"Càn",nguhanh:"Kim",phuong:"Tây Bắc",so:6},
            7:{menh:"Đoài",nguhanh:"Kim",phuong:"Tây",so:7},
            8:{menh:"Cấn",nguhanh:"Thổ",phuong:"Đông Bắc",so:8},
            9:{menh:"Ly",nguhanh:"Hỏa",phuong:"Nam",so:9}
        };
        return bang[so];
    }

    const batTrach={
        Khảm:{taybac:"Ngũ Quỷ",bac:"Phục Vị",dongbac:"Ngũ Quỷ",dong:"Thiên Y",dongnam:"Sinh Khí",nam:"Diên Niên",taynam:"Tuyệt Mệnh",tay:"Lục Sát"},
        Khôn:{taybac:"Diên Niên",bac:"Tuyệt Mệnh",dongbac:"Sinh Khí",dong:"Ngũ Quỷ",dongnam:"Ngũ Quỷ",nam:"Thiên Y",taynam:"Phục Vị",tay:"Lục Sát"},
        Chấn:{taybac:"Lục Sát",bac:"Thiên Y",dongbac:"Ngũ Quỷ",dong:"Phục Vị",dongnam:"Diên Niên",nam:"Sinh Khí",taynam:"Tuyệt Mệnh",tay:"Ngũ Quỷ"},
        Tốn:{taybac:"Lục Sát",bac:"Sinh Khí",dongbac:"Tuyệt Mệnh",dong:"Diên Niên",dongnam:"Phục Vị",nam:"Thiên Y",taynam:"Ngũ Quỷ",tay:"Ngũ Quỷ"},
        Càn:{taybac:"Phục Vị",bac:"Lục Sát",dongbac:"Ngũ Quỷ",dong:"Ngũ Quỷ",dongnam:"Tuyệt Mệnh",nam:"Diên Niên",taynam:"Thiên Y",tay:"Sinh Khí"},
        Đoài:{taybac:"Sinh Khí",bac:"Lục Sát",dongbac:"Ngũ Quỷ",dong:"Tuyệt Mệnh",dongnam:"Ngũ Quỷ",nam:"Diên Niên",taynam:"Thiên Y",tay:"Phục Vị"},
        Cấn:{taybac:"Diên Niên",bac:"Ngũ Quỷ",dongbac:"Phục Vị",dong:"Lục Sát",dongnam:"Tuyệt Mệnh",nam:"Ngũ Quỷ",taynam:"Sinh Khí",tay:"Thiên Y"},
        Ly:{taybac:"Tuyệt Mệnh",bac:"Phục Vị",dongbac:"Lục Sát",dong:"Sinh Khí",dongnam:"Thiên Y",nam:"Phục Vị",taynam:"Ngũ Quỷ",tay:"Diên Niên"}
    };

    btnXem.addEventListener("click",async()=>{
        if(!inputDate.value)return;

        const [y,m,d]=inputDate.value.split("-").map(Number);
        const hour=Number(inputHour.value||0);
        const lunar=convertSolar2Lunar(d,m,y,7);
        const jd=jdFromDate(d,m,y);

        const canNam=Can[(lunar[2]+6)%10];
        const chiNam=Chi[(lunar[2]+8)%12];
        const canThang=Can[(lunar[2]*12+lunar[1]+3)%10];
        const chiThang=Chi[(lunar[1]+1)%12];
        const canNgay=Can[(jd+9)%10];
        const chiNgay=Chi[(jd+1)%12];
        const chiGio=Chi[Math.floor((hour+1)/2)%12];
        const canGio=Can[((Can.indexOf(canNgay)*2)+Math.floor((hour+1)/2))%10];

        setText("canchinam",canNam);
        setText("chinam",chiNam);
        setText("canchithang",canThang);
        setText("chithang",chiThang);
        setText("canchingay",canNgay);
        setText("chingay",chiNgay);
        setText("canchigio",canGio);
        setText("chigio",chiGio);

        setText("napamnam",napAm[`${canNam} ${chiNam}`]);
        setText("napamthang",napAm[`${canThang} ${chiThang}`]);
        setText("napamngay",napAm[`${canNgay} ${chiNgay}`]);
        setText("napamgio",napAm[`${canGio} ${chiGio}`]);

        const [nhNam,nhThang,nhNgay,nhGio,locNam,locNgay]=await Promise.all([
            readData("banmenh/nguhanhkhuyetnam"),
            readData("banmenh/nguhanhkhuyetthang"),
            readData("banmenh/nguhanhkhuyetngay"),
            readData("banmenh/nguhanhkhuyetgio"),
            readData("banmenh/locmaquynhannam"),
            readData("banmenh/locmaquynhanngay")
        ]);

        const menhData=tinhMenhQuai(lunar[2],gioitinh.value);
        setText("menh",menhData.menh);
        setText("nguhanh",menhData.nguhanh);
        setText("phuong",menhData.phuong);
        setText("so",menhData.so);

        const bt=batTrach[menhData.menh]||{};
        Object.keys(bt).forEach(k=>setText(k,bt[k]));

        const ln=locNam?.[key(canNam)]||{};
        const ld=locNgay?.[key(canNgay)]||{};

        setText("locnam",ln.loc);
        setText("locngay",ld.loc);
        setText("manam",locNam?.[key(chiNam)]?.ma||"--");
        setText("mangay",locNgay?.[key(chiNgay)]?.ma||"--");
        setText("quyamnam",ln.quyam);
        setText("quyamngay",ld.quyam);
        setText("quyduongnam",ln.quyduong);
        setText("quyduongngay",ld.quyduong);
        setText("vanxuongnam",ln.vanxuong);
        setText("vanxuongngay",ld.vanxuong);
        setText("daohoanam",ln.daohoa);
        setText("daohoangay",ld.daohoa);

        const hanhList=["kim","thuy","moc","hoa","tho"];
        const tong={kim:0,thuy:0,moc:0,hoa:0,tho:0};

        function addHanh(src,c,ch){
            const item=src?.[key(`${c} ${ch}`)];
            if(!item)return;
            hanhList.forEach(h=>tong[h]+=Number(item[h]||0));
        }

        addHanh(nhNam,canNam,chiNam);
        addHanh(nhThang,canThang,chiThang);
        addHanh(nhNgay,canNgay,chiNgay);
        addHanh(nhGio,canGio,chiGio);

        const total=Object.values(tong).reduce((a,b)=>a+b,0)||1;

        hanhList.forEach(h=>{
            const percent=(tong[h]/total)*100;
            const name=h.charAt(0).toUpperCase()+h.slice(1);
            const bar=document.getElementById("bar"+name);
            const pct=document.getElementById("percent"+name);
            if(bar)bar.style.height=Math.max(2,percent*1.8)+"px";
            if(pct)pct.textContent=percent.toFixed(1)+"%";
        });
    });

    const t=new Date();
    inputDate.value=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
    btnXem.click();
}

