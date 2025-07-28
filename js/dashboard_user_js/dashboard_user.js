let requestsPerHourChartInstance; // Declare globally

function render3DPieChart(data) {
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
          text: 'Request Unit Distribution',
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
          data: data
      }]
  });
}

function render3DPieChartSub(data) {
  Highcharts.chart('requestCategory3DPie-Sub', {
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
          data: data
      }]
  });
}

const onLoadFetch_total_request = (startDate, endDate, division, section) => {
    console.log("Start Date: ", startDate);
    console.log("End Date: ", endDate);
    console.log("division: ", division);
    console.log("section: ", section);
    
    $.ajax({
        url: '../../php/dashboard_user_php/fetch_user_request.php',
        method: 'POST',
        data: {
        startDate, endDate, division, section
        },
        dataType: 'json',
        success: function (response) {
            console.log("AJAX Response: ", response);

            $('#total-request-value').text(response.totalRequestsForSection ?? 0);

            if (response.topSectionInDivision && response.topSectionInDivision.section) {
                $('#top-request-value').text(
                    `${response.topSectionInDivision.section}`
                );
            } else {
                $('#top-request-value').text('No top section data');
            }

            if (Array.isArray(response.categoryPie)) render3DPieChart(response.categoryPie);
            if (Array.isArray(response.subCategoryPie)) render3DPieChartSub(response.subCategoryPie);
        },
        error: function (err) {
            console.error('AJAX error:', err);
        }
    });
}

onLoadFetch_total_request(null, null, null, null); // Initial call with null values to fetch all data

// Initial move to the first active tab on load
$(document).ready(function () {
    render3DPieChart(data = [])
    render3DPieChartSub(data = [])

    let divisionSelect = document.getElementById("division-select");
    let sectionSelect = document.getElementById("section-select");

    // Clear the section dropdown initially
    sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>';

    // Listen for changes in the division select dropdown
    divisionSelect.addEventListener("change", function () {
        console.log(88)
        let selectedDivisionID = parseInt(this.value); // Get the selected PGSDivisionID
        sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>'; // Reset section dropdown

        // Filter sections where the 'division' field (PGSDivisionID) matches
        let filteredSections = section_data.filter(section => parseInt(section.division) === selectedDivisionID);

        // Populate the section dropdown with matching sections
        filteredSections.forEach(section => {
            console.log(section)
            let option = document.createElement("option");
            option.value = section.sectionID;
            option.textContent = section.sectionName;
            sectionSelect.appendChild(option);
        });
    });

    $(document).off('click', '#filter-date-search-btn').on('click', '#filter-date-search-btn', function () {
        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val(); 
        const division = $('#division-select').val();
        const section = $('#section-select').val();
        console.log(startDate, endDate, division, section)

        $.ajax({
            url: '../../php/dashboard_user_php/fetch_user_request.php',
            method: 'POST',
            data: {
            startDate, endDate, division, section
            },
            dataType: 'json',
            success: function (response) {
                console.log(response)
                
                $('#total-request-value').text(response.totalRequestsForSection);
                $('#top-request-value').text(response.topSectionInDivision.section + " - " + response.topSectionInDivision.total);
                render3DPieChart(response.categoryPie)
                render3DPieChartSub(response.subCategoryPie)
            },
            error: function (err) {
                console.error('AJAX error:', err);
            }
        });

        // // Restriction checks
        // if (!startDate) {
        //     alert('Please select a start date.');
        //     return;
        // }
    
        // // If it's not a daily request, require endDate
        // if (from !== 'daily_request' && !endDate) {
        //     alert('Please select an end date.');
        //     return;
        // }
    
        // Proceed with AJAX
    });
    

});


