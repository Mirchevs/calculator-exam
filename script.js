const translations = {
    en: {
        language: "Language",
        currency: "Currency",
        campaignStart: "Campaign Start",
        campaignEnd: "Campaign End",
        totalRevenue: "Total Revenue",
        avgOrderValue: "Avg. Order Value",
        months: "Months",
        people: "people",
        prospects: "Prospects",
        leads: "Leads",
        customers: "Customers",
        leadResponseRate: "Lead Response Rate",
        prospectResponseRate: "Prospect Response Rate",
        monthLabel: "Month",
        prospectsLabel: "Prospects",
        leadsLabel: "Leads",
        customersLabel: "Customers"
    },
    bg: {
        language: "Език",
        currency: "Валута",
        campaignStart: "Начало на кампания",
        campaignEnd: "Край на кампания",
        totalRevenue: "Общи приходи",
        avgOrderValue: "Средна стойност на поръчка",
        months: "Месеци",
        people: "души",
        prospects: "Потенциали",
        leads: "Възможности",
        customers: "Клиенти",
        leadResponseRate: "Процент на възможности",
        prospectResponseRate: "Процент на потенциали",
        monthLabel: "Месец",
        prospectsLabel: "Потенциали",
        leadsLabel: "Възможности",
        customersLabel: "Клиенти"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'en';

    const languageSelect = document.getElementById('languageSelect');
    const currencySelect = document.getElementById('currencySelect');
    const currencySymbols = document.querySelectorAll('.currency-symbol');

    const leadRateSlider = document.getElementById('leadRate');
    const prospectRateSlider = document.getElementById('prospectRate');
    const leadRateValue = document.getElementById('leadRateValue');
    const prospectRateValue = document.getElementById('prospectRateValue');
    
    const totalRevenueInput = document.getElementById('totalRevenue');
    const avgOrderValueInput = document.getElementById('avgOrderValue');
    
    const customersValue = document.getElementById('customersValue');
    const leadsValue = document.getElementById('leadsValue');
    const prospectsValue = document.getElementById('prospectsValue');

    const chartYAxis = document.getElementById('chartYAxis');
    const chartBars = document.getElementById('chartBars');
    const xAxis = document.querySelector('.chart-x-axis');
    
    const campaignStartInput = document.getElementById('campaignStart');
    const campaignEndInput = document.getElementById('campaignEnd');

    function updateLanguage() {
        currentLang = languageSelect.value;
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.childNodes.forEach(child => {
                    // Update only text nodes to preserve icons (like i.fas inside)
                    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== "") {
                        child.nodeValue = " " + translations[currentLang][key] + " ";
                    } else if (child.nodeType === Node.TEXT_NODE && el.childNodes.length === 1) {
                         el.textContent = translations[currentLang][key];
                    }
                });
                
                // If it doesn't have child nodes nicely set up or just text
                if (el.childNodes.length === 0 || (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE)) {
                    el.textContent = translations[currentLang][key];
                }
            }
        });
        updateCalculator();
    }

    if (languageSelect) {
        languageSelect.addEventListener('change', updateLanguage);
    }
    
    if (currencySelect) {
        currencySelect.addEventListener('change', (e) => {
            const sym = e.target.value;
            currencySymbols.forEach(el => el.textContent = sym);
        });
    }

    function updateCalculator() {
        const leadRate = parseFloat(leadRateSlider.value);
        const prospectRate = parseFloat(prospectRateSlider.value);
        const totalRevenue = parseFloat(totalRevenueInput.value) || 0;
        const avgOrderValue = parseFloat(avgOrderValueInput.value) || 1;
        
        // Update slider texts
        leadRateValue.textContent = leadRate.toFixed(2) + '%';
        prospectRateValue.textContent = prospectRate.toFixed(2) + '%';
        
        // Calculate logic based on exam requirements
        // Formula 01: Customers = Revenue / Average Order Value (AOV)
        const customers = Math.ceil(totalRevenue / avgOrderValue);
        customersValue.textContent = customers;
        
        // Formula 02: Leads = Customers * 100 / Lead Conversion Rate (%)
        const leads = leadRate > 0 ? Math.ceil((customers * 100) / leadRate) : 0;
        leadsValue.textContent = leads;
        
        // Formula 03: Prospects = Leads * 100 / Prospect Conversion Rate (%)
        const prospects = prospectRate > 0 ? Math.ceil((leads * 100) / prospectRate) : 0;
        prospectsValue.textContent = prospects;

        // --- DYNAMIC CHART UPDATE ---
        const maxVal = prospects > 0 ? prospects : 1; 

        // Update X Axis
        xAxis.innerHTML = '';
        const t = translations[currentLang];
        for (let i = 0; i <= 6; i++) {
            const val = Math.round((maxVal / 6) * i);
            const span = document.createElement('span');
            span.textContent = val + (i === 6 ? ` ${t.people}` : '');
            xAxis.appendChild(span);
        }
        
        // Calculate Month duration
        let monthsDuration = 1;
        if (campaignStartInput && campaignEndInput) {
            const start = new Date(campaignStartInput.value);
            const end = new Date(campaignEndInput.value);
            if (!isNaN(start) && !isNaN(end) && end >= start) {
                monthsDuration = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
            }
        }
        
        // Render Y Axis and Bars dynamically based on duration
        
        // Clear old specific dynamic elements but keep the grid and y label
        const yLabel = chartYAxis.querySelector('.y-label');
        chartYAxis.innerHTML = '';
        if (yLabel) chartYAxis.appendChild(yLabel);
        
        const chartGrid = chartBars.querySelector('.chart-grid');
        chartBars.innerHTML = '';
        if (chartGrid) chartBars.appendChild(chartGrid);

        // Update Bars (Stacked horizontally: Customer + Lead + Prospect = Total Prospects)
        for (let m = 1; m <= monthsDuration; m++) {
            // Y-axis label
            const ySpan = document.createElement('span');
            ySpan.textContent = m;
            chartYAxis.appendChild(ySpan);
            
            // Generate rows
            const row = document.createElement('div');
            row.className = 'bar-row relative';
            
            const cBar = document.createElement('div');
            cBar.className = 'bar bar-customer';
            const lBar = document.createElement('div');
            lBar.className = 'bar bar-lead';
            const pBar = document.createElement('div');
            pBar.className = 'bar bar-prospect';
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            
            row.appendChild(cBar);
            row.appendChild(lBar);
            row.appendChild(pBar);
            row.appendChild(tooltip);
            chartBars.appendChild(row);

            const m_customers = Math.round((customers / monthsDuration) * m);
            const m_leads = Math.round((leads / monthsDuration) * m);
            const m_prospects = Math.round((prospects / monthsDuration) * m);

            // Compute stacked percentages based on max prospects
            const c_pct = (m_customers / maxVal) * 100;
            const l_pct = ((m_leads - m_customers) / maxVal) * 100;
            const p_pct = ((m_prospects - m_leads) / maxVal) * 100;
            
            cBar.style.width = `${c_pct}%`;
            lBar.style.width = `${Math.max(0, l_pct)}%`; // prevent negative
            pBar.style.width = `${Math.max(0, p_pct)}%`; // prevent negative

            // Update tooltip data
            tooltip.innerHTML = `${t.monthLabel} #${m}<br>${t.prospectsLabel}: ${m_prospects}<br>${t.leadsLabel}: ${m_leads}<br>${t.customersLabel}: ${m_customers}`;
        }
    }

    leadRateSlider.addEventListener('input', updateCalculator);
    prospectRateSlider.addEventListener('input', updateCalculator);
    totalRevenueInput.addEventListener('input', updateCalculator);
    avgOrderValueInput.addEventListener('input', updateCalculator);
    if(campaignStartInput) campaignStartInput.addEventListener('change', updateCalculator);
    if(campaignEndInput) campaignEndInput.addEventListener('change', updateCalculator);
    
    // Initialize
    updateCalculator();
});