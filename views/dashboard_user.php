<?php 
    include('../session.php');
    include('../assets/connection.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="../css/dashboard_user.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-3d.js"></script>


    <?php require "../links/header_link.php" ?>

    <title>Document</title>
</head>
<body>

    <?php 
        $view = "dashboard-sub-div";
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
            <div class="nav-div">
                <span class="dashboard-request-nav-span-class active" id="division-request-span">Division</span>
                <span class="dashboard-request-nav-span-class" id="section-request-span">Section</span>
                <!-- <span class="dashboard-request-nav-span-class" id="indi-request-span">Individual</span> -->
                <div class="nav-indicator"></div> <!-- animated underline -->
            </div>

            <div class="dashboard-content-div">
                <?php include("../container/dashboard_user_containers/division_request.php"); ?>
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

    

    <?php require "../links/script_links.php" ?>
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/dashboard_user_js/dashboard_user.js?php echo time(); ?>"></script>
</body>
</html>