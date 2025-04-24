let requestsPerHourChartInstance; // Declare globally
let nav_clicked = ""
const moveIndicator = (element) => {
    const indicator = document.querySelector(".nav-indicator");
    const navSpan = element.getBoundingClientRect();
    const parent = element.parentElement.getBoundingClientRect();

    indicator.style.width = `${navSpan.width}px`;
    indicator.style.left = `${navSpan.left - parent.left}px`;
}

const onLoadFetch_total_request = (startDate, endDate, from) => {
    console.log("Start Date: ", startDate);
    console.log("End Date: ", endDate);
    console.log("From: ", from);
    $.ajax({
        url: '../../php/dashboard_request_php/fetch_dashboard_request.php',
        method: 'POST',
        data: {
            startDate: startDate,
            endDate: endDate,
            from: from
        },
        dataType: 'json',
        success: function (response) {
            console.log(response);

            let totalRequests = 0;
            let totalOT = 0;
            let totalCancelled = 0;

            // Prepare flat array for barGraph
            const hourlyTotals = Array(24).fill(0);

            Object.entries(response).forEach(([hour, statuses]) => {
                Object.entries(statuses).forEach(([status, count]) => {
                    totalRequests += count;

                    // You can customize these status matches as needed
                    if (status === 'For Overtime') {
                        totalOT += count;
                    }
                    if (status === 'Cancelled') {
                        totalCancelled += count;
                    }

                    // Add to hourly total regardless of status
                    hourlyTotals[hour] += count;
                });
            });

            // Display totals
            $('#total-request-value').text(totalRequests);
            $('#total-request-ot-value').text(totalOT);
            $('#total-request-cancel-value').text(totalCancelled);

            // Update graph
            barGraph(hourlyTotals);
        },
        error: function (err) {
            console.error("AJAX error: ", err);
        }
    });
}

const barGraph = (data = []) => {
    const ctx = document.getElementById('requestsPerHourChart').getContext('2d');

    // Destroy previous chart if it exists
    if (requestsPerHourChartInstance) {
        requestsPerHourChartInstance.destroy();
    }

    requestsPerHourChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                '00', '01', '02', '03', '04', '05', '06', '07',
                '08', '09', '10', '11', '12', '13', '14', '15',
                '16', '17', '18', '19', '20', '21', '22', '23'
            ],
            datasets: [{
                label: 'Requests per Hour',
                data: data,
                backgroundColor: '#5a4038',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            scales: {
                y: {
                    ticks: { color: 'black' },
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Requests'
                    }
                },
                x: {
                    ticks: { color: 'black' },
                    title: {
                        display: true,
                        text: 'Hour of Day'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
};


// Initial move to the first active tab on load
$(document).ready(function () {
    const activeTab = document.querySelector('.dashboard-request-nav-span-class.active');
    if (activeTab) moveIndicator(activeTab);
    onLoadFetch_total_request(null, null, "total_request_overall");

    $('.dashboard-request-nav-span-class').on('click', function () {
        $('.dashboard-request-nav-span-class').removeClass('active');
        $(this).addClass('active');
        moveIndicator(this);

        const index = $(this).index();
        console.log(index)
        switch (index){
            case 0:
                $('.dashboard-content-div').load('../../container/dashboard_request_containers/total_request_overall.php', function() {
                    nav_clicked = "total_request_overall"
                    onLoadFetch_total_request(null, null, "total_request_overall");
                });
                break;
            case 1:
                $('.dashboard-content-div').load('../../container/dashboard_request_containers/daily_request.php', function() {
                    nav_clicked = "daily_request"
                    barGraph();
                });
                break;
            case 2:
                $('.dashboard-content-div').load('../../container/dashboard_request_containers/weekly_request.php', function() {
                    nav_clicked = "weekly_request"
                    barGraph();
                });
                break;
            case 3:
                $('.dashboard-content-div').load('../../container/dashboard_request_containers/monthly_request.php', function() {
                    nav_clicked = "monthly_request"
                    barGraph();
                });
                break;
            case 4:
                $('.dashboard-content-div').load('../../container/dashboard_request_containers/by_category.php', function() {
                    nav_clicked = "category_request"
                    barGraph();
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
        onLoadFetch_total_request(startDate, endDate, from);
    });
    

});


