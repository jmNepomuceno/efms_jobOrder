let modal_logout = new bootstrap.Modal(document.getElementById('modal-logout'));

const side_bar_border_style = (view) =>{
    for(let i = 0; i < $('.side-bar-routes').length; i++){
        $('.side-bar-routes').eq(i).css('background', '#BA3912');
        $('.side-bar-routes').eq(i).css('border-left', '0');
    }

    document.getElementById(view).style.background = "#A23210"
    document.getElementById(view).style.borderLeft = "5px solid white"
}

$(document).ready(function(){
    // side_bar_border_style(view)

    // if(section.length <= 10){
    //     $('#user-section-span').css('font-size', '1.5em');
    // }

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