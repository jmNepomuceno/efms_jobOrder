<?php 
    include('../session.php');
    include('../assets/connection.php');
    include('../assets/mssql_connection.php');

    $sql = "SELECT techBioID, firstName, lastName, middle, techCategory FROM efms_technicians";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="../css/dashboard_request.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <!-- <link rel="stylesheet" href="../css/navbar.css"> -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <?php require "../links/header_link.php" ?>

    <title>Document</title>
</head>
<body>

    <?php 
        $view = "dashboard-sub-div";
        $sub_view = "req-dashboard-sub-down-div";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <!-- Element	Color	Description
        Base Background	#2e1d18	Main sidebar/dashboard background
        Primary Text	#ffffff	Text color on dark backgrounds
        Secondary Text	#f7f5f3	Lighter muted text, labels
        Card Background	#3a2620	Box/card background panels
        Accent 1 (Warm Orange)	#e3965d	Highlight / chart color
        Accent 2 (Cool Blue)	#5c87b2	Chart color / status
        Success Green (optional)	#6caa6e	For completed or success statuses
        Border/Line Divider	#5a4038	Subtle card separation and dividers
        Hover/Highlight	#5a4038	Sidebar hover or active tab -->

        <div class="dashboard-container">
            <!-- <div class="nav-div">
                <span class="dashboard-request-nav-span-class active" id="total-request-span">Total Requests</span>
                <span class="dashboard-request-nav-span-class" id="daily-request-span">Daily Requests</span>
                <span class="dashboard-request-nav-span-class" id="weekly-request-span">Weekly Requests</span>
                <span class="dashboard-request-nav-span-class" id="monthly-request-span">Monthly Requests</span>
                <span class="dashboard-request-nav-span-class" id="category-request-span">By Category</span>
                <span class="dashboard-request-nav-span-class" id="status-request-span">By Status</span>
                <span class="dashboard-request-nav-span-class" id="survey-request-span">Survey</span>

                <div class="nav-indicator"></div> 
            </div> -->

            <div class="dashboard-content-div">
                <div class="request-conent-div">

                    <div class="filter-category-div">
                        <span>Filter Unit: </span>
                        <button class="filter-category-active" id="all-filter-btn" data-category="ALL">ALL</button>
                        <button id="iu-filter-btn" data-category="IU">INFRA / PLANNING</button>
                        <button id="eu-filter-btn" data-category="EU">ELECTRICAL</button>
                        <button id="mu-filter-btn" data-category="MU">MECHANICAL</button>
                        <div class="vl"></div>
                        <select id="filter-subCategory-select">
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

                    <div class="double-date-div">
                        <div class="start-date-div">
                            <span id="start-date-span">Select Start Date: </span>
                            <input id="start-date-input" type="date">
                        </div>
                        <div class="end-date-div">
                            <span id="end-date-span">Select End Date: </span>
                            <input id="end-date-input" type="date">
                        </div>
                        <button id="filter-date-search-btn" type="button" class="btn btn-secondary">Search</button>
                    </div>

                    <h1>EFMS Requests Dashboard</h1>
                    <div class="request-graph-div">
                        <canvas id="requestsPerHourChart" ></canvas>
                        <div class="request-tally-div">
                            <div class="request-tally-sub-div">
                                <span>Total Job Order Received</span>
                                <span id="total-request-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total Job Order Completed</span>
                                <span id="total-request-completed-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total Job Pending</span>
                                <span id="total-request-pending-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total Job Unattended</span>
                                <span id="total-request-unattended-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total Correction Request</span>
                                <span id="total-request-correction-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total Job Order RTR</span>
                                <span id="total-request-rtr-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total Job Order In-Progress</span>
                                <span id="total-request-onProcess-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Percentage Accomplished</span>
                                <span id="total-request-accomplished-value">0</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="modal fade" id="modal-notif" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">Successfully Updated</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    
                </div>
                <div class="modal-footer">
                    <button id="close-modal-btn-incoming" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 
        //
        total job order recevied
        total job order cpmpleted
        total job pending total job unattended
        total efms for correction request
        total job order reporting
        total job order in-progress
        percetage accomplished
    -->

    

    <?php require "../links/script_links.php" ?>
    <script src="../assets/script.js?v=<?php echo time(); ?>"></script>
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/dashboard_request_js/dashboard_request.js?php echo time(); ?>"></script>
</body>
</html>