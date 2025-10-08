<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $filters = $_POST['filters'] ?? [];
    $what = $filters['what'] ?? null;

    // Fetch user role & category
    $sql = "SELECT role, techCategory FROM efms_technicians WHERE techBioID=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['user']]);
    $tech_data = $stmt->fetch(PDO::FETCH_ASSOC);

    // Base query
    $sql = "SELECT requestNo, requestDate, requestStartDate, requestEvaluationDate, requestCompletedDate,
                   requestCorrectionDate, requestCorrection, requestDescription, requestCategory, requestSubCategory,
                   requestBy, processedBy, requestJobRemarks, assignTo, assignToBioID, assignBy,
                   assignTargetStartDate, assignTargetEndDate
            FROM job_order_request
            WHERE requestStatus = ?";
    $params = [$what];

    // Role restrictions
    if ($tech_data['role'] == 'admin') {
        $sql .= " AND requestCategory = ?";
        $params[] = $tech_data['techCategory'];
    } elseif ($tech_data['role'] != 'super_admin') {
        $sql .= " AND processedBy = ?";
        $params[] = $_SESSION['name'];
    }

    // Dynamic filters
    if (!empty($filters['job_no'])) {
        $sql .= " AND requestNo LIKE ?";
        $params[] = "%" . $filters['job_no'] . "%";
    }

    if (!empty($filters['division'])) {
        $sql .= " AND JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.division')) = ?";
        $params[] = $filters['division'];
    }

    if (!empty($filters['section'])) {
        $sql .= " AND JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.section')) = ?";
        $params[] = $filters['section'];
    }

    if (!empty($filters['lastname']) || !empty($filters['firstname'])) {
        $nameSearch = trim(($filters['lastname'] ?? '') . ' ' . ($filters['firstname'] ?? ''));
        $sql .= " AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.name'))) LIKE ?";
        $params[] = "%" . strtolower($nameSearch) . "%";
    }

    if (!empty($filters['bioID'])) {
        $sql .= " AND CAST(JSON_EXTRACT(requestBy, '$.bioID') AS UNSIGNED) = ?";
        $params[] = $filters['bioID'];
    }


    if (!empty($filters['technician'])) {
        $sql .= " AND assignToBioID = ?";
        $params[] = $filters['technician'];
    }

    if (!empty($filters['requestType'])) {
        $sql .= " AND LOWER(requestSubCategory) LIKE ?";
        $params[] = "%" . strtolower($filters['requestType']) . "%";
    }

    // ✅ Proper date filtering (handles inclusive date range)
    $apply_date_filter = false;
    if (!empty($filters['dateFrom']) && !empty($filters['dateTo'])) {
        $dateFrom = new DateTime($filters['dateFrom']);
        $dateTo = new DateTime($filters['dateTo']);

        // Always include the full "dateTo" day (adds 1 day)
        $dateTo->modify('+1 day');
        $apply_date_filter = true;
    }

    $sql .= " ORDER BY requestDate DESC";

    // Execute query
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $my_jobs_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Category name mapping
    $categoryCodes = array_values(array_unique(array_column($my_jobs_data, 'requestCategory')));
    $categoryDescriptions = [];

    if (!empty($categoryCodes)) {
        $placeholders = implode(',', array_fill(0, count($categoryCodes), '?'));
        $sql = "SELECT category_code, category_description FROM efms_category WHERE category_code IN ($placeholders)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($categoryCodes);
        $categoryDescriptions = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    }

    $filtered_data = [];

    foreach ($my_jobs_data as $row) {
        if (isset($categoryDescriptions[$row['requestCategory']])) {
            $row['requestCategory'] = $categoryDescriptions[$row['requestCategory']];
        }

        if (!empty($row['requestBy'])) {
            $row['requestBy'] = json_decode($row['requestBy'], true);
        }

        // ✅ Filter by date (your format: 10/07/2025 - 08:38:29 AM)
        if ($apply_date_filter) {
            $reqDate = DateTime::createFromFormat('m/d/Y - h:i:s A', $row['requestDate']);
            if ($reqDate instanceof DateTime) {
                if ($reqDate < $dateFrom || $reqDate >= $dateTo) {
                    continue;
                }
            }
        }

        $filtered_data[] = $row;
    }

    echo json_encode($filtered_data);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
