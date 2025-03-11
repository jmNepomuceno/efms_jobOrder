let modal_notif = new bootstrap.Modal(document.getElementById('modal-notif'));

const onLoad = () =>{
    $('.main-container').load('../container/efms_container.php', function(response, status, xhr) {
        if (status === "success") {
            removeAllJS()
            removeAllCSS()

            $('head').append('<link rel="stylesheet" href="../css/efms_container.css?v=<?php echo time(); ?>">');
            
            let version = new Date().getTime(); // Generates a unique timestamp
            $('body').append(`<script src="../js/request_form_js/requestForm_function.js?v=${version}"><\/script>`);
            $('body').append(`<script src="../js/request_form_js/requestForm_traverse.js?v=${version}"><\/script>`);
        } else {
            console.error("Failed to load EFMS container:", xhr.statusText);
        }
    });
}

function refreshNavBtnStyle() {
    for(let i = 0; i < $('.nav-sub-div').length; i++) {
        $('.nav-sub-div').eq(i).css('background', 'none');
    }
}

function removeAllJS(){
    $('script[src*="requestForm_function.js"]').remove();
    $('script[src*="requestForm_traverse.js"]').remove();

    $('script[src*="pending_view.js"]').remove();
}

function removeAllCSS(){
    $('link[href*="efms_container.css"]').remove();
    $('link[href*="pending_view.css"]').remove();
}

$(document).ready(function(){
    onLoad();

    $('#login-btn').click(function() {
        handleLogin();
    });
    
    $('#request-form-nav-btn').click(function() {
        refreshNavBtnStyle();
        $(this).css('background-color', '#f2f2f2');  
    
        // Load efms_container.php into .main-container
        $('.main-container').empty();
        $('.main-container').load('../container/efms_container.php', function(response, status, xhr) {
            if (status === "success") {
                removeAllJS()
                removeAllCSS()

                let version = new Date().getTime(); // Generates a unique timestamp
                $('head').append(`<link rel="stylesheet" href="../css/efms_container.css?v=${version}">`);
                $('body').append(`<script src="../js/request_form_js/requestForm_function.js?v=${version}"><\/script>`);
                $('body').append(`<script src="../js/request_form_js/requestForm_traverse.js?v=${version}"><\/script>`);
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

        $('.main-container').empty();
        $('.main-container').load('../container/pending_view.php', function(response, status, xhr) {
            if (status === "success") {
                removeAllJS()
                removeAllCSS()

                let version = new Date().getTime(); // Generates a unique timestamp
                $('head').append(`<link rel="stylesheet" href="../css/pending_view.css?v=${version}">`);
                $('body').append(`<script src="../js/pending_view_js/pending_view.js?v=${version}"><\/script>`);
            } else {
                console.error("Failed to load EFMS container:", xhr.statusText);
            }
        });
    });

    $('#return-req-nav-btn').click(function() {
        refreshNavBtnStyle();
        $('#return-req-nav-btn').css('background-color', '#f2f2f2');  
    });

    $('#completed-nav-btn').click(function() {
        refreshNavBtnStyle();
        $('#completed-nav-btn').css('background-color', '#f2f2f2');  
    });

    $('#return-btn').click(function() {
        window.location.href = "../views/home.php"; 
    });
});