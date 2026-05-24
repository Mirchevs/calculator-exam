document.addEventListener('DOMContentLoaded', () => {
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

    function updateCalculator() {
        const leadRate = parseFloat(leadRateSlider.value);
        const prospectRate = parseFloat(prospectRateSlider.value);
        const totalRevenue = parseFloat(totalRevenueInput.value) || 0;
        const avgOrderValue = parseFloat(avgOrderValueInput.value) || 1;
        
        // Update slider texts
        leadRateValue.textContent = leadRate.toFixed(2) + '%';
        prospectRateValue.textContent = prospectRate.toFixed(2) + '%';
        
        // Calculate logic (mock logic fitting the image numbers if possible)
        // From image: Revenue $10000, Avg Order $1000 => 10 customers.
        const customers = Math.round(totalRevenue / avgOrderValue);
        customersValue.textContent = customers;
        
        // Lead Response Rate = 40%, Customers = 10  => Leads * 0.4 = Customers => Leads = 10 / 0.4 = 25
        const leads = leadRate > 0 ? Math.round(customers / (leadRate / 100)) : 0;
        leadsValue.textContent = leads;
        
        // Prospect Response Rate = 20%, Leads = 25 => Prospects * 0.2 = Leads => Prospects = 25 / 0.2 = 125
        const prospects = prospectRate > 0 ? Math.round(leads / (prospectRate / 100)) : 0;
        prospectsValue.textContent = prospects;

        // --- DYNAMIC CHART UPDATE ---
        const maxVal = prospects > 0 ? prospects : 1; 

        // Update X Axis
        xAxis.innerHTML = '';
        for (let i = 0; i <= 6; i++) {
            const val = Math.round((maxVal / 6) * i);
            const span = document.createElement('span');
            span.textContent = val + (i === 6 ? ' people' : '');
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
                tooltip.innerHTML = `Month #${m}<br>Prospects: ${m_prospects}<br>Leads: ${m_leads}<br>Customers: ${m_customers}`;
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