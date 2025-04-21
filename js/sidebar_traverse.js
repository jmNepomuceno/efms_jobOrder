let modal_logout = new bootstrap.Modal(document.getElementById('modal-logout'));


$(document).ready(function(){
    console.log(view)
    $(`#${view}`).css('background','#5a4038')
    $(`#${view}`).css('border-left','3px solid white')
    $('#request-form-sub-div').click(function(){
        window.location.href = "../views/job_order.php";
    });

    $('#incoming-request-sub-div').click(function(){
        window.location.href = "../views/incoming_request.php";
    });

    $('#admin-management-sub-div').click(function(){
        window.location.href = "../views/admin_management.php";
    });

    // $('#imiss-inventory-sub-div').click(function(){
    //     // window.location.href = "../views/imiss_inventory.php";
    // });

    // $('#incoming-order-sub-div').click(function(){
    //     window.location.href = "../views/incoming_order.php";
    // });

    // $('#imiss-ppmp-sub-div').click(function(){
    //     window.location.href = "../views/imiss_ppmp.php";
    // });

    // $('#item-distribution-sub-div').click(function(){
    //     window.location.href = "../views/item_distribution.php";
    // });

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