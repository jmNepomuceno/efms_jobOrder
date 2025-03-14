let request_modal = new bootstrap.Modal(document.getElementById('user-info-modal'));
// request_modal.show()

let fetch_requestData, fetch_techMyJob;
let clicked_requestNo = 0, clicked_requestNo_myJob = 0;

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
            method: "GET",
            dataType : 'json',
            success: function(response) {
                console.log(response)
                try { 
                    if(parseInt(response.length) >= 1){
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

const dataTable_my_jobs = () =>{
    try {
        $.ajax({
            url: '../../php/incoming_request_php/fetch_myJobs.php',
            method: "POST",
            dataType : "json",
            success: function(response) {
                console.log(response)
                fetch_techMyJob = response
                try {
                    let dataSet = [];

                    for(let i = 0; i < response.length; i++){
                        response[i].requestDate = dateFormatter(response[i].requestDate)
                        response[i].requestStartDate = dateFormatter(response[i].requestStartDate)

                        dataSet.push([
                            `<div><span>${response[i].requestNo}</span></div>`,
                            `<div class="request-by-td-div">
                                <span class="request-by-name-td-div">${response[i].access_by.name}</span>
                                <span class="request-by-bioID-td-div"><b>Bio ID:</b> ${response[i].access_by.bioID}</span>
                                <span class="request-by-division-td-div"><b>Division:</b> ${response[i].access_by.divisionName}</span>
                                <span class="request-by-section-td-div"><b>Section:</b> ${response[i].access_by.sectionName}</span>
                            </div>`,
                            `<div class="request-date-td-div">
                                <span><b>Requested:</b> ${response[i].requestDate}</span>
                                <span><b>Accessed:</b> ${response[i].requestStartDate}</span>
                            </div>`,
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

$(document).ready(function(){
    dataTable_incoming_request()

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
 
        $('#user-name').text(data.access_by.name);
        $('#user-bioid').text(data.access_by.bioID);
        $('#user-division').text(data.access_by.divisionName);
        $('#user-section').text(data.access_by.sectionName);
    
        $('#job-order-id').text(`JO-${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('.modal-title').text("Job Order Technician Assessment Details")
        $('#user-what').text("Technician")
        $('.assessment-section').css('display' , 'none')
        $('.tech-assessment-section').css('display' , 'flex')
        $('#start-assess-btn').text("Finish Job")
        request_modal.show();
    });

    // 
    $(document).off('click', '#start-assess-btn').on('click', '#start-assess-btn', function() {     
        console.log(clicked_requestNo)

        try {
            $.ajax({
                url: '../php/incoming_request_php/edit_toOnProcess_req.php',
                method: "POST",
                data: {requestNo : clicked_requestNo},
                success: function(response) {
                    try { 
                        dataTable_incoming_request()
                        request_modal.hide()
                        if(parseInt(response) >= 1){
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
        
    })   

    $(document).off('click', '#your-job-btn').on('click', '#your-job-btn', function() {
        dataTable_my_jobs()

        $('#your-job-btn').css('opacity' , '1')
        $('#request-list-btn').css('opacity' , '0.5')
    })     
    
    $(document).off('click', '#request-list-btn').on('click', '#request-list-btn', function() {
        dataTable_incoming_request()

        $('#your-job-btn').css('opacity' , '0.5')
        $('#request-list-btn').css('opacity' , '1')
    })  
})