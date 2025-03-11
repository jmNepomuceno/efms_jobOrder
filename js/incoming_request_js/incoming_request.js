const dataTable = () =>{
    try {
        $.ajax({
            url: '../../php/incoming_request_php/fetch_incoming_req.php',
            method: "POST",
            dataType : "json",
            success: function(response) {
                console.log(response)
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
                            `<div><span>${response[i].requestID}</span></div>`,
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
                    console.log(dataSet)

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
    dataTable()
    
})