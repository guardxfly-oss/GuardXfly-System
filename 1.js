// تعطيل النقر بزر الفأرة الأيمن
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert('النقر بالزر الأيمن معطل لهذا النظام.');
});

// تعطيل مفاتيح أدوات المطور
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        alert('هذا الإجراء غير مسموح به في النظام.');
    }
});

// استرجاع سجلات الحضور من localStorage
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

// دالة لحفظ السجلات
function saveRecords() {
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
}

// دالة لإرسال البيانات إلى Formspree
async function sendToFormspree(data) {
    try {
        const response = await fetch('https://formspree.io/f/mldweero', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _subject: data.subject,
                employee_id: data.employeeId,
                employee_name: data.employeeName,
                department: data.department,
                date: data.date,
                time: data.time,
                action: data.action,
                message: data.message,
                work_hours: data.workHours || null
            }),
        });
        
        if (!response.ok) {
            console.error('Failed to send data to Formspree');
        }
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

// الحصول على اسم اليوم بالعربية
function getArabicDayName(date) {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[new Date(date).getDay()];
}

// حساب ساعات العمل
function calculateWorkHours(checkIn, checkOut) {
    if (!checkIn || !checkOut) return null;
    
    const checkInTime = new Date(`2025-06-10 ${checkIn}`);
    const checkOutTime = new Date(`2025-06-10 ${checkOut}`);
    
    const diffMs = checkOutTime - checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.round(diffHours * 100) / 100;
}

// عرض رسالة
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    message极客时间
    messageEl.classList.add('show');
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 4000);
}

// تحديث عرض الحالة
function updateStatus(text, isSuccess = true) {
    const statusEl = document.getElementById('statusDisplay');
    statusEl.innerHTML = `
        <div style="font-size: 1.2rem; font-weight: 700; color: ${isSuccess ? '#2e7d32' : '#d32f2f'};">
            ${text}
        </div>
        <div style="margin-top: 10极客时间
        <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
            ${new Date().toLocaleString('ar-EG')}
        </div>
    `;
    statusEl.classList.add('show', 'pulse');
    
    setTimeout(() => {
        statusEl.classList.remove('pulse');
    }, 2000);
}

// التحقق من صحة المدخلات
function validateInputs() {
    const employeeId = document.getElementById('employeeId').value.trim();
    const employeeName = document.getElementById('employeeName').value.trim();
    const department = document.getElementById('department').value;

    if (!employeeId || !employeeName || !department) {
        showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
        return false;
    }
    return true;
}

// تسجيل الحضور
function checkIn() {
    if (!validateInputs()) return;

    const employeeId = document.getElementById('employeeId').value.trim();
    const employeeName = document.getElementById('employeeName').value.trim();
    const department = document.getElementById('department').value;
    const currentTime = new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const currentDate = new Date().toISOString().split('T')[0];
    const dayName = getArabicDayName(currentDate);

    const existingRecord = attendanceRecords.find(record => 
        record.employeeId === employeeId && 
        record.date === currentDate &&
        record.checkIn && !record.checkOut
    );

    if (existingRecord) {
        showMessage('تم تسجيل حضورك بالفعل اليوم', 'error');
        return;
    }

    const recordIndex = attendanceRecords.findIndex(record => 
        record.employeeId === employeeId && 
        record.date === currentDate
    );

    if (recordIndex >=极客时间
    if (recordIndex >= 0) {
        attendanceRecords[recordIndex] = {
            ...attendanceRecords[recordIndex],
            check极客时间
            checkIn: currentTime,
            checkOut: null,
            workHours: null,
            status: 'حاضر',
            notes: 'تم تسجيل الحضور'
        };
    } else {
        attendanceRecords.push({
            employeeId,
            employeeName,
            department,
            date: currentDate,
            dayName,
            checkIn: currentTime,
            checkOut: null,
            workHours: null,
            status: 'حاضر',
            notes: 'تم تسجيل الحضور'
        });
    }

    saveRecords();
    
    // إرسال إشعار الحضور إلى Formspree
    sendToFormspree({
        subject: 'تسجيل حضور جديد - سوشيال نيست',
        employeeId,
        employeeName,
        department,
        date: currentDate,
        time: currentTime,
        action: 'check-in',
        message: `تم تسجيل حضور الموظف ${employeeName} (${employeeId}) من قسم ${department} في ${currentTime}`
    });

    showMessage(`تم تسجيل الحضور بنجاح في ${currentTime}`, 'success');
    updateStatus(`🎉 أهلاً بك ${employeeName}! تم تسجيل حضورك بنجاح`);
    clearForm();
}

// تسجيل الانصراف
function checkOut() {
    if (!validateInputs()) return;

    const employeeId = document.getElementById('employee极客时间
    const employeeId = document.getElementById('employeeId').value.trim();
    const employeeName = document.getElementById('employeeName').value.trim();
    const currentTime = new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '极客时间
        minute: '2-digit',
        hour12: true
    });
    const currentDate = new Date().toISOString().split('T')[0];

    const recordIndex = attendanceRecords.findIndex(record => 
        record.employeeId === employeeId && 
        record.date === currentDate
    );

    if (recordIndex === -1 || !attendanceRecords[recordIndex].checkIn) {
        showMessage('يجب تسجيل الحضور أولاً قبل الانصراف', 'error');
        return;
    }

    if (attendanceRecords[recordIndex].checkOut) {
        showMessage('تم تسجيل انصرافك بالفعل اليوم', 'error');
        return;
    }

    const workHours极客时间
    const workHours = calculateWorkHours(
        attendanceRecords[recordIndex].checkIn,
        currentTime
    );

    attendanceRecords[recordIndex极客时间
    attendanceRecords[recordIndex] = {
        ...attendanceRecords[recordIndex],
        checkOut: currentTime,
        workHours,
        status: 'مكتمل',
        notes: workHours > 8 ? 'ساعات إضافية' : 'دوام عادي'
    };

    saveRecords();
    
    // إرسال إشعار الانصراف إلى Formspree
    sendToFormspree({
        subject: 'تسجيل انصراف جديد - سوشيال نيست',
        employeeId,
        employeeName,
        department: attendanceRecords[recordIndex].department,
        date: currentDate,
        time: currentTime,
        workHours,
        action: 'check-out',
        message: `تم تسجيل انصراف الموظف ${employeeName} (${employeeId}) من قسم ${attendanceRecords[recordIndex].department} في ${currentTime} - ساعات العمل: ${workHours} ساعة`
    });

    showMessage(`تم تسجيل الانصراف بنجاح في ${currentTime}`, 'success');
    updateStatus(`👋 مع السلامة ${employeeName}! تم تسجيل انصرافك بنجاح - ساعات العمل: ${极客时间
    updateStatus(`👋 مع السلامة ${employeeName}! تم تسجيل انصرافك بنجاح - ساعات العمل: ${workHours} ساعة`);
    clearForm();
}

// مسح النموذج
function clearForm() {
    document.getElementById('employeeId').value = '';
    document.getElementById('employeeName').value = '';
    document.getElementById('department').value = '';
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // إضافة تأثيرات للعناصر
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateX(-5px)';
        });
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateX(0)';
        });
    });
});
