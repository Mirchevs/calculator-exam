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

    const barRows = document.querySelectorAll('.bar-row');
    const xAxis = document.querySelector('.chart-x-axis');

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

        // Update Bars (Stacked horizontally: Customer + Lead + Prospect = Total Prospects)
        barRows.forEach((row, index) => {
            const m = index + 1; // Month 1 to 6
            const m_customers = Math.round((customers / 6) * m);
            const m_leads = Math.round((leads / 6) * m);
            const m_prospects = Math.round((prospects / 6) * m);

            // Compute stacked percentages based on max prospects
            const c_pct = (m_customers / maxVal) * 100;
            const l_pct = ((m_leads - m_customers) / maxVal) * 100;
            const p_pct = ((m_prospects - m_leads) / maxVal) * 100;

            const cBar = row.querySelector('.bar-customer');
            const lBar = row.querySelector('.bar-lead');
            const pBar = row.querySelector('.bar-prospect');
            
            cBar.style.width = `${c_pct}%`;
            lBar.style.width = `${Math.max(0, l_pct)}%`; // prevent negative
            pBar.style.width = `${Math.max(0, p_pct)}%`; // prevent negative

            // Update tooltip data
            const tooltip = row.querySelector('.custom-tooltip');
            if (tooltip) {
                tooltip.innerHTML = `${t.monthLabel} #${m}<br>${t.prospectsLabel}: ${m_prospects}<br>${t.leadsLabel}: ${m_leads}<br>${t.customersLabel}: ${m_customers}`;
            }
        });
    }

    leadRateSlider.addEventListener('input', updateCalculator);
    prospectRateSlider.addEventListener('input', updateCalculator);
    totalRevenueInput.addEventListener('input', updateCalculator);
    avgOrderValueInput.addEventListener('input', updateCalculator);
    
    // Initialize
    updateCalculator();
});