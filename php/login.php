<?php
include('../session.php');
include('../assets/connection.php');

$webservice = "http://192.168.42.10:8081/EmpPortal.asmx?wsdl";

if (isset($_POST["username"]) && isset($_POST["password"]) && trim($_POST["username"]) != "" && $_POST["password"] != "") {
    $biousername = $_POST["username"];
    $password = $_POST["password"];
    $param = array("bioUserName" => $biousername, "password" => $password, "accessMode" => 0);
    
    $soap = new SOAPClient($webservice);
    $result = $soap->AuthenticateEmployee($param)->AuthenticateEmployeeResult;

    $code = $result->Code;
    $canAccess = $result->CanAccess;
    $errorMessage = $result->Message;
    $userType = $result->UserType;


    if ($canAccess == 1) {
        if (isset($result->Account)) {
            $account = $result->Account;
            $name = $account->FirstName." ".substr($account->MiddleName,0,1).". ".$account->LastName;

            $_SESSION["user"] = $account->BiometricID;          
            $_SESSION["name"] = $account->FullName;
            $_SESSION["section"] = $account->Section;
            $_SESSION["sectionName"] = "";
            $_SESSION["divisionName"] = "";
            $_SESSION["division"] = $account->Division; 
            $_SESSION["password"] = $password;     
            $_SESSION["Authorized"] = "Yes";
            $_SESSION["role"] = "";

            try {
                $sql = "SELECT sectionName FROM pgssection WHERE sectionID=?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$_SESSION['section']]);
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $_SESSION["sectionName"] = $data[0]['sectionName'];
        
                $sql = "SELECT PGSDivisionName FROM pgsdivision WHERE PGSDivisionID=?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$_SESSION['division']]);
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $_SESSION["divisionName"] = $data[0]['PGSDivisionName'];
        
            } catch (PDOException $e) {
                die("Database error: " . $e->getMessage());
            }


            $sql = "SELECT techBioID FROM efms_technicians WHERE role='admin' OR role='super_admin'";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $admin_users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // extract only the techBioID values
            $admin_users = array_column($admin_users, 'techBioID');
        
            // $admin_users = [3858, 3522, 1842, 2462, 1525];
            if(in_array($_SESSION["user"], $admin_users)) {
                $_SESSION["role"] = 'admin';
                echo "/views/home.php";
            }
            else if($_SESSION['section'] == 23){
                $_SESSION["role"] = 'tech';
                echo "/views/home.php";
            }
            else{
                $_SESSION["role"] = "user";
                echo "/views/job_order.php";
            }
        }
    }
    else {
        echo "invalid";
    }

}
else {
    echo "invalid";
}


?>