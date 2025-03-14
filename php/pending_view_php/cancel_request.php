<?php
include ('../../session.php');
include('../../assets/connection.php');

$current_date = date('m/d/Y - h:i:s A');

try {
    $sql = "UPDATE job_order_request SET requestStatus='Cancelled', cancellationRequest=?, cancellationDate=? WHERE requestNo=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_POST['cancelRequest'], $current_date, $_POST['requestNo']]);

    echo "success";
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}


?>
