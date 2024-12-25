// قائمة الأسئلة والخيارات
const questions = [
    {
        id: 'breakfast',
        text: 'ماذا تفضل في الفطور؟',
        options: [
            { value: 'pancakes', text: '🥞 بان كيك يطير في الهواء' },
            { value: 'eggs', text: '🍳 بيض يتكلم' },
            { value: 'coffee', text: '☕ قهوة تقرأ المستقبل' },
            { value: 'sandwich', text: '🥪 ساندويتش يغني' }
        ]
    },
    {
        id: 'supervillain',
        text: 'من هو عدوك اللدود؟',
        options: [
            { value: 'alarm', text: '⏰ المنبه الصباحي' },
            { value: 'socks', text: '🧦 الجوارب المفقودة' },
            { value: 'wifi', text: '📶 الواي فاي البطيء' },
            { value: 'dishes', text: '🍽️ الأطباق المتسخة' }
        ]
    },
    {
        id: 'transport',
        text: 'كيف تفضل التنقل؟',
        options: [
            { value: 'flying', text: '🦸‍♂️ طائراً مثل السوبرمان' },
            { value: 'teleport', text: '✨ الانتقال الآني للمطبخ' },
            { value: 'carpet', text: '🪄 سجادة طائرة مريحة' },
            { value: 'jumping', text: '🦘 القفز العالي مثل الكنغر' }
        ]
    },
    {
        id: 'sidekick',
        text: 'من تختار كمساعد خارق؟',
        options: [
            { value: 'cat', text: '🐱 قط يتكلم ويحل الألغاز' },
            { value: 'robot', text: '🤖 روبوت يطبخ البيتزا' },
            { value: 'cloud', text: '☁️ سحابة تمطر شوكولاتة' },
            { value: 'plant', text: '🌱 نبتة تنمو وتقدم النصائح' }
        ]
    },
    {
        id: 'weakness',
        text: 'ما هي نقطة ضعفك الخارقة؟',
        options: [
            { value: 'chocolate', text: '🍫 رؤية الشوكولاتة' },
            { value: 'jokes', text: '😄 النكت السيئة' },
            { value: 'cuteness', text: '🐶 صور الحيوانات اللطيفة' },
            { value: 'music', text: '🎵 الأغاني المعدية' }
        ]
    }
];

// قائمة القوى الخارقة
const superpowers = {
    'التحكم في الطعام السحري 🍕': {
        description: 'يمكنك تحويل أي طعام عادي إلى وجبة خارقة! البيتزا تطير، والآيس كريم لا يذوب أبداً',
        abilities: [
            'تحويل الخضروات إلى حلويات 🥕→🍪',
            'جعل الطعام يرقص على المائدة 💃',
            'طبخ وجبة كاملة في ثانية واحدة ⚡'
        ],
        warning: 'تحذير: قد يؤدي إلى زيادة شهية جميع من حولك! 😋'
    },
    'عبقري النوم المتأخر 😴': {
        description: 'أنت خارق في تجنب الاستيقاظ المبكر! يمكنك النوم في أي مكان وفي أي وقت',
        abilities: [
            'تحويل المنبه إلى موسيقى هادئة 🎵',
            'إنشاء فقاعة نوم سحرية 💭',
            'التحكم في الأحلام السعيدة 🌈'
        ],
        warning: 'تحذير: قد تفوتك كل اجتماعات الصباح! 😅'
    },
    'متحدث الحيوانات الكوميدي 🐾': {
        description: 'يمكنك التحدث مع الحيوانات وجعلها تضحك! كل القطط والكلاب تحبك',
        abilities: [
            'إخبار نكت يفهمها الحيوانات 🎭',
            'عقد حفلات للحيوانات الأليفة 🎉',
            'ترجمة مواء القطط إلى شعر 📝'
        ],
        warning: 'تحذير: الحيوانات قد تطلب منك الطعام باستمرار! 🐱'
    },
    'ساحر التكنولوجيا المرح 🔮': {
        description: 'يمكنك جعل كل الأجهزة الإلكترونية تعمل بطريقة مضحكة ومفيدة',
        abilities: [
            'جعل الهاتف يضحك عند الشحن 📱',
            'تحويل الواي فاي البطيء إلى سريع 📶',
            'جعل الكمبيوتر يغني عند التحديث 🎤'
        ],
        warning: 'تحذير: الأجهزة قد تصبح مدمنة على نكتك! 🤖'
    }
};

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('superpowerForm');
    const questionContainer = document.getElementById('questionContainer');
    const resultDiv = document.getElementById('result');
    const progressBar = document.querySelector('.progress-bar');
    
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
                <div class="form-check mb-3">
                    <input class="form-check-input" type="radio" 
                           name="question" value="${option.value}" 
                           id="${option.value}" required>
                    <label class="form-check-label" for="${option.value}">
                        ${option.text}
                    </label>
                </div>
            `).join('');

        questionContainer.innerHTML = `
            <h3 class="question-title mb-4">${question.text}</h3>
            ${optionsHTML}
            <button type="submit" class="btn btn-primary w-100 mt-4">
                ${index === questions.length - 1 ? 'اكتشف قوتك الخارقة! 🦸‍♂️' : 'السؤال التالي ⚡'}
            </button>
        `;
    }

    function handleAnswer(e) {
        e.preventDefault();
        const selectedOption = document.querySelector('input[name="question"]:checked');
        if (!selectedOption) return;

        answers[questions[currentQuestion].id] = selectedOption.value;
        currentQuestion++;
        showQuestion(currentQuestion);
    }

    function calculateSuperpower() {
        const powerPoints = {
            'التحكم في الطعام السحري 🍕': 0,
            'عبقري النوم المتأخر 😴': 0,
            'متحدث الحيوانات الكوميدي 🐾': 0,
            'ساحر التكنولوجيا المرح 🔮': 0
        };

        if (answers.breakfast === 'pancakes' || answers.breakfast === 'eggs') {
            powerPoints['التحكم في الطعام السحري 🍕'] += 2;
        }
        if (answers.supervillain === 'alarm') {
            powerPoints['عبقري النوم المتأخر 😴'] += 2;
        }
        if (answers.sidekick === 'cat' || answers.weakness === 'cuteness') {
            powerPoints['متحدث الحيوانات الكوميدي 🐾'] += 2;
        }
        if (answers.supervillain === 'wifi' || answers.transport === 'teleport') {
            powerPoints['ساحر التكنولوجيا المرح 🔮'] += 2;
        }

        return Object.entries(powerPoints)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }

    function showResults() {
        const superpower = calculateSuperpower();
        const power = superpowers[superpower];

        resultDiv.innerHTML = `
            <div class="result-box mt-4">
                <h3 class="text-center mb-4">قوتك الخارقة هي:</h3>
                <div class="superpower-name display-4 text-center mb-4">${superpower}</div>
                
                <div class="superpower-description mb-4">
                    <p>${power.description}</p>
                </div>

                <div class="abilities-box mb-4">
                    <h4>قدراتك الخارقة:</h4>
                    <ul class="list-group">
                        ${power.abilities.map(ability => 
                            `<li class="list-group-item">${ability}</li>`
                        ).join('')}
                    </ul>
                </div>

                <div class="warning-box alert alert-warning">
                    ${power.warning}
                </div>

                <button onclick="location.reload()" class="btn btn-primary w-100 mt-4">
                    اختبر قوة خارقة أخرى! 🦸‍♂️
                </button>
            </div>
        `;
        
        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // تهيئة الاختبار
    showQuestion(0);
    form.addEventListener('submit', handleAnswer);
});
