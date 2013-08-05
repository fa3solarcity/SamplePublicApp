/// <reference path="vendor/amplify.min.js" /

    amplify.request.decoders.mydecoder =
    function (data, status, xhr, success, error) {
        if (status === "success") {
            success(data, xhr);
        } else if (status === "fail" || status === "error") {
            if (xhr.status == 401) {
                error("fail", xhr);
                return;
            }
            error(status, xhr);
        } else {
            error("fatal", xhr);
        }
    };

    amplify.request.define('ajaxLogin', 'ajax', {
        url: 'https://api.solarcity.com/MySolarCity/Api/V4/Authenticate',
        dataType: 'json',
        type: 'GET',
        cache: false,
        timeout: 7000,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", basicAuth);
            return true;
        },
        decoder: "mydecoder"
    });

    amplify.request.define('ajaxGetPVChart', 'ajax', {
        url: 'https://api.solarcity.com/MySolarCity/Api/V3/PVGraph?rangeType={rangeType}&chartDate={chartDate}&chartWidth={chartWidth}&chartHeight={chartHeight}&isMobile={isMobile}',
        dataType: 'json',
        type: 'GET',
        cache: false,
        timeout: 30000,       
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", basicAuth);
            return true;
        },
        decoder: "mydecoder"
    });
        
    amplify.request.define('ajaxRefer', 'ajax', {
        url: 'https://api.solarcity.com/Salesforce/Api/V1/Referral/SendMobileAppReferral?sourceIdentifier={sourceIdentifier}&referrerEmail={referrerEmail}&email={email}& &development={development}',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        cache: false,
        timeout: 5000
    });

    amplify.request.define('ajaxPing', 'ajax', {
        url: 'https://api.solarcity.com/MySolarCity/Api/V1/Ping',
        dataType: 'json',
        type: 'GET',
        cache: false,
        timeout: 5000
    });

    amplify.request.define('ajaxResource', 'ajax', {
        url: 'https://api.solarcity.com/MySolarcity/api/V1/Message/key={key}',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        cache: false,
        timeout: 5000
    });

    amplify.request.define('ajaxResources', 'ajax', {
        url: 'https://api.solarcity.com/MySolarcity/api/V1/Message/GetValues?key={key}',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        cache: false,
        timeout: 5000
    });