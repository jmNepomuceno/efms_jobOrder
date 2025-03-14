<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT requestNo, requestDate, requestBy, requestDescription, requestStatus, requestCategory, requestStartDate, processedBy FROM job_order_request WHERE requestFrom=? AND requestStatus='On-Process'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['sectionName']]);
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
