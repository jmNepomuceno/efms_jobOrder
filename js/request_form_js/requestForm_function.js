$(document).ready(function(){
    $("#submit-btn").on("click", function () {
        let data = {
            requestDate : $('#date-val-id').text(),
            requestFrom : $('#section-val-id').text(),
            requestCategory: window.selectedCategory,
            requestSubCategory: window.selectedSubCategory,
            requestDescription: $('#description-val-id').val(),
            requestStatus: "Pending",
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
                        // console.log(response)
                        if(response==='success'){
                            modal_notif.show()

                            // reset all the thingy
                            $(".infra-btn").each(function () {
                                $(this).css("opacity", ""); 
                            });
                            $('#predefined-concerns').val("").trigger("change");
                            $('#description-val-id').val("")
                        }
                        else if(response==='pending'){
                            $('#modal-notif #modal-body-incoming').text("Still has a current request pending.")
                            modal_notif.show()
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