const revenueInput = document.getElementById("revenue");
const aovInput = document.getElementById("aov");
const leadRate = document.getElementById("leadRate");
const prospectRate = document.getElementById("prospectRate");

const leadRateLabel = document.getElementById("leadRateLabel");
const prospectRateLabel = document.getElementById("prospectRateLabel");

const prospectsValue = document.getElementById("prospectsValue");
const leadsValue = document.getElementById("leadsValue");
const customersValue = document.getElementById("customersValue");
const campaignStartInput = document.getElementById("campaignStart");
const campaignEndInput = document.getElementById("campaignEnd");
const currencySelect = document.getElementById("currencySelect");

const prospectsProgress = document.querySelector(".stats .card:nth-child(1) .progress span");
const leadsProgress = document.querySelector(".stats .card:nth-child(2) .progress span");
const customersProgress = document.querySelector(".stats .card:nth-child(3) .progress span");

// ----- i18n scaffold -----
const i18n = {
  en: {
    languageLabel: "Language",
    currencyLabel: "Currency",
    campaignStart: "Campaign Start",
    campaignEnd: "Campaign End",
    totalRevenue: "Total Revenue",
    avgOrderValue: "Avg. Order Value",
    prospects: "📁 Prospects",
    leads: "👤 Leads",
    customers: "🏆 Customers",
    leadResponseRate: "Lead Response Rate",
    prospectResponseRate: "Prospect Response Rate",
    customersLabel: "Customers",
    leadsLabel: "Leads",
    prospectsLabel: "Prospects"
  },
  bg: {
    languageLabel: "Език",
    currencyLabel: "Валута",
    campaignStart: "Начало на кампанията",
    campaignEnd: "Край на кампанията",
    totalRevenue: "Общо приходи",
    avgOrderValue: "Средна стойност на поръчка",
    prospects: "📁 Контакти",
    leads: "👤 Лийдове",
    customers: "🏆 Клиенти",
    leadResponseRate: "Честота на отговор (лийдове)",
    prospectResponseRate: "Честота на отговор (контакти)",
    customersLabel: "Клиенти",
    leadsLabel: "Лийдове",
    prospectsLabel: "Контакти"
  }
};

function applyTranslations(lang) {
  const t = i18n[lang] || i18n.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.innerText = t[key];
  });

  // update chart dataset labels if chart exists
  if (typeof chart !== 'undefined' && chart.data && chart.data.datasets) {
    chart.data.datasets[0].label = t.customersLabel || chart.data.datasets[0].label;
    chart.data.datasets[1].label = t.leadsLabel || chart.data.datasets[1].label;
    chart.data.datasets[2].label = t.prospectsLabel || chart.data.datasets[2].label;
    chart.update();
  }
}

function setLanguage(lang) {
  localStorage.setItem('lp_lang', lang);
  applyTranslations(lang);
  updateLanguageBox(lang);
}

const languageOptions = {
  en: {
    label: 'English',
    src: 'https://flagcdn.com/w40/us.png',
    alt: 'US flag'
  },
  bg: {
    label: 'Български',
    src: 'https://flagcdn.com/w40/bg.png',
    alt: 'Bulgarian flag'
  }
};

const languageBoxLabel = document.getElementById('languageBoxLabel');
const languageBoxImage = document.querySelector('.language-box img');

function updateLanguageBox(lang) {
  const selected = languageOptions[lang] || languageOptions.en;
  if (languageBoxLabel) {
    languageBoxLabel.innerText = selected.label;
  }
  if (languageBoxImage) {
    languageBoxImage.src = selected.src;
    languageBoxImage.alt = selected.alt;
  }
}

function updateCurrencySymbols(symbol) {
  document.querySelectorAll('[data-currency-symbol]').forEach(el => {
    el.textContent = symbol;
  });
}

function getChartLabels(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [];
  if (isNaN(start) || isNaN(end)) {
    return Array.from({ length: 6 }, (_, i) => `Month ${i + 1}`);
  }

  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  let target = new Date(end.getFullYear(), end.getMonth(), 1);
  if (current > target) {
    [current, target] = [target, current];
  }

  while (current <= target) {
    months.push(current.toLocaleString('en-US', { month: 'short', year: 'numeric' }));
    current.setMonth(current.getMonth() + 1);
  }

  return months.length > 0 ? months : [start.toLocaleString('en-US', { month: 'short', year: 'numeric' })];
}

function generateSeries(lastValue, length) {
  return Array.from({ length }, (_, index) => {
    if (index === length - 1) return lastValue;
    const ratio = (index + 1) / length;
    return Math.max(0, Math.round(lastValue * ratio));
  });
}

// ----- end i18n functions -----

function updateCalculator() {
  const revenue = parseFloat(revenueInput.value) || 0;
  const aov = parseFloat(aovInput.value) || 1;
  const leadPercent = parseInt(leadRate.value, 10) || 0;
  const prospectPercent = parseInt(prospectRate.value, 10) || 0;

  // Formula 01
  const customers = Math.ceil(revenue / aov);

  // Formula 02 (handle 0% safely)
  let leads;
  if (leadPercent === 0) {
    leads = 0;
  } else {
    leads = Math.ceil(customers * 100 / leadPercent);
  }

  // Formula 03 (handle 0% or zero leads safely)
  let prospects;
  if (prospectPercent === 0 || leads === 0) {
    prospects = 0;
  } else {
    prospects = Math.ceil(leads * 100 / prospectPercent);
  }

  leadRateLabel.innerText = leadPercent.toFixed(2) + "%";
  prospectRateLabel.innerText = prospectPercent.toFixed(2) + "%";

  prospectsValue.innerText = prospects;
  leadsValue.innerText = leads;
  customersValue.innerText = customers;

  const leadShare = leadPercent;
  const customerShare = prospects > 0
    ? Math.round((customers / prospects) * 100)
    : 0;

  prospectsProgress.style.width = "100%";
  leadsProgress.style.width = leadShare + "%";
  customersProgress.style.width = customerShare + "%";

  document.querySelector(".stats .card:nth-child(2) small").innerText =
    leadShare + "%";

  document.querySelector(".stats .card:nth-child(3) small").innerText =
    customerShare + "%";

  // Update aria-valuenow for progress bars (accessibility)
  document.querySelector(".stats .card:nth-child(1) .progress").setAttribute("aria-valuenow", "100");
  document.querySelector(".stats .card:nth-child(2) .progress").setAttribute("aria-valuenow", leadShare);
  document.querySelector(".stats .card:nth-child(3) .progress").setAttribute("aria-valuenow", customerShare);

  updateChart(prospects, leads, customers);
}

leadRate.addEventListener("input", updateCalculator);
prospectRate.addEventListener("input", updateCalculator);
revenueInput.addEventListener("input", updateCalculator);
aovInput.addEventListener("input", updateCalculator);
if (campaignStartInput) {
  campaignStartInput.addEventListener("change", updateCalculator);
}
if (campaignEndInput) {
  campaignEndInput.addEventListener("change", updateCalculator);
}
if (currencySelect) {
  const symbol = currencySelect.value === 'eur' ? '€' : '$';
  updateCurrencySymbols(symbol);
  currencySelect.addEventListener('change', e => {
    const selected = e.target.value;
    updateCurrencySymbols(selected === 'eur' ? '€' : '$');
  });
}

const ctx = document.getElementById("leadChart");

let chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Month 1",
      "Month 2",
      "Month 3",
      "Month 4",
      "Month 5",
      "Month 6"
    ],

    datasets: [

      // WHITE TOP
      {
        label: "Customers",
        data: [2, 3, 5, 7, 8, 10],
        backgroundColor: "#ffffff",
        borderRadius: 6,
        borderSkipped: false,
        grouped: false,
        order: 0,
        barThickness: 16
      },

      // LIGHT GRAY MIDDLE
      {
        label: "Leads",
        data: [6, 9, 13, 18, 21, 25],
        backgroundColor: "#a8b0bf",
        borderRadius: 6,
        borderSkipped: false,
        grouped: false,
        order: 1,
        barThickness: 26
      },

      // DARK GRAY BOTTOM
      {
        label: "Prospects",
        data: [25, 45, 63, 85, 105, 125],
        backgroundColor: "#727b8d",
        borderRadius: 6,
        borderSkipped: false,
        grouped: false,
        order: 2,
        barThickness: 36
      }
    ]
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",

    datasets: {
      barPercentage: 1.0,
      categoryPercentage: 1.0
    },

    plugins: {
      legend: {
        labels: {
          color: "#fff"
        }
      },

      tooltip: {
        mode: "index",
        axis: "y",
        intersect: true,
        backgroundColor: "rgba(15, 23, 41, 0.95)",
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(96, 165, 250, 0.3)",
        borderWidth: 1,
        padding: 12,

        titleFont: {
          size: 14,
          weight: "bold"
        },

        bodyFont: {
          size: 13
        },

        callbacks: {
          title: function(context) {
            return context[0].label;
          },

          label: function(context) {
            return context.dataset.label + ": " + context.parsed.x;
          }
        }
      }
    },

    scales: {
      x: {
        ticks: {
          color: "#cfd7e7"
        },

        grid: {
          color: "rgba(255,255,255,0.08)"
        }
      },

      y: {
        ticks: {
          color: "#cfd7e7"
        },

        grid: {
          color: "rgba(255,255,255,0.08)"
        }
      }
    }
  }
});

function updateChart(prospects, leads, customers) {
  const startDate = campaignStartInput ? campaignStartInput.value : '';
  const endDate = campaignEndInput ? campaignEndInput.value : '';
  const labels = getChartLabels(startDate, endDate);
  const length = labels.length;

  chart.data.labels = labels;
  chart.data.datasets[0].data = generateSeries(customers, length);
  chart.data.datasets[1].data = generateSeries(leads, length);
  chart.data.datasets[2].data = generateSeries(prospects, length);

  chart.update();
}

updateCalculator();

// ----- Initialize i18n after chart and calculator are ready -----
const languageSelect = document.getElementById('languageSelect');

if (languageSelect) {
  const saved = localStorage.getItem('lp_lang') || 'en';
  languageSelect.value = saved;
  applyTranslations(saved);
  updateLanguageBox(saved);
  languageSelect.addEventListener('change', e => setLanguage(e.target.value));
}
// ----- end i18n init -----