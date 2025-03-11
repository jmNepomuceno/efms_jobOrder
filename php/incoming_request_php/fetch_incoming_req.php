<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT requestID, requestDate, requestBy, requestDescription, requestStatus, requestCategory FROM job_order_request WHERE requestStatus='Pending'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Decode the `requestBy` field for each entry
    foreach ($data as &$row) {
        if (!empty($row['requestBy'])) {
            $row['requestBy'] = json_decode($row['requestBy'], true);  // Decodes into an associative array
        }
    }

    echo json_encode($data);

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
