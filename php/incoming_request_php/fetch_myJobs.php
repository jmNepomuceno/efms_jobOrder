<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $what = $_POST['what'];
    
    $sql = "SELECT requestNo, requestDate, requestStartDate, requestEvaluationDate, requestCompletedDate, requestDescription, requestCategory, requestBy, processedBy, requestJobRemarks FROM job_order_request WHERE requestStatus=? AND processedBy=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$what,$_SESSION['name']]);
    $my_jobs_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($my_jobs_data as &$row) {
        if (!empty($row['requestBy'])) {
            $row['requestBy'] = json_decode($row['requestBy'], true);  // Decodes into an associative array
        }
    }

    echo json_encode($my_jobs_data);
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
