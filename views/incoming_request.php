<?php 
    include('../session.php');
    include('../assets/connection.php');

    // echo '<pre>'; print_r($_SESSION); echo '</pre>';
    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestStartDate=null, requestEvaluationDate=null, requestCompletedDate=null, requestJobRemarks=null, requestEvaluation=null WHERE requestNo=2";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestStartDate=null, requestEvaluationDate=null, requestCompletedDate=null, requestJobRemarks=null, requestEvaluation=null WHERE requestNo=3";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestStartDate=null, requestEvaluationDate=null, requestCompletedDate=null, requestJobRemarks=null, requestEvaluation=null WHERE requestNo=14";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestStartDate=null, requestEvaluationDate=null, requestCompletedDate=null, requestCorrectionDate=null, requestCorrection=null, requestJobRemarks=null, requestEvaluation=null WHERE requestNo=13";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "DELETE FROM job_order_request";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "SELECT * FROM job_order_request";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();
    // $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // echo "<pre>"; print_r($data); "</pre>";

    $sql = "SELECT PGSDivisionName, PGSDivisionID FROM pgsdivision";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $division_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT sectionName, division FROM pgssection";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $section_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // echo $_SESSION['name'];

    // $sql = "DELETE FROM job_order_request WHERE requestNo='EU-2025-06-002'";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    // $sql = "DELETE FROM job_order_request WHERE requestNo='EU-2025-06-001'";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EFMS-APP</title>
    <link rel="stylesheet" href="../css/incoming_request.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/navbar.css">

    <?php require "../links/header_link.php" ?>

</head>
<body>
    
    <?php 
        $view = "incoming-request-sub-div";
        $sub_view = "none";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <?php 
            // $view = "Incoming Request";
            // include("./navbar.php");
        ?>

        <div class="search-div">

            <div class="top-div">

                <input type="text" class="form-control" id="job-no-input" placeholder="Job Order No." autocomplete="off">

                <select class="form-control" id="division-select">
                    <option value="" disabled selected>Select Division</option>
                    <?php foreach ($division_data as $division): ?>
                        <option value="<?= htmlspecialchars($division['PGSDivisionID']) ?>">
                            <?= htmlspecialchars($division['PGSDivisionName']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                
                <select class="form-control" id="section-select">
                    <option value="" disabled selected>Select Section</option>
                </select>

                <input type="text" class="form-control" id="lastname-input" placeholder="Last Name" autocomplete="off">
                <input type="text" class="form-control" id="firstname-input" placeholder="First Name" autocomplete="off">
                
            </div>

            <div class="bottom-div">
                <input type="number" class="form-control" id="bioId-input" placeholder="Biometric ID" autocomplete="off">

                <select class="form-control" id="status-select">
                    <option value="" disabled selected>Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="on-process">On-Process</option>
                    <option value="evaluation">For Evaluation</option>
                    <option value="completed">Completed</option>
                </select>

                <select class="form-control" id="technician-select">
                    <option value="" disabled selected>Select IMISS Technician</option>
                </select>

                <select class="form-control" id="requestType-select">
                    <option value="" disabled selected>Select Request Type</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="met">MET</option>
                </select>

                <input type="date" class="form-control" id="dateFrom-input">
                <span>to</span>
                <input type="date" class="form-control" id="dateTo-input">

                <button type="button" class="btn btn-success" id="search-btn">Search</button>
            </div>
        </div>

        <div class="table-div">
            <div class="nav-request-div">
                <button class="nav-btn" id="request-list-btn">
                    Job Order List
                    <span id="jobOrder-notif-span"></span>
                </button>
                <div class="my-job-order-div">
                    <button class="nav-btn" id="your-job-btn">
                        My Job Order
                        <span id="your-job-notif-span"></span>
                    </button> 

                    <div id="your-job-sub-btns">
                        <button class="your-job-sub-btn" id="your-job-on-process-btn">
                            On-Process
                            <span id="on-process-notif-span">0</span>
                        </button>
                        <button class="your-job-sub-btn" id="your-job-correction-btn">
                            Correction
                            <span id="correction-notif-span">0</span>
                        </button>
                        <button class="your-job-sub-btn" id="your-job-for-evaluation-btn">
                            For Evaluation
                            <span id="for-evaluation-notif-span">0</span>
                        </button>
                        <button class="your-job-sub-btn" id="your-job-completed-btn">
                            Completed
                            <span id="completed-notif-span">0</span>
                        </button>
                        <button id="your-job-close-btn">Close</button>
                    </div>
                </div>
            </div>

            <!-- <div class="sub-table-nav">
                <button id="on-process-sub-btn">
                    On-Process 
                    <span id="on-process-notif-span">0</span>
                </button>
                <button id="for-evaluation-sub-btn">
                    For Evaluation
                    <span id="for-evaluation-notif-span"></span>
                </button>
                <button id="completed-sub-btn">
                    Completed
                    <span id="completed-notif-span"></span>
                </button>
            </div> -->

            <div class="table-container">
                <table id="incoming-req-table" class="display">
                    <thead>
                        <tr >
                            <th>REQUEST NO.</th>
                            <th>NAME OF REQUESTER</th>
                            <th>DATE REQUESTED</th>
                            <th>UNIT</th>
                            <th>CATEGORY</th>
                        </tr>
                    </thead>

                    <tbody>
                    
                    </tbody>
                </table>
            </div>
        </div>
    </div>


    <div class="modal fade custom-modal-size" id="user-info-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered"> <!-- Smaller Modal Size -->
            <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                    <h5 class="modal-title" id="user-info-modal-label">User & Job Order Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body">
                    <!-- User Information -->
                    <div class="main-information">

                        <div class="user-info">
                            <i class="" id="user-image"></i>

                            <div class="user-details">
                                <p><strong> <span id="user-what">Requester</span> Name:</strong> <span id="user-name">John Marvin Nepomuceno</span></p>
                                <p><strong>BioID:</strong> <span id="user-bioid">4497</span></p>
                                <p><strong>Division:</strong> <span id="user-division">Finance Division</span></p>
                                <p><strong>Section:</strong> <span id="user-section">Accounting Section</span></p>
                            </div>
                        </div>

                        <!-- Job Order Information -->
                        <div class="job-order-info">
                            <h5 class="info-heading">Job Order Request Information</h5>
                            <p><strong>Job Order ID:</strong> <span id="job-order-id">JO-2025-001</span></p>
                            <p><strong>Date Requested:</strong> <span id="date-requested">March 11, 2025</span></p>
                            <p><strong>Request Type:</strong> <span id="request-type">IT Support</span></p>
                        </div>
                    </div>

                    <div class="request-description">
                        <h5 class="info-heading">Request Description</h5>
                        <p id="request-description">
                            The workstation in the accounting office has encountered a persistent issue where the system fails to load critical accounting software.
                        </p>
                    </div>

                    <div class="assessment-section">
                        <div class="tech-btns">
                            <button id="diagnosis-btn">Diagnosis</button>
                            <button id="correction-btn">Correction</button>
                        </div>
                        <textarea class="assessment-textarea" placeholder="Enter Diagnosis details..."></textarea>
                    </div>

                    <div class="tech-assessment-section">
                        <h5 class="info-heading">Technician Remarks Details</h5>
                        <div class="tech-info-assessment">
                            <span><b>Technician Name:</b> <i id="tech-name-i"></i></span>
                            <span><b>Reception Date:</b> <i id="reception-date-i"></i></span>
                        </div>
                        <textarea class="tech-remarks-textarea" placeholder="Enter remarks details..."></textarea>
                    </div>
                    
                     <div class="assign-to-div">
                        <h5 class="info-heading">Assign Job Order</h5>
                        <div class="mb-3">
                            <label for="assign-tech-select" class="form-label">Select Technician</label>
                            <select id="assign-tech-select" class="form-select">
                                <option value="">Select Technician</option>
                                <!-- Options will be populated dynamically -->
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="assign-to-modal-tech-remarks" class="form-label">Remarks</label>
                            <textarea id="assign-to-modal-tech-remarks" class="form-control" rows="3" placeholder="Enter remarks details. Input at least 10 characters..."></textarea>
                        </div>
                    </div>

                    <div class="function-btn">
                        <button id="rtr-assess-btn" class="btn btn-success">Return to Requestor</button>
                        <button id="start-assess-btn" class="btn btn-success">Start Job</button>
                        <button id="assign-assess-btn" class="btn btn-secondary">Assign To</button>
                    </div>

                   
                </div>


                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modal-notif" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">Your Cart</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    
                </div>
                <div class="modal-footer">
                    <button id="close-modal-btn-incoming" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                </div>
            </div>
        </div>
    </div>


    <?php require "../links/script_links.php" ?>

    

    <script src="../assets/script.js?v=<?php echo time(); ?>"></script>

    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/incoming_request_js/incoming_request.js?php echo time(); ?>"></script>
    <script src="../js/incoming_request_js/incoming_request_traverse.js?php echo time(); ?>"></script>

    <!-- <script src="../js/home_traverse.js?v=<?php echo time(); ?>"></script> -->
    <!-- <script src="../js/home_function.js?v=<?php echo time(); ?>"></script> -->
                
    <script>
        var section_data = <?php echo json_encode($section_data); ?>;
        var division_data = <?php echo json_encode($division_data); ?>;
    </script>
</body>
</html>
 