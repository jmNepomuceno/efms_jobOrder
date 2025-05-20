$(document).ready(function(){

    $(document).off('click', '#diagnosis-btn').on('click', '#diagnosis-btn', function() {        
        $('.assessment-textarea').attr('placeholder', 'Enter diagnosis details...');
        $('#start-assess-btn').text("Start Job")

        $('#correction-btn').css('opacity' , '0.5')
        $('#diagnosis-btn').css('opacity' , '1')

    });

    $(document).off('click', '#correction-btn').on('click', '#correction-btn', function() {        
        $('.assessment-textarea').attr('placeholder', 'Enter correction details...');
        $('#start-assess-btn').text("Send")

        $('#correction-btn').css('opacity' , '1')
        $('#diagnosis-btn').css('opacity' , '0.5')
    });

    let divisionSelect = document.getElementById("division-select");
    let sectionSelect = document.getElementById("section-select");

    // Clear the section dropdown initially
    sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>';

    // Listen for changes in the division select dropdown
    divisionSelect.addEventListener("change", function () {
        let selectedDivisionID = parseInt(this.value); // Get the selected PGSDivisionID
        sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>'; // Reset section dropdown

        // Filter sections where the 'division' field (PGSDivisionID) matches
        let filteredSections = section_data.filter(section => parseInt(section.division) === selectedDivisionID);

        // Populate the section dropdown with matching sections
        filteredSections.forEach(section => {
            let option = document.createElement("option");
            option.value = section.sectionName;
            option.textContent = section.sectionName;
            sectionSelect.appendChild(option);
        });
    });
})

