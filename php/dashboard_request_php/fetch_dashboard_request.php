<?php
include('../../session.php');
include('../../assets/connection.php');

// Get POST values or default to today if missing
$startDate = !empty($_POST['startDate']) ? $_POST['startDate'] : date('Y-m-d');

if (!empty($_POST['endDate'])) {
    $endDate = $_POST['endDate'];
} else {
    // Default to one day after start date if endDate is not set
    $endDate = date('Y-m-d', strtotime($startDate . ' +1 day'));
}

$category = $_POST['category'] ?? "ALL";
$subCategory = !empty($_POST['subCategory']) ? $_POST['subCategory'] : "none";

// Format for comparison with requestDate in the DB
$startDateFormatted = date('m/d/Y', strtotime($startDate));
$endDateFormatted = date('m/d/Y', strtotime($endDate));

try {
    if ($category === 'ALL') {
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
            ':startDate' => $startDateFormatted,
            ':endDate' => $endDateFormatted
        ]);
    } else {
        if($subCategory !== "none"){
            $sql = "
                SELECT 
                    HOUR(STR_TO_DATE(requestDate, '%m/%d/%Y - %r')) AS hr, 
                    requestStatus,
                    COUNT(*) AS total 
                FROM job_order_request 
                WHERE requestCategory = :category AND requestSubCategory = :subCategory
                AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
                    BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
                    AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
                GROUP BY hr, requestStatus
                ORDER BY hr
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':category' => $category,
                ':subCategory' => $subCategory,
                ':startDate' => $startDateFormatted,
                ':endDate' => $endDateFormatted
            ]);
        }else{
            $sql = "
                SELECT 
                    HOUR(STR_TO_DATE(requestDate, '%m/%d/%Y - %r')) AS hr, 
                    requestStatus,
                    COUNT(*) AS total 
                FROM job_order_request 
                WHERE requestCategory = :category
                AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
                    BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
                    AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
                GROUP BY hr, requestStatus
                ORDER BY hr
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':category' => $category,
                ':startDate' => $startDateFormatted,
                ':endDate' => $endDateFormatted
            ]);
        }
        
    }

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format output into associative array [hour][status] = total count
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
    echo json_encode(["error" => $e->getMessage()]);
}
