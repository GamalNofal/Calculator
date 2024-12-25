// معلومات الأبراج
const ZODIAC_SIGNS = {
    'الحمل': { 
        symbol: '♈', 
        traits: 'شجاع، متحمس، مغامر', 
        element: 'النار',
        lucky_numbers: [1, 9, 17],
        compatibility: ['الأسد', 'القوس'],
        color: '#FF4136',
        stone: 'الياقوت الأحمر',
        description: 'برج الحمل هو أول الأبراج، يتميز أصحابه بالشجاعة والحماس والطاقة العالية.'
    },
    'الثور': { 
        symbol: '♉', 
        traits: 'صبور، موثوق، عملي', 
        element: 'الأرض',
        lucky_numbers: [2, 6, 15],
        compatibility: ['العذراء', 'الجدي'],
        color: '#2ECC40',
        stone: 'الزمرد',
        description: 'برج الثور يتميز بالصبر والثبات، محب للجمال والفنون والطبيعة.'
    },
    'الجوزاء': { 
        symbol: '♊', 
        traits: 'متكيف، ذكي، فضولي', 
        element: 'الهواء',
        lucky_numbers: [3, 12, 21],
        compatibility: ['الميزان', 'الدلو'],
        color: '#FFDC00',
        stone: 'العقيق',
        description: 'برج الجوزاء متعدد المواهب، سريع التكيف، يحب التواصل والتعلم.'
    },
    'السرطان': { 
        symbol: '♋', 
        traits: 'عاطفي، حدسي، محب', 
        element: 'الماء',
        lucky_numbers: [4, 13, 22],
        compatibility: ['العقرب', 'الحوت'],
        color: '#B10DC9',
        stone: 'اللؤلؤ',
        description: 'برج السرطان عاطفي وحساس، يهتم كثيراً بالعائلة والمنزل.'
    },
    'الأسد': { 
        symbol: '♌', 
        traits: 'إبداعي، كريم، متفائل', 
        element: 'النار',
        lucky_numbers: [5, 14, 23],
        compatibility: ['الحمل', 'القوس'],
        color: '#FF851B',
        stone: 'الياقوت الأصفر',
        description: 'برج الأسد قيادي وكريم، يحب الإبداع والتميز والمسرح.'
    },
    'العذراء': { 
        symbol: '♍', 
        traits: 'منظم، تحليلي، مخلص', 
        element: 'الأرض',
        lucky_numbers: [6, 15, 24],
        compatibility: ['الثور', 'الجدي'],
        color: '#7FDBFF',
        stone: 'العقيق اليماني',
        description: 'برج العذراء دقيق ومنظم، يهتم بالتفاصيل والصحة والنظام.'
    },
    'الميزان': { 
        symbol: '♎', 
        traits: 'دبلوماسي، عادل، اجتماعي', 
        element: 'الهواء',
        lucky_numbers: [7, 16, 25],
        compatibility: ['الجوزاء', 'الدلو'],
        color: '#F012BE',
        stone: 'الياقوت الأزرق',
        description: 'برج الميزان يحب العدل والتوازن، دبلوماسي ومحب للجمال.'
    },
    'العقرب': { 
        symbol: '♏', 
        traits: 'قوي، غامض، عاطفي', 
        element: 'الماء',
        lucky_numbers: [8, 17, 26],
        compatibility: ['السرطان', 'الحوت'],
        color: '#85144B',
        stone: 'الزبرجد',
        description: 'برج العقرب غامض وقوي، يتميز بالذكاء العاطفي والحدس القوي.'
    },
    'القوس': { 
        symbol: '♐', 
        traits: 'متفائل، مغامر، صريح', 
        element: 'النار',
        lucky_numbers: [9, 18, 27],
        compatibility: ['الحمل', 'الأسد'],
        color: '#39CCCC',
        stone: 'الفيروز',
        description: 'برج القوس متفائل ومغامر، يحب السفر واكتشاف الثقافات الجديدة.'
    },
    'الجدي': { 
        symbol: '♑', 
        traits: 'طموح، منضبط، صبور', 
        element: 'الأرض',
        lucky_numbers: [10, 19, 28],
        compatibility: ['الثور', 'العذراء'],
        color: '#01FF70',
        stone: 'الماس',
        description: 'برج الجدي طموح وعملي، يسعى دائماً للنجاح والتقدم في الحياة.'
    },
    'الدلو': { 
        symbol: '♒', 
        traits: 'مستقل، مبتكر، إنساني', 
        element: 'الهواء',
        lucky_numbers: [11, 20, 29],
        compatibility: ['الجوزاء', 'الميزان'],
        color: '#0074D9',
        stone: 'العقيق الأزرق',
        description: 'برج الدلو مبتكر ومستقل، يهتم بالإنسانية والتكنولوجيا والمستقبل.'
    },
    'الحوت': { 
        symbol: '♓', 
        traits: 'حساس، فني، حالم', 
        element: 'الماء',
        lucky_numbers: [12, 21, 30],
        compatibility: ['السرطان', 'العقرب'],
        color: '#3D9970',
        stone: 'الزبرجد الأخضر',
        description: 'برج الحوت حساس وفني، يتميز بالخيال الواسع والإبداع.'
    }
};

// ملء القوائم المنسدلة للتاريخ
function populateDateDropdowns() {
    const daySelect = document.getElementById('birthDay');
    const monthSelect = document.getElementById('birthMonth');
    const yearSelect = document.getElementById('birthYear');

    // إضافة الأيام 1-31
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }

    // إضافة الأشهر بالعربية
    const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    arabicMonths.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // إضافة السنوات
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // إضافة مستمعي الأحداث للتحقق من صحة التاريخ
    monthSelect.addEventListener('change', updateDays);
    yearSelect.addEventListener('change', updateDays);
}

// تحديث عدد الأيام حسب الشهر والسنة
function updateDays() {
    const daySelect = document.getElementById('birthDay');
    const monthSelect = document.getElementById('birthMonth');
    const yearSelect = document.getElementById('birthYear');
    
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);
    
    if (!month || !year) return;
    
    const daysInMonth = new Date(year, month, 0).getDate();
    const currentDay = parseInt(daySelect.value);
    
    // حفظ اليوم الحالي المحدد
    daySelect.innerHTML = '<option value="">اختر اليوم</option>';
    
    for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }
    
    // إعادة تحديد اليوم السابق إذا كان صالحاً
    if (currentDay && currentDay <= daysInMonth) {
        daySelect.value = currentDay;
    }
}

// تهيئة حاسبة الأبراج
function initializeZodiacCalculator() {
    const form = document.getElementById('zodiacForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const day = parseInt(document.getElementById('birthDay').value);
        const month = parseInt(document.getElementById('birthMonth').value);
        
        if (!day || !month) {
            showError('الرجاء إدخال تاريخ ميلاد صحيح');
            return;
        }
        
        const zodiacSign = calculateZodiacSign(day, month);
        displayZodiacResult(ZODIAC_SIGNS[zodiacSign]);
    });
}

// التحقق من صحة التاريخ
function addDateValidation() {
    const daySelect = document.getElementById('birthDay');
    const monthSelect = document.getElementById('birthMonth');
    const yearSelect = document.getElementById('birthYear');
    
    [daySelect, monthSelect, yearSelect].forEach(select => {
        select.addEventListener('change', validateDate);
    });
}

// حساب البرج
function calculateZodiacSign(day, month) {
    const dates = {
        'الحمل': [3, 21, 4, 19],
        'الثور': [4, 20, 5, 20],
        'الجوزاء': [5, 21, 6, 20],
        'السرطان': [6, 21, 7, 22],
        'الأسد': [7, 23, 8, 22],
        'العذراء': [8, 23, 9, 22],
        'الميزان': [9, 23, 10, 22],
        'العقرب': [10, 23, 11, 21],
        'القوس': [11, 22, 12, 21],
        'الجدي': [12, 22, 1, 19],
        'الدلو': [1, 20, 2, 18],
        'الحوت': [2, 19, 3, 20]
    };
    
    for (const [sign, [startMonth, startDay, endMonth, endDay]] of Object.entries(dates)) {
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
            return sign;
        }
    }
    return 'الجدي'; // للتواريخ المتبقية (22-31 ديسمبر)
}

// عرض النتيجة مع الرسوم المتحركة
function displayZodiacResult(zodiacInfo) {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'none'; // إخفاء مؤقت للتأثير المتحرك
    
    const resultHTML = `
        <div class="zodiac-result">
            <div class="zodiac-symbol">${zodiacInfo.symbol}</div>
            <h2 class="zodiac-title mb-4">برجك هو: ${Object.keys(ZODIAC_SIGNS).find(key => ZODIAC_SIGNS[key] === zodiacInfo)}</h2>
            
            <div class="zodiac-details">
                <div class="detail-item">
                    <h4>الصفات 🎭</h4>
                    <p>${zodiacInfo.traits}</p>
                </div>
                
                <div class="detail-item">
                    <h4>العنصر 🌍</h4>
                    <p>${zodiacInfo.element}</p>
                </div>
                
                <div class="detail-item">
                    <h4>الأرقام المحظوظة 🎲</h4>
                    <p>${zodiacInfo.lucky_numbers.join(' - ')}</p>
                </div>
                
                <div class="detail-item">
                    <h4>التوافق ❤️</h4>
                    <p>${zodiacInfo.compatibility.join(' - ')}</p>
                </div>
                
                <div class="detail-item">
                    <h4>اللون 🎨</h4>
                    <div class="color-preview" style="background-color: ${zodiacInfo.color}"></div>
                </div>
                
                <div class="detail-item">
                    <h4>الحجر الكريم 💎</h4>
                    <p>${zodiacInfo.stone}</p>
                </div>
            </div>
            
            <div class="zodiac-description mt-4">
                <h4>نبذة عن برجك ✨</h4>
                <p>${zodiacInfo.description}</p>
            </div>
        </div>
    `;
    
    resultDiv.innerHTML = resultHTML;
    
    // تأثير متحرك لإظهار النتيجة
    setTimeout(() => {
        resultDiv.style.display = 'block';
        resultDiv.style.opacity = '0';
        requestAnimationFrame(() => {
            resultDiv.style.transition = 'opacity 0.5s ease-in-out';
            resultDiv.style.opacity = '1';
        });
    }, 100);
}

// عرض رسالة خطأ
function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            ${message}
        </div>
    `;
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    populateDateDropdowns();
    initializeZodiacCalculator();
    addDateValidation();
});
