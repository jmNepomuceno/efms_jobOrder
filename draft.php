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

    // $webservice = "http://192.168.42.10:8081/EmpPortal.asmx?wsdl";
    // $param = array("division" => 3);
    // $soap = new SOAPClient($webservice);
    // $result = $soap->Departments($param)->DepartmentsResult;
    // echo "<pre>"; print_r($result); echo "</pre>";


    // echo $result->Photo;

    // $account = $result;
    // $array = json_decode(json_encode($account), true);

    // echo "<pre>"; print_r($account); echo "</pre>";
    // echo $account;
    // echo print_r($array, true);


    // $param = array("bioUserName" => 3858, "password" => 3858, "accessMode" => 0);
    
    // $soap = new SOAPClient($webservice);
    // $result = $soap->LogIn($param)->LogInResult;
    // print_r($result);

    // $sql = "SELECT role, techCategory FROM efms_technicians WHERE techBioID=?";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute([3858]);
    // $tech_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // $sql = "SELECT * FROM efms_technicians";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();
    // $data = $stmt->fetchAll(PDO::FETCH_ASSOC); 

    // echo "<pre>"; print_r($data); echo "</pre>";
    // echo json_encode($tech_data);


    // Prismatic cake: 1 banana + 4 bone blossoms
    // Prismatic hotdog: 1 corn + 4 bone blossoms
    // Prismatic salad: 1 tomato + 4 bone blossoms
    // Prismatic donut: 1 sugar glaze + 4 bone blossoms
    // Prismatic pie: 1 pumpkin + 4 bone blossoms
    // Prismatic Ice Cream : 1 banana + 1 sugar apple + 3 bone blossom
    // Prismatic Pizza : 1 Sugar apple + 1 Violet corn + 3 Bone blossom


    $sql = "SELECT requestBy FROM job_order_request";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC); 

    echo "<pre>"; print_r($data); echo "</pre>";
?>