let requestsPerHourChartInstance; // Declare globally
let category_clicked = "ALL", sub_category_clicked = null
let requestsByDivisionChart;

let avgCompletionTimeChart;
let statusChart;
let trendChart;
let categoryChart;
let agingChart;

const moveIndicator = (element) => {
    const indicator = document.querySelector(".nav-indicator");
    const navSpan = element.getBoundingClientRect();
    const parent = element.parentElement.getBoundingClientRect();

    indicator.style.width = `${navSpan.width}px`;
    indicator.style.left = `${navSpan.left - parent.left}px`;
}

const fetchNotifValue = () =>{
    $.ajax({
        url: '../php/incoming_request_php/fetch_notifValue.php',
        method: "POST",
        dataType : 'json',
        success: function(response) {
            try { 
                console.log(response)
                const pending_value = parseInt(response.count_pending)
                const myJob_value = parseInt(response.count_evaluation) + parseInt(response.count_onProcess)
                const onProcess_value = parseInt(response.count_onProcess)
                const evaluation_value = parseInt(response.count_evaluation)
                
                console.log(356, pending_value)

                if(pending_value > 0){
                    $('#jobOrder-notif-span').text(pending_value)
                    $('#jobOrder-notif-span').css('display' , 'block')

                    $('#notif-value').text(pending_value);
                    $('#notif-value').css('display', 'flex');

                }else{
                    $('#jobOrder-notif-span').css('display' , 'none')
                    
                    $('#notif-value').text(pending_value);
                    $('#notif-value').css('display', 'none');
                }
                
                if(myJob_value > 0){
                    $('#your-job-notif-span').text(myJob_value)
                    $('#your-job-notif-span').css('display' , 'block')

                }else{
                    $('#your-job-notif-span').css('display' , 'none')
                }

                if(onProcess_value > 0){
                    $('#on-process-notif-span').text(onProcess_value)
                    $('#on-process-notif-span').css('display' , 'block')
                }else{
                    $('#on-process-notif-span').css('display' , 'none')
                }

                
                if(evaluation_value > 0){
                    $('#for-evaluation-notif-span').text(evaluation_value)
                    $('#for-evaluation-notif-span').css('display' , 'block')
                }else{
                    $('#for-evaluation-notif-span').css('display' , 'none')
                }

            } catch (innerError) {
                console.error("Error processing response:", innerError);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX request failed:", error);
        }
    });
}

socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    console.log("Received from WebSocket:", data); // Debugging

    // Call fetchNotifValue() on every process update
    switch (data.action) {
        case "refreshIncomingTable":
            fetchNotifValue()
            break;
        default:
            console.log("Unknown action:", data.action);
    }
};



// 🌿 Define ApexCharts bar + pie charts before AJAX runs
const barChartOptions = {
    chart: {
        type: 'bar',
        height: '90%',
        toolbar: { show: false },
        foreColor: '#291915', // earthy text tone
    },
    series: [{ name: 'Requests per Hour', data: Array(24).fill(0) }],
    xaxis: {
        categories: [...Array(24).keys()].map(h => `${h}:00`),
        labels: { style: { fontSize: '11px', colors: '#291915' } },
        axisBorder: { color: 'rgba(89, 63, 55, 0.3)' },
        axisTicks: { color: 'rgba(89, 63, 55, 0.3)' }
    },
    yaxis: {
        labels: { style: { colors: '#291915' } }
    },
    grid: {
        borderColor: 'rgba(66, 42, 34, 0.1)' // subtle warm gridlines
    },
    colors: ['#593f37'], // primary bar color (warm brown)
    plotOptions: {
        bar: {
            borderRadius: 5,
            columnWidth: '60%',
            distributed: false
        }
    },
    tooltip: {
        theme: 'dark',
        style: { fontSize: '12px', color: '#fff' },
        background: '#422a22'
    }
};
const barChart = new ApexCharts(document.querySelector("#barGraph"), barChartOptions);
barChart.render();

// 🌿 Pie chart for request status distribution
const pieChartOptions = {
    chart: { type: 'pie', height: '90%' },
    labels: ['Completed', 'Pending', 'On-Process', 'Unattended', 'RTR', 'Correction'],
    series: [0, 0, 0, 0, 0, 0],
    colors: [
        '#402e28', // deep brown
        '#593f37', // medium warm
        '#422a22', // dark cocoa
        '#291915', // rich coffee
        '#211512', // deep espresso
        '#75574a'  // subtle clay accent
    ],
    legend: {
        show: false // 🚫 remove legend
    },
    dataLabels: {
        style: { fontSize: '12px', colors: ['#fff'] }
    },
    tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
    }
};
const pieChart = new ApexCharts(document.querySelector("#pieChart"), pieChartOptions);
pieChart.render();



// 🎨 Base inspired color palette
const chartColors = {
    primary: '#a5725a',      // warm medium brown
    secondary: '#8c5b48',    // slightly darker tone
    highlight: '#c49a85',    // soft beige accent
    neutral: '#d6c2b9',      // gridline / subtle elements
    darkText: '#3a231b',     // deep brown for labels/titles
    lightFill: 'rgba(165, 114, 90, 0.2)' // for line/radar fill
};

// ✨ Requests Over Time (Line)
const requestsOverTimeChart = new Chart(document.getElementById('requestsOverTimeChart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Requests',
            data: [],
            backgroundColor: chartColors.lightFill,
            borderColor: chartColors.primary,
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { 
                beginAtZero: true,
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            },
            x: { 
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            }
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Requests Trend Over Time',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 🟠 Request Status Breakdown (Pie)
const requestStatusBreakdownChart = new Chart(document.getElementById('requestStatusBreakdownChart'), {
    type: 'pie',
    data: { 
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                chartColors.primary, 
                chartColors.secondary, 
                chartColors.highlight
            ],
            borderColor: chartColors.darkText,
            borderWidth: 1
        }]
    },
    options: { 
        responsive: true,
        plugins: { 
            legend: { display: false },
            title: {
                display: true,
                text: 'Request Status Breakdown',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 🟢 Requests by Category (Bar)
const requestsByCategoryChart = new Chart(document.getElementById('requestsByCategoryChart'), {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                chartColors.primary,
                chartColors.secondary,
                chartColors.highlight
            ],
            borderColor: chartColors.darkText,
            borderWidth: 1
        }]
    },
    options: { 
        responsive: true,
        scales: {
            x: { 
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            },
            y: { 
                beginAtZero: true,
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            }
        },
        plugins: { 
            legend: { display: false },
            title: {
                display: true,
                text: 'Requests by Category',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 🟡 Average Completion Time (Bar)
avgCompletionTimeChart = new Chart(document.getElementById('avgCompletionTimeChart'), {
    type: 'bar',
    data: { 
        labels: [], 
        datasets: [{
            data: [],
            backgroundColor: chartColors.highlight,
            borderColor: chartColors.darkText,
            borderWidth: 1
        }] 
    },
    options: { 
        responsive: true,
        scales: {
            x: { 
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            },
            y: { 
                beginAtZero: true,
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            }
        },
        plugins: { 
            legend: { display: false },
            title: {
                display: true,
                text: 'Average Completion Time',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 🧭 Evaluation Ratings (Radar)
const evaluationRadarChart = new Chart(document.getElementById('evaluationRadarChart'), {
    type: 'radar',
    data: { 
        labels: [], 
        datasets: [{
            data: [],
            backgroundColor: chartColors.lightFill,
            borderColor: chartColors.primary,
            borderWidth: 2,
            pointBackgroundColor: chartColors.secondary
        }] 
    },
    options: { 
        responsive: true,
        scales: {
            r: {
                grid: { color: chartColors.neutral },
                pointLabels: { color: chartColors.darkText },
                angleLines: { color: chartColors.neutral },
                ticks: { display: false }
            }
        },
        plugins: { 
            legend: { display: false },
            title: {
                display: true,
                text: 'Evaluation Results',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 🔝 Top Requests (Bar)
const topRequestsChart = new Chart(document.getElementById('topRequestsChart'), {
    type: 'bar',
    data: { 
        labels: [], 
        datasets: [{
            data: [],
            backgroundColor: chartColors.secondary,
            borderColor: chartColors.darkText,
            borderWidth: 1
        }] 
    },
    options: { 
        responsive: true,
        scales: {
            x: { 
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            },
            y: { 
                beginAtZero: true,
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            }
        },
        plugins: { 
            legend: { display: false },
            title: {
                display: true,
                text: 'Top Requests',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});



// Generates random pastel colors for charts
function randomColor() {
    const r = Math.floor(150 + Math.random() * 105);
    const g = Math.floor(150 + Math.random() * 105);
    const b = Math.floor(150 + Math.random() * 105);
    return `rgb(${r}, ${g}, ${b})`;
}

// Generates a palette of distinct colors for bars
function generateDistinctColors(count) {
    // 🌿 Base earthy tones from your palette
    const baseColors = ['#422a22', '#291915', '#593f37', '#402e28', '#211512'];

    const colors = [];
    for (let i = 0; i < count; i++) {
        const base = baseColors[i % baseColors.length];

        // Create slight light/dark variation to distinguish similar bars
        const shade = 0.8 + (i % 3) * 0.1; // cycles through 0.8–1.0
        const color = shadeColor(base, shade);
        colors.push(color);
    }
    return colors;
}

// 🧮 Helper: adjusts brightness of hex color
function shadeColor(hex, shade) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, Math.floor(r * shade));
    g = Math.min(255, Math.floor(g * shade));
    b = Math.min(255, Math.floor(b * shade));

    return `rgb(${r}, ${g}, ${b})`;
}



// 🔹 Unified dashboard data fetcher
const onLoadFetch_total_request = (startDate, endDate, category, subCategory) => {
    $.ajax({
        url: '../../php/dashboard_request_php/fetch_dashboard_request.php',
        method: 'POST',
        data: { startDate, endDate, category, subCategory },
        dataType: 'json',
        success: function (data) {
            console.log("Dashboard data:", data);

            // ✅ 1. SUMMARY (Top cards + ApexCharts)
            if (data.summary) {
                const totals = data.summary.totals;
                const hourlyTotals = data.summary.hourlyTotals;
                const totalPercentage = data.summary.totalPercentage;

                $('#total-request-value').text(totals.totalRequests);
                $('#total-request-correction-value').text(totals.correction);
                $('#total-request-completed-value').text(totals.completed);
                $('#total-request-pending-value').text(totals.pending);
                $('#total-request-onProcess-value').text(totals.onProcess);
                $('#total-request-unattended-value').text(totals.unattended);
                $('#total-request-rtr-value').text(totals.rtr);
                $('#total-request-accomplished-value').text(totalPercentage + "%");

                if (typeof barChart !== 'undefined') {
                    barChart.updateSeries([{ data: hourlyTotals }]);
                }

                if (typeof pieChart !== 'undefined') {
                    pieChart.updateSeries([
                        totals.completed,
                        totals.pending,
                        totals.onProcess,
                        totals.unattended,
                        totals.rtr,
                        totals.correction
                    ]);
                }
            }

            // ✅ 2. DETAILED CHARTS (Chart.js)
            if (data.trend) {
                requestsOverTimeChart.data.labels = data.trend.map(d => d.date);
                requestsOverTimeChart.data.datasets[0].data = data.trend.map(d => parseInt(d.total));
                requestsOverTimeChart.update();
            }

            if (data.status) {
                requestStatusBreakdownChart.data.labels = data.status.map(s => s.requestStatus);
                requestStatusBreakdownChart.data.datasets[0].data = data.status.map(s => parseInt(s.total));
                requestStatusBreakdownChart.update();
            }

            const unitColors = {
                IU: '#4e73df',
                EU: '#1cc88a',
                MU: '#f6c23e'
            };

            // 🔹 Requests by Category (IU, EU, MU)
            if (Array.isArray(data.category) && data.category.length > 0) {
                const unitColors = { IU: '#8c5b48', EU: '#c49a85', MU: '#d6c2b9' };
                console.log(data.category)
                requestsByCategoryChart.data.labels = data.category.map(c => c.requestCategory);
                requestsByCategoryChart.data.datasets[0].data = data.category.map(c => parseInt(c.total));
                requestsByCategoryChart.data.datasets[0].backgroundColor = data.category.map(c => unitColors[c.requestCategory] || randomColor());
                requestsByCategoryChart.update();
            } else {
                $('#requestsByCategoryChart').parent().find('.text-muted').remove();
                $('#requestsByCategoryChart').parent().append('<p class="text-muted mt-2">No data available.</p>');
                requestsByCategoryChart.data.labels = [];
                requestsByCategoryChart.data.datasets[0].data = [];
                requestsByCategoryChart.update();
            }


            // 🔹 Average Completion Time per Unit
            if (Array.isArray(data.completionTime) && data.completionTime.length > 0) {
                const colors = generateDistinctColors(data.completionTime.length);
                if (typeof avgCompletionTimeChart !== 'undefined' && avgCompletionTimeChart) {
                    avgCompletionTimeChart.data.labels = data.completionTime.map(c => c.requestCategory || 'Unknown');
                    avgCompletionTimeChart.data.datasets[0].data = data.completionTime.map(c => parseFloat(c.avg_hours));
                    avgCompletionTimeChart.data.datasets[0].backgroundColor = colors
                    avgCompletionTimeChart.update();
                }
            } else {
                avgCompletionTimeChart.data.labels = [];
                avgCompletionTimeChart.data.datasets[0].data = [];
                avgCompletionTimeChart.update();
            }

            if (data.ratings) {
                evaluationRadarChart.data.labels = Object.keys(data.ratings).filter(k => k);
                evaluationRadarChart.data.datasets[0].data = Object.values(data.ratings);
                evaluationRadarChart.update();
            }


            // 🔹 Top 5 Most Common Requests
            if (Array.isArray(data.topRequests) && data.topRequests.length > 0) {
                const colors = generateDistinctColors(data.topRequests.length);
                topRequestsChart.data.labels = data.topRequests.map(t => t.requestDescription || 'Unknown');
                topRequestsChart.data.datasets[0].data = data.topRequests.map(t => parseInt(t.total));
                topRequestsChart.data.datasets[0].backgroundColor = colors;
                topRequestsChart.update();
            } else {
                topRequestsChart.data.labels = [];
                topRequestsChart.data.datasets[0].data = [];
                topRequestsChart.update();
            }

            if (data.recent) {
                const tableBody = $('#recentRequestsTable tbody');
                tableBody.empty();
                data.recent.forEach(r => {
                    tableBody.append(`
                        <tr>
                            <td>${r.requestNo}</td>
                            <td>${r.requestCategory}</td>
                            <td>${r.requestSubCategory}</td>
                            <td>${r.requestStatus}</td>
                            <td>${r.requestDate}</td>
                        </tr>
                    `);
                });
            }

            // ✅ Requests by Division / Department
            if (data.divisions && data.divisions.length > 0) {
                const colors = generateDistinctColors(data.divisions.length); // 🌿 use earthy tones

                if (!requestsByDivisionChart) {
                    requestsByDivisionChart = new Chart(document.getElementById('requestsByDivisionChart'), {
                        type: 'bar',
                        data: {
                            labels: data.divisions.map(d => d.division_name),
                            datasets: [{
                                label: 'Requests',
                                data: data.divisions.map(d => parseInt(d.total)),
                                backgroundColor: colors
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: { display: false }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: { color: 'rgba(66, 42, 34, 0.1)' }, // subtle warm gridline
                                    ticks: { color: '#291915' } // earthy text tone
                                },
                                x: {
                                    grid: { display: false },
                                    ticks: { color: '#291915' }
                                }
                            }
                        }
                    });
                } else {
                    // ✅ Requests by Division Chart (safe update)
                    if (typeof requestsByDivisionChart !== 'undefined' && requestsByDivisionChart) {
                        requestsByDivisionChart.data.labels = data.divisions.map(d => d.division_name);
                        requestsByDivisionChart.data.datasets[0].data = data.divisions.map(d => parseInt(d.total));
                        requestsByDivisionChart.data.datasets[0].backgroundColor = colors
                        requestsByDivisionChart.update();
                    }
                }
            }


            // ✅ Evaluation Comments
            if (data.comments && data.comments.length > 0) {
                const commentsContainer = $('#evaluationCommentsContainer');
                commentsContainer.empty();
                data.comments.forEach(c => {
                    commentsContainer.append(`
                        <div class="comment-card">
                            <p><strong>${c.unit}</strong>: ${c.comment}</p>
                        </div>
                    `);
                });
            } else {
                $('#evaluationCommentsContainer').html('<p class="text-muted">No evaluation comments available.</p>');
            }

        },
        error: function (xhr, status, err) {
            console.error("AJAX Error:", err);
        }
    });
};

// Initial move to the first active tab on load
$(document).ready(function () {
    fetchNotifValue();
    onLoadFetch_total_request(null, null, "ALL", null);

    const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD

    document.getElementById("start-date-input").value = today;
    document.getElementById("end-date-input").value = today;

    $(document).off('click', '#filter-date-search-btn').on('click', '#filter-date-search-btn', function () {
        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        const category = category_clicked
        const sub_category = sub_category_clicked

        // Restriction checks
        if (!startDate) {
            alert('Please select a start date.');
            return;
        }
    
        // Proceed with AJAX
        onLoadFetch_total_request(startDate, endDate, category, sub_category);
    });
    
    $('.filter-category-div button').on('click', function() {
        // Remove the active class from all buttons
        $('.filter-category-div button').removeClass('filter-category-active');

        // Add the active class to the clicked button
        $(this).addClass('filter-category-active');

        const category = $(this).data('category');

        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        category_clicked = category
        const sub_category = sub_category_clicked

        // populate the sub category


        onLoadFetch_total_request(startDate, endDate, category, sub_category);

        $.ajax({
            url: '../../php/dashboard_request_php/fetch_subCategoryFilter.php',
            method: 'POST',
            data: {category},
            dataType: 'json',
            success: function (response) {
                console.log(response);

                // First, clear all options
                $('#filter-subCategory-select').css('pointer-events' , 'auto')
                $('#filter-subCategory-select').css('opacity' , '1')

                const select = document.getElementById("filter-subCategory-select");
                select.innerHTML = ''; // remove all options

                // Add default option
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "-- Select Sub Category --";
                select.appendChild(defaultOption);

                // Populate with new options from PHP response
                response.forEach(function(item) {
                    const option = document.createElement("option");
                    option.value = "IU"; // You can change this depending on your logic
                    option.textContent = item.sub_category_description;
                    select.appendChild(option);
                });
            },
            error: function (err) {
                console.error("AJAX error: ", err);
            }
        });
    });

    $(document).on('change', '#filter-subCategory-select', function () {
        const selectedValue = $(this).val();
        const selectedText = $(this).find("option:selected").text();
    
        // Do something with the selected value/text
        console.log("Selected Sub Category Value:", selectedValue);
        console.log("Selected Sub Category Text:", selectedText);
    
        sub_category_clicked = selectedText
        console.log(sub_category_clicked)

        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        const category = category_clicked
        const sub_category = sub_category_clicked

        onLoadFetch_total_request(startDate, endDate, category, sub_category);
    });

    const infoButtons = document.querySelectorAll('.info-btn');
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    document.body.appendChild(tooltip);

    infoButtons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            tooltip.textContent = btn.dataset.info;
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });
        btn.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });
        btn.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });
});