<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT requestNo, requestDate, requestStartDate, requestDescription, requestCategory FROM job_order_request WHERE requestStatus='On-Process' AND processedBy=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['name']]);
    $my_jobs_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    for($i = 0; $i < count($my_jobs_data); $i++){
        $my_jobs_data[$i]["access_by"]['name'] = $_SESSION['name'];
        $my_jobs_data[$i]["access_by"]['bioID'] = $_SESSION['user'];
        $my_jobs_data[$i]["access_by"]['divisionName'] = $_SESSION['divisionName'];
        $my_jobs_data[$i]["access_by"]['sectionName'] = $_SESSION['sectionName'];
    }
    
    echo json_encode($my_jobs_data);

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
