<?php 
    include('../../session.php');
    include('../../assets/connection.php');

    $object = $_POST;

    $sql = "INSERT INTO job_order_request (requestDate, requestFrom, requestBy, requestCategory, requestDescription, requestStatus) VALUES (?,?,?,?,?,?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $object["requestDate"],
        $object["requestFrom"],
        $object["requestBy"],
        $object["requestCategory"],
        $object["requestDescription"],            
        $object["requestStatus"],            
    ]);

    // echo json_encode($object);
?>