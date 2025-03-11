<?php 
    include('../session.php');
    include('../assets/connection.php');

    // echo '<pre>'; print_r($_SESSION); echo '</pre>';
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
    <!-- <script src="../js/home_traverse.js?v=<?php echo time(); ?>"></script> -->
    <!-- <script src="../js/home_function.js?v=<?php echo time(); ?>"></script> -->
                
</body>
</html>
 