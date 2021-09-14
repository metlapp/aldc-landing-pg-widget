// define constants
const COLOR_DIY = "#2196f3";
const COLOR_ECLIPSE = "#ff6b00";
const DELAY_MS = 500;
const DURATION_MS = 2000;
const GRAPH_RELOAD_MS = 3000;

// define data and other simple variables
var delayed = undefined;

// normal vs mobile font sizes
const REGULAR_LABEL_FONT = {
  weight: 'bold',
  size: 14,
}
const MOBILE_LABEL_FONT = {
  weight: 'bold',
  size: 14,
}

function aldcCreateBarChart(params = {}) {

  let is_mobile = false;

  let param_color_diy = COLOR_DIY;
  if (params.colorDiyBar !== undefined) param_color_diy = params.colorDiyBar;

  let param_color_eclipse = COLOR_ECLIPSE;
  if (params.colorEclipseBar !== undefined) params_color_eclipse = params.colorEclipseBar;

  let delay_ms = DELAY_MS;
  if (params.delay_ms !== undefined) delay_ms = params.delay_ms;

  let param_duration_ms = DURATION_MS;
  if (params.animation_duration_ms !== undefined) param_duration_ms = params.animation_duration_ms;

  let param_graph_reload_ms = GRAPH_RELOAD_MS;
  if (params.graph_reload_ms !== undefined) param_graph_reload_ms = params.graph_reload_ms;

  graph_data = [
    {
      data: [2, 8],
      label: "Time to Implement",
      colors: [param_color_eclipse, param_color_diy, ],
      x_ticks: (val) => {
        return val;
      },
    },
    {
      data: [90000, 133800],
      label: "Maintenance Costs",
      colors: [param_color_eclipse, param_color_diy, ],
      x_ticks: (val) => {
        return '$' + val/1000 + 'K';
      },
    },
    {
      data: [10, 4],
      label: "Innovation Time",
      colors: ["#00b33c", "#e60000", ],
      x_ticks: (val) => {
        return val;
      },
    },
  ]

  // insert html into #aldcBarChart container
  const html_code =
      '<canvas id="myChart"></canvas>';
  document.getElementById('aldcBarChart').insertAdjacentHTML("afterbegin", html_code);

  // if this chart will be drawn small, adjust to mobile layout
  // TODO not working
  // if (document.getElementById('myChart').clientWidth < 400) is_mobile = true;

  // set the labels, using a shortened version for DIY if the graph is too small
  // TODO currently using mobile labels always, change if we can fix mobile detection
  let labels = ["ECLIPSE", "BUILDING A CUSTOM SOLUTION"];
  if (is_mobile || true) labels[1] = "DIY";

  data = {
    labels: labels,
    datasets: [{
      label: "",
      backgroundColor: [param_color_eclipse, param_color_diy, ],
      data: graph_data[0].data,
    }]
  };

  // create chart
  var ctx = document.getElementById("myChart").getContext("2d");
  var combinedBarChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      indexAxis: 'y',  // this makes the graph horizontal
      maintainAspectRatio: false,  // this makes the graph stretch to the size of the parent container
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            callback: graph_data[0].x_ticks,
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            mirror: true,
            z: 100,
            padding: 10,
            color: ['white', 'white'],
            font: is_mobile ? MOBILE_LABEL_FONT : REGULAR_LABEL_FONT,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: graph_data[0].label,
          position: "top",
          font: {
            size: 18,
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * delay_ms;
          }
          return delay;
        },
        // loop: true,
        duration: param_duration_ms,
      },
    },
  });


  // loop through graphs - set new data and reload graph
  let counter = 0;
  setInterval(function(){

    // get new graph data
    counter++;
    graph_sequence = counter % 3;
    const graph_data_arr = graph_data[graph_sequence].data;
    const graph_label = graph_data[graph_sequence].label;
    const graph_x_ticks = graph_data[graph_sequence].x_ticks;
    const graph_colors = graph_data[graph_sequence].colors;



    // set new dataset and options
    delayed = undefined;
    combinedBarChart.data.datasets[0].data = graph_data_arr;
    combinedBarChart.options.plugins.title.text = graph_label;
    combinedBarChart.options.scales.x.ticks.callback = graph_x_ticks;
    combinedBarChart.data.datasets[0].backgroundColor = graph_colors;

    // reload graph
    combinedBarChart.reset();
    combinedBarChart.update();


  }, param_graph_reload_ms);


}
