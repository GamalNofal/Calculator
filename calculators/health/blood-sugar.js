document.addEventListener('DOMContentLoaded', function() {
    // Initialize history array in localStorage if it doesn't exist
    if (!localStorage.getItem('bloodSugarHistory')) {
        localStorage.setItem('bloodSugarHistory', JSON.stringify([]));
    }
    // Get DOM elements
    const mgdlForm = document.getElementById('mgdlForm');
    const mmolForm = document.getElementById('mmolForm');
    const a1cForm = document.getElementById('a1cForm');
    const resultContainer = document.getElementById('result');
    const quickConversions = document.getElementById('quickConversions');

    // Input validation and error handling
    function showError(form, message) {
        let error = form.querySelector('.form-error');
        if (!error) {
            error = document.createElement('div');
            error.className = 'form-error text-danger mt-2';
            form.appendChild(error);
        }
        error.textContent = message;
        announce(message);
    }
    function clearError(form) {
        let error = form.querySelector('.form-error');
        if (error) error.remove();
    }
    // Attach validation to forms
    if (mgdlForm) {
        mgdlForm.addEventListener('submit', function(e) {
            clearError(mgdlForm);
            const input = mgdlForm.querySelector('input');
            if (!input.value || isNaN(input.value) || Number(input.value) <= 0) {
                e.preventDefault();
                showError(mgdlForm, 'يرجى إدخال قيمة عددية صحيحة لمستوى السكر.');
            } else {
                const mgdl = parseFloat(input.value);
                convertAndDisplay(mgdl, 'mgdl');
            }
        });
    }
    if (mmolForm) {
        mmolForm.addEventListener('submit', function(e) {
            clearError(mmolForm);
            const input = mmolForm.querySelector('input');
            if (!input.value || isNaN(input.value) || Number(input.value) <= 0) {
                e.preventDefault();
                showError(mmolForm, 'يرجى إدخال قيمة عددية صحيحة لمستوى السكر.');
            } else {
                const mmol = parseFloat(input.value);
                convertAndDisplay(mmol, 'mmol');
            }
        });
    }
    if (a1cForm) {
        a1cForm.addEventListener('submit', function(e) {
            clearError(a1cForm);
            const input = a1cForm.querySelector('input');
            if (!input.value || isNaN(input.value) || Number(input.value) <= 0) {
                e.preventDefault();
                showError(a1cForm, 'يرجى إدخال قيمة عددية صحيحة للهيموغلوبين السكري.');
            } else {
                const a1c = parseFloat(input.value);
                const avgBloodSugar = a1cToBloodSugar(a1c);
                displayA1cResult(a1c, avgBloodSugar);
            }
        });
    }

    // Helper function for accessibility: Announce updates to screen readers
    function announce(message) {
        let liveRegion = document.getElementById('aria-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('role', 'status');
            liveRegion.className = 'visually-hidden';
            document.body.appendChild(liveRegion);
        }
        liveRegion.textContent = message;
    }
    
    // Create history container
    const historyContainer = document.createElement('div');
    historyContainer.className = 'history-container mt-4';
    historyContainer.innerHTML = `
        <h4 class="mb-3">آخر التحويلات</h4>
        <div class="history-list"></div>
    `;
    document.querySelector('.calculator-container').appendChild(historyContainer);
    updateHistory();

    // Blood sugar ranges in mg/dL
    const ranges = {
        fasting: {
            normal: { min: 70, max: 99 },
            prediabetes: { min: 100, max: 125 },
            diabetes: { min: 126, max: 1000 }
        },
        postMeal: {
            normal: { min: 70, max: 140 },
            prediabetes: { min: 141, max: 199 },
            diabetes: { min: 200, max: 1000 }
        },
        a1c: {
            normal: { min: 4, max: 5.6 },
            prediabetes: { min: 5.7, max: 6.4 },
            diabetes: { min: 6.5, max: 14 }
        }
    };

    // Common values for quick conversion
    const commonValues = [
        { mgdl: 70, label: 'الحد الأدنى الطبيعي', icon: 'exclamation-triangle' },
        { mgdl: 99, label: 'الحد الأقصى الطبيعي للصائم', icon: 'check-circle' },
        { mgdl: 140, label: 'الحد الأقصى الطبيعي بعد الأكل', icon: 'clock' },
        { mgdl: 180, label: 'هدف ما بعد الوجبة لمرضى السكري', icon: 'bullseye' },
        { mgdl: 200, label: 'عتبة تشخيص السكري', icon: 'exclamation-circle' }
    ];

    // Lifestyle tips based on blood sugar levels
    const lifestyleTips = {
        low: [
            { tip: 'تناول 15 جرام من الكربوهيدرات سريعة المفعول', icon: 'lightning' },
            { tip: 'تناول وجبات منتظمة ولا تتخطى أي وجبة', icon: 'clock-history' },
            { tip: 'احمل دائماً سكر سريع المفعول معك', icon: 'bag-check' }
        ],
        normal: [
            { tip: 'حافظ على نمط حياتك الصحي', icon: 'heart' },
            { tip: 'مارس الرياضة بانتظام (30 دقيقة يومياً)', icon: 'bicycle' },
            { tip: 'تناول الخضروات والبروتين في كل وجبة', icon: 'egg-fried' }
        ],
        prediabetes: [
            { tip: 'قلل من تناول السكريات المكررة', icon: 'dash-circle' },
            { tip: 'زد من النشاط البدني (45 دقيقة يومياً)', icon: 'person-walking' },
            { tip: 'راقب وزنك وحاول خسارة 5-7% من وزنك', icon: 'graph-down-arrow' }
        ],
        diabetes: [
            { tip: 'راجع طبيبك لوضع خطة علاجية', icon: 'hospital' },
            { tip: 'قس السكر بانتظام وسجل القراءات', icon: 'journal-check' },
            { tip: 'تعلم حساب الكربوهيدرات في طعامك', icon: 'calculator' }
        ]
    };

    // Advice data
    const adviceData = {
        low: [
            {
                title: 'تناول السكر السريع',
                text: 'تناول 15 جرام من الكربوهيدرات سريعة المفعول مثل عصير التفاح',
                icon: 'lightning-charge'
            },
            {
                title: 'المراقبة',
                text: 'قم بقياس السكر بعد 15 دقيقة من تناول السكر',
                icon: 'clock'
            },
            {
                title: 'الوقاية',
                text: 'احمل دائماً سكر سريع المفعول معك',
                icon: 'shield-check'
            }
        ],
        normal: [
            {
                title: 'النشاط البدني',
                text: 'مارس الرياضة بانتظام لمدة 30 دقيقة يومياً',
                icon: 'bicycle'
            },
            {
                title: 'التغذية',
                text: 'تناول وجبات متوازنة تحتوي على الخضروات والبروتين',
                icon: 'egg-fried'
            },
            {
                title: 'المتابعة',
                text: 'استمر في مراقبة مستوى السكر بشكل دوري',
                icon: 'graph-up'
            }
        ],
        high: [
            {
                title: 'استشارة الطبيب',
                text: 'راجع طبيبك لتعديل خطة العلاج',
                icon: 'hospital'
            },
            {
                title: 'شرب الماء',
                text: 'احرص على شرب كمية كافية من الماء',
                icon: 'droplet'
            },
            {
                title: 'الحركة',
                text: 'قم بالمشي لمدة 15 دقيقة لتخفيض مستوى السكر',
                icon: 'person-walking'
            }
        ],
        prediabetes: [
            {
                title: 'تعديل النظام الغذائي',
                text: 'قلل من تناول السكريات والنشويات المكررة',
                icon: 'basket'
            },
            {
                title: 'النشاط البدني',
                text: 'مارس الرياضة لمدة 150 دقيقة أسبوعياً',
                icon: 'heart-pulse'
            },
            {
                title: 'الوزن',
                text: 'اعمل على خسارة 5-7% من وزنك الحالي',
                icon: 'graph-down-arrow'
            }
        ]
    };

    // Food impact on blood sugar
    const foodImpact = {
        fast: [
            { food: 'العسل', impact: 'سريع جداً', icon: '🍯' },
            { food: 'التمر', impact: 'سريع', icon: '🌴' },
            { food: 'الخبز الأبيض', impact: 'سريع', icon: '🍞' }
        ],
        moderate: [
            { food: 'الأرز البني', impact: 'معتدل', icon: '🌾' },
            { food: 'البقوليات', impact: 'معتدل', icon: '🥜' },
            { food: 'الفواكه الكاملة', impact: 'معتدل', icon: '🍎' }
        ],
        slow: [
            { food: 'الخضروات الورقية', impact: 'بطيء', icon: '🥬' },
            { food: 'المكسرات', impact: 'بطيء', icon: '🥜' },
            { food: 'الأفوكادو', impact: 'بطيء', icon: '🥑' }
        ]
    };

    // Form submission handlers
    mgdlForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const mgdl = parseFloat(document.getElementById('mgdlInput').value);
        convertAndDisplay(mgdl, 'mgdl');
    });

    mmolForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const mmol = parseFloat(document.getElementById('mmolInput').value);
        convertAndDisplay(mmol, 'mmol');
    });

    // A1C form submission handler
    a1cForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const a1c = parseFloat(document.getElementById('a1cInput').value);
        const avgBloodSugar = a1cToBloodSugar(a1c);
        displayA1cResult(a1c, avgBloodSugar);
    });

    function a1cToBloodSugar(a1c) {
        // Formula: eAG (mg/dL) = (28.7 × A1C) - 46.7
        return Math.round((28.7 * a1c) - 46.7);
    }

    function displayA1cResult(a1c, avgBloodSugar) {
        const mmolValue = mgdlToMmol(avgBloodSugar);
        resultContainer.style.display = 'block';
        document.querySelector('.conversion-result').innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i>
                نسبة A1C ${a1c}% تعادل متوسط سكر:
                <br>
                <strong>${avgBloodSugar} mg/dL</strong>
                <br>
                <strong>${mmolValue.toFixed(1)} mmol/L</strong>
            </div>
        `;
        updateRangeStatus(avgBloodSugar);
        updateRangeIndicator(avgBloodSugar);
        updateRecommendations(avgBloodSugar);
        addToHistory({ value: a1c, unit: 'A1C', timestamp: new Date().toISOString() });
    }

    function addToHistory(entry) {
        const history = JSON.parse(localStorage.getItem('bloodSugarHistory'));
        history.unshift(entry);
        if (history.length > 10) history.pop(); // Keep only last 10 entries
        localStorage.setItem('bloodSugarHistory', JSON.stringify(history));
        updateHistory();
    }

    function updateHistory() {
        const history = JSON.parse(localStorage.getItem('bloodSugarHistory'));
        const historyList = document.querySelector('.history-list');
        historyList.innerHTML = history.map(entry => {
            const date = new Date(entry.timestamp);
            const timeStr = date.toLocaleTimeString('ar-EG');
            const dateStr = date.toLocaleDateString('ar-EG');
            return `
                <div class="history-item mb-2 p-2 border rounded">
                    <small class="text-muted">${dateStr} ${timeStr}</small>
                    <br>
                    <strong>${entry.value} ${entry.unit}</strong>
                </div>
            `;
        }).join('');
    }

    function getTimeBasedRecommendations() {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 10) {
            return 'الصباح أفضل وقت لفحص السكر الصائم';
        } else if (hour >= 10 && hour < 16) {
            return 'تذكر قياس السكر بعد ساعتين من الوجبة';
        } else if (hour >= 16 && hour < 22) {
            return 'راقب مستوى السكر قبل النوم';
        } else {
            return 'تجنب الأكل في وقت متأخر من الليل';
        }
    }

    function convertAndDisplay(value, fromUnit) {
        let mgdlValue, mmolValue;
        
        if (fromUnit === 'mgdl') {
            mgdlValue = value;
            mmolValue = mgdlToMmol(value);
        } else {
            mmolValue = value;
            mgdlValue = mmolToMgdl(value);
        }

        // Add to history
        addToHistory({
            value: fromUnit === 'mgdl' ? mgdlValue : mmolValue,
            unit: fromUnit.toUpperCase(),
            timestamp: new Date().toISOString()
        });

        // Show result container
        resultContainer.style.display = 'block';

        // Update conversion result
        const conversionResult = document.querySelector('.conversion-result');
        conversionResult.innerHTML = `
            <div class="alert alert-info">
                <div class="row align-items-center">
                    <div class="col-6 text-center border-end">
                        <small>mg/dL</small>
                        <h3 class="mb-0">${mgdlValue}</h3>
                    </div>
                    <div class="col-6 text-center">
                        <small>mmol/L</small>
                        <h3 class="mb-0">${mmolValue.toFixed(1)}</h3>
                    </div>
                </div>
            </div>
        `;

        // Update status and recommendations
        updateRangeStatus(mgdlValue);
        updateRangeIndicator(mgdlValue);
        updateRecommendations(mgdlValue);
        updateQuickConversions(fromUnit);
        updateFoodImpact(mgdlValue);
        updateRangeIndicator(mgdlValue);

        // Update quick conversions
        updateQuickConversions(fromUnit);

        // Update recommendations and lifestyle tips
        updateRecommendations(mgdlValue);

        // Show food impact
        updateFoodImpact(mgdlValue);

        // Show results with smooth animation
        resultContainer.style.opacity = '0';
        resultContainer.style.display = 'block';
        setTimeout(() => {
            resultContainer.style.opacity = '1';
            resultContainer.style.transition = 'opacity 0.5s ease-in';
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    function mgdlToMmol(mgdl) {
        return mgdl / 18.0182;
    }

    function mmolToMgdl(mmol) {
        return mmol * 18.0182;
    }

    function updateRangeStatus(mgdl) {
        let status, color;
        
        if (mgdl < ranges.fasting.normal.max) {
            status = 'طبيعي';
            color = '#198754';  // Bootstrap success green
        } else if (mgdl < ranges.fasting.prediabetes.max) {
            status = 'ما قبل السكري';
            color = '#ffc107';  // Bootstrap warning yellow
        } else {
            status = 'نطاق السكري';
            color = '#dc3545';  // Bootstrap danger red
        }

        document.getElementById('rangeStatus').innerHTML = `
            <span style="color: ${color}; font-weight: 600;">${status}</span>
        `;
    }

    function updateRangeIndicator(mgdl) {
        // Calculate position percentage (0-100)
        let position;
        if (mgdl <= ranges.fasting.normal.max) {
            position = (mgdl / ranges.fasting.normal.max) * 20; // First 20% of bar
        } else if (mgdl <= ranges.fasting.prediabetes.max) {
            position = 20 + ((mgdl - ranges.fasting.normal.max) / 
                (ranges.fasting.prediabetes.max - ranges.fasting.normal.max)) * 20; // Next 20%
        } else {
            position = Math.min(40 + ((mgdl - ranges.fasting.prediabetes.max) / 
                (ranges.fasting.diabetes.max - ranges.fasting.prediabetes.max)) * 60, 100); // Remaining 60%
        }

        const marker = document.getElementById('valueMarker');
        const label = document.getElementById('markerLabel');
        
        marker.style.left = `${position}%`;
        label.textContent = `${Math.round(mgdl)} mg/dL`;
    }

    function updateQuickConversions(fromUnit) {
        quickConversions.innerHTML = '';
        
        commonValues.forEach(value => {
            const div = document.createElement('div');
            div.className = 'quick-convert-item';
            div.innerHTML = `
                <span>${value.label}</span>
                <span>
                    <strong>${value.mgdl} mg/dL</strong>
                    <span class="text-muted">=</span>
                    <strong>${mgdlToMmol(value.mgdl).toFixed(1)} mmol/L</strong>
                    <i class="bi bi-${value.icon} text-primary ms-2"></i>
                </span>
            `;
            quickConversions.appendChild(div);
        });
    }

    function updateRecommendations(mgdl) {
        const timeRecommendation = getTimeBasedRecommendations();
        
        // Determine blood sugar status and get relevant advice
        let adviceType = 'normal';
        if (mgdl < 70) {
            adviceType = 'low';
        } else if (mgdl > 180) {
            adviceType = 'high';
        } else if (mgdl >= 100 && mgdl <= 125) {
            adviceType = 'prediabetes';
        }

        // Get advice cards for the current status
        const advice = adviceData[adviceType];
        
        // Update advice section
        const adviceCards = document.getElementById('advice-cards');
        if (adviceCards) {
            adviceCards.innerHTML = advice.map(item => `
                <div class="col-md-4">
                    <div class="advice-card">
                        <i class="bi bi-${item.icon} advice-icon text-primary"></i>
                        <h5 class="advice-title">${item.title}</h5>
                        <p class="advice-text">${item.text}</p>
                    </div>
                </div>
            `).join('');
        }

        // Update range status
        const rangeStatus = document.querySelector('.range-status');
        if (rangeStatus) {
            let statusClass, statusText;
            if (mgdl < 70) {
                statusClass = 'danger';
                statusText = 'انخفاض السكر في الدم';
            } else if (mgdl <= 99) {
                statusClass = 'success';
                statusText = 'مستوى طبيعي';
            } else if (mgdl <= 125) {
                statusClass = 'warning';
                statusText = 'ما قبل السكري';
            } else {
                statusClass = 'danger';
                statusText = 'ارتفاع السكر في الدم';
            }

            rangeStatus.innerHTML = `
                <div class="alert alert-${statusClass} mb-0">
                    <i class="bi bi-info-circle me-2"></i>
                    ${statusText}
                    <div class="mt-2 small">${timeRecommendation}</div>
                </div>
            `;
        }


        let category;
        if (mgdl < ranges.fasting.normal.min) {
            category = 'low';
        } else if (mgdl <= ranges.fasting.normal.max) {
            category = 'normal';
        } else if (mgdl <= ranges.fasting.prediabetes.max) {
            category = 'prediabetes';
        } else {
            category = 'diabetes';
        }

        // Add lifestyle tips
        const tipsSection = document.createElement('div');
        tipsSection.className = 'mb-4';
        tipsSection.innerHTML = `
            <h5 class="mb-3">
                <i class="bi bi-lightbulb-fill text-warning me-2"></i>
                نصائح نمط الحياة
            </h5>
            <div class="list-group">
                ${lifestyleTips[category].map(tip => `
                    <div class="list-group-item list-group-item-action d-flex align-items-center" 
                         style="animation: fadeIn 0.5s ease-in;">
                        <i class="bi bi-${tip.icon} text-primary me-3"></i>
                        <span>${tip.tip}</span>
                    </div>
                `).join('')}
            </div>
        `;
        recommendationsList.appendChild(tipsSection);

        // Add general recommendations
        const generalSection = document.createElement('div');
        generalSection.className = 'mb-4';
        generalSection.innerHTML = `
            <h5 class="mb-3">
                <i class="bi bi-info-circle-fill text-info me-2"></i>
                معلومات مهمة
            </h5>
            <ul class="list-unstyled">
                <li class="mb-2">
                    <i class="bi bi-check2-circle text-success me-2"></i>
                    المستويات الطبيعية للسكر الصائم: ${ranges.fasting.normal.min}-${ranges.fasting.normal.max} mg/dL
                </li>
                <li class="mb-2">
                    <i class="bi bi-check2-circle text-success me-2"></i>
                    المستويات الطبيعية بعد الأكل: ${ranges.postMeal.normal.min}-${ranges.postMeal.normal.max} mg/dL
                </li>
                <li class="mb-2">
                    <i class="bi bi-clock text-primary me-2"></i>
                    يجب قياس السكر الصائم بعد 8 ساعات من الصيام
                </li>
            </ul>
        `;
        recommendationsList.appendChild(generalSection);
    }

    function updateFoodImpact(mgdl) {
        const foodSection = document.createElement('div');
        foodSection.className = 'mt-4';
        foodSection.innerHTML = `
            <h5 class="mb-3">
                <i class="bi bi-basket-fill text-success me-2"></i>
                تأثير الأطعمة على السكر
            </h5>
            <div class="row g-3">
                ${Object.entries(foodImpact).map(([speed, foods]) => `
                    <div class="col-md-4">
                        <div class="card h-100" style="animation: fadeIn 0.5s ease-in;">
                            <div class="card-body">
                                <h6 class="card-title text-center mb-3">
                                    ${speed === 'fast' ? 'تأثير سريع' : 
                                      speed === 'moderate' ? 'تأثير معتدل' : 'تأثير بطيء'}
                                </h6>
                                ${foods.map(food => `
                                    <div class="d-flex align-items-center mb-2">
                                        <span class="me-2">${food.icon}</span>
                                        <span>${food.food}</span>
                                        <span class="ms-auto small text-muted">${food.impact}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        document.getElementById('recommendations').appendChild(foodSection);
    }
});
