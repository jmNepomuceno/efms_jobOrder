var modal_cancel_form;
var clicked_requestID;

if (!modal_cancel_form) {
    modal_cancel_form = new bootstrap.Modal(document.getElementById('modal-cancel-form'));
}

var fetch_dataTable = () =>{
    $.ajax({
        url: '../php/pending_view_php/fetch_pending.php',
        method: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            try {
                let dataSet = [];
                for (let i = 0; i < response.length; i++) {
                    dataSet.push([
                        `<span class="requestNo-span">${response[i].requestNo}</span>`,
                        `<span>${response[i].requestDate}</span>`,
                        `<span>${response[i].requestBy.name}</span>`,
                        `<span>${response[i].requestDescription}</span>`,
                        `<span class="pending-status-span">${response[i].requestStatus}</span>`,
                        `<div class="action-pending-div">
                            <button type="button" class="btn btn-primary">View</button>
                            <button type="button" class="btn btn-danger cancel-request-btn">Cancel</button>
                        </div>`
                    ]);
                }
                
                if ($.fn.DataTable.isDataTable('#pending-dataTable')) {
                    $('#pending-dataTable').DataTable().destroy();
                    $('#pending-dataTable tbody').empty(); // Clear previous table body
                }

                $('#pending-dataTable').DataTable({
                    destroy: true,
                    data: dataSet,
                    columns: [
                        { title: "JOB ORDER NO." },
                        { title: "REQUESTED DATE" },
                        { title: "EMPLOYEE NAME" },
                        { title: "DESCRIPTION" },
                        { title: "STATUS" },
                        { title: "ACTION" }
                        
                    ],
                    columnDefs: [
                        { targets: 0, createdCell: function(td) { $(td).addClass('request-id-td'); } },
                        { targets: 1, createdCell: function(td) { $(td).addClass('request-date-td'); } },
                        { targets: 2, createdCell: function(td) { $(td).addClass('request-name-td'); } },
                        { targets: 3, createdCell: function(td) { $(td).addClass('request-description-td'); } },
                        { targets: 4, createdCell: function(td) { $(td).addClass('request-status-td'); } },
                        { targets: 5, createdCell: function(td) { $(td).addClass('request-action-td'); } },
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

$(document).ready(function(){
    // pending_view
    fetch_dataTable()
    
    $(document).off('click', '.cancel-request-btn').on('click', '.cancel-request-btn', function() {        
        const index = $('.cancel-request-btn').index(this);
        const requestNo = $('.requestNo-span').eq(index).text()
        clicked_requestNo = requestNo
        modal_cancel_form.show()
    });

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
})