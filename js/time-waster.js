// قائمة الأسئلة
const questions = [
    {
        id: 'procrastination',
        text: 'ما هو أسلوبك المفضل في المماطلة؟',
        options: [
            { value: 'social', text: '📱 تصفح وسائل التواصل الاجتماعي لساعات', hours: 4 },
            { value: 'videos', text: '🎥 مشاهدة فيديوهات عشوائية', hours: 3 },
            { value: 'food', text: '🍕 البحث عن وصفات طعام لن أطبخها أبداً', hours: 2 },
            { value: 'cleaning', text: '🧹 تنظيف المنزل فجأة عندما يكون لدي عمل مهم', hours: 2 }
        ]
    },
    {
        id: 'excuse',
        text: 'ما هو عذرك المفضل للتأجيل؟',
        options: [
            { value: 'tired', text: '😴 "أنا متعب جداً اليوم"', hours: 3 },
            { value: 'tomorrow', text: '🌅 "غداً سأكون أكثر إنتاجية"', hours: 4 },
            { value: 'mood', text: '🎭 "لست في المزاج المناسب"', hours: 2 },
            { value: 'research', text: '🔍 "أحتاج لمزيد من البحث"', hours: 3 }
        ]
    },
    {
        id: 'distraction',
        text: 'ما الذي يشتت انتباهك بسهولة؟',
        options: [
            { value: 'notifications', text: '📱 إشعارات الهاتف', hours: 3 },
            { value: 'pets', text: '🐱 حيواني الأليف يريد الاهتمام', hours: 2 },
            { value: 'snacks', text: '🍪 الرغبة في تناول وجبة خفيفة', hours: 1 },
            { value: 'thoughts', text: '💭 أفكار عشوائية تماماً', hours: 2 }
        ]
    },
    {
        id: 'activity',
        text: 'ما هو نشاطك المفضل لإضاعة الوقت؟',
        options: [
            { value: 'shopping', text: '🛒 التسوق الإلكتروني بدون شراء', hours: 3 },
            { value: 'organizing', text: '📚 إعادة تنظيم أشياء مرتبة أصلاً', hours: 2 },
            { value: 'planning', text: '📅 التخطيط للمستقبل بدل العمل', hours: 2 },
            { value: 'daydreaming', text: '🌈 أحلام اليقظة', hours: 1 }
        ]
    },
    {
        id: 'productivity',
        text: 'كيف تتظاهر بأنك مشغول؟',
        options: [
            { value: 'emails', text: '📧 فتح وإغلاق البريد الإلكتروني', hours: 1 },
            { value: 'notes', text: '📝 كتابة قوائم مهام لن أنجزها', hours: 2 },
            { value: 'meetings', text: '👥 حضور اجتماعات غير ضرورية', hours: 3 },
            { value: 'research', text: '🔍 البحث عن نصائح للإنتاجية', hours: 2 }
        ]
    }
];

const alternativeActivities = {
    '4': [
        { text: 'تعلم لغة جديدة 🗣️', value: '48 درس لغة' },
        { text: 'قراءة كتاب 📚', value: '2 كتاب' },
        { text: 'ممارسة الرياضة 🏃‍♂️', value: '24 تمرين' }
    ],
    '3': [
        { text: 'تعلم مهارة جديدة 🎯', value: '36 درس' },
        { text: 'الطبخ 🍳', value: '18 وصفة' },
        { text: 'التأمل 🧘‍♂️', value: '90 جلسة' }
    ],
    '2': [
        { text: 'العناية بالنباتات 🌱', value: '24 نبتة' },
        { text: 'تعلم العزف 🎵', value: '24 مقطوعة' },
        { text: 'الرسم 🎨', value: '12 لوحة' }
    ],
    '1': [
        { text: 'كتابة يوميات 📔', value: '30 مقال' },
        { text: 'التصوير 📸', value: '60 صورة' },
        { text: 'اليوجا 🧘‍♀️', value: '30 جلسة' }
    ]
};

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('timeWasterForm');
    const resultDiv = document.getElementById('result');
    const progressBar = document.querySelector('.progress-bar');
    const questionContainer = document.getElementById('questionContainer');

    let currentQuestion = 0;
    const answers = {};

    function showQuestion(index) {
        if (index >= questions.length) {
            showResults();
            return;
        }

        const question = questions[index];
        const progress = ((index + 1) / questions.length) * 100;

        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);

        const optionsHTML = question.options
            .map(option => `
                <div class="form-check custom-option mb-3">
                    <input class="form-check-input" type="radio" 
                           name="question" value="${option.value}" 
                           id="${option.value}" required
                           data-hours="${option.hours}">
                    <label class="form-check-label" for="${option.value}">
                        ${option.text}
                    </label>
                </div>
            `).join('');

        const questionHTML = `
            <div class="question-slide">
                <h3 class="question-title mb-4">${question.text}</h3>
                <div class="options-container">
                    ${optionsHTML}
                </div>
                <button type="submit" class="btn btn-primary w-100 mt-4">
                    ${index === questions.length - 1 ? 'اكتشف نتيجتك! 🎯' : 'السؤال التالي ⏭️'}
                </button>
            </div>
        `;

        // Add fade out animation to current question
        if (questionContainer.children.length > 0) {
            questionContainer.children[0].style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                questionContainer.innerHTML = questionHTML;
                // Add fade in animation to new question
                questionContainer.children[0].style.animation = 'slideIn 0.3s ease-out';
            }, 300);
        } else {
            questionContainer.innerHTML = questionHTML;
            questionContainer.children[0].style.animation = 'slideIn 0.3s ease-out';
        }
    }

    function handleAnswer(e) {
        e.preventDefault();
        const selectedOption = document.querySelector('input[name="question"]:checked');
        if (!selectedOption) return;

        answers[questions[currentQuestion].id] = {
            value: selectedOption.value,
            hours: parseInt(selectedOption.dataset.hours)
        };

        currentQuestion++;
        showQuestion(currentQuestion);
    }

    function calculateTimeWasted() {
        const timeWastingProfiles = {
            'محترف المماطلة الرقمية 📱': {
                description: 'أنت خبير في تضييع الوقت على وسائل التواصل الاجتماعي والإنترنت!',
                icon: '📱',
                activities: [
                    'تصفح لا نهائي لوسائل التواصل الاجتماعي',
                    'مشاهدة فيديوهات عشوائية',
                    'قراءة تعليقات لا نهاية لها'
                ],
                advice: [
                    'استخدم تطبيقات تتبع وقت استخدام الهاتف',
                    'حدد أوقاتاً محددة لتصفح السوشيال ميديا',
                    'فعّل وضع عدم الإزعاج أثناء العمل'
                ]
            },
            'فنان التسويف المبدع 🎨': {
                description: 'لديك موهبة خاصة في ابتكار أعذار إبداعية وأنشطة بديلة!',
                icon: '🎨',
                activities: [
                    'إعادة ترتيب الغرفة بدل إنهاء العمل',
                    'البحث عن وصفات طعام معقدة',
                    'التخطيط المفرط لأشياء بسيطة'
                ],
                advice: [
                    'استخدم إبداعك في تحويل المهام المملة إلى تحديات ممتعة',
                    'اكتب قائمة مهام واقعية وقصيرة',
                    'كافئ نفسك بعد إنجاز كل مهمة'
                ]
            },
            'خبير الأعذار المحترف 🎭': {
                description: 'لديك قدرة خارقة على اختراع الأعذار المقنعة!',
                icon: '🎭',
                activities: [
                    'اختراع أعذار معقدة',
                    'إقناع نفسك بتأجيل المهام',
                    'التظاهر بالانشغال الشديد'
                ],
                advice: [
                    'ابدأ بمهام صغيرة وسهلة',
                    'ضع موعداً نهائياً لكل مهمة',
                    'شارك أهدافك مع صديق ليساعدك في المتابعة'
                ]
            },
            'ملك التشتت المتعدد المهام 👑': {
                description: 'أنت موهوب في بدء عدة مهام دون إنهاء أي منها!',
                icon: '👑',
                activities: [
                    'فتح عدة مشاريع في نفس الوقت',
                    'التنقل بين المهام بسرعة',
                    'نسيان ما كنت تفعله أصلاً'
                ],
                advice: [
                    'ركز على مهمة واحدة في كل مرة',
                    'استخدم تقنية بومودورو (25 دقيقة عمل، 5 دقيقة راحة)',
                    'أغلق كل التطبيقات غير الضرورية'
                ]
            }
        };

        // Calculate total hours wasted
        const totalHours = Object.values(answers).reduce((sum, answer) => sum + answer.hours, 0);
        
        // Determine profile based on answers
        let profile = '';
        if (answers.procrastination.value === 'social' || answers.distraction.value === 'notifications') {
            profile = 'محترف المماطلة الرقمية 📱';
        } else if (answers.activity.value === 'organizing' || answers.excuse.value === 'mood') {
            profile = 'فنان التسويف المبدع 🎨';
        } else if (answers.excuse.value === 'tomorrow' || answers.productivity.value === 'notes') {
            profile = 'خبير الأعذار المحترف 🎭';
        } else {
            profile = 'ملك التشتت المتعدد المهام 👑';
        }

        const profileData = timeWastingProfiles[profile];
        
        // Calculate yearly statistics
        const yearlyHours = totalHours * 52; // 52 weeks in a year
        const yearlyDays = Math.round(yearlyHours / 24);
        const yearlySalary = yearlyHours * 50; // Assuming average hourly rate of 50 SAR

        // Get alternative activities based on daily hours
        const dailyHours = Math.round(totalHours / 7); // Average daily hours
        const alternatives = alternativeActivities[dailyHours] || alternativeActivities['2'];

        return {
            ...profileData,
            totalHours,
            yearlyStats: {
                hours: yearlyHours,
                days: yearlyDays,
                salary: yearlySalary
            },
            alternatives
        };
    }

    function showResults() {
        const result = calculateTimeWasted();
        const { yearlyStats, alternatives } = result;

        resultDiv.innerHTML = `
            <div class="result-container">
                <div class="profile-section text-center mb-5">
                    <div class="profile-icon mb-3">${result.icon}</div>
                    <h2 class="mb-3">${result.description}</h2>
                    
                    <div class="yearly-stats mt-4">
                        <div class="row g-4">
                            <div class="col-md-4">
                                <div class="stat-card">
                                    <div class="stat-icon">⏰</div>
                                    <div class="stat-value">${yearlyStats.hours}</div>
                                    <div class="stat-label">ساعة في السنة</div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-card">
                                    <div class="stat-icon">📅</div>
                                    <div class="stat-value">${yearlyStats.days}</div>
                                    <div class="stat-label">يوم في السنة</div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-card">
                                    <div class="stat-icon">💰</div>
                                    <div class="stat-value">${yearlyStats.salary.toLocaleString()}</div>
                                    <div class="stat-label">ريال مهدر</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="activities-section mb-5">
                    <h3 class="text-center mb-4">أنشطتك المفضلة لإضاعة الوقت 🎯</h3>
                    <div class="activities-list">
                        ${result.activities.map(activity => `
                            <div class="activity-item">
                                <i class="bi bi-check2-circle"></i>
                                <span>${activity}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="alternatives-section mb-5">
                    <h3 class="text-center mb-4">ماذا يمكنك أن تفعل بهذا الوقت؟ 🌟</h3>
                    <div class="row g-4">
                        ${alternatives.map(alt => `
                            <div class="col-md-4">
                                <div class="alternative-card">
                                    <div class="alternative-text">${alt.text}</div>
                                    <div class="alternative-value">${alt.value}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="advice-section mb-5">
                    <h3 class="text-center mb-4">نصائح لتحسين إدارة وقتك ✨</h3>
                    <div class="advice-list">
                        ${result.advice.map(tip => `
                            <div class="advice-item">
                                <i class="bi bi-lightbulb"></i>
                                <span>${tip}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="actions mt-4 text-center">
                    <button onclick="location.reload()" class="btn btn-primary btn-lg">
                        اختبر نفسك مرة أخرى! 🔄
                    </button>
                    <button onclick="shareResults()" class="btn btn-outline-primary btn-lg ms-2">
                        شارك النتيجة! 🔗
                    </button>
                </div>
            </div>
        `;
        
        resultDiv.style.display = 'block';
        
        // Animate stats cards
        setTimeout(() => {
            document.querySelectorAll('.stat-card').forEach((card, index) => {
                card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.2}s forwards`;
            });
        }, 100);

        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function shareResults() {
        alert('قريباً! سيتم إضافة خاصية مشاركة النتائج في التحديث القادم 🔜');
    }

    // تهيئة الاختبار
    showQuestion(0);
    form.addEventListener('submit', handleAnswer);
});
