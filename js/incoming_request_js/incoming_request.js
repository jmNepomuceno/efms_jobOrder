let request_modal = new bootstrap.Modal(document.getElementById('user-info-modal'));
// request_modal.show()

let fetch_requestData, fetch_techMyJob;
let clicked_requestNo = 0, clicked_requestNo_myJob = 0;
let clicked_tech_assess_textarea = ""
let clicked_sub_nav = "On-Process"

const dateFormatter = (originalDate) =>{
    const dateParts = originalDate.split(" - ");
    const [month, day, year] = dateParts[0].split("/");
    const timePart = dateParts[1];

    const dateObj = new Date(`${year}-${month}-${day} ${timePart}`);

    // Format the date
    const formattedDate = dateObj.toLocaleString('en-US', {
        weekday: 'short',    // Tue
        month: 'short',      // Mar
        day: '2-digit',      // 11
        year: 'numeric',     // 2025
        hour: '2-digit',     // 9
        minute: '2-digit',   // 04
        second: '2-digit',   // 08
        hour12: true         // AM/PM format
    });

    return formattedDate
}

const dataTable_incoming_request = () =>{
    try {
        $.ajax({
            url: '../../php/incoming_request_php/fetch_incoming_req.php',
            method: "POST",
            dataType : "json",
            success: function(response) {
                fetch_requestData = response
                try {
                    let dataSet = [];
                    for(let i = 0; i < response.length; i++){
                        const originalDate = response[i].requestDate;
                        const dateParts = originalDate.split(" - ");
                        const [month, day, year] = dateParts[0].split("/");
                        const timePart = dateParts[1];

                        const dateObj = new Date(`${year}-${month}-${day} ${timePart}`);
                        const now = new Date();

                        // Check if more than 2 hours have passed
                        const diffInMs = now - dateObj;
                        const diffInHours = diffInMs / (1000 * 60 * 60);
                        const isOverdue = diffInHours > 2;

                        const formattedDate = dateObj.toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                        });

                        // Highlight in red if overdue
                        const formattedDateHTML = `<span style="color: ${isOverdue ? 'red' : 'black'}">${formattedDate}</span>`;

                        dataSet.push([
                            `<div><span>${response[i].requestNo}</span></div>`,
                            `<div class="request-by-td-div">
                                <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                            </div>`,
                            `<div>${formattedDateHTML}</div>`,
                            `<div><span class="unit-td-span">${response[i].requestCategory}</span></div>`,
                            `<div><span class="category-td-span">${response[i].requestSubCategory}</span></div>`,
                        ]);
                    }  

                    if ($.fn.DataTable.isDataTable('#incoming-req-table')) {
                        $('#incoming-req-table').DataTable().destroy();
                        $('#incoming-req-table tbody').empty(); // Clear previous table body
                    }

                    $('#incoming-req-table').DataTable({
                        data: dataSet,
                        columns: [
                            { title: "REQUEST NO.", data:0 },
                            { title: "NAME OF REQUESTER", data:1 },
                            { title: "DATE REQUESTED", data:2 },
                            { title: "UNIT", data:3 },
                            { title: "CATEGORY", data:4 },
                        ],
                        columnDefs: [
                            { targets: 0, createdCell: function(td) { $(td).addClass('item-req-no-td'); } },
                            { targets: 1, createdCell: function(td) { $(td).addClass('item-name-td'); } , width:"35%"},
                            { targets: 2, createdCell: function(td) { $(td).addClass('item-date-td'); } },
                            { targets: 3, createdCell: function(td) { $(td).addClass('item-unit-td'); } },
                            { targets: 4, createdCell: function(td) { $(td).addClass('item-category-td'); } },
                        ],
                        "autoWidth": false, // Prevents auto column sizing
                        "paging": false,
                        "info": false,
                        "ordering": false,
                        "stripeClasses": [],
                        "searching": false,
                        
                    });

                    // **Set unique ID for each row after table initialization**
                    $('#incoming-req-table tbody tr').each(function(index) {
                        $(this).attr('class', `incoming-req-row-class`);
                    });

                } catch (innerError) {
                    console.error("Error processing response:", innerError);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });


        //fetch is theres on proncess on your job
        // $.ajax({
        //     url: '../php/incoming_request_php/fetch_myJobs.php',
        //     method: "POST",
        //     data : {what : "On-Process"},
        //     dataType : 'json',
        //     success: function(response) {
        //         // console.log(response)
        //         try { 
        //             if(parseInt(response.length) >= 1){
        //                 $('#on-process-notif-span').text(response.length)
        //                 $('#on-process-notif-span').css('display' , 'flex')
        //             }
        //         } catch (innerError) {
        //             console.error("Error processing response:", innerError);
        //         }
        //     },
        //     error: function(xhr, status, error) {
        //         console.error("AJAX request failed:", error);
        //     }
        // });

        //  //fetch is theres evaluation on your job
        //  $.ajax({
        //     url: '../php/incoming_request_php/fetch_for_evaluation.php',
        //     method: "POST",
        //     data : {what : "both"},
        //     dataType : 'json',
        //     success: function(response) {
        //         console.log(response)
        //         try { 
        //             if(response >= 1){
        //                 $('#for-evaluation-notif-span').text(response)
        //                 $('#for-evaluation-notif-span').css('display' , 'block')
                        
        //                 $('#your-job-notif-span').text(parseInt($('#for-evaluation-notif-span').text()) + parseInt($('#on-process-notif-span').text()))
        //                 $('#your-job-notif-span').css('display' , 'block')
        //             }
        //         } catch (innerError) {
        //             console.error("Error processing response:", innerError);
        //         }
        //     },
        //     error: function(xhr, status, error) {
        //         console.error("AJAX request failed:", error);
        //     }
        // });

        

    } catch (ajaxError) {
        console.error("Unexpected error occurred:", ajaxError);
    }
   
}

const getTimeDifference = (start, end) => {
    // Convert to Date objects
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Calculate difference in milliseconds
    let diffMs = endDate - startDate;

    if (diffMs < 0) return "00:00:00"; // If end is before start, return zero

    // Convert to hh:mm:ss
    const hours = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((diffMs % (1000 * 60)) / 1000)).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

const dataTable_my_jobs = (what) =>{ 
    try {
        $.ajax({
            url: '../../php/incoming_request_php/fetch_myJobs.php',
            method: "POST",
            data : {what},
            dataType : "json",
            success: function(response) {
                console.log(response)
                fetch_techMyJob = response
                try {
                    let dataSet = [];
                    let recept_interval = "", eval_interval = ""
                    

                    for(let i = 0; i < response.length; i++){
                        response[i].requestDate = dateFormatter(response[i].requestDate)
                        response[i].requestStartDate = dateFormatter((response[i].requestStartDate) ? response[i].requestStartDate : response[i].requestCorrectionDate);
                        fetch_techMyJob[i]['what'] = what

                        
                        // update the number of the notif value
                        // $('#your-job-notif-span').text(parseInt(response.length))
                        // $('#your-job-notif-span').css('display' , 'block')

                        if(clicked_sub_nav === 'On-Process'){
                            recept_interval = getTimeDifference(response[i].requestDate, response[i].requestStartDate);
                            let interval_style = "";
                            if (recept_interval !== "00:00:00" && getTimeDifference(response[i].requestDate, response[i].requestStartDate) > "02:00:00") {
                                interval_style = "color: red;";
                            } else {
                                interval_style = "color: #1a8754;";
                            }
                            
                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                </div>`,
                                `<div class="request-date-td-div">
                                    <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                                    <span>
                                        <b>Reception Date:</b> 
                                        ${response[i].requestStartDate}
                                        <h6 class='recept-interval' style='${interval_style}'>+${recept_interval}</h6>
                                    </span>
                                </div>`,
                                `<div><span class="request-category-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="request-subcategory-span">${response[i].requestSubCategory}</span></div>`,
                            ])
                        }

                        if(clicked_sub_nav === 'Evaluation'){
                            response[i].requestEvaluationDate = dateFormatter(response[i].requestEvaluationDate)
                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                </div>`,
                                `<div class="request-date-td-div">
                                    <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                                    <span><b>Reception Date:</b> ${response[i].requestStartDate}</span>
                                    <span><b>For Evaluation Date:</b> ${response[i].requestEvaluationDate}</span>
                                </div>`,
                                `<div><span class="category-td-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="sub-category-td-span">${response[i].requestSubCategory}</span></div>`,
                            ])
                        }

                        if(clicked_sub_nav === 'Completed'){
                            let rawStart = response[i].requestDate; // "Tue, Mar 11, 2025, 11:50:14 AM"
                            let rawEnd = response[i].requestEvaluationDate; // "03/18/2025 - 10:31:41 AM"

                            // Format rawStart: remove weekday
                            let formattedStart = rawStart.replace(/^.*?,\s*/, ''); // "Mar 11, 2025, 11:50:14 AM"
                            let startDate = new Date(formattedStart); // JS can parse this

                            // Format rawEnd: change to "MM/DD/YYYY HH:MM:SS AM/PM"
                            let formattedEnd = rawEnd.replace(" - ", " "); // "03/18/2025 10:31:41 AM"
                            let endDate = new Date(formattedEnd); // JS can parse this too

                            // Calculate time difference
                            const timeDiff = endDate - startDate;
                            let hours = Math.floor(timeDiff / (1000 * 60 * 60));
                            let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                            let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                            let formattedTimeDiff = `${hours}h ${minutes}m ${seconds}s`;

                            const twoHours = 2 * 60 * 60 * 1000;
                            
                            let style = "";
                            if (!isNaN(timeDiff) && timeDiff > twoHours) {
                                style = "color: red; font-weight: bold;";
                            }else{
                                style = "color: #1a8754; font-weight: bold;";
                            }

                            response[i].requestEvaluationDate = dateFormatter(response[i].requestEvaluationDate)
                            response[i].requestCompletedDate = dateFormatter(response[i].requestCompletedDate)
                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                </div>`,
                                `<div class="request-date-td-div">
                                    <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                                    <span><b>Reception Date:</b> ${response[i].requestStartDate}</span>
                                    <span><b>For Evaluation Date:</b> ${response[i].requestEvaluationDate}</span>
                                    <span><b>Completed Date:</b> ${response[i].requestCompletedDate} <i style='${style}'> (${formattedTimeDiff}) </i> </span>
                                </div>`,
                                `<div><span class="category-td-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="sub-category-td-span">${response[i].requestSubCategory}</span></div>`,
                            ])
                        }

                        if(clicked_sub_nav === 'Correction'){

                            dataSet.push([
                                `<div><span>${response[i].requestNo}</span></div>`,
                                `<div class="request-by-td-div">
                                    <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                    <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                    <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                    <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                                </div>`,
                                `<div class="request-date-td-div">
                                    <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                                    <span><b>Correction Date:</b> ${response[i].requestStartDate}</span>
                                </div>`,
                                `<div><span class="category-td-span">${response[i].requestCategory}</span></div>`,
                                `<div><span class="sub-category-td-span">${response[i].requestSubCategory}</span></div>`,
                            ])
                        }
                       
                    }  

                    if ($.fn.DataTable.isDataTable('#incoming-req-table')) {
                        $('#incoming-req-table').DataTable().destroy();
                        $('#incoming-req-table tbody').empty(); // Clear previous table body
                    }

                    $('#incoming-req-table').DataTable({
                        data: dataSet,
                        columns: [
                            { title: "REQUEST NO.", data:0 },
                            { title: "NAME OF TECHNICIAN", data:1 },
                            { title: "DATE", data:2 },
                            { title: "UNIT", data:3 },
                            { title: "CATEGORY", data:4 },
                        ],
                        columnDefs: [
                            { targets: 0, createdCell: function(td) { $(td).addClass('item-req-no-td'); } },
                            { targets: 1, createdCell: function(td) { $(td).addClass('item-name-td'); } , width:"35%"},
                            { targets: 2, createdCell: function(td) { $(td).addClass('item-date-td'); } },
                            { targets: 3, createdCell: function(td) { $(td).addClass('item-unit-td'); } },
                            { targets: 4, createdCell: function(td) { $(td).addClass('item-category-td'); } },
                        ],
                        "autoWidth": false, // Prevents auto column sizing 
                        "paging": false,
                        "info": false,
                        "ordering": false,
                        "stripeClasses": [],
                        "searching": false,
                        
                    });

                    // **Set unique ID for each row after table initialization**
                    $('#incoming-req-table tbody tr').each(function(index) {
                        $(this).attr('class', `my-job-row-class`);
                    });

                } catch (innerError) {
                    console.error("Error processing response:", innerError);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });
    } catch (ajaxError) {
        console.error("Unexpected error occurred:", ajaxError);
    }
   
}

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
            dataTable_incoming_request();  
            break;
        case "refreshDoneEvaluationTableUser":
            fetchNotifValue()
            dataTable_my_jobs("Evaluation");  
            break;
        default:
            console.log("Unknown action:", data.action);
    }
};


$(document).ready(function(){
    dataTable_incoming_request()
    fetchNotifValue()

    // Set interval to fetch data every 10 seconds
    // setInterval(function() {
    //     dataTable_incoming_request();
    // }, 10000); // 10 seconds (10000ms)

    $(document).off('click', '.incoming-req-row-class').on('click', '.incoming-req-row-class', function() {        
        const index = $('.incoming-req-row-class').index(this);
        const data = fetch_requestData[index];
        clicked_requestNo = data.requestNo
        
        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);
        $('#user-section').text(data.requestBy.section);
    
        $('#job-order-id').text(`${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('.modal-title').text("User & Job Order Details")
        $('#user-what').text("Requester")
        $('.assessment-section').css('display' , 'flex')
        $('.tech-assessment-section').css('display' , 'none')
        $('#start-assess-btn').text("Start Job")
        $('#start-assess-btn').css('display' , 'flex')
        $('#rtr-assess-btn').css('display' , 'flex')

        request_modal.show();
    });

    $(document).off('click', '.my-job-row-class').on('click', '.my-job-row-class', function() {        
        const index = $('.my-job-row-class').index(this);
        const data = fetch_techMyJob[index];
        clicked_requestNo_myJob = data.requestNo
        console.log(fetch_techMyJob) 
 
        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);
        $('#user-section').text(data.requestBy.section);
    
        $('#job-order-id').text(`${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('.modal-title').text("Job Order Technician Assessment Details || " + clicked_sub_nav)
        $('#user-what').text("Technician")
        $('.assessment-section').css('display' , 'none')
        $('.tech-assessment-section').css('display' , 'flex')
        $('.tech-remarks-textarea').attr('placeholder', 'Enter remarks details. Input at least 10 characters...')
        $('#start-assess-btn').text("Finish Job")

        if($('.tech-remarks-textarea').val().length >= 10){
            $('#start-assess-btn').css('opacity' , '1')
            $('#start-assess-btn').css('pointer-events' , 'auto')
        }else{
            $('#start-assess-btn').css('opacity' , '0.5')
            $('#start-assess-btn').css('pointer-events' , 'none')
        }

        $('#tech-name-i').text(data.processedBy)
        $('#reception-date-i').text(data.requestStartDate)
        $('#rtr-assess-btn').css('display' , 'flex')
        $('#start-assess-btn').css('display' , 'flex')

        if(clicked_sub_nav === "Evaluation"){
            $('.tech-remarks-textarea').val(data.requestJobRemarks)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('opacity' , '0.7')
            $('#start-assess-btn').css('pointer-events' , 'none')
            $('#start-assess-btn').text("Waiting for User's Evaluation...")
            $('#rtr-assess-btn').css('display' , 'none')
        }

        else if(clicked_sub_nav === "Completed"){
            $('.tech-remarks-textarea').val(data.requestJobRemarks)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('display' , 'none')
            $('#rtr-assess-btn').css('display' , 'none')

        }

        request_modal.show();


    });

    // requestCompletedDate
    $(document).off('click', '#start-assess-btn').on('click', '#start-assess-btn', function() {     
        console.log()
        if($('#start-assess-btn').text() === 'Start Job'){
            console.log(clicked_requestNo)
            try {
                $.ajax({
                    url: '../php/incoming_request_php/edit_toOnProcess_req.php',
                    method: "POST",
                    data: {requestNo : clicked_requestNo},
                    success: function(response) {
                        try { 
                            console.log(response)
                            dataTable_incoming_request()
                            fetchNotifValue()
                            request_modal.hide()
                        } catch (innerError) {
                            console.error("Error processing response:", innerError);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("AJAX request failed:", error);
                    }
                });
            } catch (ajaxError) {
                console.error("Unexpected error occurred:", ajaxError);
            }
        }
        else  if($('#start-assess-btn').text() === 'Finish Job'){
            console.log(clicked_requestNo_myJob)
            try {
                $.ajax({
                    url: '../php/incoming_request_php/edit_toEvaluation_req.php',
                    method: "POST",
                    data: {
                        requestNo : clicked_requestNo_myJob,
                        requestJobRemarks : $('.tech-remarks-textarea').val()
                    },
                    dataType : "json",
                    success: function(response) {
                        try { 
                            dataTable_my_jobs("On-Process")
                            request_modal.hide()
                            
                            console.log(response)

                            if(response.count_yourJob > 0){
                                $('#your-job-notif-span').text(response.count_yourJob)
                                $('#your-job-notif-span').css('display' , 'block')
                            }else{
                                $('#your-job-notif-span').text(0)
                                $('#your-job-notif-span').css('display' , 'none')
                            }

                            if(response.count_onProcess > 0){
                                $('#on-process-notif-span').text(response.count_onProcess)
                                $('#on-process-notif-span').css('display' , 'block')
                            }else{
                                $('#on-process-notif-span').text(0)
                                $('#on-process-notif-span').css('display' , 'none')
                            }

                            if(response.count_evaluation > 0){
                                $('#for-evaluation-notif-span').text(response.count_evaluation)
                                $('#for-evaluation-notif-span').css('display' , 'block')
                            }else{
                                $('#for-evaluation-notif-span').text(0)
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
            } catch (ajaxError) {
                console.error("Unexpected error occurred:", ajaxError);
            }
        }
        else  if($('#start-assess-btn').text() === 'Send'){
            console.log('here')
            try {
                $.ajax({
                    url: '../php/incoming_request_php/edit_toCorrection_req.php',
                    method: "POST",
                    data: {
                        requestNo : clicked_requestNo,
                        requestJobRemarks : $('.assessment-textarea').val()
                    },
                    success: function(response) {
                        try { 
                            dataTable_incoming_request()
                            request_modal.hide()
                            fetchNotifValue()
                            
                            console.log(response)
                        } catch (innerError) {
                            console.error("Error processing response:", innerError);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("AJAX request failed:", error);
                    }
                });
            } catch (ajaxError) {
                console.error("Unexpected error occurred:", ajaxError);
            }
        }
    })   

    // $(document).off('click', '#your-job-btn').on('click', '#your-job-btn', function() {
    //     dataTable_my_jobs("On-Process")

    //     $('#your-job-btn').css('opacity' , '1')
    //     $('#request-list-btn').css('opacity' , '0.5')

    //     $('.sub-table-nav').css('display' , 'flex')

    //     // reset the css for the sub buttons
    //     $("#for-evaluation-sub-btn, #on-process-sub-btn, #completed-sub-btn").css({
    //         "opacity": "0.5",
    //         "background": "none",
    //         "color": "white"
    //     });
    //     // Highlight the "On-Process" button
    //     $("#on-process-sub-btn").css({
    //         "opacity": "1",
    //         "background": "white",
    //         "color": "black"
    //     });
    // })     

    $('#your-job-btn').on('click', function () {
        const $container = $('.my-job-order-div');
        const $subBtns = $('#your-job-sub-btns');

        $('#your-job-btn').css('opacity', '1');
        $('#request-list-btn').css('opacity', '0.5');

        // Remove active class from all sub buttons
        $(".your-job-sub-btn").removeClass("active");

        // Add active to "On-Process" button
        $("#your-job-on-process-btn").addClass("active");

        $container.toggleClass('active');
        $subBtns.toggleClass('show');

        dataTable_my_jobs("On-Process");
    });


    $('#your-job-close-btn').on('click', function () {
        const $container = $('.my-job-order-div');
        const $subBtns = $('#your-job-sub-btns');

        $container.removeClass('active');
        $subBtns.removeClass('show');
    });
    
    $(document).off('click', '#request-list-btn').on('click', '#request-list-btn', function() {
        dataTable_incoming_request()

        $('#your-job-btn').css('opacity' , '0.5')
        $('#request-list-btn').css('opacity' , '1')

        $('.sub-table-nav').css('display' , 'none')

        const $container = $('.my-job-order-div');
        const $subBtns = $('#your-job-sub-btns');

        $container.removeClass('active');
        $subBtns.removeClass('show');
    })  

    $(document).off("click", "#your-job-on-process-btn, #your-job-for-evaluation-btn, #your-job-completed-btn, #your-job-correction-btn").on("click", "#your-job-on-process-btn, #your-job-for-evaluation-btn, #your-job-completed-btn, #your-job-correction-btn", function () {
        console.log('here')
        let status = {
            "your-job-for-evaluation-btn": "Evaluation",
            "your-job-on-process-btn": "On-Process",
            "your-job-on-process-btn": "On-Process",
            "your-job-completed-btn": "Completed",
            "your-job-correction-btn": "Correction"
        }[this.id];
    
        dataTable_my_jobs(status);
        clicked_sub_nav = status
    
        // Reset all buttons
        $(".your-job-sub-btn").removeClass("active");
    
        // Highlight the clicked button
        $(this).addClass("active");
    });

    $('.tech-remarks-textarea').on('input', function() {
        if ($(this).val().length >= 10) {
            $('#start-assess-btn').css({
                'opacity': '1',
                'pointer-events': 'auto'
            });
        } else {
            $('#start-assess-btn').css({
                'opacity': '0.5',
                'pointer-events': 'none'
            });
        }
    });


})