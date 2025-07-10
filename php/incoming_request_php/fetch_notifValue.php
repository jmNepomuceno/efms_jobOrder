<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT 
        SUM(CASE WHEN requestStatus = 'Pending' THEN 1 ELSE 0 END) AS count_pending,
        SUM(CASE WHEN requestStatus = 'On-Process' THEN 1 ELSE 0 END) AS count_onProcess,
        SUM(CASE WHEN requestStatus = 'Evaluation' THEN 1 ELSE 0 END) AS count_evaluation,
        SUM(CASE WHEN requestStatus = 'Completed' THEN 1 ELSE 0 END) AS count_completed,
        (SELECT COUNT(*) FROM job_order_request WHERE requestStatus = 'Pending' AND processedBy IS NULL) AS count_incoming
    FROM job_order_request 
    WHERE processedBy = ? OR processedBy IS NULL";

$stmt = $pdo->prepare($sql);
$stmt->execute([$_SESSION['name']]);
$data = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($data); // Send JSON response

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
