let requestsPerHourChartInstance; // Declare globally
let category_clicked = "ALL", sub_category_clicked = null

const moveIndicator = (element) => {
    const indicator = document.querySelector(".nav-indicator");
    const navSpan = element.getBoundingClientRect();
    const parent = element.parentElement.getBoundingClientRect();

    indicator.style.width = `${navSpan.width}px`;
    indicator.style.left = `${navSpan.left - parent.left}px`;
}

const onLoadFetch_total_request = (startDate, endDate, category, subCategory) => {
    console.log("Start Date: ", startDate);
    console.log("End Date: ", endDate);
    console.log("category: ", category);
    console.log("sub category: ", subCategory);
    
    $.ajax({
        url: '../../php/dashboard_request_php/fetch_dashboard_request.php',
        method: 'POST',
        data: {
            startDate: startDate,
            endDate: endDate,
            category: category,
            subCategory: subCategory,
        },
        dataType: 'json',
        success: function (response) {
            console.log(response);

            let totalRequests = 0;
            let totalCorrection = 0;
            let totalCompleted = 0;
            let totalPending = 0;
            let totalOnProcess = 0;
            let totalUnattended = 0;
            let totalRTR = 0;
            let totalPercentage = 0;
            // Prepare flat array for barGraph
            const hourlyTotals = Array(24).fill(0);

            Object.entries(response).forEach(([hour, statuses]) => {
                Object.entries(statuses).forEach(([status, count]) => {
                    totalRequests += count;

                    // You can customize these status matches as needed
                    if (status === 'Correction') {
                        totalCorrection += count;
                    }
                    if (status === 'Completed' || status === 'Evaluation') {
                        totalCompleted += count;
                    }
                    if (status === 'Pending') {
                        totalPending += count;
                    }
                    if (status === 'On-Process') {
                        totalOnProcess += count;
                    }
                    if (status === 'Unattended') {
                        totalUnattended += count;
                    }
                    if (status === 'RTR') {
                        totalRTR += count;
                    }

                    if (totalRequests > 0) {
                        totalPercentage = (totalCompleted / (totalRequests - totalCorrection)) * 100;
                        totalPercentage = totalPercentage.toFixed(2); // Round to 2 decimal places
                    }

                    // Add to hourly total regardless of status
                    hourlyTotals[hour] += count;
                });
            });

            // Display totals
            $('#total-request-value').text(totalRequests);
            $('#total-request-correction-value').text(totalCorrection);
            $('#total-request-completed-value').text(totalCompleted);
            $('#total-request-pending-value').text(totalPending);
            $('#total-request-onProcess-value').text(totalOnProcess);
            $('#total-request-unattended-value').text(totalUnattended);
            $('#total-request-rtr-value').text(totalRTR);

            $('#total-request-accomplished-value').text(totalPercentage+ "%");
            // $('#total-request-cancel-value').text(totalCancelled);

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

const fetchNotifValue = () =>{
    $.ajax({
        url: '../php/incoming_request_php/fetch_notifValue.php',
        method: "POST",
        dataType : 'json',
        success: function(response) {
            try { 
                // console.log(response)
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
});