<?php
include ('../../session.php');
include('../../assets/connection.php');

$current_date = date('m/d/Y - h:i:s A');
try {
    if($_POST['cancelRequest'] === 'from_correction'){
        $sql = "UPDATE job_order_request SET requestStatus='Cancelled', cancellationDate=? WHERE requestNo=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$current_date, $_POST['requestNo']]);
    }else{
        $sql = "UPDATE job_order_request SET requestStatus='Cancelled', cancellationRequest=?, cancellationDate=? WHERE requestNo=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_POST['cancelRequest'], $current_date, $_POST['requestNo']]);
    }
    
    echo "success";
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}


?>
