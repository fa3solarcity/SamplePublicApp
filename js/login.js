/// <reference path="vendor/require.js" />
/// <reference path="vendor/amplify.min.js" /

// Wait for Cordova to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
//
function onDeviceReady() {
    try{
        navigator.splashscreen.hide();
        alert('splash hide');
    } catch (err) { alert(err.message);}
}

(function () {
    $(document).ready(function () {
        var make_base_auth = function (user, password) {
            var tok = user + ':' + password;
            var hash = Base64.encode(tok);
            return "Basic " + hash;
        };

        
        //prevents safari from opening a new window when site is bookmarked.
        var a = document.getElementsByTagName("a");
        for (var i = 0; i < a.length; i++) {
            a[i].onclick = function () {
                window.location = this.getAttribute("href");
                return false
            }
        }
		
		//checking if device is online or offline
	    var isOnline = true;
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
        
        var emailInCookie = $.jStorage.get('savedusername');
        if (emailInCookie) {
            $('#inputEmail').val(emailInCookie);
        }
	
        amplify.request({
            resourceId: 'ajaxPing'
        });
	
	$('#inputPassword').keypress(function (e) {
	  
	  if (e.which == 13) {
		e.preventDefault();
	    $('#loginButton').click();
	  }
	});
		//checking if the username was logged out automatically by the system 
		//if yes, lets check if the system can relog the user
		var savedusername = $.jStorage.get('savedusername');
		var lastloggedinuser = $.jStorage.get('username');
		var userloggedout = $.jStorage.get('userloggedout');
		if (savedusername && lastloggedinuser && userloggedout != true && savedusername.toLowerCase() == lastloggedinuser.toLowerCase()){
			//user was logged out automatically and last logged in user matches with saved user
		    //lets automatically login user
		    alert('1');
		    navigator.splashscreen.hide();
		    window.location.href = 'chart.htm';
		    alert('2');
		    return;
		}
		alert(savedusername + "-" + lastloggedinuser);
		alert('3');
        $('#loginButton').click(function () {	
		$.jStorage.set('userloggedout', true, {TTL: 30*24*60*60*1000});
		var e = $('#inputEmail').val();
		var p = $('#inputPassword').val();

        //username and password needs to be filled in.
		if (e.length == 0 || p.length == 0) {
		    $('#invalidUsernamePasswordModal .modal-body p').text('Username and password is required.');
		    $('#invalidUsernamePasswordModal').modal('show');
		    return;
		}
		alert('3.1');
        //used by request.js
		basicAuth = make_base_auth(e, p)
		alert('3.2');
		var myRequest = amplify.request({
		    resourceId: 'ajaxLogin',
		    success: function (data, xhr) {
		        if (data.isAuthenticated == true) {
		            if ($('#rememberMeCheckbox').prop('checked')) {
		                $.jStorage.set('savedusername', e, { TTL: 30 * 24 * 60 * 60 * 1000 });
		            }
		            $.jStorage.set('username', e, { TTL: 30 * 24 * 60 * 60 * 1000 });
		            //save for 30 days				
		            $.jStorage.set(e.replace("@", "_"), p, { TTL: 30 * 24 * 60 * 60 * 1000 });
		            $.jStorage.set('userloggedout', false, { TTL: 30 * 24 * 60 * 60 * 1000 });
		            //var jqxhr = $.get("https://api.solarcity.com/MySolarCity/Api/V1/Monitoring?email=" + e + "&password=" + p + "&_=" + new Date(), function (data) {
		            if (data.isMonitoringReady == true) {
		                var isfirstuse = $.jStorage.get("isfirstuse");
		                if (isfirstuse == false) {
		                    window.location.href = "chart.htm";
		                } else {
		                    $.jStorage.set('isfirstuse', false, { TTL: 12 * 30 * 24 * 60 * 60 * 1000 });
		                    window.location.href = 'instructions.html';
		                }
		            } else {
		                window.location.href = "nonpto.html?message=" + encodeURIComponent(data.message);
		            }

		        } else {
		            $('#invalidUsernamePasswordModal .modal-body p').text('Please retry typing in your username and password.');
		            $('#invalidUsernamePasswordModal').modal('show');
		        }
		    },
		    error: function (status, xhr) {
		        if (status === 'fail' && xhr.status === 401) {
		            $('#invalidUsernamePasswordModal .modal-body p').text('Invalid username or password.');
		            $('#invalidUsernamePasswordModal').modal('show');
		        } else {
		            if (isOnline || window.navigator.onLine) {
		                $('#invalidUsernamePasswordModal .modal-body p').text('There was a problem connecting to the server');
		                $('#invalidUsernamePasswordModal').modal('show');
		            } else {
		                //let's load from somewhere, for now let's get it from storage and compare
		                var pass = $.jStorage.get(e);
		                if (e && p && p == pass) {
		                    window.location.href = "chart.htm";
		                } else {
		                    //nothing from storage or doesnt match, lets display the error
		                    $('#invalidUsernamePasswordModal .modal-body p').text("You're currently offline right now.  Please try again later.");
		                    $('#invalidUsernamePasswordModal').modal('show');
		                }
		            }
		        }
		    }
		});

        });
    });
})();
