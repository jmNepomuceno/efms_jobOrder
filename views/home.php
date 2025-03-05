<?php 
    include('../session.php');
    include('../assets/connection.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EFMS-APP</title>
    <link rel="stylesheet" href="../css/home.css">

    <?php require "../links/header_link.php" ?>

</head>
<body>
    
    <?php 
        $view = "inventory-list-sub-div";
        include("./sidebar.php");
    ?>

    <div class="right-container">


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
    <script> 
        
    </script>
    <!-- <script src="../js/home_traverse.js?v=<?php echo time(); ?>"></script> -->
    <!-- <script src="../js/home_function.js?v=<?php echo time(); ?>"></script> -->
                
</body>
</html>
 