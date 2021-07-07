const image = document.getElementById('image');
var cropper;

$(() => {
    $('body').on("click", "#setCity", (e) => {
        e.preventDefault();
        var modalInstance = M.Modal.getInstance(document.querySelector('#city-selector'));
        modalInstance.close();
        var city = $('#cities').val();
        var region = $('#regions').val();
        $('#selected-city-input').val(city);
        $('#selected-region-input').val(region);
        $('#region').text(region);
        $('#city').text(city);
        $('#prompt').addClass('hidden');
        $('#selected-city').removeClass('hidden');
    });
    if(image){
        cropper = new Cropper(image, {
            aspectRatio: 'Free'
        });
        $('#image-degree').on('input', function(e){
            var degree = $(this).val();
            cropper.rotateTo(degree);
        });
        $('#image-scale').on('input', function(e){
            var scale = $(this).val();
            cropper.scale(scale);
        });
        $('#save-edited').on('click', function (e) {
            e.preventDefault();
            // console.log(cropper.getCroppedCanvas().toDataURL());
            $.ajax({
                url: $(this).data('url'),
                data: {
                    src: image.getAttribute('src'),
                    file: cropper.getCroppedCanvas().toDataURL()
                },
                type: 'POST',
                dataType: 'JSON',
                success: function(res){
                    if(res.success){
                        M.toast({html: 'Изображение сохранено'});
                        setTimeout(function(){
                            location.reload();
                        }, 500);
                    }
                },
                error: function(err){
                    console.error(err);
                }
            });
        });
        $('#reset-edited').on('click', function(e){
            e.preventDefault();
            cropper.scale(1);
            cropper.rotateTo(0);
        })
        $('#rotate-left').on('click', function(e){
            e.preventDefault();
            cropper.rotate(-1);
        });
        $('#rotate-right').on('click', function(e){
            e.preventDefault();
            cropper.rotate(1);
        });
    }
});



