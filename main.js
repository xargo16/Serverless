$(document).ready(function() {
    $('.carousel-image-small-enlarge').on('click', function() {
        $('.imagepreview').attr('src', $(this).find('img').attr('src'));
        $('#imagemodal').modal('show');   
    });


    /**
     * Navbar
     */
    $(window).on("scroll", function() {
        if($(window).scrollTop()) {
            makeNavbarWhite();
        } else {
            makeNavbarTransparent();
        }

        $('.btn-package').click(function() {
            $('.package-selected').removeClass('package-selected');

            $(this).addClass('package-selected');
        })
    })
    $('#navbarToggler').on('click', function() {
        if($(window).scrollTop()) {
            makeNavbarWhite();
        } else {
            if (isNavbarTransparent()) {
                makeNavbarWhite();
            } else {
                makeNavbarTransparent();
            }
        }
    });

    /**
     * scroll to anchor
     */
    $(".background-button").click(function(){
        var navbarHeight = $('#navbarNav').outerHeight();
        
        $('html, body').animate({
            scrollTop: $('#scrollTo').offset().top - 90
        }, 'slow');
    });

    $('#btn-booking').click(function() {
        var navbarHeight = $('#navbarNav').outerHeight();

        $('html, body').animate({
            scrollTop: $('#contact-form-link').offset().top - 90
        }, 'slow');
    })


    /**
     * Contact form
     */
    $('#contact-form').parsley();
    $('#contact-form').submit(function(e) {
        e.preventDefault();

        /**
         * Show the loading spinner
         */
        $('#contact-form-spinner').show();
        $('#contact-form-response').text('');

        const data = {};
        $("#contact-form :input").each(function(){
            data[$(this).attr('name')] = $(this).val();
        });

        
        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method'),
            headers: {
                'Accept' : 'application/json; charset=utf-8',
                'Content-type' : 'application/json; charset=utf-8'
            },
            data: JSON.stringify(data),
            success: function(resp) {
                contactFormSuccess();
            },
            error: function(resp) {
                contactFormFailure();
            }
        });

    });

    /**
     * Carrer Form
     */
    $('#attachedPhoto').on('change', function() {
        /**
         * Validate file size
         */
        if ($(this)[0].files[0].size > 1024 * 1024) {
            alert('File is too big. Please upload an image smaller than 1MB');
            $(this).val('');
            return;
        }

        var fileName = $(this).val().split(/[\\/]/).pop();
        $('#attachedPhotoLabel').text(fileName);
    });

    $('#career-form').parsley();
    $('#career-form').submit(function(e) {
        e.preventDefault();

        /**
         * Show the loading spinner
         */
        $('#career-form-spinner').show();
        $('#career-form-response').text('');

        /**
         * Get data from each input
         */
        const data = {};
        $("#career-form :input").each(function(){
            if ($(this).attr('name') != 'file') {
                data[$(this).attr('name')] = $(this).val();
            }
        });

        var action = $(this).attr('action');
        var method = $(this).attr('method');

        var file = $('#attachedPhoto')[0].files[0];

        if (file) {
            /**
             * Base64 encode file before uploading it
             */
            var reader = new FileReader();
            reader.onloadend = function() {
                data['file'] = reader.result;

                $.ajax({
                    url: action,
                    type: method,
                    
                    headers: {
                        'Accept' : 'application/json; charset=utf-8',
                        'Content-type' : 'application/json; charset=utf-8'
                    },
                    data: JSON.stringify(data),
                    success: function(resp) {
                        carrerFormSuccess();
                    },
                    error: function(resp) {
                        carrerFormFailure();
                    }
                });
            }
            reader.readAsDataURL(file);
        } else {
            $.ajax({
                url: action,
                type: method,
                
                headers: {
                    'Accept' : 'application/json; charset=utf-8',
                    'Content-type' : 'application/json; charset=utf-8'
                },
                data: JSON.stringify(data),
                success: function(resp) {
                    carrerFormSuccess();
                },
                error: function(resp) {
                    carrerFormFailure();
                }
            });
        }
    });
    
    /**
     * Instagram
     */
    if ($('#instafeed').length) {
        var userFeed = new Instafeed({
            get: 'user',
            userId: 4230924048,
            limit: 12,
            resolution: 'standard_resolution',
            accessToken: '4230924048.1677ed0.9de48c4ab38c4e53ad3287fc13ed48d6',
            sortBy: 'most-recent',
            template: '<div class="col-lg-2 col-md-4 col-6 instaimg mb-4"><a href="{{link}}" title="{{caption}}" target="_blank"><img src="{{image}}" alt="{{caption}}" class="img-fluid rounded"/></a></div>'
        })

        userFeed.run();
    }

    
})

function makeNavbarWhite()
{
    $('nav').addClass('half-transparent');
    $('nav').addClass('navbar-light');
    $('nav').removeClass('navbar-dark');
    $('nav').addClass('shrink');
    if ($('.logo').attr('src') != '/assets/img/icons/logo-black.svg') {
        $('.logo').attr('src', '/assets/img/icons/logo-black.svg');
    }
    
    
    if ($('#nav-instagram').attr('src') != '/assets/img/icons/instagram-black.svg') {
        $('#nav-instagram').attr('src', '/assets/img/icons/instagram-black.svg');
    }
    if ($('#nav-facebook').attr('src') != '/assets/img/icons/facebook-black.svg') {
        $('#nav-facebook').attr('src', '/assets/img/icons/facebook-black.svg');
    }
    if ($('#nav-twitter').attr('src') != '/assets/img/icons/twitter-black.svg') {
        $('#nav-twitter').attr('src', '/assets/img/icons/twitter-black.svg');
    }
}

function makeNavbarTransparent()
{
    $('nav').addClass('navbar-dark');
    $('nav').removeClass('half-transparent');
    $('nav').removeClass('navbar-light');
    if ($('.logo').attr('src') != '/assets/img/icons/logo-white.svg') {
        $('.logo').attr('src', '/assets/img/icons/logo-white.svg');
    }
    if ($('#nav-instagram').attr('src') != '/assets/img/icons/instagram-white.svg') {
        $('#nav-instagram').attr('src', '/assets/img/icons/instagram-white.svg');
    }
    if ($('#nav-facebook').attr('src') != '/assets/img/icons/facebook-white.svg') {
        $('#nav-facebook').attr('src', '/assets/img/icons/facebook-white.svg');
    }
    if ($('#nav-twitter').attr('src') != '/assets/img/icons/twitter-white.svg') {
        $('#nav-twitter').attr('src', '/assets/img/icons/twitter-white.svg');
    }
    $('nav').removeClass('shrink');
}

function isNavbarTransparent()
{
    return $('nav').hasClass('navbar-dark');
}

function contactFormSuccess()
{
    $('#contact-form-spinner').hide();
    $('#contact-form').trigger('reset');
    $('#contact-form').parsley().reset();
    $('#contact-form-response').text('Thanks for the message. I’ll be in touch shortly.');
}
function contactFormFailure()
{
    $('#contact-form-spinner').hide();
    $('#contact-form-response').text('Something went wrong. Please try again or send email manually');
}

function carrerFormSuccess()
{
    $('#career-form-spinner').hide();
    $('#career-form').trigger('reset');
    $('#career-form').parsley().reset();
    $('#career-form-response').text('Thanks for the message. I’ll be in touch shortly.');
}
function carrerFormFailure()
{
    $('#career-form-spinner').hide();
    $('#career-form-response').text('Something went wrong. Please try again or send email manually');
}