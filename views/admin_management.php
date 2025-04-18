<?php 
    include('../session.php');
    include('../assets/connection.php');
    include('../assets/mssql_connection.php');

    $sql = "SELECT techBioID, firstName, lastName, middle, techCategory FROM efms_technicians";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // echo '<pre>'; print_r($employees);  echo '</pre>';

    // Categorize employees
    $categories = [
        "free_agents" => [],
        "met" => [],
        "carpentry" => [],
        "electrical" => [],
        "plumber" => []
    ];

    foreach ($employees as $employee) {
        $category = isset($employee['techCategory']) ? strtolower($employee['techCategory']) : "free_agents";
        if (isset($categories[$category])) {
            $categories[$category][] = $employee;
        }
    }

    // Function to generate draggable span elements
    function generateDraggableSpans($employees, $extraClass = "") {
        $output = "";
        foreach ($employees as $perHead) {
            $output .= '<span class="draggable ' . $extraClass . '" draggable="true" id="' . $perHead['techBioID'] . '">'
                    . strtoupper($perHead['lastName']) . ', ' . strtoupper($perHead['firstName']) .
                    '</span>';
        }
        return $output;
    }

    // echo '<pre>'; print_r($sample_list);  echo '</pre>';

    // $sql = "DELETE FROM efms_technicians WHERE techBioID=4826";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

    $sql = "UPDATE efms_technicians SET techCategory=null";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
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
            <div class="draft-container-div">
                <h5>Unassign Employees</h5>
                <div class="free-agents">
                    <?= generateDraggableSpans($categories['free_agents']) ? generateDraggableSpans($categories['free_agents']) : "No Data"; ?>
                </div>

                <div class="function-unassign-div">
                    <button id="refresh-drag-btn">Refresh Employee List</button>
                    <button id="multi-select-drag-btn">Multi Select</button>
                </div>

                <div class="loader"></div>

            </div>

            <div class="category-container">
                <?php
                $category_names = ["MET", "CARPENTRY", "ELECTRICAL", "PLUMBER"];
                foreach ($category_names as $category) {
                    $categoryID = strtolower($category);
                    echo '
                    <div class="container">
                        <div class="title">' . $category . '</div>
                        <div class="draggable-container" id="' . $categoryID . '-category">
                            ' . (isset($categories[$categoryID]) ? generateDraggableSpans($categories[$categoryID], "draggable-done") : "") . '
                        </div>
                    </div>';
                }
                ?>
            </div>

            <div class="function-btn">
                <div class="function-sub-btn">
                    <button type="button" class="btn btn-primary" id="add-personel-btn">Add Personnels</button>
                    <button type="button" class="btn btn-primary" id="move-personel-btn">Move Personnels</button>
                </div>
            
                <div class="confirmation-btn">
                    <button type="button" class="btn btn-success" id="save-btn">SAVE</button>
                    <button type="button" class="btn btn-danger" id="cancel-btn">CANCEL</button>
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

    

    <?php require "../links/script_links.php" ?>
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/admin_management_js/admin_management.js?php echo time(); ?>"></script>
    <!-- <script src="../js/admin_management_js/admin_management_traverse.js?php echo time(); ?>"></script> -->
</body>
</html>