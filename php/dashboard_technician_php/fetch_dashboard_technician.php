<?php
include('../../session.php');
include('../../assets/connection.php');

// Get POST values
$startDate = !empty($_POST['startDate']) ? $_POST['startDate'] : date('Y-m-d');
$endDate = !empty($_POST['endDate']) ? $_POST['endDate'] : date('Y-m-d', strtotime($startDate . ' +1 day'));
$category = $_POST['category'] ?? "ALL";
$subCategory = !empty($_POST['subCategory']) ? $_POST['subCategory'] : "none";

// 🔧 Override for testing
$startDate = '2025-05-21';
$endDate = '2025-10-21';

$startDateFormatted = date('m/d/Y', strtotime($startDate));
$endDateFormatted = date('m/d/Y', strtotime($endDate));

try {
    // 🧮 1️⃣ DAILY STATS QUERY (same as before)
    $dailyQuery = "
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

    if ($category !== 'ALL') {
        $dailyQuery .= " AND requestCategory = :category";
        if ($subCategory !== "none") {
            $dailyQuery .= " AND requestSubCategory = :subCategory";
        }
    }

    $dailyQuery .= " GROUP BY req_date ORDER BY req_date ASC";

    $stmt1 = $pdo->prepare($dailyQuery);
    $params = [':startDate' => $startDateFormatted, ':endDate' => $endDateFormatted];
    if ($category !== 'ALL') {
        $params[':category'] = $category;
        if ($subCategory !== "none") $params[':subCategory'] = $subCategory;
    }
    $stmt1->execute($params);
    $dailyStats = $stmt1->fetchAll(PDO::FETCH_ASSOC);

    // 🧩 2️⃣ TECHNICIAN PERFORMANCE + EVALUATION SUMMARY
    $techQuery = "
        SELECT 
            ANY_VALUE(j.processedBy) AS tech_name,
            j.processedByID AS tech_bio_id,
            COUNT(*) AS total_jobs,
            SUM(CASE WHEN j.requestStatus IN ('Completed', 'Evaluation') THEN 1 ELSE 0 END) AS completed_jobs,
            SUM(CASE 
                WHEN TIMESTAMPDIFF(MINUTE,
                    STR_TO_DATE(j.requestDate, '%m/%d/%Y - %r'),
                    STR_TO_DATE(j.requestEvaluationDate, '%m/%d/%Y - %r')
                ) <= 120 THEN 1 ELSE 0 END
            ) AS on_time,
            SUM(CASE 
                WHEN TIMESTAMPDIFF(MINUTE,
                    STR_TO_DATE(j.requestDate, '%m/%d/%Y - %r'),
                    STR_TO_DATE(j.requestEvaluationDate, '%m/%d/%Y - %r')
                ) > 120 THEN 1 ELSE 0 END
            ) AS exceeded,
            ROUND(AVG(
                TIMESTAMPDIFF(MINUTE,
                    STR_TO_DATE(j.requestDate, '%m/%d/%Y - %r'),
                    STR_TO_DATE(j.requestEvaluationDate, '%m/%d/%Y - %r')
                )
            ) / 60, 2) AS avg_time_hours,
            ROUND(
                (SUM(CASE WHEN j.requestStatus IN ('Completed', 'Evaluation') THEN 1 ELSE 0 END) / COUNT(*)) * 100,
                1
            ) AS completion_rate,

            -- 🧮 Evaluation: convert text to numeric (Very Satisfactory=5, Satisfactory=4, etc.)
            COUNT(j.requestEvaluation) AS rating_count,
            ROUND(AVG(
                (
                    CASE JSON_UNQUOTE(JSON_EXTRACT(j.requestEvaluation, '$.q1'))
                        WHEN 'Very Satisfactory' THEN 5
                        WHEN 'Satisfactory' THEN 4
                        WHEN 'Fair' THEN 3
                        WHEN 'Poor' THEN 2
                        WHEN 'Very Poor' THEN 1
                        ELSE NULL
                    END +
                    CASE JSON_UNQUOTE(JSON_EXTRACT(j.requestEvaluation, '$.q2'))
                        WHEN 'Very Satisfactory' THEN 5
                        WHEN 'Satisfactory' THEN 4
                        WHEN 'Fair' THEN 3
                        WHEN 'Poor' THEN 2
                        WHEN 'Very Poor' THEN 1
                        ELSE NULL
                    END +
                    CASE JSON_UNQUOTE(JSON_EXTRACT(j.requestEvaluation, '$.q3'))
                        WHEN 'Very Satisfactory' THEN 5
                        WHEN 'Satisfactory' THEN 4
                        WHEN 'Fair' THEN 3
                        WHEN 'Poor' THEN 2
                        WHEN 'Very Poor' THEN 1
                        ELSE NULL
                    END +
                    CASE JSON_UNQUOTE(JSON_EXTRACT(j.requestEvaluation, '$.q4'))
                        WHEN 'Very Satisfactory' THEN 5
                        WHEN 'Satisfactory' THEN 4
                        WHEN 'Fair' THEN 3
                        WHEN 'Poor' THEN 2
                        WHEN 'Very Poor' THEN 1
                        ELSE NULL
                    END +
                    CASE JSON_UNQUOTE(JSON_EXTRACT(j.requestEvaluation, '$.q5'))
                        WHEN 'Very Satisfactory' THEN 5
                        WHEN 'Satisfactory' THEN 4
                        WHEN 'Fair' THEN 3
                        WHEN 'Poor' THEN 2
                        WHEN 'Very Poor' THEN 1
                        ELSE NULL
                    END
                ) / 5
            ), 2) AS avg_rating
        FROM job_order_request j
        WHERE j.requestStatus IN ('Completed', 'Evaluation')
        AND STR_TO_DATE(j.requestDate, '%m/%d/%Y - %r') 
            BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y')
            AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
    ";

    if ($category !== 'ALL') {
        $techQuery .= " AND j.requestCategory = :category";
        if ($subCategory !== "none") {
            $techQuery .= " AND j.requestSubCategory = :subCategory";
        }
    }

    $techQuery .= " GROUP BY j.processedByID ORDER BY completed_jobs DESC";


    $stmt2 = $pdo->prepare($techQuery);
    $stmt2->execute($params);
    $techSummary = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    // 🧭 3️⃣ ASSIGNMENT FLOW NETWORK DATA
    $assignFlowQuery = "
        SELECT 
            ANY_VALUE(assignBy) AS assign_by,
            ANY_VALUE(assignTo) AS assign_to,
            COUNT(*) AS total_assigned
        FROM job_order_request
        WHERE assignBy IS NOT NULL 
          AND assignTo IS NOT NULL
          AND assignBy <> ''
          AND assignTo <> ''
          AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
              BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y')
              AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
    ";

    if ($category !== 'ALL') {
        $assignFlowQuery .= " AND requestCategory = :category";
        if ($subCategory !== "none") {
            $assignFlowQuery .= " AND requestSubCategory = :subCategory";
        }
    }

    $assignFlowQuery .= " GROUP BY assignBy, assignTo ORDER BY total_assigned DESC";

    $stmt3 = $pdo->prepare($assignFlowQuery);
    $stmt3->execute($params);
    $assignmentFlow = $stmt3->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'daily_stats' => $dailyStats,
        'technician_summary' => $techSummary,
        'assignment_flow' => $assignmentFlow
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
