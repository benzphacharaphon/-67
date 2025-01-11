// Firebase configuration (using CDN)
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
    // Handle the form submission
    const form = document.getElementById('signForm');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Collect form data
            const name = document.getElementById('name').value.trim();
            const organization = document.getElementById('organization').value.trim();
            const typeElement = document.querySelector('input[name="type"]:checked');
            const otherType = document.getElementById('otherType').value.trim();

            // Validate form inputs
            if (!name) {
                alert("กรุณากรอกชื่อ-นามสกุล");
                return;
            }
            if (!typeElement) {
                alert("กรุณาเลือกประเภท");
                return;
            }

            const type = typeElement.value;
            const finalType = type === "อื่น ๆ" ? otherType : type;
            const currentDate = new Date().toLocaleDateString();
            const currentTime = new Date().toLocaleTimeString();

            // Prepare data payload
            const payload = {
                name,
                organization,
                type: finalType,
                date: currentDate,
                time: currentTime
            };

            try {
                // Save data to Firebase
                const dbRef = firebase.database().ref('signatures');
                const newRef = await dbRef.push(payload);

                // Debug: Log key of the new entry
                console.log("Data saved successfully to Firebase:", newRef.key);

                // Redirect to success page
                window.location.href = "success.html";
            } catch (error) {
                console.error("Error saving to Firebase:", error);
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            }
        });
    }

    // Handle data export
    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
        exportButton.addEventListener('click', async function () {
            try {
                // Fetch data from Firebase
                const dbRef = firebase.database().ref('signatures');
                const snapshot = await dbRef.once('value');
                const data = snapshot.val();

                if (!data) {
                    alert("ไม่มีข้อมูลสำหรับการดาวน์โหลด");
                    return;
                }

                // Convert data to an array
                const signData = Object.values(data);

                // Debug: Log data fetched for export
                console.log("Data fetched for export:", signData);

                // Use SheetJS to create and download the Excel file
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
