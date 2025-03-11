if (window.dateTimeInterval) {
    clearInterval(window.dateTimeInterval);
}

function updateDateTime() {
    let now = new Date();
    let formattedDate = now.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).replace(',', ' -'); 

    let dateElement = document.getElementById("date-val-id");
    if (dateElement) {
        dateElement.innerText = formattedDate;
    } else {
        clearInterval(window.dateTimeInterval);
    }
}

window.dateTimeInterval = setInterval(updateDateTime, 1000);

$(document).ready(function(){
    window.selectedCategory = "";
    $("#predefined-concerns").select2({
        placeholder: "Search for a concern...",
        allowClear: true
    });


    // Handle predefined concerns selection
    $("#predefined-concerns").on("change", function () {
        let selectedConcernText = $(this).find("option:selected").text(); // Get the text, not the value
        let selectedConcernValue = $(this).val(); // Get the category
    
        if (selectedConcernText) {
            $("#description-val-id").val(selectedConcernText).trigger("input"); // Set text & trigger event
            selectCategory(selectedConcernValue); // Auto-select category
        }
    
        checkIfCategorySelected();
    });

    // Handle category button clicks
    $(".infra-btn").on("click", function () {
        $("#predefined-concerns").val("").trigger("change");
        selectedCategory = $(this).data("category");
        highlightSelectedCategory($(this));
        checkIfCategorySelected();

        if($("#description-val-id").val() === "-- Select Concern --") {
            $("#description-val-id").val("")
        }
    });

    function selectCategory(category) {
        $(".infra-btn").each(function () {
            if ($(this).data("category") === category) {
                highlightSelectedCategory($(this));
                selectedCategory = category;
            }
        });
    }

    function highlightSelectedCategory($selectedButton) {
        $(".infra-btn").css("opacity", "0.5"); 
        $selectedButton.css("opacity", "1"); 
    }

    function checkIfCategorySelected() {
        if (selectedCategory) {
            $("#submit-btn").prop("disabled", false);
        } else {
            $("#submit-btn").prop("disabled", true);
        }
    }

    function checkDescriptionLength() {
        if ($("#description-val-id").val().length > 10) {
            $("#submit-btn").css("pointer-events", "auto"); 
            $("#submit-btn").css("opacity", "1"); 
        } else {
            $("#submit-btn").css("pointer-events", "none"); 
            $("#submit-btn").css("opacity", "0.7"); 

        }
    }

    $("#description-val-id").on("input", checkDescriptionLength);
})