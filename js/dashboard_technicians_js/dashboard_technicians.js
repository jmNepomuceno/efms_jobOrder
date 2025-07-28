let requestsPerHourChartInstance; // Declare globally
let category_clicked = "ALL", sub_category_clicked = null, techBioID_clicked = null;
let fetch_viewRequestData;
let techEvalTable;

let modal_view_form = new bootstrap.Modal(document.getElementById('modal-view-form'));

const onLoadFetch_total_request = (startDate, endDate, category, subCategory, techBioID) => {
    console.log("Start Date: ", startDate);
    console.log("End Date: ", endDate);
    console.log("category: ", category);
    console.log("sub category: ", subCategory);
    console.log("techBioID: ", techBioID);
    // startDate = "2025-05-01"
    // endDate = "2025-07-10"
    $.ajax({
        url: '../../php/dashboard_technician_php/fetch_dashboard_technician.php',
        method: 'POST',
        data: {
            startDate: startDate,
            endDate: endDate,
            category: category,
            subCategory: subCategory,
            techBioID: techBioID
        },
        dataType: 'json',
        success: function (response) {
            console.log(response)
            
            barGraph(response)
            kpiCard(startDate, endDate, category, subCategory, techBioID);
            techDataTable(startDate, endDate, category, subCategory, techBioID)
            fetchTechEval(startDate, endDate, category, subCategory, techBioID)
        },
        error: function (err) {
            console.error('AJAX error:', err);
        }
    });
}


const kpiCard = (startDate, endDate, category, subCategory, techBioID) => {
    $.ajax({
        url: '../../php/dashboard_technician_php/fetch_dashboard_tech_kpi.php',
        method: 'POST',
        data: {
            startDate: startDate,
            endDate: endDate,
            category: category,
            subCategory: subCategory,
            techBioID: techBioID
        },
        dataType: 'json',
        success: function (response) {
            console.log(response);

            let totalRequests = 0;
            let totalCompleted = 0;
            let totalAverage = response.averageEvaluationMinutes ? response.averageEvaluationMinutes : 0; // Ensure it's a number
            let totalCorrection = 0;
            let totalUnattended = 0;
            let totalRTR = 0;
            let totalPercentage = 0;
            let totalOnProcess = 0;
            let totalPending = 0;
            // Prepare flat array for barGraph

            Object.entries(response.counts).forEach(([hour, statuses]) => {
                Object.entries(statuses).forEach(([status, count]) => {
                    totalRequests += count;

                    if (status === 'Completed' || status === 'Evaluation') {
                        totalCompleted += count;
                    }
                    if (status === 'Unattended') {
                        totalUnattended += count;
                    }
                    if (status === 'Correction') {
                        totalCorrection += count;
                    }
                    if (status === 'RTR') {
                        totalRTR += count;
                    }
                    if (status === 'Pending') {
                        totalPending += count;
                    }
                    if (status === 'On-Process') {
                        totalOnProcess += count;
                    }
                });
            });

            // Calculate percentage *after* the loop
            if (totalRequests > 0) {
                totalPercentage = ((totalCompleted / (totalRequests - totalCorrection)) * 100).toFixed(2);
            }



            // Display totals
            $('#total-assigned-value').text(totalRequests);
            $('#total-request-completed-value').text(totalCompleted);

            // Set the text
            $('#total-request-average-value').text(totalAverage);

            // Split into parts
            let parts = totalAverage.split(":");
            let hours = parseInt(parts[0]);
            let minutes = parseInt(parts[1]);
            let seconds = parseInt(parts[2]);

            // Convert to total seconds
            let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

            // Compare and apply color style
            if (totalSeconds >= 7200) { // 2 hours = 7200 seconds
                $('#total-request-average-value').css('color', 'red');
            } else {
                $('#total-request-average-value').css('color', 'green'); // Or default
            }
            
            $('#total-request-correction-value').text(totalCorrection);
            $('#total-request-onProcess-value').text(totalOnProcess);
            $('#total-request-pending-value').text(totalPending);
            // $('#total-request-unattended-value').text(totalUnattended);
            // $('#total-request-rtr-value').text(totalRTR);

            $('#total-request-accomplished-value').text(totalPercentage+ "%");

            // Update graph
            // barGraph(hourlyTotals);
        },
        error: function (err) {
            console.error("AJAX error: ", err);
        }
    });
}

const barGraph = (response = []) => {
    // Prepare chart data
    const labels = response.map(item => item.req_date);
    const onTimeData = response.map(item => parseInt(item.on_time));
    const exceededData = response.map(item => parseInt(item.exceeded));
    
    // Create chart
    const ctx = document.getElementById('requestsPerHourChart').getContext('2d');
    
    if (window.completedRequestsChartInstance) {
        window.completedRequestsChartInstance.destroy();
    }
    
    window.completedRequestsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'On Time (≤ 2 hrs)',
                    data: onTimeData,
                    backgroundColor: '#593f37',
                    borderRadius: 4,
                    barThickness: 25,         // Set fixed bar thickness
                    maxBarThickness: 35       // Limit max thickness
                },
                {
                    label: 'Exceeded (> 2 hrs)',
                    data: exceededData,
                    backgroundColor: 'red',
                    borderRadius: 4,
                    barThickness: 25,
                    maxBarThickness: 35
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Date Completed',
                        color: 'black'
                    },
                    ticks: {
                        color: 'black',
                        maxRotation: 90,
                        minRotation: 45
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Completed Requests',
                        color: 'black'
                    },
                    ticks: {
                        color: 'black'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: 'Completed Job Orders per Date (On Time vs Exceeded)'
                }
            }
        }
    });
};

const techDataTable = (startDate, endDate, category, subCategory, techBioID) =>{
    console.log(techBioID)
    $.ajax({
        url: '../php/dashboard_technician_php/fetch_techDataTable.php',
        method: "POST",
        data : {startDate, endDate, category, subCategory, techBioID},
        dataType: "json",
        success: function (response) {
            console.log(response);

            fetch_viewRequestData = response
            try {
                let dataSet = [];
                for (let i = 0; i < response.length; i++) {
                    dataSet.push([
                        `<span class="requestNo-span">${response[i].requestNo}</span>`,
                        `<span>${response[i].requestBy.name}</span>`,
                        `<span>${response[i].requestDate}</span>`,
                        `<span>${response[i].requestCategory}</span>`,
                        `<span>${response[i].requestSubCategory}</span>`,
                        `<span>${response[i].requestStatus}</span>`,
                        `<div class="action-pending-div">
                            <button type="button" class="btn btn-primary view-request-btn">View</button>
                        </div>`
                    ]);
                }
                
                if ($.fn.DataTable.isDataTable('#tech-request-dataTable')) {
                    $('#tech-request-dataTable').DataTable().destroy();
                    $('#tech-request-dataTable tbody').empty(); // Clear previous table body
                }

                $('#tech-request-dataTable').DataTable({
                    destroy: true,
                    data: dataSet,
                    columns: [
                        { title: "REQUEST NO." },
                        { title: "NAME OF REQUESTER" },
                        { title: "DATE REQUESTED" },
                        { title: "UNIT" },
                        { title: "CATEGORY" },
                        { title: "Status" },
                        { title: "ACTION" },
                        
                    ],
                    columnDefs: [
                        { targets: 0, createdCell: function(td) { $(td).addClass('request-id-td'); } },
                        { targets: 1, createdCell: function(td) { $(td).addClass('request-name-td'); } },
                        { targets: 2, createdCell: function(td) { $(td).addClass('request-date-td'); } },
                        { targets: 3, createdCell: function(td) { $(td).addClass('request-unit-td'); } },
                        { targets: 4, createdCell: function(td) { $(td).addClass('request-category-td'); } },
                        { targets: 5, createdCell: function(td) { $(td).addClass('request-status-td'); } },
                        { targets: 6, createdCell: function(td) { $(td).addClass('request-action-td'); } },
                        
                    ],
                    // "paging": false,
                    // "info": false,
                    "ordering": false,
                    // "stripeClasses": [],
                    // "search": false,
                    // autoWidth: false,
                });
            } catch (innerError) {
                console.error("Error processing response:", innerError);
            }

        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed:", error);
        }
    });
}

const fetchTechEval = (startDate, endDate, category, subCategory, techBioID) => {
    $.ajax({
        url: '../php/dashboard_technician_php/fetch_tech_eval.php',
        method: "POST",
        data: { startDate, endDate, category, subCategory, techBioID },
        dataType: "json",
        success: function (response) {
            console.log(response);

            let dataSet = [];
            for (let i = 0; i < response.length; i++) {
                let evalData = response[i].requestEvaluation;

                dataSet.push([
                    `<span class="requestNo-span">${response[i].requestNo}</span>`,
                    `<span>${response[i].requestDate}</span>`,
                    `<span>${response[i].requestCategory}</span>`,
                    `<span>${response[i].requestSubCategory}</span>`,
                    `<span>${response[i].processedBy}</span>`,
                    `<span>${evalData.q1}</span>`,
                    `<span>${evalData.q2}</span>`,
                    `<span>${evalData.q3}</span>`,
                    `<span>${evalData.q4}</span>`,
                    `<span>${evalData.q5}</span>`,
                    `<button type="button" class="btn btn-primary view-request-btn">View</button>`
                ]);
            }

            if ($.fn.DataTable.isDataTable('#tech-eval-table')) {
                $('#tech-eval-table').DataTable().destroy();
                $('#tech-eval-table tbody').empty(); // clear previous body
            }

            $('#tech-eval-table').DataTable({
                destroy: true,
                data: dataSet,
                columns: [
                    { title: "REQUEST NO." },
                    { title: "DATE REQUESTED" },
                    { title: "CATEGORY" },
                    { title: "SUBCATEGORY" },
                    { title: "PROCESSED BY" },
                    { title: "Q1" },
                    { title: "Q2" },
                    { title: "Q3" },
                    { title: "Q4" },
                    { title: "Q5" },
                    { title: "COMMENTS" }
                ],
                columnDefs: [
                    { targets: 0, createdCell: (td) => $(td).addClass('eval-request-no') },
                    { targets: 1, createdCell: (td) => $(td).addClass('eval-request-date') },
                    { targets: 2, createdCell: (td) => $(td).addClass('eval-request-category') },
                    { targets: 3, createdCell: (td) => $(td).addClass('eval-request-subcategory') },
                    { targets: 4, createdCell: (td) => $(td).addClass('eval-processed-by') },
                    { targets: 5, createdCell: (td) => $(td).addClass('eval-q1') },
                    { targets: 6, createdCell: (td) => $(td).addClass('eval-q2') },
                    { targets: 7, createdCell: (td) => $(td).addClass('eval-q3') },
                    { targets: 8, createdCell: (td) => $(td).addClass('eval-q4') },
                    { targets: 9, createdCell: (td) => $(td).addClass('eval-q5') },
                    { targets: 10, createdCell: (td) => $(td).addClass('eval-comments') },
                ],
                ordering: false
            });
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed:", error);
        }
    });
};


// Initial move to the first active tab on load
$(document).ready(function () {
    onLoadFetch_total_request('', '', "ALL", null, null);

    const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD

    document.getElementById("start-date-input").value = today;
    document.getElementById("end-date-input").value = today;

    $(document).off('click', '#filter-date-search-btn').on('click', '#filter-date-search-btn', function () {
        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        const category = category_clicked
        const sub_category = sub_category_clicked
        const techBioID = techBioID_clicked 

        // Restriction checks
        if (!startDate) {
            alert('Please select a start date.');
            return;
        }
    
        // Proceed with AJAX
        onLoadFetch_total_request(startDate, endDate, category, sub_category, techBioID);
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
        const techBioID = techBioID_clicked
        // populate the sub category


        onLoadFetch_total_request(startDate, endDate, category, sub_category, techBioID);

        if(category != "ALL"){
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
    
            $.ajax({
                url: '../../php/dashboard_technician_php/fetch_technicians.php',
                method: 'POST',
                data: { category },
                dataType: 'json',
                success: function (response) {
                    console.log(response);
            
                    // Enable the technicians select dropdown
                    $('#filter-technicians-select').css('pointer-events', 'auto');
                    $('#filter-technicians-select').css('opacity', '1');
            
                    const select = document.getElementById("filter-technicians-select");
                    select.innerHTML = ''; // Clear all options
            
                    // Add default option
                    const defaultOption = document.createElement("option");
                    defaultOption.value = "";
                    defaultOption.textContent = "-- Select Technician --";
                    select.appendChild(defaultOption);
            
                    // Populate the dropdown with technicians
                    response.forEach(function(tech) {
                        const option = document.createElement("option");
                        const fullName = `${tech.firstName || ''} ${tech.middle ? tech.middle[0] + '.' : ''} ${tech.lastName || ''}`.trim();
            
                        option.value = fullName;
                        option.textContent = fullName;
                        option.dataset.category = tech.techBioID;
                        select.appendChild(option);
                    });
                },
                error: function (err) {
                    console.error("AJAX error: ", err);
                }
            });
        }
        else{
            $('#filter-subCategory-select').css('pointer-events' , 'none')
            $('#filter-subCategory-select').css('opacity' , '0.3')

            $('#filter-technicians-select').css('pointer-events', 'none');
            $('#filter-technicians-select').css('opacity', '0.3');
        }
        
        
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
        const techBioID = techBioID_clicked

        onLoadFetch_total_request(startDate, endDate, category, sub_category, techBioID);
    });

    $(document).on('change', '#filter-technicians-select', function () {
        const selectedCategory = $(this).find("option:selected").data("category");
    
        techBioID_clicked = selectedCategory
        console.log(techBioID_clicked)

        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        const category = category_clicked
        const sub_category = sub_category_clicked
        const techBioID = techBioID_clicked

        onLoadFetch_total_request(startDate, endDate, category, sub_category, techBioID);
    });

    $(document).off('click', '.view-request-btn').on('click', '.view-request-btn', function() {
        const index = $('.view-request-btn').index(this);
        const data = fetch_viewRequestData[index]
        console.log(data)
        
        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);
        $('#user-section').text(data.requestBy.section);
    
        $('#job-order-id').text(`${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('#tech-name-i').text(data.processedBy ? data.processedBy : "No data yet.")
        $('#reception-date-i').text(data.requestStartDate ? data.requestStartDate : data.requestCorrectionDate )
        $('.tech-remarks-textarea').attr('placeholder', (data.requestJobRemarks) ? data.requestJobRemarks : data.requestCorrection);
        $('#modal-status-incoming').text(data.requestStatus);
        modal_view_form.show()
    })
});