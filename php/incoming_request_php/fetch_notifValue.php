<?php
include ('../../session.php');
include('../../assets/connection.php');

    try {
        $sql = "SELECT role, techCategory
        FROM efms_technicians 
        WHERE techBioID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['user']]);
        $tech_data = $stmt->fetch(PDO::FETCH_ASSOC);

        if($tech_data['role'] == 'super_admin'){
            $sql = "SELECT 
                SUM(CASE WHEN requestStatus = 'Pending' THEN 1 ELSE 0 END) AS count_pending,
                SUM(CASE WHEN requestStatus = 'On-Process' THEN 1 ELSE 0 END) AS count_onProcess,
                SUM(CASE WHEN requestStatus = 'Evaluation' THEN 1 ELSE 0 END) AS count_evaluation,
                SUM(CASE WHEN requestStatus = 'Completed' THEN 1 ELSE 0 END) AS count_completed,
                (SELECT COUNT(*) FROM job_order_request WHERE requestStatus = 'Pending' AND processedBy IS NULL) AS count_incoming
            FROM job_order_request 
            WHERE processedBy = ? OR processedBy IS NULL";
        }
        else{
            $sql = "SELECT 
                SUM(CASE WHEN requestStatus = 'Pending' THEN 1 ELSE 0 END) AS count_pending,
                SUM(CASE WHEN requestStatus = 'On-Process' THEN 1 ELSE 0 END) AS count_onProcess,
                SUM(CASE WHEN requestStatus = 'Evaluation' THEN 1 ELSE 0 END) AS count_evaluation,
                SUM(CASE WHEN requestStatus = 'Completed' THEN 1 ELSE 0 END) AS count_completed,
                (SELECT COUNT(*) FROM job_order_request WHERE requestStatus = 'Pending' AND processedBy IS NULL) AS count_incoming
            FROM job_order_request 
            WHERE (processedBy = ? OR processedBy IS NULL) AND requestCategory = ?";
        
    }

        $stmt = $pdo->prepare($sql);
        if($tech_data['role'] == 'super_admin'){
            $stmt->execute([$_SESSION['name']]);
        }
        else{
            $stmt->execute([$_SESSION['name'], $tech_data['techCategory']]);
        }
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

    //     $sql = "SELECT 
    //         SUM(CASE WHEN requestStatus = 'Pending' THEN 1 ELSE 0 END) AS count_pending,
    //         SUM(CASE WHEN requestStatus = 'On-Process' THEN 1 ELSE 0 END) AS count_onProcess,
    //         SUM(CASE WHEN requestStatus = 'Evaluation' THEN 1 ELSE 0 END) AS count_evaluation,
    //         SUM(CASE WHEN requestStatus = 'Completed' THEN 1 ELSE 0 END) AS count_completed,
    //         (SELECT COUNT(*) FROM job_order_request WHERE requestStatus = 'Pending' AND processedBy IS NULL) AS count_incoming
    //     FROM job_order_request 
    //     WHERE (processedBy = ? OR processedBy IS NULL) AND requestCategory = ?";

    // $stmt = $pdo->prepare($sql);
    // $stmt->execute([$_SESSION['name'], $tech_data['techCategory']]);
    // $data = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($data); // Send JSON response

    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }

?>
