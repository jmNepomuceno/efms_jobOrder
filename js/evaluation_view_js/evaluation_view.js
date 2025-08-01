var modal_view_eval_form, modal_eval_form
var clicked_requestID;
var fetch_viewRequestData;
var clicked_requestNo = 0;
// $('#evaluation-notif-span')
if (!modal_view_eval_form) {
    modal_view_eval_form = new bootstrap.Modal(document.getElementById('modal-view-eval-form'));
}

if (!modal_eval_form) {
    modal_eval_form = new bootstrap.Modal(document.getElementById('modal-eval-form'));
}

var fetch_dataTable = () =>{
    $.ajax({
        url: '../php/evaluation_view_php/fetch_evaluation_req.php',
        method: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            fetch_viewRequestData = response
            try {

                //enable notif div
                
                let dataSet = [];
                for (let i = 0; i < response.length; i++) {
                    dataSet.push([
                        `<span class="requestNo-span">${response[i].requestNo}</span>`,
                        `<span>${response[i].processedBy}</span>`,
                        `<div class="date-request-td"> 
                            <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                            <span><b>Reception Date:</b> ${response[i].requestStartDate}</span>
                            <span><b>Evaluation Date:</b> ${response[i].requestEvaluationDate}</span>
                        </div>`,
                        `<span>${response[i].requestCategory}</span>`,
                        `<div class="action-evaluation-div">
                            <button type="button" class="btn btn-primary view-eval-req-btn">View</button>
                            <button type="button" class="btn btn-success view-eval-form-btn">Evaluation</button>
                        </div>`
                    ]);
                }
                
                if ($.fn.DataTable.isDataTable('#evaluation-dataTable')) {
                    $('#evaluation-dataTable').DataTable().destroy();
                    $('#evaluation-dataTable tbody').empty(); // Clear previous table body
                }

                $('#evaluation-dataTable').DataTable({
                    destroy: true,
                    data: dataSet,
                    columns: [
                        { title: "JOB ORDER NO." },
                        { title: "TECHNICIAN NAME" },
                        { title: "DATE" },
                        { title: "REQUEST TYPE" },
                        { title: "ACTION" }
                        
                    ],
                    columnDefs: [
                        { targets: 0, createdCell: function(td) { $(td).addClass('request-no-td'); } },
                        { targets: 1, createdCell: function(td) { $(td).addClass('request-tech-name-td'); } },
                        { targets: 2, createdCell: function(td) { $(td).addClass('request-date-td'); },width:"30%"},
                        { targets: 3, createdCell: function(td) { $(td).addClass('request-req-type-td'); } },
                        { targets: 4, createdCell: function(td) { $(td).addClass('request-action-td'); } },
                    ],
                    // "paging": false,
                    // "info": false,
                    // "ordering": false,
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

socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    console.log("Received from WebSocket:", data); // Debugging
    if (data.action === "refreshEvaluationTableUser") {
        fetch_dataTable();  // Refresh the table
    }
};

// modal_eval_form.show()
$(document).ready(function(){
    fetch_dataTable() 
    $(document).off('click', '#submit-modal-btn').on('click', '#submit-modal-btn', function() {        
        try {
            $.ajax({
                url: '../../php/pending_view_php/cancel_request.php',
                data : { 
                    requestNo: clicked_requestNo, 
                    cancelRequest : $('#cancel-input-id').val() 
                },
                method: "POST",
                success: function(response) {
                    console.log(response)
                    try {
                        if(response === "success"){
                            modal_cancel_form.hide()
                            fetch_dataTable()
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
    });

    $(document).off('click', '.view-eval-req-btn').on('click', '.view-eval-req-btn', function() {
        const index = $('.view-eval-req-btn').index(this);
        const data = fetch_viewRequestData[index]
        clicked_requestNo = data.requestNo

        console.log(129, data)

        $.ajax({
            url: '../php/incoming_request_php/fetch_account_photo.php',
            method: "POST",
            data: {bioID : data.processedByID},
            success: function(response) {
                console.log(response);

                const base64Data = (response.photo || "").trim();
                $('#tech-photo').attr('src', `data:image/bmp;base64,${base64Data}`);
            },

            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });

        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);
        $('#user-section').text(data.requestBy.section);
    
        $('#job-order-id').text(`JO-${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('#tech-name-i').text(data.processedBy)
        // tech-bioID-i
        $('#tech-bioID-i').text(data.processedByID)

        // $('#reception-date-i').text(data.requestStartDate)
        $('.tech-remarks-textarea').val(`Assessment: ` + data.requestJobRemarks)
        modal_view_eval_form.show()
    })

    $(document).off('click', '.view-eval-form-btn').on('click', '.view-eval-form-btn', function() {
        const index = $('.view-eval-form-btn').index(this);
        const data = fetch_viewRequestData[index]
        clicked_requestNo = data.requestNo
        console.log(data)

        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);
        $('#user-section').text(data.requestBy.section);
    
        $('#job-order-id').text(`JO-${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        // $('.modal-title').text("Job Order Technician Assessment Details")
        $('#user-what').text("Technician")
        $('.assessment-section').css('display' , 'none')
        $('.tech-assessment-section').css('display' , 'flex')
        $('#start-assess-btn').text("Finish Job")

        $('#tech-name-i').text(data.processedBy)
        $('#reception-date-i').text(data.requestStartDate)
        
        modal_eval_form.show()
    })

    $(document).off('submit', '#evaluation-form').on('submit', '#evaluation-form', function() {
        event.preventDefault();

        let formData = new FormData(this);
        formData.append("requestNo", clicked_requestNo); // Append requestNo
        console.log(formData); 

        $.ajax({
            url: "../../php/evaluation_view_php/add_evaluation.php", // Backend PHP file to process data
            method: "POST",
            data: formData,
            processData: false, // Important for FormData
            contentType: false, // Important for FormData
            success: function(response) {
                $('.modal-body-incoming').text('Successfully Submitted.')
                modal_notif.show()
                modal_eval_form.hide()
                fetch_dataTable()
                fetchNotifValue()
            },
            error: function(xhr, status, error) {
                console.error("Submission Error:", error);
            }
        });
    });
})