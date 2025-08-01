function validateFields() {
    const category = window.selectedCategory;
    const subcategory = window.selectedSubCategory;
    const description = $('#description-val-id').val().trim();

    // Enable the button only if all are filled
    if (category && subcategory && description) {
        $('#submit-btn').css("pointer-events", "auto").css("opacity", "1");
    } else {
        $('#submit-btn').css("pointer-events", "none").css("opacity", "0.7");
    }
}

$(document).ready(function(){
    // Revalidate whenever user types or selects

    $('#description-val-id').on('input', validateFields);
    $('#sub-infra-select').on('change', function () {
        const value = $(this).val();
        const text = $('#sub-infra-select option:selected').text()
        // Only accept valid selections
        if (value !== "") {
            window.selectedSubCategory = text;
        } else {
            window.selectedSubCategory = null;
        }
        validateFields();
    });

    $('.infra-btn').on('click', function () {
        window.selectedCategory = $(this).data('category');
        validateFields();
    });

    $("#submit-btn").on("click", function () {
        const requestCategory = window.selectedCategory;
        const requestSubCategory = window.selectedSubCategory;
        const requestDescription = $('#description-val-id').val().trim();

        if (!requestCategory || !requestSubCategory || !requestDescription) {
            alert("Please complete all fields.");
            return;
        }

        const data = {
            requestDate: $('#date-val-id').text(),
            requestFrom: $('#section-val-id').text(),
            requestCategory,
            requestSubCategory,
            requestDescription,
            requestStatus: "Pending",
        };

        try {
            $.ajax({
                url: '../php/job_order_php/add_jobOrderRequest.php',
                method: "POST",
                data: data,
                success: function(response) {
                    try {
                        if (response === 'success') {
                            modal_notif.show();
                            // Reset fields
                            $(".infra-btn").each(function () {
                                $(this).css("opacity", "");
                            });
                            $('#predefined-concerns').val("").trigger("change");
                            $('#description-val-id').val("");
                        } else if (response === 'pending') {
                            $('#modal-notif #modal-body-incoming').text("Still has a current request pending.");
                            modal_notif.show();
                        }
                        // remove all the glow effects
                        $('.infra-btn').removeClass('active glow-btn').css({
                            'opacity': '0.6',
                            'border': 'none'
                        });
                        $('#sub-infra-select').removeClass('active glow-btn').css({
                            'opacity': '0.6',
                            'border': 'none'
                        });
                        $('#sub-infra-select').prop('disabled', true).empty().append('<option value="">-- Select Sub Category --</option>');
                        window.selectedCategory = null;
                        window.selectedSubCategory = null;
                        $('#submit-btn').css("pointer-events", "none").css("opacity", "0.7");


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