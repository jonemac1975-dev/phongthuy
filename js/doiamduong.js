/* =====================================================
   LỊCH ÂM DƯƠNG – THUẬT TOÁN HỒ NGỌC ĐỨC (BẢN GIỮ NGUYÊN GỐC)
   Tối ưu cho dự án đa trang – mỗi trang hoạt động độc lập
===================================================== */

function jdFromDate(dd, mm, yy) {
    var a = Math.floor((14 - mm) / 12);
    var y = yy + 4800 - a;
    var m = mm + 12 * a - 3;
    return dd + Math.floor((153 * m + 2) / 5) +
        365 * y + Math.floor(y / 4) - Math.floor(y / 100) +
        Math.floor(y / 400) - 32045;
}

function getNewMoonDay(k, timeZone) {
    var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = Math.PI / 180;

    var Jd1 = 2415020.75933 +
        29.53058868 * k +
        0.0001178 * T2 -
        0.000000155 * T3;

    Jd1 += 0.00033 *
        Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

    var M = 359.2242 +
        29.10535608 * k -
        0.0000333 * T2 -
        0.00000347 * T3;

    var Mpr = 306.0253 +
        385.81691806 * k +
        0.0107306 * T2 +
        0.00001236 * T3;

    var F = 21.2964 +
        390.67050646 * k -
        0.0016528 * T2 -
        0.00000239 * T3;

    var C1 =
        (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
        0.0021 * Math.sin(2 * M * dr) -
        0.4068 * Math.sin(Mpr * dr) +
        0.0161 * Math.sin(2 * Mpr * dr) -
        0.0004 * Math.sin(3 * Mpr * dr) +
        0.0104 * Math.sin(2 * F * dr) -
        0.0051 * Math.sin((M + Mpr) * dr) -
        0.0074 * Math.sin((M - Mpr) * dr) +
        0.0004 * Math.sin((2 * F + M) * dr) -
        0.0004 * Math.sin((2 * F - M) * dr) -
        0.0006 * Math.sin((2 * F + Mpr) * dr) +
        0.0010 * Math.sin((2 * F - Mpr) * dr) +
        0.0005 * Math.sin((2 * Mpr + M) * dr);

    var JdNew = Jd1 + C1;
    return Math.floor(JdNew + 0.5 + timeZone / 24);
}

function getSunLongitude(jdn, timeZone) {
    var T = (jdn - 2451545.5 - timeZone / 24) / 36525;
    var dr = Math.PI / 180;

    var M = 357.52910 +
        35999.05030 * T -
        0.0001559 * T * T -
        0.00000048 * T * T * T;

    var L0 = 280.46645 +
        36000.76983 * T +
        0.0003032 * T * T;

    var DL =
        (1.914600 - 0.004817 * T - 0.000014 * T * T) * Math.sin(dr * M) +
        (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
        0.000290 * Math.sin(dr * 3 * M);

    var L = (L0 + DL) * dr;
    L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
    return Math.floor((L / Math.PI) * 6);
}

function getLunarMonth11(yy, timeZone) {
    var off = jdFromDate(31, 12, yy) - 2415021;
    var k = Math.floor(off / 29.530588853);
    var nm = getNewMoonDay(k, timeZone);

    if (getSunLongitude(nm, timeZone) >= 9)
        nm = getNewMoonDay(k - 1, timeZone);

    return nm;
}

function getLeapMonthOffset(a11, timeZone) {
    var k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    var last, i = 1;

    var arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);

    return i - 1;
}

function convertSolar2Lunar(dd, mm, yy, timeZone) {
    var dayNumber = jdFromDate(dd, mm, yy);
    var k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);

    var monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber)
        monthStart = getNewMoonDay(k, timeZone);

    var a11 = getLunarMonth11(yy, timeZone);
    var b11 = a11;
    var lunarYear = yy;

    if (a11 >= monthStart) {
        a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
        b11 = getLunarMonth11(yy + 1, timeZone);
        lunarYear = yy + 1;
    }

    var lunarDay = dayNumber - monthStart + 1;
    var diff = Math.floor((monthStart - a11) / 29);

    var lunarMonth = diff + 11;
    var lunarLeap = 0;

    if (b11 - a11 > 365) {
        var leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff === leapMonthDiff)
                lunarLeap = 1;
        }
    }

    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

    return [lunarDay, lunarMonth, lunarYear, lunarLeap];
}


// ========================= NẠP ÂM =============================
const napAmTable = {
    "Giáp Tý": "Hải Trung Kim", "Ất Sửu": "Hải Trung Kim",
    "Bính Dần": "Lô Trung Hỏa", "Đinh Mão": "Lô Trung Hỏa",
    "Mậu Thìn": "Đại Lâm Mộc", "Kỷ Tỵ": "Đại Lâm Mộc",
    "Canh Ngọ": "Lộ Bàng Thổ", "Tân Mùi": "Lộ Bàng Thổ",
    "Nhâm Thân": "Kiếm Phong Kim", "Quý Dậu": "Kiếm Phong Kim",

    "Giáp Tuất": "Sơn Đầu Hỏa", "Ất Hợi": "Sơn Đầu Hỏa",
    "Bính Tý": "Giản Hạ Thủy", "Đinh Sửu": "Giản Hạ Thủy",
    "Mậu Dần": "Thành Đầu Thổ", "Kỷ Mão": "Thành Đầu Thổ",
    "Canh Thìn": "Bạch Lạp Kim", "Tân Tỵ": "Bạch Lạp Kim",
    "Nhâm Ngọ": "Dương Liễu Mộc", "Quý Mùi": "Dương Liễu Mộc",

    "Giáp Thân": "Tuyền Trung Thủy", "Ất Dậu": "Tuyền Trung Thủy",
    "Bính Tuất": "Ốc Thượng Thổ", "Đinh Hợi": "Ốc Thượng Thổ",
    "Mậu Tý": "Tích Lịch Hỏa", "Kỷ Sửu": "Tích Lịch Hỏa",
    "Canh Dần": "Tùng Bách Mộc", "Tân Mão": "Tùng Bách Mộc",
    "Nhâm Thìn": "Trường Lưu Thủy", "Quý Tỵ": "Trường Lưu Thủy",

    "Giáp Ngọ": "Sa Trung Kim", "Ất Mùi": "Sa Trung Kim",
    "Bính Thân": "Sơn Hạ Hỏa", "Đinh Dậu": "Sơn Hạ Hỏa",
    "Mậu Tuất": "Bình Địa Mộc", "Kỷ Hợi": "Bình Địa Mộc",
    "Canh Tý": "Bích Thượng Thổ", "Tân Sửu": "Bích Thượng Thổ",
    "Nhâm Dần": "Kim Bạch Kim", "Quý Mão": "Kim Bạch Kim",

    "Giáp Thìn": "Phú Đăng Hỏa", "Ất Tỵ": "Phú Đăng Hỏa",
    "Bính Ngọ": "Thiên Hà Thủy", "Đinh Mùi": "Thiên Hà Thủy",
    "Mậu Thân": "Đại Trạch Thổ", "Kỷ Dậu": "Đại Trạch Thổ",
    "Canh Tuất": "Thoa Xuyến Kim", "Tân Hợi": "Thoa Xuyến Kim",
    "Nhâm Tý": "Tang Đố Mộc", "Quý Sửu": "Tang Đố Mộc",

    "Giáp Dần": "Đại Khe Thủy", "Ất Mão": "Đại Khe Thủy",
    "Bính Thìn": "Sa Trung Thổ", "Đinh Tỵ": "Sa Trung Thổ",
    "Mậu Ngọ": "Thiên Thượng Hỏa", "Kỷ Mùi": "Thiên Thượng Hỏa",
    "Canh Thân": "Thạch Lựu Mộc", "Tân Dậu": "Thạch Lựu Mộc",
    "Nhâm Tuất": "Đại Hải Thủy", "Quý Hợi": "Đại Hải Thủy",
};

function getNapAm(can, chi) {
    const key = `${can} ${chi}`;
    return napAmTable[key] || "Không có nạp âm";
}

export {
    jdFromDate,
    getNewMoonDay,
    getSunLongitude,
    getLunarMonth11,
    getLeapMonthOffset,
    convertSolar2Lunar,
    getNapAm,
    napAmTable
};

// ========================= END NẠP ÂM =============================
