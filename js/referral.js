(function () {

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
﻿
    //prevents safari from opening a new window when site is bookmarked.
    var a = document.getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
        a[i].onclick = function () {
            window.location = this.getAttribute("href");
            return false
        }
    }

    //tying the back button
    var source = getParameterByName('source');
    if (source.length == 0) {
        $('#referralBackButton').attr('href', "chart.htm");
    } else { $('#referralBackButton').attr('href', source); }

    //checking if device is online or offline
    var isOnline = false;
    function checkOnlineStatus() {
        isOnline = window.navigator.onLine;
    };
    //lets get the initial status;
    checkOnlineStatus();

    window.addEventListener("offline", function (e) {
        isOnline = false;
    }, false);

    window.addEventListener("online", function (e) {
        isOnline = true;
    }, false);

    $(".alert").alert();
    $('#myModal').modal({ show: false })
    $('#emailerrorrequired').modal({ show: false });
    var initializeModal = function () {
        $('#modalheaderlabel').text('Sending referral');
        $('#pbar').removeClass();
        $('#pbar').addClass("progress progress-striped active");
        $('#modalbodymessage').text('Please wait while sending referral.');
    };
    var validateEmail = function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    var validateEmails = function (e) {
        var emails = $(e).val().split(/[;,]+/); // split element by , and ;
        var valid = true;
        for (var i in emails) {
            value = emails[i].trim();
            valid = valid && validateEmail(value);
        }
        return valid;
    };

    $('#to').keypress(function(e){
        
        if (e.which==13){
            e.preventDefault();
            $('#sendreferral').click();
        }
    });


    $('#sendreferral').click(function () {

        var to = $('#to').val();

        if (to.length == 0) {
            $('#emailerrorrequired').modal('show');
            return;
        }
        else if (!validateEmails($('#to'))) {
            $('#emailerrorrequired').modal('show');
            return;
        }


        initializeModal();
        $('#myModal').modal('show');


        if (isOnline) {

            var param = {
                'email': to,
                'referrerEmail': $.jStorage.get('username'),
                'sourceIdentifier':'mysolarcitymobileapp'
            };
            var myRequest = amplify.request({
                resourceId: 'ajaxRefer',
                data: param,
                success: function (msg) {
                    var mb = $('#modalbody');
                    if (mb.is(':not(:visible)')) {
                        $('#myModal').modal('show');
                    }
                    $('#pbar').removeClass();
                    $('#pbar').addClass("progress progress-success progress-striped");
                    $('#modalbodymessage').text('Thank you for referring us to your friend.')
                    $('#modalheaderlabel').text('Success!');
                    $('#to').val("");
                },
                error: function (msg) {
                    $('#pbar').removeClass();
                    $('#pbar').addClass("progress progress-warning progress-striped");
                    $('#modalbodymessage').text("I wasn't able to send it. Please try again later.")
                    $('#modalheaderlabel').text('Oops!');
                }
            });
        } else {
            $('#pbar').removeClass();
            $('#pbar').addClass("progress progress-warning progress-striped");
            $('#modalbodymessage').text("You're currently offline right now.  Please try again later.")
            $('#modalheaderlabel').text('Oops!');
        }
    });

    $('#closemodalbutton').click(function () {
        $('#myModal').modal('hide');
    });

﻿})();
