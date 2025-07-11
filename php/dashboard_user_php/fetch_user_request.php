<?php
include('../../session.php');
include('../../assets/connection.php');

$startDate = !empty($_POST['startDate']) ? $_POST['startDate'] : date('Y-m-d');
$endDate = !empty($_POST['endDate']) ? $_POST['endDate'] : date('Y-m-d', strtotime($startDate . ' +1 day'));
$divisionID = $_POST['division'] ?? null;
$sectionID = $_POST['section'] ?? null;

$startDate = "2025-05-01";
$endDate = "2025-05-26";
$divisionID = 4;
$sectionID = 12;

$startDateFormatted = date('m/d/Y', strtotime($startDate));
$endDateFormatted = date('m/d/Y', strtotime($endDate));

try {
    // Step 1: Resolve division and section names
    $stmt = $pdo->prepare("SELECT PGSDivisionName FROM pgsdivision WHERE PGSDivisionID = ?");
    $stmt->execute([$divisionID]);
    $divisionName = $stmt->fetchColumn();

    $stmt = $pdo->prepare("SELECT sectionName FROM pgssection WHERE sectionID = ?");
    $stmt->execute([$sectionID]);
    $sectionName = $stmt->fetchColumn();

    if (!$divisionName || !$sectionName) {
        echo json_encode(["error" => "Invalid division or section ID."]);
        exit;
    }

    // Step 2: Get category and subcategory definitions
    $categories = [
        'IU' => ['name' => 'INFRA/PLANNING', 'color' => '#c75c5c'],
        'EU' => ['name' => 'Electrical', 'color' => '#d78c38'],
        'MU' => ['name' => 'MECHANICAL', 'color' => '#4fa3c7'],
    ];

    $excludedSubcategories = ['CARPENTRY WORKS', 'PLUMBING WORKS'];

    // Step 3: Fetch total number of requests for this section
    $sql = "
        SELECT COUNT(*)
        FROM job_order_request
        WHERE JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.division')) = :division
          AND JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.section')) = :section
          AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r')
              BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y')
              AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':division' => $divisionName,
        ':section' => $sectionName,
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);
    $totalRequests = (int)$stmt->fetchColumn();

    // Step 4: Category-wise percentage
    $sql = "
        SELECT requestCategory, COUNT(*) AS total
        FROM job_order_request
        WHERE JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.division')) = :division
          AND JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.section')) = :section
          AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r')
              BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y')
              AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
        GROUP BY requestCategory
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':division' => $divisionName,
        ':section' => $sectionName,
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);

    $categoryPie = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $code = $row['requestCategory'];
        if (isset($categories[$code])) {
            $percent = $totalRequests > 0 ? round(($row['total'] / $totalRequests) * 100, 2) : 0;
            $categoryPie[] = [
                'name' => $categories[$code]['name'],
                'y' => $percent,
                'color' => $categories[$code]['color']
            ];
        }
    }

    // Step 5: Subcategory-wise percentage
    $sql = "
        SELECT requestCategory, requestSubCategory, COUNT(*) AS total
        FROM job_order_request
        WHERE JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.division')) = :division
          AND JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.section')) = :section
          AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r')
              BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y')
              AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
        GROUP BY requestCategory, requestSubCategory
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':division' => $divisionName,
        ':section' => $sectionName,
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);

    $subCategoryPie = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $categoryCode = $row['requestCategory'];
        $subcategory = $row['requestSubCategory'];

        if (!in_array(strtoupper($subcategory), $excludedSubcategories) && isset($categories[$categoryCode])) {
            $percent = $totalRequests > 0 ? round(($row['total'] / $totalRequests) * 100, 2) : 0;
            $subCategoryPie[] = [
                'name' => $subcategory,
                'y' => $percent,
                'color' => $categories[$categoryCode]['color']
            ];
        }
    }

    // Step 6: Top requesting section
    $stmt = $pdo->prepare("
        SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.section')) AS section, 
            COUNT(*) AS total
        FROM job_order_request
        WHERE JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.division')) = :division
          AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
              BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
              AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
        GROUP BY section
        ORDER BY total DESC
        LIMIT 1
    ");
    $stmt->execute([
        ':division' => $divisionName,
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);
    $topSection = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'division' => $divisionName,
        'section' => $sectionName,
        'totalRequestsForSection' => $totalRequests,
        'topSectionInDivision' => $topSection ?: ['section' => null, 'total' => 0],
        'categoryPie' => $categoryPie,
        'subCategoryPie' => $subCategoryPie
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
