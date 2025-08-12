<?php
include('../../session.php');
include('../../assets/connection.php');

// Get POST values or set defaults
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
    $baseQuery = "
        SELECT 
            DATE(STR_TO_DATE(requestDate, '%m/%d/%Y - %r')) AS req_date,
            SUM(TIMESTAMPDIFF(MINUTE, STR_TO_DATE(requestDate, '%m/%d/%Y - %r'), STR_TO_DATE(requestEvaluationDate, '%m/%d/%Y - %r')) <= 120) AS on_time,
            SUM(TIMESTAMPDIFF(MINUTE, STR_TO_DATE(requestDate, '%m/%d/%Y - %r'), STR_TO_DATE(requestEvaluationDate, '%m/%d/%Y - %r')) > 120) AS exceeded
        FROM job_order_request
        WHERE (requestStatus = 'Completed' OR requestStatus = 'Evaluation')
          AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
              BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
              AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
    ";

    // Add filters if not ALL
    if ($category !== 'ALL') {
        $baseQuery .= " AND requestCategory = :category";
        if ($subCategory !== "none") {
            $baseQuery .= " AND requestSubCategory = :subCategory";
        }
    }

    $baseQuery .= " GROUP BY req_date ORDER BY req_date ASC";

    $stmt = $pdo->prepare($baseQuery);

    // Bind values
    $params = [
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ];

    if ($category !== 'ALL') {
        $params[':category'] = $category;
        if ($subCategory !== "none") {
            $params[':subCategory'] = $subCategory;
        }
    }

    $stmt->execute($params);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
    // echo json_encode([
    //     'a' => $startDate,
    //     'b' => $endDate,
    // ]);


} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

