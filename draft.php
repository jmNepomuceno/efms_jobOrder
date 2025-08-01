<?php 
    include('./session.php');
    include('./assets/connection.php');
    
    // $sql = "SELECT * FROM efms_technicians WHERE techCategory = ?";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute(['MU']);
    // $sub_category = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // $sql = "SELECT * FROM job_order_request";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();
    // $job_order_request = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // echo "<pre>"; print_r($job_order_request); echo "</pre>";

    $webservice = "http://192.168.42.10:8081/EmpPortal.asmx?wsdl";
    // $biousername = "lieannlyyy";
    // $password = 0210;
    // $param = array("bioID" => 4497);
    
    // $soap = new SOAPClient($webservice);
    // $result = $soap->GetEmployee($param)->GetEmployeeResult;
    // print_r($result);
    // echo $result->Photo;

    // $account = $result;
    // $array = json_decode(json_encode($account), true);

    // // echo "<pre>"; print_r($account); echo "</pre>";
    // // echo $account;
    // echo print_r($array, true);


    $param = array("bioUserName" => 3858, "password" => 3858, "accessMode" => 0);
    
    $soap = new SOAPClient($webservice);
    $result = $soap->LogIn($param)->LogInResult;
    print_r($result);
    echo "<pre>"; print_r($result); echo "</pre>";
?>