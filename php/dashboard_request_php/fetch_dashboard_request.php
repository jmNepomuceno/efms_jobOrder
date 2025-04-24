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
                requestStatus,
                COUNT(*) AS total 
            FROM job_order_request 
            WHERE requestDate LIKE CONCAT(:startDate, '%')
            GROUP BY hr, requestStatus
            ORDER BY hr
        ";


        $stmt = $pdo->prepare($sql);
        $stmt->execute([':startDate' => $startDate]);

    } 
    else if ($from === 'total_request_overall'){
        // get the overall request
        $sql = "
            SELECT 
                HOUR(STR_TO_DATE(requestDate, '%m/%d/%Y - %r')) AS hr, 
                requestStatus,
                COUNT(*) AS total 
            FROM job_order_request 
            GROUP BY hr, requestStatus
            ORDER BY hr
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        
    }
    else {
        // Query for a range of dates (weekly or monthly)
        $sql = "
            SELECT 
                HOUR(STR_TO_DATE(requestDate, '%m/%d/%Y - %r')) AS hr, 
                requestStatus,
                COUNT(*) AS total 
            FROM job_order_request 
            WHERE STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
                BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
                AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
            GROUP BY hr, requestStatus
            ORDER BY hr
        ";


        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':startDate' => $startDate,
            ':endDate' => $endDate
        ]);
    }

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Initialize structured array
    $requestsPerHourStatus = [];

    foreach ($results as $row) {
        $hour = (int)$row['hr'];
        $status = $row['requestStatus'];
        $total = (int)$row['total'];

        if (!isset($requestsPerHourStatus[$hour])) {
            $requestsPerHourStatus[$hour] = [];
        }

        $requestsPerHourStatus[$hour][$status] = $total;
    }

    echo json_encode($requestsPerHourStatus);

} catch (PDOException $e) {
    die(json_encode(["error" => $e->getMessage()]));
}
?>
