// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get } from "firebase/database";

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function () {
    // Debug: Check if DOM is fully loaded
    console.log("DOM fully loaded and parsed");

    // Handle the form submission
    const form = document.getElementById('signForm');

    if (form) {
        console.log("Form found in DOM");

        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            console.log("Form submission triggered");

            // Collect form data
            const name = document.getElementById('name').value.trim();
            const organization = document.getElementById('organization').value.trim();
            const typeElement = document.querySelector('input[name="type"]:checked');
            const otherType = document.getElementById('otherType').value.trim();

            console.log("Collected form data:", { name, organization, typeElement, otherType });

            // Validate form inputs
            if (!name) {
                alert("กรุณากรอกชื่อ-นามสกุล");
                console.error("Validation failed: Name is required");
                return;
            }
            if (!typeElement) {
                alert("กรุณาเลือกประเภท");
                console.error("Validation failed: Type is required");
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

            console.log("Payload prepared for Firebase:", payload);

            try {
                // Save data to Firebase
                const dbRef = ref(database, 'signatures');
                const newRef = await push(dbRef, payload);

                // Debug: Log key of the new entry
                console.log("Data saved successfully to Firebase with key:", newRef.key);

                // Redirect to success page
                console.log("Redirecting to success.html");
                window.location.href = "success.html";
            } catch (error) {
                console.error("Error saving to Firebase:", error);
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            }
        });
    } else {
        console.error("Form not found in DOM");
    }

    // Handle data export
    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
        console.log("Export button found in DOM");

        exportButton.addEventListener('click', async function () {
            console.log("Export button clicked");

            try {
                // Fetch data from Firebase
                const dbRef = ref(database, 'signatures');
                const snapshot = await get(dbRef);
                const data = snapshot.val();

                if (!data) {
                    alert("ไม่มีข้อมูลสำหรับการดาวน์โหลด");
                    console.warn("No data found in Firebase for export");
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

                console.log("Exporting data to Excel file");
                XLSX.writeFile(workbook, "รายชื่อผู้ลงนาม.xlsx");
            } catch (error) {
                console.error("Error exporting data:", error);
                alert("เกิดข้อผิดพลาดในการดาวน์โหลดข้อมูล");
            }
        });
    } else {
        console.error("Export button not found in DOM");
    }
});
