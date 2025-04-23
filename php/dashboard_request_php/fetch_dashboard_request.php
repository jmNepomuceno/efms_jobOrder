<?php
include('../../session.php');
include('../../assets/connection.php');

// Get POST values
$from = $_POST['from'] ?? 'daily_request';
$startDate = $_POST['startDate'] ?? null;
$endDate = $_POST['endDate'] ?? null;

// Convert to MM/DD/YYYY
$startDate = $startDate ? date('m/d/Y', strtotime($startDate)) : null;
$endDate = $endDate ? date('m/d/Y', strtotime($endDate)) : null;

try {
    if ($from === 'daily_request') {
        // Query for one specific date
        $sql = "
            SELECT 
                HOUR(STR_TO_DATE(requestDate, '%m/%d/%Y - %r')) AS hr, 
                COUNT(*) AS total 
            FROM job_order_request 
            WHERE requestStatus = 'Pending' OR requestStatus = 'Completed'
              AND requestDate LIKE CONCAT(:startDate, '%')
            GROUP BY hr
            ORDER BY hr
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':startDate' => $startDate]);

    } else {
        // Query for a range of dates (weekly or monthly)
        $sql = "
            SELECT 
                HOUR(STR_TO_DATE(requestDate, '%m/%d/%Y - %r')) AS hr, 
                COUNT(*) AS total 
            FROM job_order_request 
            WHERE requestStatus = 'Pending' OR requestStatus = 'Completed'
            AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
                BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
                    AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
            GROUP BY hr
            ORDER BY hr
        ";


        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':startDate' => $startDate,
            ':endDate' => $endDate
        ]);
    }

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Prepare hourly array
    $requestsPerHour = array_fill(0, 24, 0);
    foreach ($results as $row) {
        $hour = (int)$row['hr'];
        $requestsPerHour[$hour] = (int)$row['total'];
    }

    echo json_encode($requestsPerHour);

} catch (PDOException $e) {
    die(json_encode(["error" => $e->getMessage()]));
}
?>
