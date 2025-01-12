<!DOCTYPE> html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ลงนามถวายพระพร</title>
    <link rel="stylesheet" href="style.css">
    <script type="module">
        // Import Firebase SDK
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
        import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
        import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.19.0/package/xlsx.mjs";

        // Firebase Configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBGptyFg34K5rY4BZdJOLCFgjqqp4rG9P0",
            authDomain: "dooyaischoolblessings.firebaseapp.com",
            databaseURL: "https://dooyaischoolblessings-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "dooyaischoolblessings",
            storageBucket: "dooyaischoolblessings.appspot.com",
            messagingSenderId: "1003915601288",
            appId: "1:1003915601288:web:284b05585e3dba79a1c63d"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);

        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOM fully loaded and parsed");

            const form = document.getElementById('signForm');
            if (form) {
                form.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    console.log("Form submission triggered");

                    const name = document.getElementById('name').value.trim();
                    const organization = document.getElementById('organization').value.trim();
                    const typeElement = document.querySelector('input[name="type"]:checked');
                    const otherType = document.getElementById('otherType').value.trim();

                    if (!name || !typeElement) {
                        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                        return;
                    }

                    const payload = {
                        name,
                        organization,
                        type: typeElement.value === "อื่น ๆ" ? otherType : typeElement.value,
                        date: new Date().toLocaleDateString(),
                        time: new Date().toLocaleTimeString()
                    };

                    try {
                        const dbRef = ref(database, 'signatures');
                        await push(dbRef, payload);
                        console.log("Data saved successfully:", payload);
                        window.location.href = "success.html";
                    } catch (error) {
                        console.error("Error saving data:", error);
                        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
                    }
                });
            }

            const exportButton = document.getElementById('exportButton');
            if (exportButton) {
                exportButton.addEventListener('click', async () => {
                    console.log("Export button clicked");

                    try {
                        const dbRef = ref(database, 'signatures');
                        const snapshot = await get(dbRef);
                        const data = snapshot.val();

                        if (!data) {
                            alert("ไม่มีข้อมูลสำหรับการดาวน์โหลด");
                            return;
                        }

                        const signData = Object.values(data);
                        console.log("Fetched data for export:", signData);

                        const worksheet = XLSX.utils.json_to_sheet(signData);
                        XLSX.utils.sheet_add_aoa(worksheet, [
                            ["ชื่อ-นามสกุล", "หน่วยงาน/ที่อยู่", "ประเภท", "วันที่ลงนาม", "เวลาที่ลงนาม"]
                        ], { origin: "A1" });

                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workbook, worksheet, "รายชื่อผู้ลงนาม");

                        XLSX.writeFile(workbook, "รายชื่อผู้ลงนาม.xlsx");
                    } catch (error) {
                        console.error("Error exporting data:", error);
                        alert("เกิดข้อผิดพลาดในการดาวน์โหลดข้อมูล");
                    }
                });
            }
        });
    </script>
</head>
<body>
    <main>
        <form id="signForm">
            <div class="form-header-container">
                <h1 class="form-header">วันคล้ายวันพระบรมราชสมภพพระบาทสมเด็จพระบรมชนกาธิเบศร<br>มหาภูมิพลอดุลยเดชมหาราช บรมนาถบพิตร</h1>
                <p class="sub-header">วันชาติ และวันพ่อแห่งชาติ ๕ ธันวาคม ๒๕๖๗</p>
            </div>

            <label for="name">ชื่อ-นามสกุล <span class="required">*</span></label>
            <input type="text" id="name" name="name" placeholder="เช่น: นายเรียนดี มีความสุข" required><br>

            <label for="organization">หน่วยงาน/ที่อยู่</label>
            <input type="text" id="organization" name="organization" placeholder="เช่น: โรงเรียนบ้านดู่ใหญ่"><br>

            <fieldset>
                <legend>ประเภท</legend>
                <label><input type="radio" name="type" value="นักเรียน" required> นักเรียน</label>
                <label><input type="radio" name="type" value="ครูหรือบุคลากรทางการศึกษา" required> ครูหรือบุคลากรทางการศึกษา</label>
                <label><input type="radio" name="type" value="บุคคลทั่วไป" required> บุคคลทั่วไป</label>
                <label class="other-option">
                    <input type="radio" name="type" value="อื่น ๆ" id="otherRadio" required> อื่น ๆ
                    <input type="text" id="otherType" name="otherType" placeholder="โปรดระบุประเภท" disabled>
                </label>
            </fieldset><br>

            <button type="submit" class="form-button">บันทึกการลงนาม</button>
        </form>
        <button id="exportButton" class="form-button">ดาวน์โหลดข้อมูล</button>
    </main>
</body>
</html>
