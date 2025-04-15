var modal_view_form;
var fetch_viewRequestData;

if (!modal_view_form) {
    modal_view_form = new bootstrap.Modal(document.getElementById('modal-view-form'));
}

// modal_view_form.show()
var fetch_dataTable = () =>{
    $.ajax({
        url: '../php/onProcess_view_php/fetch_onProcess.php',
        method: "GET",
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
                        `<div class="date-onProcess-div-td"> 
                            <span><b>Requested Date:</b> ${response[i].requestDate}</span>
                            <span><b>Reception Date:</b> ${response[i].requestStartDate}</span>
                        </div>`,
                        `<span>${response[i].requestCategory}</span>`,
                        `<div class="action-pending-div">
                            <button type="button" class="btn btn-primary view-request-btn">View</button>
                        </div>`
                    ]);
                }
                
                if ($.fn.DataTable.isDataTable('#onProcess-dataTable')) {
                    $('#onProcess-dataTable').DataTable().destroy();
                    $('#onProcess-dataTable tbody').empty(); // Clear previous table body
                }

                $('#onProcess-dataTable').DataTable({
                    destroy: true,
                    data: dataSet,
                    columns: [
                        { title: "JOB ORDER NO." },
                        { title: "NAME OF END USER" },
                        { title: "DATE" },
                        { title: "REQUEST TYPE" },
                        { title: "ACTION" }
                        
                    ],
                    columnDefs: [
                        { targets: 0, createdCell: function(td) { $(td).addClass('onProcess-no-td'); } },
                        { targets: 1, createdCell: function(td) { $(td).addClass('onProcess-name-td'); } },
                        { targets: 2, createdCell: function(td) { $(td).addClass('onProcess-date-td'); } , width:"25%" },
                        { targets: 3, createdCell: function(td) { $(td).addClass('onProcess-reqType-td'); } },
                        { targets: 4, createdCell: function(td) { $(td).addClass('onProcess-action-td'); } },
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

registerSocketHandler((data) => {
    if (data.action === "refreshOnProcessTableUser") {
        fetch_dataTable();  // Refresh the table
    }
});

$(document).ready(function(){
    fetch_dataTable()
    
    $(document).off('click', '.view-request-btn').on('click', '.view-request-btn', function() {
        const index = $('.view-request-btn').index(this);
        const data = fetch_viewRequestData[index]
        console.log(data)
        
        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);
        $('#user-section').text(data.requestBy.section);
    
        $('#job-order-id').text(`JO-${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        $('#tech-name-i').text(data.processedBy)
        $('#reception-date-i').text(data.requestStartDate)
        
        modal_view_form.show()
    })
})