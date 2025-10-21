<?php
include ('../../session.php');
include('../../assets/connection.php');
include('../../assets/mssql_connection.php');

$current_date = date('m/d/Y - h:i:s A');

try {
    // Fetch all admin and super admin accounts dynamically
    $sql = "SELECT 
                techBioID, 
                firstName, 
                middle, 
                lastName, 
                employmentStatus, 
                techCategory, 
                role 
            FROM efms_technicians 
            WHERE role IN ('admin', 'super_admin')
            ORDER BY role DESC, firstName ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = [];

    foreach ($admins as $row) {
        $fullName = strtoupper($row['lastName']) . ', ' . strtoupper($row['firstName']) . ' ' . strtoupper($row['middle']);
        $roleText = ($row['role'] === 'super_admin') ? 'Super Admin' : 'Admin';

        $response[] = [
            'adminID' => $row['techBioID'],
            'fullName' => $fullName,
            'employmentStatus' => $row['employmentStatus'],
            'techCategory' => $row['techCategory'],
            'role' => $roleText
        ];
    }

    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
