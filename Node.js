const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const signatures = []; // เก็บข้อมูลในหน่วยความจำ (สามารถใช้ฐานข้อมูลแทนได้)

app.post('/api/signatures', (req, res) => {
    const { name, organization, type, date, time } = req.body;

    if (!name || !type) {
        return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    signatures.push({ name, organization, type, date, time });
    res.status(201).json({ message: "บันทึกข้อมูลสำเร็จ" });
});

app.get('/api/signatures', (req, res) => {
    res.json(signatures);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
