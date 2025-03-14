<?php 
    include('../../session.php');
    include('../../assets/connection.php');

    $requestNo = (int)$_POST['requestNo'];
    $evaluation = [
        "q1" => $_POST['q1'],
        "q2" => $_POST['q2'],
        "q3" => $_POST['q3'],
        "q4" => $_POST['q4'],
        "q5" => $_POST['q5'],
        "comments" => $_POST['comment']
    ];

    $evaluationJSON = json_encode($evaluation);
    
    $sql = "UPDATE job_order_request SET requestEvaluation=? WHERE requestNo=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$evaluationJSON , $requestNo]);

    echo json_encode($_POST);
    
?>