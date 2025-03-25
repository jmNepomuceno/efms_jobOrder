let modal_notif = new bootstrap.Modal(document.getElementById('modal-notif'));

let clicked_draggable = {}

// Global variables to track selected employees and multi-select mode
let selectedDraggables = new Set();
let multiSelectEnabled = false;

const drag_function = () => {
    let draggables = document.querySelectorAll(".draggable");
    let containers = document.querySelectorAll(".draggable-container");
    let multiSelectBtn = document.getElementById("multi-select-drag-btn");

    // Toggle Multi-Select Mode
    multiSelectBtn.addEventListener("click", () => {
        multiSelectEnabled = !multiSelectEnabled;
        multiSelectBtn.style.opacity = multiSelectEnabled ? "1" : "0.5";        
        // multiSelectBtn.textContent = multiSelectEnabled ? "Disable Multi-Select" : "Multi Select";

        // Clear selection when disabling multi-select
        if (!multiSelectEnabled) {
            selectedDraggables.forEach(el => el.classList.remove("selected"));
            selectedDraggables.clear();
        }
    });

    // Ensure all elements are draggable
    draggables.forEach(draggable => {
        draggable.setAttribute("draggable", "true");

        // Handle Click for Multi-Select (No need for Ctrl/Cmd)
        draggable.addEventListener("click", function () {
            if (!multiSelectEnabled) return; // Only allow selection in multi-select mode

            if (selectedDraggables.has(this)) {
                // Deselect if already selected
                selectedDraggables.delete(this);
                this.classList.remove("selected");
            } else {
                // Select the item
                selectedDraggables.add(this);
                this.classList.add("selected");
            }
        });

        // Handle Drag Start
        draggable.addEventListener("dragstart", function (event) {
            if (!multiSelectEnabled || !selectedDraggables.has(this)) {
                // If dragging without multi-select, reset selected items
                selectedDraggables.forEach(el => el.classList.remove("selected"));
                selectedDraggables.clear();
                selectedDraggables.add(this);
            }

            // Store selected items
            event.dataTransfer.setData("text/plain", [...selectedDraggables].map(el => el.id).join(","));
            setTimeout(() => selectedDraggables.forEach(el => el.classList.add("hide")), 0);
        });

        // Handle Drag End
        draggable.addEventListener("dragend", function () {
            selectedDraggables.forEach(el => el.classList.remove("hide"));
        });
    });

    containers.forEach(container => {
        container.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        container.addEventListener("drop", function (event) {
            event.preventDefault();
            let draggedElementIDs = event.dataTransfer.getData("text/plain").split(",");

            draggedElementIDs.forEach(id => {
                let draggedElement = document.getElementById(id);
                if (!draggedElement) return;

                draggedElement.classList.add("draggable-done");
                draggedElement.classList.remove("hide");

                clicked_draggable[draggedElement.id] = container.id.replace("-category", "");
                container.appendChild(draggedElement);
            });

            // Clear selection after dropping
            selectedDraggables.forEach(el => el.classList.remove("selected"));
            selectedDraggables.clear();
        });
    });
};


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
                        modal_notif.show();
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

    $(document).off('click', '#refresh-drag-btn').on('click', '#refresh-drag-btn', function() {  
        // console.log(clicked_draggable)

        try {
            $.ajax({
                url: '../php/admin_management_php/fetch_dataEmployees.php',
                method: "POST",
                success: function(response) {
                    try { 
                        console.log(response)
                        if (response != "error") {
                            $('.loader').css('display', 'block'); // Show loader
                            document.querySelector('.free-agents').textContent = ""
                            setTimeout(() => {
                                $('.loader').css('display', 'none'); // Hide loader after 2 seconds
                                document.querySelector('.free-agents').innerHTML = response;
                            }, 2000); 
                        }
                        // // modal_notif.show();
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