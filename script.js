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
    }

    leadRateSlider.addEventListener('input', updateCalculator);
    prospectRateSlider.addEventListener('input', updateCalculator);
    totalRevenueInput.addEventListener('input', updateCalculator);
    avgOrderValueInput.addEventListener('input', updateCalculator);
    
    // Initialize
    updateCalculator();
});