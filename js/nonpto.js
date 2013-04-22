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

    var message = getParameterByName('message');
    if (message.length > 0) {
        $('#messageHolder').text(message);
    }

    $('#logoutButton').click(function (e) {
        e.preventDefault();
        $.jStorage.set('userloggedout', true, { TTL: 30 * 24 * 60 * 60 * 1000 });
        window.location.href = 'index.html';
    });

})();