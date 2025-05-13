<?php 
    include('../session.php');
    include('../assets/connection.php');

    $current_date = date('m/d/Y - h:i:s A');

    $section;
    try {
        $sql = "SELECT sectionName FROM pgssection WHERE sectionID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['section']]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $section = $data[0]['sectionName'];
        $_SESSION["sectionName"] = $section;

    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }
?>

<div class="efms-container">
    

    <div class="request-form-div">

        <div class="section-div">
            <span id="section-title-id">Section:</span>
            <span id="section-val-id"><?php echo $section ?></span>
        </div>

        <div class="date-div">
            <span id="date-title-id">Request Date and Time:</span>
            <span id="date-val-id"><?php echo $current_date ?></span>
        </div>

        <div class="infra-div">
            <span id="infra-title-id">Select Category:</span>
            <div class="infra-sub-div">
                <div id="infra-1-btn" class="infra-btn" data-category="planning">INFRA/PLANNING UNIT</div>
                <div id="infra-2-btn" class="infra-btn" data-category="electrical">ELECTRICAL UNIT</div>
                <div id="infra-3-btn" class="infra-btn" data-category="mechanical">MECHANICAL UNIT</div>
            </div>
        </div>

        <div class="pre-concern-div">
            <span id="concern-title-id">Common Concerns:</span>
            <select id="predefined-concerns">
                <option value="">-- Select Concern --</option>

                <!-- Electrical Issues -->
                <option value="Electrical">Broken Bulb</option>
                <option value="Electrical">Flickering Lights</option>
                <option value="Electrical">Power Outlet Not Working</option>
                <option value="Electrical">Circuit Breaker Tripping</option>
                <option value="Electrical">Exposed Wires</option>
                <option value="Electrical">Light Fixture Not Turning On</option>
                <option value="Electrical">Overloaded Power Strip</option>
                <option value="Electrical">Electric Fan Not Working</option>
                <option value="Electrical">Air Conditioner Not Turning On</option>
                <option value="Electrical">Emergency Light Not Functioning</option>

                <!-- Plumbing Issues -->
                <option value="Plumbing">Leaking Pipe</option>
                <option value="Plumbing">Clogged Sink/Drain</option>
                <option value="Plumbing">No Water Supply</option>
                <option value="Plumbing">Running/Leaking Toilet</option>
                <option value="Plumbing">Low Water Pressure</option>
                <option value="Plumbing">Faucet Not Working</option>
                <option value="Plumbing">Water Heater Not Heating</option>
                <option value="Plumbing">Sewer Smell in Restroom</option>
                <option value="Plumbing">Overflowing Drainage</option>
                <option value="Plumbing">Broken Flush Handle</option>

                <!-- Carpentry Issues -->
                <option value="Carpentry">Broken Door Handle</option>
                <option value="Carpentry">Loose Cabinet Hinges</option>
                <option value="Carpentry">Squeaky Door/Flooring</option>
                <option value="Carpentry">Window Frame Damage</option>
                <option value="Carpentry">Stuck or Misaligned Door</option>
                <option value="Carpentry">Loose Wall Panels</option>
                <option value="Carpentry">Broken Chair/Table</option>
                <option value="Carpentry">Cabinet Drawer Not Closing Properly</option>
                <option value="Carpentry">Wooden Surface Cracks</option>
                <option value="Carpentry">Ceiling Panel Falling</option>

                <!-- Mechanical (MET) Issues -->
                <option value="MET">Air Conditioner Not Cooling</option>
                <option value="MET">HVAC System Not Working</option>
                <option value="MET">Exhaust Fan Not Functioning</option>
                <option value="MET">Elevator Not Operating</option>
                <option value="MET">Generator Not Turning On</option>
                <option value="MET">Water Pump Failure</option>
                <option value="MET">Refrigerator Not Cooling</option>
                <option value="MET">Boiler Malfunction</option>
                <option value="MET">Fire Sprinkler System Issue</option>
                <option value="MET">Industrial Fan Not Spinning</option>
            </select>

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