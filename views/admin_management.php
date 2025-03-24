<?php 
    include('../session.php');
    include('../assets/connection.php');

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="../css/admin_management.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/navbar.css">

    <?php require "../links/header_link.php" ?>

    <title>Document</title>
</head>
<body>

    <?php 
        $view = "admin-management-sub-div";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <?php 
            $view = "Admin Management";
            include("./navbar.php");
        ?>

        <div class="manage-accts-div">
            <div class="container" id="container1">
                <div class="title">Container 1</div>
                <span class="draggable" draggable="true" id="itemA">Item A</span>
                <span class="draggable" draggable="true" id="itemB">Item B</span>
            </div>

            <div class="container" id="container2">
                <div class="title">Container 2</div>
                <span class="draggable" draggable="true" id="itemC">Item C</span>
            </div>

            <div class="container" id="container3">
                <div class="title">Container 3</div>
            </div>

            <div class="container" id="container4">
                <div class="title">Container 4</div>
            </div>
        </div>

       

    </div>
    
    

    <?php require "../links/script_links.php" ?>
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/admin_management_js/admin_management.js?php echo time(); ?>"></script>
    <!-- <script src="../js/admin_management_js/admin_management_traverse.js?php echo time(); ?>"></script> -->
</body>
</html>