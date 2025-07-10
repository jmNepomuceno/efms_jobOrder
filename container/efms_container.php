<?php 
    include('../session.php');
    include('../assets/connection.php');

    $current_date = date('m/d/Y - h:i:s A');

    include('../php/get_section.php');
?>

<div class="efms-container">
    

    <div class="request-form-div">

        <div class="date-div">
            <span id="date-title-id">Request Date and Time:</span>
            <span id="date-val-id"><?php echo $current_date ?></span>
        </div>

        <div class="infra-div">
            <span id="infra-title-id">Select Category:</span>
            <div class="infra-sub-div">
                <div id="infra-1-btn" class="infra-btn" data-category="IU">INFRA/PLANNING UNIT</div>
                <div id="infra-2-btn" class="infra-btn" data-category="EU">ELECTRICAL UNIT</div>
                <div id="infra-3-btn" class="infra-btn" data-category="MU">MECHANICAL UNIT</div>
            </div>
        </div>

        <div class="sub-infra-div">
            <span id="sub-infra-title-id">Common Concerns:</span>
            <select id="sub-infra-select">
                <option value="">-- Select Sub Category --</option>

                <option value="IU">CARPENTRY WORKS</option>
                <option value="IU">FABRICATION</option>
                <option value="IU">MASONRY WORKS</option>
                <option value="IU">WELDING WORKS</option>
                <option value="IU">PAINTING WORKS</option>
                <option value="IU">PLUMBING WORKS</option>
                <option value="IU">ROOFING WORKS</option>
                <option value="IU">CONDEMN/ASSESSMENTS</option>

                <option value="EU">ELECTRICAL WORKS</option>
                <option value="EU">AIRCONDITIONING WORKS</option>
                <option value="EU">REFRIGERATION WORKS (NON MEDICAL)</option>

                <option value="MU">PREVENTIVE MAINTENANCE</option>
                <option value="MU">CALIBRATION</option>
                <option value="MU">REPAIR (MEDICAL & NON MEDICAL)</option>
                <option value="MU">CONDEMN/ASSESSMENT</option>
            </select>

        </div>

        <div class="section-div">
            <span id="section-title-id">Location of Repair:</span>
            <span id="section-val-id"><?php echo $section ?></span>
        </div>

        <div class="description-div">
            <span id="description-title-id">Describe the details of your request: </span>
            <textarea id="description-val-id"></textarea>
        </div>

        <div class="submit-div">
            <button id="submit-btn">SUBMIT</button>
        </div>
    </div>
</div>