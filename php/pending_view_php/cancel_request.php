<?php
include ('../../session.php');
include('../../assets/connection.php');

$current_date = date('m/d/Y - h:i:s A');

try {
    $sql = "UPDATE job_order_request SET requestStatus='Cancelled', cancellationRequest=?, cancellationDate=? WHERE requestID=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_POST['cancelRequest'], $_POST['requestID'], $current_date]);

    echo "success";
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}


?>
