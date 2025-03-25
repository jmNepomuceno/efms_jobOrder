let clicked_draggable = {}

const drag_function = () => {
    let draggables = document.querySelectorAll(".draggable");
    let containers = document.querySelectorAll(".draggable-container");

    // Ensure all elements are draggable
    draggables.forEach(draggable => {
        draggable.setAttribute("draggable", "true");

        draggable.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text/plain", this.id); // Store only the ID
            setTimeout(() => this.classList.add("hide"), 0); // Hide while dragging
        });

        draggable.addEventListener("dragend", function () {
            this.classList.remove("hide"); // Show again after drop
        });
    });

    containers.forEach(container => {
        container.addEventListener("dragover", function (event) {
            event.preventDefault(); // Allow drop
        });

        container.addEventListener("drop", function (event) {
            event.preventDefault();
            let draggedElementID = event.dataTransfer.getData("text/plain"); // Get ID of dragged element
            let draggedElement = document.getElementById(draggedElementID);
            
            if (!draggedElement) return; // Prevent errors if element is missing

            // Change class to mark as assigned
            draggedElement.classList.add("draggable-done");
            draggedElement.classList.remove("hide");

            // Update category tracking
            clicked_draggable[draggedElement.id] = container.id.replace("-category", "");

            // Append element to new category
            container.appendChild(draggedElement);
        });
    });
}


$(document).ready(function(){
    $(document).off('click', '#add-personel-btn').on('click', '#add-personel-btn', function() {  
        $('#move-personel-btn').css('opacity', '')
        $('#add-personel-btn').css('opacity', '1')

        $('.confirmation-btn').css('display', 'flex')
    })      
    
    $(document).off('click', '#move-personel-btn').on('click', '#move-personel-btn', function() {  
        $('#add-personel-btn').css('opacity', '')
        $('#move-personel-btn').css('opacity', '1')

        $('.confirmation-btn').css('display', 'flex')

        $('.draft-container-div .free-agents .draggable').css('pointer-events', 'auto')
        $('.category-container .container .draggable-container .draggable-done').css('pointer-events', 'auto')
        drag_function()
    })

    $(document).off('click', '#cancel-btn').on('click', '#cancel-btn', function() {  
        $('#add-personel-btn').css('opacity', '')
        $('#move-personel-btn').css('opacity', '1')
        
        $('.confirmation-btn').css('display', 'none')
    })

    $(document).off('click', '#save-btn').on('click', '#save-btn', function() {  
        console.log(clicked_draggable)

        try {
            $.ajax({
                url: '../php/admin_management_php/edit_tech_category.php',
                method: "POST",
                data: { updates: JSON.stringify(clicked_draggable) },
                success: function(response) {
                    try { 
                        console.log("Update response:", response);
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
})