let modal_notif = new bootstrap.Modal(document.getElementById('modal-notif'));
// modal_notif.show()

// Global listeners map
const socketEventHandlers = [];

const fetchNotifValue = () => {
    $.ajax({
        url: "../../php/job_order_php/fetch_notifValue.php",
        method: "GET",
        dataType: "json",
        success: function(response) {
            console.log(response);

            // Mapping status keys from response to their corresponding spans
            const statusMap = {
                count_pending: "#pending-notif-span",
                count_onProcess: "#process-notif-span",
                count_correction: "#correction-notif-span",
                count_returned: "#return-notif-span",
                count_evaluation: "#evaluation-notif-span",
                count_completed: "#completed-notif-span"
            };

            // Iterate over the status map and update the respective spans
            Object.keys(statusMap).forEach(key => {
                let value = response[key] || 0; // Default to 0 if not found
                let spanSelector = statusMap[key];

                if (value > 0) {
                    $(spanSelector).text(value).show();  // Show span and update value
                } else {
                    $(spanSelector).hide(); // Hide if value is 0
                }
            });
        },
        error: function(xhr, status, error) {
            console.error("Error fetching notification data:", error);
        }
    });
};

socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    console.log("📡 WebSocket received:", data);

    socketEventHandlers.forEach(handler => {
        try {
            handler(data);
        } catch (err) {
            console.error("❌ Error in socket event handler:", err);
        }
    });
};

registerSocketHandler((data) => {
    if (
        data.action === "refreshOnProcessTableUser" || 
        data.action === "refreshEvaluationTableUser" || 
        data.action === "refreshCorrectionTableUser" || 
        data.action === "refreshPendingTableUser"
    ) {
        fetchNotifValue();
    }
})

// Function to register listeners
function registerSocketHandler(callback) {
    socketEventHandlers.push(callback);
}

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
    fetchNotifValue()
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

    $('#process-nav-btn').click(function() {
        refreshNavBtnStyle();
        $('#process-nav-btn').css('background-color', '#f2f2f2');  

        $('.main-container').empty();
        $('.main-container').load('../container/onProcess_view.php', function(response, status, xhr) {
            if (status === "success") {
                removeAllJS()
                removeAllCSS()

                let version = new Date().getTime(); // Generates a unique timestamp
                $('head').append(`<link rel="stylesheet" href="../css/onProcess_view.css?v=${version}">`);
                $('body').append(`<script src="../js/onProcess_view_js/onProcess_view.js?v=${version}"><\/script>`);
            } else {
                console.error("Failed to load EFMS container:", xhr.statusText);
            }
        });
    });

    $('#correction-nav-btn').click(function() {
        refreshNavBtnStyle();
        $('#correction-nav-btn').css('background-color', '#f2f2f2');  

        $('.main-container').empty();
        $('.main-container').load('../container/correction_view.php', function(response, status, xhr) {
            if (status === "success") {
                removeAllJS()
                removeAllCSS()

                let version = new Date().getTime(); // Generates a unique timestamp
                $('head').append(`<link rel="stylesheet" href="../css/correction_view.css?v=${version}">`);
                $('body').append(`<script src="../js/correction_view_js/correction_view.js?v=${version}"><\/script>`);
            } else {
                console.error("Failed to load EFMS container:", xhr.statusText);
            }
        });
    });

    $('#evaluation-req-nav-btn').click(function() {
        refreshNavBtnStyle();
        $('#evaluation-nav-btn').css('background-color', '#f2f2f2');  

        $('.main-container').empty();
        $('.main-container').load('../container/evaluation_view.php', function(response, status, xhr) {
            if (status === "success") {
                removeAllJS()
                removeAllCSS()

                let version = new Date().getTime(); // Generates a unique timestamp
                $('head').append(`<link rel="stylesheet" href="../css/evaluation_view.css?v=${version}">`);
                $('body').append(`<script src="../js/evaluation_view_js/evaluation_view.js?v=${version}"><\/script>`);
            } else {
                console.error("Failed to load EFMS container:", xhr.statusText);
            }
        });
    });

    $('#completed-nav-btn').click(function() {
        refreshNavBtnStyle();
        $('#completed-nav-btn').css('background-color', '#f2f2f2');  

        $('.main-container').empty();
        $('.main-container').load('../container/completed_view.php', function(response, status, xhr) {
            if (status === "success") {
                removeAllJS()
                removeAllCSS()

                let version = new Date().getTime(); // Generates a unique timestamp
                $('head').append(`<link rel="stylesheet" href="../css/completed_view.css?v=${version}">`);
                $('body').append(`<script src="../js/completed_view_js/completed_view.js?v=${version}"><\/script>`);
            } else {
                console.error("Failed to load EFMS container:", xhr.statusText);
            }
        });
    });

    $('#return-btn').click(function() {
        window.location.href = "../views/home.php"; 
    });
});