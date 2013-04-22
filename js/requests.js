/// <reference path="vendor/amplify.min.js" /

    amplify.request.decoders.appEnvelope =
    function (data, status, xhr, success, error) {
        if (data.status === "success") {
            success(data.data);
        } else if (data.status === "fail" || data.status === "error") {
            error(data.message, data.status);
        } else {
            error(data.message, "fatal");
        }
    };

    amplify.request.define('ajaxLogin', 'ajax', {
        url: 'http://api.solarcity.com/MySolarCity/Api/V2/Authenticate?email={email}&password={password}',
        dataType: 'json',
        type: 'GET',
        cache: false,
        timeout: 7000
    });

    amplify.request.define('ajaxGetPVChart', 'ajax', {
        url: 'http://api.solarcity.com/MySolarCity/Api/V2/PVGraph?email={email}&password={password}&rangeType={rangeType}&chartDate={chartDate}&chartWidth={chartWidth}&chartHeight={chartHeight}&isMobile={isMobile}',
        dataType: 'json',
        type: 'GET',
        cache: false,
        timeout: 30000
    });
        
    amplify.request.define('ajaxRefer', 'ajax', {
        url: 'http://api.solarcity.com/Salesforce/Api/V1/Referral/SendMobileAppReferral?sourceIdentifier={sourceIdentifier}&referrerEmail={referrerEmail}&email={email}& &development={development}',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        cache: false,
        timeout: 5000
    });

    amplify.request.define('ajaxPing', 'ajax', {
        url: 'http://api.solarcity.com/MySolarCity/Api/V1/Ping',
        dataType: 'json',
        type: 'GET',
        cache: false,
        timeout: 5000
    });
