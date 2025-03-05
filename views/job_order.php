

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EFMS-APP</title>
    <link rel="stylesheet" href="../css/job_order.css">

    <?php require "../links/header_link.php" ?>

</head>
<body>
    <div class="sample-container"></div>

    <div class="nav-main-div">
        <h2>EFMS JOB ORDER REQUEST FORM</h2>

        <div class="nav-div">
            <button class="nav-sub-div" id="request-form-nav-btn">Request Form</button>
            <button class="nav-sub-div" id="logs-nav-btn">Logs</button>
            <button class="nav-sub-div" id="pending-nav-btn">Pending</button>
            <button class="nav-sub-div" id="return-req-nav-btn">Returned Request</button>
            <button class="nav-sub-div" id="completed-nav-btn">Completed</button>
        </div>
    </div>
    
    <div class="main-container">
        
        
    </div>
    
    <?php require "../links/script_links.php" ?>
    <script> 
        var user_name = "John Marvin Gomez Nepomuceno";
    </script>

    <script src="../js/job_order.js?v=<?php echo time(); ?>"></script>
    
    <!-- <script src="../js/home_function.js?v=<?php echo time(); ?>"></script> -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>
        
</body>
</html>
 