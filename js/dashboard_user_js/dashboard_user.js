let requestsPerHourChartInstance; // Declare globally
let nav_clicked = ""
const moveIndicator = (element) => {
    const indicator = document.querySelector(".nav-indicator");
    const navSpan = element.getBoundingClientRect();
    const parent = element.parentElement.getBoundingClientRect();

    indicator.style.width = `${navSpan.width}px`;
    indicator.style.left = `${navSpan.left - parent.left}px`;
}

function render3DPieChart() {
  Highcharts.chart('requestCategory3DPie', {
      chart: {
          type: 'pie',
          borderRadius: "10px",
          padding: "10px",
          options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
          },
      },
      title: {
          text: 'Request Category Distribution',
          style: {
              color: '#2e1d18',
              fontSize: '1.2rem',
              textTransform: 'uppercase',
          }
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
          backgroundColor: '#3a2620',
          style: {
              color: '#ffffff'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 40,
              dataLabels: {
                  enabled: true,
                  format: '{point.name}: {point.y}%',
                  style: {
                      color: '#2e1d18',
                      textOutline: 'none'
                  }
              }
          }
      },
      series: [{
          name: 'Requests',
          colorByPoint: true,
          data: [
              { name: 'MET', y: 15, color: '#c75c5c' },
              { name: 'Electrical', y: 15, color: '#d78c38' },
              { name: 'Plumbing', y: 30, color: '#4fa3c7' },
              { name: 'Carpentry', y: 40, color: '#68a17c' }
          ]
      }]
  });
}



// Initial move to the first active tab on load
$(document).ready(function () {
    const activeTab = document.querySelector('.dashboard-request-nav-span-class.active');
    if (activeTab) moveIndicator(activeTab);
    render3DPieChart()

    $('.dashboard-request-nav-span-class').on('click', function () {
      $('.dashboard-request-nav-span-class').removeClass('active');
      $(this).addClass('active');
      moveIndicator(this);

      const index = $(this).index();
      console.log(index);
      
      switch (index) {
          case 0:
              $('.dashboard-content-div').load('../container/dashboard_user_containers/division_request.php', function () {
                  nav_clicked = "division_request";
                  
                  // Call Highcharts inside the callback
                  render3DPieChart(); 
              });
              break;
          case 1:
              $('.dashboard-content-div').load('../container/dashboard_user_containers/section_request.php', function () {
                  nav_clicked = "section_request";

                  // Also call it here if needed
                  render3DPieChart(); 
              });
              break;
      }
    });
  

    $(document).off('click', '#filter-date-search-btn').on('click', '#filter-date-search-btn', function () {
        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val(); // might be undefined in daily view
        const from = nav_clicked;
    
        // Restriction checks
        if (!startDate) {
            alert('Please select a start date.');
            return;
        }
    
        // If it's not a daily request, require endDate
        if (from !== 'daily_request' && !endDate) {
            alert('Please select an end date.');
            return;
        }
    
        // Proceed with AJAX
    });
    

});


