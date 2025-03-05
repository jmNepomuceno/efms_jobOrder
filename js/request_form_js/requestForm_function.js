$(document).ready(function(){
    $("#submit-btn").on("click", function () {
        let data = {
            requestDate : $('#date-val-id').text(),
            requestFrom : $('#section-val-id').text(),
            requestBy: user_name,
            requestCategory: window.selectedCategory,
            requestDescription: $('#description-val-id').val(),
            requestStatus: "Pending",
            // requestStartDate: false,
            // requestCompletedDate: false,
            // processedBy: false,
            // requestJobMarks: false,
            // taskAssignedTo: false,
        }

        console.log(data)

        try {
            $.ajax({
                url: '../php/job_order_php/add_jobOrderRequest.php',
                method: "POST",
                data: data,
                // dataType : 'json',
                success: function(response) {
                    try { 
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

    });
})