const leadRate = document.getElementById("leadRate");
const prospectRate = document.getElementById("prospectRate");

const leadRateLabel = document.getElementById("leadRateLabel");
const prospectRateLabel = document.getElementById("prospectRateLabel");

const prospectsValue = document.getElementById("prospectsValue");
const leadsValue = document.getElementById("leadsValue");
const customersValue = document.getElementById("customersValue");

const prospectsProgress = document.querySelector(".stats .card:nth-child(1) .progress span");
const leadsProgress = document.querySelector(".stats .card:nth-child(2) .progress span");
const customersProgress = document.querySelector(".stats .card:nth-child(3) .progress span");

function updateCalculator() {
  const prospects = 125;

  const leadPercent = parseInt(leadRate.value, 10);
  const prospectPercent = parseInt(prospectRate.value, 10);

  const leads = Math.round((prospects * prospectPercent) / 100);
  const customers = Math.round((leads * leadPercent) / 100);

  leadRateLabel.innerText = leadPercent + "%";
  prospectRateLabel.innerText = prospectPercent + "%";

  leadsValue.innerText = leads;
  customersValue.innerText = customers;

  const leadShare = prospectPercent;
  const customerShare = prospects > 0 ? Math.round((customers / prospects) * 100) : 0;

  prospectsProgress.style.width = "100%";
  leadsProgress.style.width = leadShare + "%";
  customersProgress.style.width = customerShare + "%";

  document.querySelector(".stats .card:nth-child(2) small").innerText = leadShare + "%";
  document.querySelector(".stats .card:nth-child(3) small").innerText = customerShare + "%";

  updateChart(prospects, leads, customers);
}

leadRate.addEventListener("input", updateCalculator);
prospectRate.addEventListener("input", updateCalculator);

const ctx = document.getElementById("leadChart");

let chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["1", "2", "3", "4", "5", "6"],
    datasets: [
      {
        label: "Prospects",
        data: [25, 45, 63, 85, 105, 125],
        backgroundColor: "#727b8d",
        borderRadius: 6,
      },
      {
        label: "Leads",
        data: [6, 9, 13, 18, 21, 25],
        backgroundColor: "#a8b0bf",
        borderRadius: 6,
      },
      {
        label: "Customers",
        data: [2, 3, 5, 7, 8, 10],
        backgroundColor: "#d6dbe5",
        borderRadius: 6,
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        labels: {
          color: "#fff"
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
  chart.data.datasets[1].data = [6, 9, 13, 18, 21, leads];
  chart.data.datasets[2].data = [2, 3, 5, 7, 8, customers];
  chart.update();
}

updateCalculator();