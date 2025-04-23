let modal_logout = new bootstrap.Modal(document.getElementById('modal-logout'));


$(document).ready(function(){
    console.log(view)
    $(`#${view}`).css('background','#5a4038')
    $(`#${view}`).css('border-left','3px solid white')
    
    // dashboard-arrow
    $('#dashboard-arrow').click(function(event) {
        event.stopPropagation();
        if($('#dashboard-arrow').attr('class') === 'fa-solid fa-caret-down'){
            $('#dashboard-arrow').removeClass('fa-solid fa-caret-down')
            $('#dashboard-arrow').addClass('fa-solid fa-caret-up')
    
            $('.sub-down-div').css('display' , 'flex')
        }else{
            $('#dashboard-arrow').removeClass('fa-solid fa-caret-up')
            $('#dashboard-arrow').addClass('fa-solid fa-caret-down')
            $('.sub-down-div').css('display' , 'none')
        }
    });

    $('#request-form-sub-div').click(function(){
        window.location.href = "../views/job_order.php";
    });

    $('#incoming-request-sub-div').click(function(){
        window.location.href = "../views/incoming_request.php";
    });

    $('#admin-management-sub-div').click(function(){
        window.location.href = "../views/admin_management.php";
    });

    $('#req-dashboard-sub-down-div').click(function(){
        window.location.href = "../views/dashboard_request.php";
    });

    $('#tech-dashboard-sub-down-div').click(function(){
        window.location.href = "../views/dashboard.php";
    });

    $('#user-dashboard-sub-down-div').click(function(){
        window.location.href = "../views/dashboard.php";
    });

    $('#logout-btn').click(function(){
        modal_logout.show()

        $(document).off('click', '#yes-modal-btn-logout').on('click', '#yes-modal-btn-logout', function() {
            $.ajax({
                url: '../php/logout.php',
                method: "GET",
                
                success: function(response) {
                    window.location.href = response;
                }
            });
        })
    });

    $(document).off('click', '#burger-icon').on('click', '#burger-icon', function() {
        if($('#burger-icon').css('color') != 'rgb(255, 85, 33)'){
            $('body .left-container').css('display', 'none');
            $('#burger-icon').css('color', '#ff5521');
        }else{
            $('body .left-container').css('display', 'flex');
            $('#burger-icon').css('color', 'white');
        }
    });


})