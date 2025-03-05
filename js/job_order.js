$(document).ready(function(){
    
    $('.main-container').load('../container/efms_container.php', function(response, status, xhr) {
        if (status === "success") {
            $('body').append('<script src="../js/request_form_js/requestForm_function.js?v=<?php echo time(); ?>"><\/script>');
            $('body').append('<script src="../js/request_form_js/requestForm_traverse.js?v=<?php echo time(); ?>"><\/script>');
        } else {
            console.error("Failed to load EFMS container:", xhr.statusText);
        }
    });

    $('#login-btn').click(function() {
        handleLogin();
    });

    function refreshNavBtnStyle() {
        for(let i = 0; i < $('.nav-sub-div').length; i++) {
            $('.nav-sub-div').eq(i).css('background', 'none');
        }
    }

    
    $('#request-form-nav-btn').click(function() {
        refreshNavBtnStyle();
        $(this).css('background-color', '#f2f2f2');  
    
        // Load efms_container.php into .main-container
        $('.main-container').empty();
        $('.main-container').load('../container/efms_container.php', function(response, status, xhr) {
            if (status === "success") {
                $('script[src*="requestForm_function.js"]').remove();
                $('script[src*="requestForm_traverse.js"]').remove();

                $('body').append('<script src="../js/request_form_js/requestForm_function.js?v=<?php echo time(); ?>"><\/script>');
                $('body').append('<script src="../js/request_form_js/requestForm_traverse.js?v=<?php echo time(); ?>"><\/script>');
            } else {
                console.error("Failed to load EFMS container:", xhr.statusText);
            }
        });
    });

    $('#logs-nav-btn').click(function() {
        refreshNavBtnStyle();
        $('#logs-nav-btn').css('background-color', '#f2f2f2');  
    });

    $('#pending-nav-btn').click(function() {
        refreshNavBtnStyle();
        $('#pending-nav-btn').css('background-color', '#f2f2f2');  
    });

    $('#return-req-nav-btn').click(function() {
        refreshNavBtnStyle();
        $('#return-req-nav-btn').css('background-color', '#f2f2f2');  
    });

    $('#completed-nav-btn').click(function() {
        refreshNavBtnStyle();
        $('#completed-nav-btn').css('background-color', '#f2f2f2');  
    });
});