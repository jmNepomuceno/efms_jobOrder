<?php 
    include('../session.php');
    include('../assets/connection.php');

    // echo '<pre>'; print_r($_SESSION); echo '</pre>';
    // $sql = "UPDATE job_order_request SET requestStatus='Pending', processedBy=null, requestStartDate=null, requestCompletedDate=null, requestJobRemarks=null WHERE requestNo=2";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    $sql = "SELECT * FROM job_order_request";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<pre>"; print_r($data); "</pre>";
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
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <?php 
            include("./navbar.php");
        ?>

        <div class="search-div">

            <div class="top-div">

                <input type="text" class="form-control" id="job-no-input" placeholder="Job Order No." autocomplete="off">
                <select class="form-control" id="division-select">
                    <option value="" disabled selected>Select Division</option>
                </select>
                <select class="form-control" id="section-select">
                    <option value="" disabled selected>Select Section\Department</option>
                </select>

                <input type="text" class="form-control" id="lastname-input" placeholder="Last Name" autocomplete="off">
                <input type="text" class="form-control" id="firstname-input" placeholder="First Name" autocomplete="off">
                
            </div>

            <div class="bottom-div">
                <input type="number" class="form-control" id="bioId-input" placeholder="Biometric ID" autocomplete="off">

                <select class="form-control" id="status-select">
                    <option value="" disabled selected>Select Status</option>
                </select>

                <select class="form-control" id="technician-select">
                    <option value="" disabled selected>Select IMISS Technician</option>
                </select>

                <select class="form-control" id="requestType-select">
                    <option value="" disabled selected>Select Request Type</option>
                </select>

                <input type="date" class="form-control" id="dateFrom-input">
                <span>to</span>
                <input type="date" class="form-control" id="dateTo-input">

                <button type="button" class="btn btn-success" id="search-btn">Search</button>
            </div>
        </div>

        <div class="table-div">
            <div class="nav-request-div">
                <button id="request-list-btn">Job Order List</button>
                <button id="your-job-btn">
                    Your Job
                    <span id="your-job-notif-span"></span>
                </button>
            </div>
            <div class="table-container">
                <table id="incoming-req-table" class="display">
                    <thead>
                        <tr >
                            <th>REQUEST NO.</th>
                            <th>NAME OF REQUESTER</th>
                            <th>DATE REQUESTED</th>
                            <th>REQUEST TYPE</th>
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
                             <i class="fa-solid fa-user"></i>
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
                    

                    <button id="start-assess-btn" class="btn btn-success">Start Job</button>
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

    <script> </script>
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/incoming_request_js/incoming_request.js?php echo time(); ?>"></script>
    <script src="../js/incoming_request_js/incoming_request_traverse.js?php echo time(); ?>"></script>
    <!-- <script src="../js/home_traverse.js?v=<?php echo time(); ?>"></script> -->
    <!-- <script src="../js/home_function.js?v=<?php echo time(); ?>"></script> -->
                
</body>
</html>
 