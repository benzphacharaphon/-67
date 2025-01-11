// โหลด Firebase ผ่าน CDN
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGptyFg34K5rY4BZdJOLCFgjqq4rG9P0",
    authDomain: "dooyaischoolblessings.firebaseapp.com",
    databaseURL: "https://dooyaischoolblessings-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dooyaischoolblessings",
    storageBucket: "dooyaischoolblessings.appspot.com",
    messagingSenderId: "1003915601288",
    appId: "1:1003915601288:web:284b05585e3dba79a1c63d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    // Handle the form submission
    const form = document.getElementById('signForm');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

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
                const dbRef = firebase.database().ref('signatures');
                await dbRef.push(payload);
                console.log("Data saved successfully:", payload);

                window.location.href = "success.html";
            } catch (error) {
                console.error("Error saving data:", error);
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            }
        });
    }

    // Handle export button
    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
        exportButton.addEventListener('click', async function () {
            try {
                const dbRef = firebase.database().ref('signatures');
                const snapshot = await dbRef.once('value');
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
