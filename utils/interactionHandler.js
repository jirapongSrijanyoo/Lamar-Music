const fs = require('fs');
const path = require('path');

// ฟังก์ชันบันทึก interactionId และ messageId ลงในไฟล์
async function saveInteraction(interactionId, messageId) {
    const filePath = path.join(__dirname, 'interactions.json');
    let data = {};

    // โหลดข้อมูลเก่า (ถ้ามี)
    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    // บันทึก interactionId และ messageId
    data[interactionId] = { messageId };

    // เขียนข้อมูลลงไฟล์
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ฟังก์ชันโหลด interactions เก่า
function loadInteractions() {
    const filePath = path.join(__dirname, 'interactions.json');

    // ถ้ามีไฟล์ interactions.json
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return {};
}

module.exports = { saveInteraction, loadInteractions };
