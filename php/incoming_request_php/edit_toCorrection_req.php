<?php
include ('../../session.php');
include('../../assets/connection.php');

$current_date = date('m/d/Y - h:i:s A');

try {
    $sql = "UPDATE job_order_request SET requestStatus='Correction', processedBy=?, requestCorrectionDate=?, requestCorrection=? WHERE requestNo=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['name'] ,$current_date ,$_POST['requestJobRemarks'], (int)$_POST['requestNo']]);

    $sql = "SELECT * FROM job_order_request";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($_POST);

    // $sql = "SELECT COUNT(*) AS count FROM job_order_request WHERE requestStatus='On-Process' AND processedBy=?";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute([$_SESSION['name']]);
    // $my_jobs_data = $stmt->fetch(PDO::FETCH_ASSOC);
    // $count_onProcess = $my_jobs_data['count'];

    // $sql = "SELECT COUNT(*) AS count FROM job_order_request WHERE requestStatus='Evaluation' AND processedBy=?";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute([$_SESSION['name']]);
    // $my_jobs_data = $stmt->fetch(PDO::FETCH_ASSOC);
    // $count_evaluation = $my_jobs_data['count'];

    // echo json_encode([
    //     "count_onProcess" => $count_onProcess,
    //     "count_evaluation" => $count_evaluation,
    //     "count_yourJob" => $count_evaluation + $count_onProcess,
    // ]);

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
