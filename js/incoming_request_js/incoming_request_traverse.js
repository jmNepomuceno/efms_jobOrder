$(document).ready(function(){

    $(document).off('click', '#diagnosis-btn').on('click', '#diagnosis-btn', function() {        
        $('.assessment-textarea').attr('placeholder', 'Enter diagnosis details...');
        $('#start-assess-btn').text("Start Job")

        $('#correction-btn').css('opacity' , '0.5')
        $('#diagnosis-btn').css('opacity' , '1')

    });

    $(document).off('click', '#correction-btn').on('click', '#correction-btn', function() {        
        $('.assessment-textarea').attr('placeholder', 'Enter correction details...');
        $('#start-assess-btn').text("Send")

        $('#correction-btn').css('opacity' , '1')
        $('#diagnosis-btn').css('opacity' , '0.5')
    });
})