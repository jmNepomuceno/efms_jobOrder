<?php 
    include('../../session.php');
    include('../../assets/connection.php');

    // check first if the current user has a pending request on the fucking system
    // $sql = "SELECT COUNT(*) AS pending_count FROM job_order_request WHERE requestStatus = 'On-Process' AND JSON_EXTRACT(requestBy, '$.bioID')=?";
    $sql = "SELECT COUNT(*) AS pending_count FROM efms_joborder.job_order_request WHERE (requestStatus = 'Pending' OR requestStatus = 'On-Process' OR requestStatus = 'Evaluation') AND CAST(JSON_EXTRACT(requestBy, '$.bioID') AS UNSIGNED) = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['user']]);  // Integer parameter
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    $pending_count = $data['pending_count'];
    
    if($pending_count >= 1){
        echo "pending";
    }
    else{
        $object = $_POST;
        $object["requestBy"] = [
            "name" => $_SESSION['name'],
            "bioID" => $_SESSION['user'],
            "division" => $_SESSION['divisionName'],
            "section" => $_SESSION['sectionName'],
        ];

        $sql = "SELECT requestNo FROM job_order_request ORDER BY requestNo DESC LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Increment the request number (if applicable)
        $requestNo = isset($data['requestNo']) ? intval($data['requestNo']) + 1 : 1;

        // Insert new record
        $sql = "INSERT INTO job_order_request 
                (requestNo, requestDate, requestFrom, requestBy, requestCategory, requestDescription, requestStatus) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $requestNo, // Removed extra `$` sign
            $object["requestDate"],
            $object["requestFrom"],
            json_encode($object["requestBy"]),
            $object["requestCategory"],
            $object["requestDescription"],
            $object["requestStatus"],
        ]);

        echo "success";
    }
    
?>