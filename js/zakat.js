class ZakatCalculator {
    constructor() {
        this.form = document.getElementById('zakatForm');
        this.resultContainer = document.getElementById('zakatResult');
        this.zakatAmountElement = document.getElementById('zakatAmount');
        this.zakatDetailsElement = document.getElementById('zakatDetails');
        
        // Initialize with default prices
        this.prices = {
            gold: 250,
            silver: 3,
            lastUpdate: null
        };
        
        this.nisab = {
            gold: 85,
            silver: 595
        };
        
        this.exchangeRates = {
            SAR: 1.00,
            USD: 3.75,
            EUR: 4.12,
            GBP: 4.77
        };

        // API Configuration
        this.metalPriceConfig = {
            baseUrl: 'https://api.metalpriceapi.com/v1/',
            apiKey: 'YOUR_API_KEY',
            symbols: ['XAU', 'XAG'] // Gold and Silver
        };
        
        this.exchangeApiConfig = {
            baseUrl: 'https://v6.exchangerate-api.com/v6/',
            apiKey: 'YOUR_API_KEY',
            baseCurrency: 'SAR'
        };
        
        this.lastRatesUpdate = null;
        this.ratesUpdateInterval = 1 * 60 * 60 * 1000; // 1 hour
        this.loadingStates = new Set();
        
        this.initializeApp();
    }

    async initializeApp() {
        this.showLoading('initialization');
        try {
            await Promise.all([
                this.initializeMetalPrices(),
                this.initializeExchangeRates()
            ]);
            this.initializeEventListeners();
            this.initializeTooltips();
            this.startRatesUpdateInterval();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('حدث خطأ أثناء تهيئة الحاسبة. يرجى المحاولة مرة أخرى.');
        } finally {
            this.hideLoading('initialization');
        }
    }

    async initializeMetalPrices() {
        try {
            const savedPrices = this.getSavedMetalPrices();
            if (savedPrices) {
                this.prices = savedPrices;
                this.updatePriceDisplay();
            }

            if (this.shouldUpdatePrices()) {
                await this.fetchMetalPrices();
            }
        } catch (error) {
            console.warn('Failed to initialize metal prices:', error);
            this.showMetalPriceError();
        }
    }

    async fetchMetalPrices() {
        this.showLoading('metals');
        try {
            const response = await fetch(
                `${this.metalPriceConfig.baseUrl}latest?api_key=${this.metalPriceConfig.apiKey}&base=SAR&currencies=XAU,XAG`
            );
            
            if (!response.ok) throw new Error('Metal price API request failed');
            
            const data = await response.json();
            if (data.success) {
                // Convert troy ounce to gram (1 troy oz = 31.1034768 grams)
                const gramsPerOz = 31.1034768;
                this.prices = {
                    gold: (data.rates.XAU * 1000) / gramsPerOz, // price per gram
                    silver: (data.rates.XAG * 1000) / gramsPerOz,
                    lastUpdate: Date.now()
                };
                
                localStorage.setItem('zakatMetalPrices', JSON.stringify(this.prices));
                this.updatePriceDisplay();
            }
        } catch (error) {
            console.error('Error fetching metal prices:', error);
            this.showMetalPriceError();
        } finally {
            this.hideLoading('metals');
        }
    }

    getSavedMetalPrices() {
        const saved = localStorage.getItem('zakatMetalPrices');
        if (!saved) return null;

        const prices = JSON.parse(saved);
        return Date.now() - prices.lastUpdate < this.ratesUpdateInterval ? prices : null;
    }

    shouldUpdatePrices() {
        return !this.prices.lastUpdate || 
               (Date.now() - this.prices.lastUpdate) > this.ratesUpdateInterval;
    }

    showLoading(state) {
        this.loadingStates.add(state);
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const refreshBtn = document.getElementById('refresh-rates');
        
        if (this.loadingStates.size > 0) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>جاري التحميل...';
            if (refreshBtn) {
                refreshBtn.disabled = true;
                refreshBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
            }
        }
    }

    hideLoading(state) {
        this.loadingStates.delete(state);
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const refreshBtn = document.getElementById('refresh-rates');
        
        if (this.loadingStates.size === 0) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'احسب الزكاة';
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
            }
        }
    }

    updatePriceDisplay() {
        const goldPriceElement = document.getElementById('currentGoldPrice');
        const silverPriceElement = document.getElementById('currentSilverPrice');
        const lastUpdateElement = document.getElementById('lastPriceUpdate');
        
        if (goldPriceElement) {
            goldPriceElement.textContent = `${this.prices.gold.toFixed(2)} ريال/جرام`;
        }
        if (silverPriceElement) {
            silverPriceElement.textContent = `${this.prices.silver.toFixed(2)} ريال/جرام`;
        }
        if (lastUpdateElement && this.prices.lastUpdate) {
            const date = new Date(this.prices.lastUpdate);
            lastUpdateElement.textContent = `آخر تحديث: ${date.toLocaleString('ar-SA')}`;
        }
    }

    showError(message) {
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger alert-dismissible fade show mt-3';
        errorAlert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.form.insertAdjacentElement('beforebegin', errorAlert);
    }

    showMetalPriceError() {
        this.showError('تعذر تحديث أسعار المعادن. سيتم استخدام الأسعار المحفوظة مسبقاً.');
    }

    showExchangeRateError() {
        this.showError('تعذر تحديث أسعار العملات. سيتم استخدام الأسعار المحفوظة مسبقاً.');
    }

    calculateZakat() {
        this.showLoading('calculation');
        try {
            const formData = new FormData(this.form);
            const assets = this.collectAssets(formData);
            const totalValue = this.calculateTotalValue(assets);
            const nisabValue = this.calculateNisabValue();
            
            const zakatAmount = totalValue >= nisabValue ? totalValue * 0.025 : 0;
            const currency = formData.get('currency') || 'SAR';
            
            this.displayResults({
                zakatAmount,
                totalValue,
                nisabValue,
                currency,
                assets
            });
        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('حدث خطأ أثناء حساب الزكاة. يرجى التحقق من المدخلات والمحاولة مرة أخرى.');
        } finally {
            this.hideLoading('calculation');
        }
    }

    displayResults({ zakatAmount, totalValue, nisabValue, currency, assets }) {
        const formatter = new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: currency
        });

        this.zakatAmountElement.textContent = formatter.format(zakatAmount);
        
        let details = `إجمالي الأصول: ${formatter.format(totalValue)}<br>`;
        details += `نصاب الزكاة: ${formatter.format(nisabValue)}<br><br>`;
        
        if (totalValue >= nisabValue) {
            details += `تفاصيل الأصول:<br>`;
            for (const [category, value] of Object.entries(assets)) {
                if (value > 0) {
                    details += `- ${this.getAssetCategoryName(category)}: ${formatter.format(value)}<br>`;
                }
            }
        } else {
            details += `<div class="alert alert-info">لم يتم بلوغ النصاب. لا تجب عليك الزكاة.</div>`;
        }

        this.zakatDetailsElement.innerHTML = details;
        this.resultContainer.style.display = 'block';
        this.resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    getAssetCategoryName(category) {
        const categories = {
            cash: 'النقود السائلة',
            bankAccounts: 'الحسابات البنكية',
            gold: 'الذهب',
            silver: 'الفضة',
            stocks: 'الأسهم',
            investments: 'الاستثمارات الأخرى'
        };
        return categories[category] || category;
    }

    async initializeExchangeRates() {
        try {
            // First try to get rates from localStorage
            const savedRates = this.getSavedRates();
            if (savedRates) {
                this.exchangeRates = savedRates;
                console.log('Using cached exchange rates');
            }

            // If rates are old or don't exist, fetch new ones
            if (this.shouldUpdateRates()) {
                await this.fetchExchangeRates();
            }
        } catch (error) {
            console.warn('Failed to initialize exchange rates:', error);
            this.showExchangeRateError();
        }
    }

    getSavedRates() {
        const saved = localStorage.getItem('zakatExchangeRates');
        if (!saved) return null;

        const { rates, timestamp } = JSON.parse(saved);
        this.lastRatesUpdate = timestamp;

        // Return rates if they're less than 1 hour old
        if (Date.now() - timestamp < this.ratesUpdateInterval) {
            return rates;
        }
        return null;
    }

    shouldUpdateRates() {
        return !this.lastRatesUpdate || 
               (Date.now() - this.lastRatesUpdate) > this.ratesUpdateInterval;
    }

    async fetchExchangeRates() {
        try {
            const response = await fetch(`${this.exchangeApiConfig.baseUrl}${this.exchangeApiConfig.apiKey}/latest/${this.exchangeApiConfig.baseCurrency}`);
            if (!response.ok) throw new Error('Exchange rate API request failed');

            const data = await response.json();
            if (data.result === 'success') {
                this.exchangeRates = { SAR: 1, ...data.conversion_rates };
                this.lastRatesUpdate = Date.now();
                
                // Save to localStorage
                localStorage.setItem('zakatExchangeRates', JSON.stringify({
                    rates: this.exchangeRates,
                    timestamp: this.lastRatesUpdate
                }));

                // Update UI with new rates
                this.updateCurrencyLabels();
                if (this.form.checkValidity()) {
                    this.calculateZakat();
                }

                this.showRatesUpdateSuccess();
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error);
            this.showExchangeRateError();
        }
    }

    startRatesUpdateInterval() {
        // Check for updates every hour
        setInterval(() => {
            if (this.shouldUpdateRates()) {
                this.fetchExchangeRates();
            }
        }, this.ratesUpdateInterval);
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateZakat();
        });

        // Update currency labels when currency changes
        document.getElementById('currency').addEventListener('change', () => {
            this.updateCurrencyLabels();
            if (this.form.checkValidity()) {
                this.calculateZakat();
            }
        });

        // Add refresh rates button listener
        const refreshRatesBtn = document.getElementById('refresh-rates');
        if (refreshRatesBtn) {
            refreshRatesBtn.addEventListener('click', async () => {
                refreshRatesBtn.disabled = true;
                refreshRatesBtn.innerHTML = '<i class="bi bi-arrow-clockwise rotating"></i>';
                await this.fetchExchangeRates();
                refreshRatesBtn.disabled = false;
                refreshRatesBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
            });
        }

        // Real-time calculation as user types
        const inputs = ['cash', 'bankBalance', 'gold', 'silver', 'stocks', 'investments'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    if (this.form.checkValidity()) {
                        this.calculateZakat();
                    }
                });
            }
        });

        // Sync all currency selectors
        document.querySelectorAll('.currency-select[data-sync="currency"]').forEach(select => {
            select.addEventListener('change', (e) => {
                const selectedValue = e.target.value;
                document.querySelectorAll('.currency-select[data-sync="currency"]').forEach(otherSelect => {
                    if (otherSelect !== e.target) {
                        otherSelect.value = selectedValue;
                    }
                });
                this.updateCurrencyLabels();
                if (this.form.checkValidity()) {
                    this.calculateZakat();
                }
            });
        });

        // Set initial values for all currency selectors
        const mainCurrencySelect = document.getElementById('currency');
        if (mainCurrencySelect) {
            const initialCurrency = mainCurrencySelect.value;
            document.querySelectorAll('.currency-select[data-sync="currency"]').forEach(select => {
                select.value = initialCurrency;
            });
        }
    }

    initializeTooltips() {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    }

    updateCurrencyLabels() {
        const currencySelect = document.getElementById('currency');
        const selectedOption = currencySelect.options[currencySelect.selectedIndex];
        const symbol = selectedOption.getAttribute('data-symbol');
        const labels = document.querySelectorAll('.currency-label');
        
        labels.forEach(label => {
            label.textContent = symbol;
        });
    }

    convertToSAR(amount, currency) {
        return amount * this.exchangeRates[currency];
    }

    formatCurrency(amount, currency = 'SAR') {
        const currencySelect = document.getElementById('currency');
        const selectedOption = currencySelect.options[currencySelect.selectedIndex];
        const symbol = selectedOption.getAttribute('data-symbol');

        const formattedNumber = new Intl.NumberFormat('ar-SA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);

        return `${formattedNumber} ${symbol}`;
    }

    calculateTotalWealth() {
        const currency = document.getElementById('currency').value;
        
        // Get values from inputs
        const cash = parseFloat(document.getElementById('cash').value) || 0;
        const bankBalance = parseFloat(document.getElementById('bankBalance').value) || 0;
        const goldGrams = parseFloat(document.getElementById('gold').value) || 0;
        const silverGrams = parseFloat(document.getElementById('silver').value) || 0;
        const stocks = parseFloat(document.getElementById('stocks').value) || 0;
        const investments = parseFloat(document.getElementById('investments').value) || 0;

        // Convert monetary values to SAR
        const cashInSAR = this.convertToSAR(cash, currency);
        const bankBalanceInSAR = this.convertToSAR(bankBalance, currency);
        const stocksInSAR = this.convertToSAR(stocks, currency);
        const investmentsInSAR = this.convertToSAR(investments, currency);

        // Calculate precious metals value in SAR
        const goldValueSAR = goldGrams * this.prices.gold;
        const silverValueSAR = silverGrams * this.prices.silver;

        // Calculate total wealth in SAR
        return {
            cash: cashInSAR,
            bankBalance: bankBalanceInSAR,
            gold: goldValueSAR,
            silver: silverValueSAR,
            stocks: stocksInSAR,
            investments: investmentsInSAR,
            total: cashInSAR + bankBalanceInSAR + goldValueSAR + silverValueSAR + stocksInSAR + investmentsInSAR
        };
    }

    meetsNisab(wealthInSAR) {
        const goldNisabValue = this.nisab.gold * this.prices.gold;
        const silverNisabValue = this.nisab.silver * this.prices.silver;
        
        // Use the lower of the two nisab values
        const nisabThreshold = Math.min(goldNisabValue, silverNisabValue);
        
        return wealthInSAR >= nisabThreshold;
    }

    collectAssets(formData) {
        const assets = {};

        // Collect monetary assets
        const cash = parseFloat(formData.get('cash')) || 0;
        const bankBalance = parseFloat(formData.get('bankBalance')) || 0;
        const stocks = parseFloat(formData.get('stocks')) || 0;
        const investments = parseFloat(formData.get('investments')) || 0;

        // Convert monetary assets to SAR
        const currency = formData.get('currency') || 'SAR';
        assets.cash = this.convertToSAR(cash, currency);
        assets.bankAccounts = this.convertToSAR(bankBalance, currency);
        assets.stocks = this.convertToSAR(stocks, currency);
        assets.investments = this.convertToSAR(investments, currency);

        // Collect precious metal assets
        const goldGrams = parseFloat(formData.get('gold')) || 0;
        const silverGrams = parseFloat(formData.get('silver')) || 0;

        assets.gold = goldGrams * this.prices.gold;
        assets.silver = silverGrams * this.prices.silver;

        return assets;
    }

    calculateTotalValue(assets) {
        return Object.values(assets).reduce((total, value) => total + value, 0);
    }

    calculateNisabValue() {
        const goldNisabValue = this.nisab.gold * this.prices.gold;
        const silverNisabValue = this.nisab.silver * this.prices.silver;
        
        // Use the lower of the two nisab values
        return Math.min(goldNisabValue, silverNisabValue);
    }

    showRatesUpdateSuccess() {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success show';
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-check-circle me-2"></i>
                <span>تم تحديث أسعار العملات بنجاح</span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.zakatCalculator = new ZakatCalculator();
});
