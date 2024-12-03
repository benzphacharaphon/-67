document.addEventListener('DOMContentLoaded', function () {
    // ฟังก์ชันสำหรับบันทึกข้อมูลการลงนาม
    const form = document.getElementById('signForm');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const organization = document.getElementById('organization').value.trim();
            const typeElement = document.querySelector('input[name="type"]:checked');
            const otherType = document.getElementById('otherType').value.trim();

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

            const signData = JSON.parse(localStorage.getItem('signData')) || [];
            const currentDate = new Date().toLocaleDateString();
            const currentTime = new Date().toLocaleTimeString();

            signData.push({
                name,
                organization,
                type: finalType,
                date: currentDate,
                time: currentTime
            });

            localStorage.setItem('signData', JSON.stringify(signData));
            window.location.href = "success.html";
        });
    }

    // ฟังก์ชันสำหรับดาวน์โหลดข้อมูลผู้ลงนาม
    const exportButton = document.getElementById('exportButton');

    if (exportButton) {
        exportButton.addEventListener('click', function () {
            // ดึงข้อมูลจาก Local Storage
            const signData = JSON.parse(localStorage.getItem('signData')) || [];

            if (signData.length === 0) {
                alert("ไม่มีข้อมูลสำหรับการดาวน์โหลด");
                return;
            }

            // ใช้ SheetJS สร้าง Worksheet
            const worksheet = XLSX.utils.json_to_sheet(signData);

            // เพิ่ม Header แบบกำหนดเอง
            XLSX.utils.sheet_add_aoa(worksheet, [
                ["ชื่อ-นามสกุล", "หน่วยงาน/ที่อยู่", "ประเภท", "วันที่ลงนาม", "เวลาที่ลงนาม"]
            ], { origin: "A1" });

            // สร้าง Workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "รายชื่อผู้ลงนาม");

            // ดาวน์โหลดไฟล์ Excel
            XLSX.writeFile(workbook, "รายชื่อผู้ลงนาม.xlsx");
        });
    }
});
