$(document).ready(function(){
    let draggables = document.querySelectorAll(".draggable");
    let containers = document.querySelectorAll(".container");

    draggables.forEach(draggable => {
        draggable.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text/plain", this.id); // Store only the ID
            setTimeout(() => this.classList.add("hide"), 0); // Hide the element while dragging
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
            this.appendChild(draggedElement); // Move the element (not copy)
        });
    });
})