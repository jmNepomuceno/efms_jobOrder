<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT requestID, requestDate, requestBy, requestDescription, requestStatus FROM job_order_request WHERE requestFrom=? AND requestStatus='Pending'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['sectionName']]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // Send JSON response
    echo json_encode($data);

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}
?>
