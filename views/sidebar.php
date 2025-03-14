<?php 
    
    // $sql = "SELECT permission FROM permission WHERE role=?";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute([$_SESSION['role']]);
    // $permission_account = $stmt->fetch(PDO::FETCH_ASSOC);
    // $permissions = json_decode($permission_account['permission'], true);
        
    
?>
    <div class="left-container">
        <div class="home-name-div">
             <h1>EFMS TICKETING SYSTEM</h1>
        </div>

        <div class="side-bar-route">
            <div class="side-bar-routes" id="request-form-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>Request Form</span>
            </div>

            <div class="side-bar-routes" id="incoming-request-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>Pending</span>
            </div>

            <div class="side-bar-routes" id="incoming-order-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>For Corrections</span>
                <!-- <i class="fa-solid fa-bell hidden" id="bell-notif"></i> -->
            </div>
            
            <div class="side-bar-routes" id="imiss-inventory-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>On Process</span>
            </div>

            <div class="side-bar-routes" id="imiss-ppmp-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>For Evaluation</span>
            </div>

            <div class="side-bar-routes" id="item-distribution-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>Accomplished</span>
            </div>

        </div>

        <div class="user-acc-div">
            <span id="user-section-span">MET</span>
            <div class="vl"></div>
            <span id="user-name-span"><?php echo $_SESSION["name"] ?></span>
            <!-- <i class="fa-solid fa-right-from-bracket" id="logout-btn"></i> -->
        </div>
    </div>

    <script> 
        var view = "<?php echo $view ?>";
            
        // const audio = new Audio('../source/sound/shopee.mp3'); // Load the notification sound
        // let previousResponse = 0; // Store the previous count to prevent duplicate sounds

        // const fetchIncomingOrder = () => {
        //     $.ajax({
        //         url: '../php/fetch_incoming_order.php',
        //         method: "GET",
        //         success: function(response) {
        //             console.log(response);
        //             response = parseInt(response);

        //             if (response > 0) {
        //                 $('#bell-notif').removeClass('hidden'); // Show bell notification
        //                 audio.play();
        //             } else {
        //                 $('#bell-notif').addClass('hidden'); // Hide bell notification
        //             }

        //             previousResponse = response; // Update previous response count
        //         }
        //     });
        // };Sear

        // // Run the function every 5 minutes (300000ms)
        // setInterval(fetchIncomingOrder, 300000);

        // // Run immediately on page load
        // fetchIncomingOrder();
    </script>