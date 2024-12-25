document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('dateConverterForm');
    const resultDiv = document.getElementById('result');
    const todayBtn = document.getElementById('useToday');
    const swapBtn = document.getElementById('swapCalendars');

    // Calendar month names in Arabic
    const calendarMonths = {
        gregorian: [
            'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ],
        hijri: [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
            'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ],
        persian: [
            'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ],
        jewish: [
            'تشري', 'حشوان', 'كسلو', 'طيفت', 'شباط', 'آذار',
            'نيسان', 'إيار', 'سيوان', 'تموز', 'آب', 'أيلول'
        ]
    };

    // Day names in Arabic
    const weekDays = {
        gregorian: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        hijri: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    };

    // Initialize date inputs with today's date
    function setToday() {
        const today = new Date();
        document.getElementById('day').value = today.getDate();
        document.getElementById('month').value = today.getMonth() + 1;
        document.getElementById('year').value = today.getFullYear();
        convertDate();
    }

    // Event listeners
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        convertDate();
    });

    todayBtn.addEventListener('click', setToday);

    swapBtn.addEventListener('click', function() {
        const fromCalendar = document.getElementById('fromCalendar');
        const toCalendar = document.getElementById('toCalendar');
        const tempValue = fromCalendar.value;
        fromCalendar.value = toCalendar.value;
        toCalendar.value = tempValue;
        convertDate();
    });

    // Update max days when month changes
    document.getElementById('month').addEventListener('change', updateDayLimit);
    document.getElementById('year').addEventListener('change', updateDayLimit);
    document.getElementById('fromCalendar').addEventListener('change', updateDayLimit);

    function updateDayLimit() {
        const month = parseInt(document.getElementById('month').value);
        const year = parseInt(document.getElementById('year').value);
        const calendar = document.getElementById('fromCalendar').value;
        const dayInput = document.getElementById('day');
        
        let maxDays = 31;
        
        if (calendar === 'gregorian') {
            maxDays = new Date(year, month, 0).getDate();
        } else if (calendar === 'hijri') {
            maxDays = moment.iMoment([year, month - 1, 1], 'iYYYY/iM/iD').daysInMonth();
        }
        
        dayInput.max = maxDays;
        if (parseInt(dayInput.value) > maxDays) {
            dayInput.value = maxDays;
        }
    }

    function convertDate() {
        const fromCalendar = document.getElementById('fromCalendar').value;
        const toCalendar = document.getElementById('toCalendar').value;
        const day = parseInt(document.getElementById('day').value);
        const month = parseInt(document.getElementById('month').value);
        const year = parseInt(document.getElementById('year').value);

        if (!isValidDate(day, month, year, fromCalendar)) {
            showError('التاريخ المدخل غير صحيح في التقويم المحدد');
            return;
        }

        let gregorianDate;
        let convertedDate;

        try {
            // Convert input date to Gregorian
            switch(fromCalendar) {
                case 'gregorian':
                    gregorianDate = moment([year, month - 1, day]);
                    break;
                case 'hijri':
                    gregorianDate = moment.iMoment([year, month - 1, day], 'iYYYY/iM/iD').format('YYYY/M/D');
                    gregorianDate = moment(gregorianDate, 'YYYY/M/D');
                    break;
                case 'persian':
                    // Add Persian calendar conversion
                    break;
                case 'jewish':
                    // Add Jewish calendar conversion
                    break;
            }

            // Convert Gregorian to target calendar
            switch(toCalendar) {
                case 'gregorian':
                    convertedDate = gregorianDate;
                    break;
                case 'hijri':
                    convertedDate = gregorianDate.format('iYYYY/iM/iD');
                    break;
                case 'persian':
                    // Add Persian calendar conversion
                    break;
                case 'jewish':
                    // Add Jewish calendar conversion
                    break;
            }

            // Format dates for display
            const originalDateStr = formatDate(day, month, year, fromCalendar);
            const convertedDateStr = formatConvertedDate(convertedDate, toCalendar);
            const weekDay = getWeekDay(gregorianDate, toCalendar);

            // Update UI
            document.getElementById('originalDate').textContent = originalDateStr;
            document.getElementById('convertedDate').textContent = `${weekDay}، ${convertedDateStr}`;
            
            // Show success message
            showSuccess('تم التحويل بنجاح');
            
            // Show results
            resultDiv.classList.remove('d-none');
            
        } catch (error) {
            showError('حدث خطأ أثناء تحويل التاريخ');
            console.error(error);
        }
    }

    function isValidDate(day, month, year, calendar) {
        if (day < 1 || month < 1 || month > 12 || year < 1) return false;

        switch(calendar) {
            case 'gregorian':
                return moment([year, month - 1, day]).isValid();
            case 'hijri':
                return moment.iMoment([year, month - 1, day], 'iYYYY/iM/iD').isValid();
            case 'persian':
                // Add Persian calendar validation
                return true;
            case 'jewish':
                // Add Jewish calendar validation
                return true;
            default:
                return false;
        }
    }

    function formatDate(day, month, year, calendar) {
        const monthName = calendarMonths[calendar][month - 1];
        return `${day} ${monthName} ${year}`;
    }

    function formatConvertedDate(date, calendar) {
        if (calendar === 'gregorian') {
            return `${date.date()} ${calendarMonths.gregorian[date.month()]} ${date.year()}`;
        } else if (calendar === 'hijri') {
            const parts = date.split('/');
            return `${parts[2]} ${calendarMonths.hijri[parseInt(parts[1]) - 1]} ${parts[0]}`;
        }
        return date;
    }

    function getWeekDay(date, calendar) {
        const dayIndex = date.day();
        return weekDays[calendar] ? weekDays[calendar][dayIndex] : weekDays.gregorian[dayIndex];
    }

    function showSuccess(message) {
        const alertDiv = document.getElementById('alertMessage');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = message;
        alertDiv.style.display = 'block';
        setTimeout(() => alertDiv.style.display = 'none', 3000);
    }

    function showError(message) {
        const alertDiv = document.getElementById('alertMessage');
        alertDiv.className = 'alert alert-danger';
        alertDiv.textContent = message;
        alertDiv.style.display = 'block';
        setTimeout(() => alertDiv.style.display = 'none', 3000);
    }

    // Initialize with today's date
    setToday();
});
