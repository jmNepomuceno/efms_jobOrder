<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT requestNo, requestDate, requestBy, requestDescription, requestStatus, requestCategory, requestSubCategory 
        FROM job_order_request 
        WHERE requestStatus='Pending'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $categoryDescriptions = [];

    if (count($data) > 0) {
        // Build category mapping
        $categoryCodes = array_unique(array_column($data, 'requestCategory'));

        if (count($categoryCodes) > 0) {
            $placeholders = str_repeat('?,', count($categoryCodes) - 1) . '?';
            $sql = "SELECT category_code, category_description 
                    FROM efms_category 
                    WHERE category_code IN ($placeholders)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($categoryCodes);

            $categoryDescriptions = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // ['code' => 'description']
        }

        // Process data
        foreach ($data as &$row) {
            // Replace category code with description
            if (isset($categoryDescriptions[$row['requestCategory']])) {
                $row['requestCategory'] = $categoryDescriptions[$row['requestCategory']];
            }

            // Decode requestBy if available
            if (!empty($row['requestBy'])) {
                $row['requestBy'] = json_decode($row['requestBy'], true);
            }
        }
    }

    echo json_encode($data);


    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }

?>
