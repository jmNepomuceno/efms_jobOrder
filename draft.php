<?php 
    include('./session.php');
    include('./assets/connection.php');
    

    // $webservice = "http://192.168.42.10:8081/EmpPortal.asmx?wsdl";
    // $param = array("bioID" => 4497);
    // $soap = new SOAPClient($webservice);
    // $result = $soap->GetEmployee($param)->GetEmployeeResult;
    // echo "<pre>"; print_r($result); echo "</pre>";


    // select all
    $sql = "SELECT techBioID FROM efms_technicians WHERE role='admin' OR role='super_admin'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $admin_users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // extract only the techBioID values
    $admin_users = array_column($admin_users, 'techBioID');

    echo "<pre>"; print_r($admin_users); echo "</pre>";

    // Prismatic cake: 1 banana + 4 bone blossoms
    // Prismatic hotdog: 1 corn + 4 bone blossoms
    // Prismatic salad: 1 tomato + 4 bone blossoms
    // Prismatic donut: 1 sugar glaze + 4 bone blossoms
    // Prismatic pie: 1 pumpkin + 4 bone blossoms
    // Prismatic Ice Cream : 1 banana + 1 sugar apple + 3 bone blossom
    // Prismatic Pizza : 1 Sugar apple + 1 Violet corn + 3 Bone blossom

?>