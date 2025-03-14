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
    <link rel="stylesheet" href="../css/job_order.css">
    <link rel="stylesheet" href="../css/sidebar.css">

    <?php require "../links/header_link.php" ?>

</head>
<body>

    <?php if($_SESSION["role"] === 'admin'){?>
        <i class="fa-solid fa-arrow-left" id="return-btn"></i>
    <?php } ?>
    
    <div class="sample-container"></div>

    <div class="nav-main-div">
        <h2>EFMS JOB ORDER REQUEST FORM</h2>

        <div class="nav-div">
            <button class="nav-sub-div" id="request-form-nav-btn">Request Form</button>
            <button class="nav-sub-div" id="pending-nav-btn">Pending</button>
            <button class="nav-sub-div" id="process-nav-btn">On-Process</button>
            <button class="nav-sub-div" id="correction-nav-btn">Correction</button>
            <button class="nav-sub-div" id="return-req-nav-btn">Returned Request</button>
            <button class="nav-sub-div" id="completed-nav-btn">Completed</button>
        </div>
    </div>
    
    <div class="main-container"></div>

    <div class="modal fade" id="modal-notif" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">NOTIFICATION</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    Successfully Submitted
                </div>
                <div class="modal-footer">
                    <button id="close-modal-btn" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                    <!-- <button id="submit-modal-btn" type="button" type="button">SUBMIT</button> -->
                </div>
            </div>
        </div>
    </div>

    
    <?php require "../links/script_links.php" ?>
    <script src="../js/job_order.js?v=<?php echo time(); ?>"></script>
    
    <!-- <script src="../js/home_function.js?v=<?php echo time(); ?>"></script> -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>
        
</body>
</html>
 