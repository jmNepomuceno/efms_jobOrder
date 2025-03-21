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
                console.log(response)
                fetch_requestData = response
                try {
                    let dataSet = [];

                    // <span class="request-by-td-span">${response[i].requestBy.bioID}</span>
                    //             <span class="request-by-td-span">${response[i].requestBy.division}</span>
                    //             <span class="request-by-td-span">${response[i].requestBy.section}</span>
                    for(let i = 0; i < response.length; i++){
                        const originalDate = response[i].requestDate
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

                        dataSet.push([
                            `<div><span>${response[i].requestNo}</span></div>`,
                            `<div class="request-by-td-div">
                                <span class="request-by-name-td-div">${response[i].requestBy.name}</span>
                                <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].requestBy.bioID}</span>
                                <span class="request-by-division-td-div"><b>Division:</b> ${response[i].requestBy.division}</span>
                                <span class="request-by-section-td-div"><b>Section:</b> ${response[i].requestBy.section}</span>
                            </div>`,
                            `<div><span>${formattedDate}</span></div>`,
                            `<div><span class="request-type-td-span">${response[i].requestCategory}</span></div>`,
                        ])
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
                            { title: "REQUEST TYPE", data:3 },
                        ],
                        columnDefs: [
                            { targets: 0, createdCell: function(td) { $(td).addClass('item-req-no-td'); } },
                            { targets: 1, createdCell: function(td) { $(td).addClass('item-name-td'); } , width:"35%"},
                            { targets: 2, createdCell: function(td) { $(td).addClass('item-date-td'); } },
                            { targets: 3, createdCell: function(td) { $(td).addClass('item-req-type-td'); } },
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
        $.ajax({
            url: '../php/incoming_request_php/fetch_myJobs.php',
            method: "POST",
            data : {what : "On-Process"},
            dataType : 'json',
            success: function(response) {
                console.log(response)
                try { 
                    if(parseInt(response.length) >= 1){
                        $('#on-process-notif-span').text(response.length)
                        $('#on-process-notif-span').css('display' , 'flex')
                    }
                } catch (innerError) {
                    console.error("Error processing response:", innerError);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });

         //fetch is theres evaluation on your job
         $.ajax({
            url: '../php/incoming_request_php/fetch_for_evaluation.php',
            method: "POST",
            data : {what : "both"},
            dataType : 'json',
            success: function(response) {
                console.log(response)
                try { 
                    if(response >= 1){
                        $('#for-evaluation-notif-span').text(response)
                        $('#for-evaluation-notif-span').css('display' , 'block')
                        
                        $('#your-job-notif-span').text(parseInt($('#for-evaluation-notif-span').text()) + parseInt($('#on-process-notif-span').text()))
                        $('#your-job-notif-span').css('display' , 'block')
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

                    for(let i = 0; i < response.length; i++){
                        response[i].requestDate = dateFormatter(response[i].requestDate)
                        response[i].requestStartDate = dateFormatter(response[i].requestStartDate)
                        fetch_techMyJob[i]['what'] = what

                        
                        // update the number of the notif value
                        // $('#your-job-notif-span').text(parseInt(response.length))
                        // $('#your-job-notif-span').css('display' , 'block')

                        if(clicked_sub_nav === 'On-Process'){
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
                                </div>`,
                                `<div><span class="request-type-td-span">${response[i].requestCategory}</span></div>`,
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
                                `<div><span class="request-type-td-span">${response[i].requestCategory}</span></div>`,
                            ])
                        }

                        if(clicked_sub_nav === 'Completed'){
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
                                    <span><b>Completed Date:</b> ${response[i].requestCompletedDate}</span>
                                </div>`,
                                `<div><span class="request-type-td-span">${response[i].requestCategory}</span></div>`,
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
                            { title: "REQUEST TYPE", data:3 },
                        ],
                        columnDefs: [
                            { targets: 0, createdCell: function(td) { $(td).addClass('item-req-no-td'); } },
                            { targets: 1, createdCell: function(td) { $(td).addClass('item-name-td'); } , width:"35%"},
                            { targets: 2, createdCell: function(td) { $(td).addClass('item-date-td'); } },
                            { targets: 3, createdCell: function(td) { $(td).addClass('item-req-type-td'); } },
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



// socket.onmessage = function(event) {
//     let data = JSON.parse(event.data);
//     console.log("Received from WebSocket:", data); // Debugging
//     if (data.action === "refreshIncomingTable") {
//         dataTable_incoming_request();  // Refresh the table
//     }
// };

socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    console.log("Received from WebSocket:", data); // Debugging

    // Call fetchNotifValue() on every process update
    switch (data.action) {
        case "refreshIncomingTable":
            dataTable_incoming_request();  
            break;
        case "refreshDoneEvaluationTableUser":
            dataTable_my_jobs("Evaluation");  
            break;
        default:
            console.log("Unknown action:", data.action);
    }
};


$(document).ready(function(){
    dataTable_incoming_request()

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
    
        $('#job-order-id').text(`JO-${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('.modal-title').text("User & Job Order Details")
        $('#user-what').text("Requester")
        $('.assessment-section').css('display' , 'flex')
        $('.tech-assessment-section').css('display' , 'none')
        $('#start-assess-btn').text("Start Job")
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
    
        $('#job-order-id').text(`JO-${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('.modal-title').text("Job Order Technician Assessment Details || " + clicked_sub_nav)
        $('#user-what').text("Technician")
        $('.assessment-section').css('display' , 'none')
        $('.tech-assessment-section').css('display' , 'flex')
        $('#start-assess-btn').text("Finish Job")

        $('#tech-name-i').text(data.processedBy)
        $('#reception-date-i').text(data.requestStartDate)

        if(clicked_sub_nav === "Evaluation"){
            $('.tech-remarks-textarea').val(data.requestJobRemarks)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('opacity' , '0.7')
            $('#start-assess-btn').css('pointer-events' , 'none')
            $('#start-assess-btn').text("Waiting for User's Evaluation...")
        }

        else if(clicked_sub_nav === "Completed"){
            $('.tech-remarks-textarea').val(data.requestJobRemarks)
            $('.tech-remarks-textarea').css('pointer-events' , 'none')
            $('#start-assess-btn').css('display' , 'none')
        }

        request_modal.show();


    });

    // requestCompletedDate
    $(document).off('click', '#start-assess-btn').on('click', '#start-assess-btn', function() {     
        console.log()
        if($('#start-assess-btn').text() === 'Start Job'){
            try {
                $.ajax({
                    url: '../php/incoming_request_php/edit_toOnProcess_req.php',
                    method: "POST",
                    data: {requestNo : clicked_requestNo},
                    dataType : 'json',
                    success: function(response) {
                        try { 
                            console.log(response)
                            dataTable_incoming_request()
                            request_modal.hide()
                            if(parseInt(response.count_yourJob) >= 1){
                                $('#your-job-notif-span').text(response.count_yourJob)
                                $('#your-job-notif-span').css('display' , 'block')
                            }else{
                                $('#your-job-notif-span').text(0)
                                $('#your-job-notif-span').css('display' , 'none')
                            }
                            if(parseInt(response.count_onProcess) >= 1){
                                $('#on-process-notif-span').text(response.count_onProcess)
                                $('#on-process-notif-span').css('display' , 'block')
                            }else{
                                $('#on-process-notif-span').text(0)
                                $('#on-process-notif-span').css('display' , 'none')
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
        else  if($('#start-assess-btn').text() === 'Finish Job'){
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
                    dataType : "json",
                    success: function(response) {
                        try { 
                            dataTable_incoming_request()
                            request_modal.hide()
                            
                            console.log(response)

                            // if(response.count_yourJob > 0){
                            //     $('#your-job-notif-span').text(response.count_yourJob)
                            //     $('#your-job-notif-span').css('display' , 'block')
                            // }else{
                            //     $('#your-job-notif-span').text(0)
                            //     $('#your-job-notif-span').css('display' , 'none')
                            // }

                            // if(response.count_onProcess > 0){
                            //     $('#on-process-notif-span').text(response.count_onProcess)
                            //     $('#on-process-notif-span').css('display' , 'block')
                            // }else{
                            //     $('#on-process-notif-span').text(0)
                            //     $('#on-process-notif-span').css('display' , 'none')
                            // }

                            // if(response.count_evaluation > 0){
                            //     $('#for-evaluation-notif-span').text(response.count_evaluation)
                            //     $('#for-evaluation-notif-span').css('display' , 'block')
                            // }else{
                            //     $('#for-evaluation-notif-span').text(0)
                            //     $('#for-evaluation-notif-span').css('display' , 'none')
                            // }

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

    $(document).off('click', '#your-job-btn').on('click', '#your-job-btn', function() {
        dataTable_my_jobs("On-Process")

        $('#your-job-btn').css('opacity' , '1')
        $('#request-list-btn').css('opacity' , '0.5')

        $('.sub-table-nav').css('display' , 'flex')
    })     
    
    $(document).off('click', '#request-list-btn').on('click', '#request-list-btn', function() {
        dataTable_incoming_request()

        $('#your-job-btn').css('opacity' , '0.5')
        $('#request-list-btn').css('opacity' , '1')

        $('.sub-table-nav').css('display' , 'none')
    })  

    $(document).off("click", "#for-evaluation-sub-btn, #on-process-sub-btn, #completed-sub-btn").on("click", "#for-evaluation-sub-btn, #on-process-sub-btn, #completed-sub-btn", function () {
        let status = {
            "for-evaluation-sub-btn": "Evaluation",
            "on-process-sub-btn": "On-Process",
            "completed-sub-btn": "Completed"
        }[this.id];
    
        dataTable_my_jobs(status);
        clicked_sub_nav = status
    
        // Reset all buttons
        $("#for-evaluation-sub-btn, #on-process-sub-btn, #completed-sub-btn").css({
            "opacity": "0.5",
            "background": "none",
            "color": "white"
        });
    
        // Highlight the clicked button
        $(this).css({
            "opacity": "1",
            "background": "white",
            "color": "black"
        });
    });

    
})