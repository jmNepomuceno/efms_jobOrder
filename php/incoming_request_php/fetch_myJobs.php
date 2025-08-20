<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $what = $_POST['what'];

    $sql = "SELECT role, techCategory
        FROM efms_technicians 
        WHERE techBioID=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['user']]);
    $tech_data = $stmt->fetch(PDO::FETCH_ASSOC);

    if($tech_data['role'] == 'super_admin'){
        $sql = "SELECT requestNo, requestDate, requestStartDate, requestEvaluationDate, requestCompletedDate, requestCorrectionDate, requestCorrection, 
                   requestDescription, requestCategory, requestSubCategory, requestBy, processedBy, requestJobRemarks, assignTo, assignToBioID, assignBy, assignTargetStartDate, assignTargetEndDate
            FROM job_order_request
            WHERE requestStatus = ? ORDER BY requestDate DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$what]);
        $my_jobs_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    else if($tech_data['role'] == 'admin') {
        $sql = "SELECT requestNo, requestDate, requestStartDate, requestEvaluationDate, requestCompletedDate, requestCorrectionDate, requestCorrection,
                   requestDescription, requestCategory, requestSubCategory, requestBy, processedBy, requestJobRemarks, assignTo, assignToBioID, assignBy, assignTargetStartDate, assignTargetEndDate
            FROM job_order_request
            WHERE requestStatus = ? AND requestCategory = ?  ORDER BY requestDate DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$what, $tech_data['techCategory']]);
        $my_jobs_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        // For technicians or other roles
        $sql = "SELECT requestNo, requestDate, requestStartDate, requestEvaluationDate, requestCompletedDate, requestCorrectionDate, requestCorrection,
                   requestDescription, requestCategory, requestSubCategory, requestBy, processedBy, requestJobRemarks
            FROM job_order_request
            WHERE requestStatus = ? AND processedBy = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$what, $_SESSION['name']]);
        $my_jobs_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // 2. Build unique list of requestCategory codes
    $categoryCodes = array_values(array_unique(array_column($my_jobs_data, 'requestCategory')));

    $categoryDescriptions = [];
    
    if (!empty($categoryCodes)) {
        $placeholders = implode(',', array_fill(0, count($categoryCodes), '?'));
        $sql = "SELECT category_code, category_description
                FROM efms_category
                WHERE category_code IN ($placeholders)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($categoryCodes);
    
        // Fetch as key-value pairs
        $categoryDescriptions = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // [code => description]
    }
    
    // 3. Update each row
    foreach ($my_jobs_data as &$row) {
        // Replace category code with its description
        if (isset($categoryDescriptions[$row['requestCategory']])) {
            $row['requestCategory'] = $categoryDescriptions[$row['requestCategory']];
        }
    
        // Decode requestBy JSON
        if (!empty($row['requestBy'])) {
            $row['requestBy'] = json_decode($row['requestBy'], true);
        }
    }
    unset($row); // Good practice after using reference in foreach
    
    // 4. Return the result
    echo json_encode($my_jobs_data);
    
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
