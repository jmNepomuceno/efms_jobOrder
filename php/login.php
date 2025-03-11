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
            $_SESSION["division"] = $account->Division; 
            $_SESSION["password"] = $password;     
            $_SESSION["Authorized"] = "Yes";
            $_SESSION["role"] = "";


            if($_SESSION['section'] == 12 || $_SESSION['section'] == 23){
                $_SESSION["role"] = 'admin';
                echo "/views/home.php";
            }else{
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