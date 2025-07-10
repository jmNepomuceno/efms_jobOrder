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

    <link rel="stylesheet" href="../css/dashboard_technicians.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <!-- <link rel="stylesheet" href="../css/navbar.css"> -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <?php require "../links/header_link.php" ?>

    <title>Document</title>
</head>
<body>

    <?php 
        $view = "dashboard-sub-div";
        $sub_view = "tech-dashboard-sub-down-div";
        include("./sidebar.php");
    ?>

    <div class="right-container">
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
                        <div class="vl"></div>

                        <select id="filter-technicians-select">
                            <option value="">-- Select Technicians --</option>
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

                    <div class="request-graph-div" style="overflow-x: auto;">

                        <h4>Bar Graph: Completed Requests Over Time</h4>
                        <canvas id="requestsPerHourChart" width="1500" height="400" ></canvas>
                        
                        <div class="hl"></div>

                        <h4>Job Order Summary</h4>
                        <div class="request-tally-div">
                            <div class="request-tally-sub-div">
                                <span>Total Assigned Jobs</span>
                                <span id="total-assigned-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Completed Jobs</span>
                                <span id="total-request-completed-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total Job Pending</span>
                                <span id="total-request-pending-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total Job Order In-Progress</span>
                                <span id="total-request-onProcess-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total For Correction Jobs</span>
                                <span id="total-request-correction-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Average Time to Completion</span>
                                <span id="total-request-average-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total RTR</span>
                                <span id="total-request-rtr-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Total Unattended Jobs</span>
                                <span id="total-request-unattended-value">0</span>
                            </div>

                            <div class="request-tally-sub-div">
                                <span>Percentage Accomplished</span>
                                <span id="total-request-accomplished-value">0</span>
                            </div>

                        </div>

                        <div class="hl"></div>
                        
                        <h4>Completed Job Orders List</h4>
                        <div class="table-container">
                            <table id="tech-request-dataTable">
                                <thead>
                                    <tr>
                                        <th>REQUEST NO.</th>
                                        <th>NAME OF REQUESTER</th>
                                        <th>DATE REQUESTED</th>
                                        <th>UNIT</th>
                                        <th>CATEGORY</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>

                        <div class="hl"></div>
                        
                        <h4>Completed Job Orders List</h4>
                        <div class="table-container">
                            <table id="tech-eval-table">
                                <thead>
                                    <tr>
                                        <th>Request No</th>
                                        <th>Date</th>
                                        <th>Category</th>
                                        <th>Subcategory</th>
                                        <th>Processed By</th>
                                        <th>Q1</th>
                                        <th>Q2</th>
                                        <th>Q3</th>
                                        <th>Q4</th>
                                        <th>Q5</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
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

    <div class="modal fade" id="modal-view-form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">View Request Form </h5>
                    <h5 id="modal-status-incoming" class="modal-status-incoming" >Completed</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    <div class="main-information">

                        <div class="user-info">
                            <i class="fa-solid fa-user"></i>
                            <div class="user-details">
                                <p><strong> <span id="user-what">Requester</span> Name:</strong> <span id="user-name"></span></p>
                                <p><strong>BioID:</strong> <span id="user-bioid"></span></p>
                                <p><strong>Division:</strong> <span id="user-division"></span></p>
                                <p><strong>Section:</strong> <span id="user-section"></span></p>
                            </div>
                        </div>

                        <!-- Job Order Information -->
                        <div class="job-order-info">
                            <h5 class="info-heading">Job Order Request Information</h5>
                            <p><strong>Job Order ID:</strong> <span id="job-order-id"></span></p>
                            <p><strong>Date Requested:</strong> <span id="date-requested"></span></p>
                            <p><strong>Request Type:</strong> <span id="request-type"></span></p>
                        </div>
                    </div>

                    <div class="request-description">
                        <h5 class="info-heading">Request Description</h5>
                        <p id="request-description">
                        </p>
                    </div>

                    <div class="tech-assessment-section">
                        <h5 class="info-heading">Technician Remarks Details</h5>
                        <div class="tech-info-assessment">
                            <span><b>Technician Name:</b> <i id="tech-name-i"></i></span>
                            <span><b>Reception Date:</b> <i id="reception-date-i"></i></span>
                        </div>
                        <textarea class="tech-remarks-textarea" placeholder="Currently assessing..."></textarea>
                    </div>


                </div>
                <div class="modal-footer">
                    <button id="close-modal-btn" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
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
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/dashboard_technicians_js/dashboard_technicians.js?php echo time(); ?>"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>

</body>
</html>