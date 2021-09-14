// define constants
const COLOR_DIY_BAR = "#2196f3";
const COLOR_ECLIPSE_BAR = "#ff6b00";
const DELAY_MS = 100;

// define data and other simple variables
var delayed = undefined;
let dataset_diy = {
  label: "DIY",
  backgroundColor: COLOR_DIY_BAR,
  data: [14308, 9486, 9486, 14034, 14034, 24814, 10780, 31244 ]
};
let dataset_eclipse = {
  label: "Eclipse",
  backgroundColor: COLOR_ECLIPSE_BAR,
  data: [7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500],
}
let data = {
  labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", "Month 7", "Month 8"],
  datasets: [dataset_diy, dataset_eclipse]
};

function aldcCreateBarChart(params = {
  colorDiyBar: COLOR_DIY_BAR,
  colorEclipseBar: COLOR_ECLIPSE_BAR,
  delay_ms: DELAY_MS,
}) {

  let delay_ms = DELAY_MS;
  if (params.colorDiyBar !== undefined) dataset_diy.backgroundColor = params.colorDiyBar;
  if (params.colorEclipseBar !== undefined) dataset_eclipse.backgroundColor = params.colorEclipseBar;
  if (params.delay_ms !== undefined) delay_ms = params.delay_ms;

  // insert html into #aldcBarChart container
  const html_code =
      '<canvas id="myChart"></canvas>';
  document.getElementById('aldcBarChart').insertAdjacentHTML("afterbegin", html_code);


  // create chart
  var ctx = document.getElementById("myChart").getContext("2d");
  var combinedBarChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      maintainAspectRatio: false,  // this makes the graph stretch to the size of the parent container
      barValueSpacing: 20,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          max: 35000,
          ticks: {
            callback: function(val, index) {
              return (val).toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
              });
            },
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].dataset.label + " Cost in " + tooltipItems[0].label;
            },
            label: function (tooltipItem) {
              return '$' + tooltipItem.formattedValue;
            },
          },
        },
      },
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * delay_ms + context.datasetIndex * 200;
          }
          return delay;
        },
        loop: true,
      },
    },
  });
}
