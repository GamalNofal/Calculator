// Calculator data structure
const calculators = {
    math: [
        { name: 'النسبة المئوية', icon: 'percent', url: './calculators/math/percentage.html' },
        { name: 'الكسور', icon: 'slash', url: './calculators/math/fractions.html' },
        { name: 'المساحة', icon: 'square', url: './calculators/math/area.html' },
        { name: 'الحجم', icon: 'box', url: './calculators/math/volume.html' },
        { name: 'الحاسبة العلمية', icon: 'calculator', url: './calculators/math/scientific.html' }
    ],
    time: [
        { name: 'حساب العمر', icon: 'calendar-date', url: './calculators/time/age.html' },
        { name: 'الوقت بين تاريخين', icon: 'calendar-range', url: './calculators/time/date-diff.html' },
        { name: 'مدة الوقت', icon: 'clock', url: './calculators/time/duration.html' }
    ],
    health: [
        { name: 'مؤشر كتلة الجسم', icon: 'person', url: './calculators/health/bmi.html' },
        { name: 'السعرات الحرارية', icon: 'fire', url: './calculators/health/calories.html' },
        { name: 'نسبة الدهون', icon: 'heart-pulse', url: './calculators/health/body-fat.html' },
        { name: 'الوزن المثالي', icon: 'person-check', url: './calculators/health/ideal-weight.html' }
    ],
    conversion: [
        { name: 'الطول', icon: 'rulers', url: './calculators/conversion/length.html' },
        { name: 'الوزن', icon: 'weight', url: './calculators/conversion/weight.html' },
        { name: 'درجات الحرارة', icon: 'thermometer', url: './calculators/conversion/temperature.html' },
        { name: 'العملات', icon: 'currency-exchange', url: './calculators/conversion/currency.html' }
    ],
    financial: [
        { name: 'القروض', icon: 'cash-coin', url: './calculators/financial/loans.html' },
        { name: 'الرهن العقاري', icon: 'house', url: './calculators/financial/mortgage.html' },
        { name: 'التقاعد', icon: 'piggy-bank', url: './calculators/financial/retirement.html' },
        { name: 'المدخرات', icon: 'wallet2', url: './calculators/financial/savings.html' }
    ],
    misc: [
        { name: 'الحب', icon: 'heart', url: './calculators/misc/love.html' },
        { name: 'الأبراج', icon: 'stars', url: './calculators/misc/horoscope.html' },
        { name: 'الرحلات', icon: 'airplane', url: './calculators/misc/travel.html' },
        { name: 'العد العشري', icon: '123', url: './calculators/misc/decimal.html' }
    ]
};

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchCalculator');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.trim().toLowerCase();
            
            // Combine all calculators for searching
            const allCalculators = Object.values(calculators).flat();
            
            // Filter calculators based on search term
            const matchedCalculators = allCalculators.filter(calc => 
                calc.name.toLowerCase().includes(searchTerm)
            );

            // Update UI with search results (to be implemented)
            updateSearchResults(matchedCalculators);
        });
    }
});

// Function to update search results
function updateSearchResults(results) {
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results';
    
    if (results.length > 0) {
        results.forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.href = result.url;
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <i class="bi bi-${result.icon}"></i>
                <span>${result.name}</span>
            `;
            searchResultsContainer.appendChild(resultItem);
        });
    } else {
        searchResultsContainer.innerHTML = '<div class="no-results">لا توجد نتائج</div>';
    }

    // Update the search results in the UI
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
    
    const searchContainer = document.querySelector('.search-container');
    searchContainer.appendChild(searchResultsContainer);
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
