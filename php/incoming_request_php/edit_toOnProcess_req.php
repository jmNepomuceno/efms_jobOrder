<?php
include ('../../session.php');
include('../../assets/connection.php');

$current_date = date('m/d/Y - h:i:s A');

try {
    $sql = "UPDATE job_order_request SET requestStatus='On-Process', processedBy=?, requestStartDate=? WHERE requestNo=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['name'] ,$current_date , (int)$_POST['requestNo']]);

    // fetch all the start job or on process
    $sql = "SELECT COUNT(*) AS count FROM job_order_request WHERE requestStatus='On-Process' AND processedBy=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['name']]);
    $my_jobs_data = $stmt->fetch(PDO::FETCH_ASSOC);
    $count = $my_jobs_data['count'];

    echo $count;

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
