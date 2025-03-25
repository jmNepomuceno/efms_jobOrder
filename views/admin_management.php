<?php 
    include('../session.php');
    include('../assets/connection.php');
    include('../assets/mssql_connection.php');

    // $sql = "SELECT bioID, LastName, FirstName, Middle, employmentStatus FROM dbo.tblEmployee WHERE sectionID = 23";
    // $stmt = $pdo2->prepare($sql);
    // $stmt->execute();
    // $data = $stmt->fetchAll(PDO::FETCH_ASSOC);


    // $insert_sql = "INSERT INTO efms_technicians (techBioID, firstName, lastName, middle, employmentStatus) 
    //     VALUES (?, ?, ?, ?, ?)";
    // $insert_stmt = $pdo->prepare($insert_sql);


    // foreach ($data as $row) {
    //     $success = $insert_stmt->execute([
    //         $row['bioID'],
    //         $row['FirstName'],
    //         $row['LastName'],
    //         $row['Middle'],  
    //         $row['employmentStatus'],
    //     ]);
    // }

    // Fetch all employees in one query
    $sql = "SELECT techBioID, firstName, lastName, middle, techCategory FROM efms_technicians";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
    
    

    <?php require "../links/script_links.php" ?>
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/admin_management_js/admin_management.js?php echo time(); ?>"></script>
    <!-- <script src="../js/admin_management_js/admin_management_traverse.js?php echo time(); ?>"></script> -->
</body>
</html>