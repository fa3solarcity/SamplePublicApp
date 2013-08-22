(function () {
    $(document).ready(function () {
        alert('4');
        setTimeout(function () {
            navigator.splashscreen.hide();
        }, 2000);

        var make_base_auth = function (user, password) {
            var tok = user + ':' + password;
            var hash = Base64.encode(tok);
            return "Basic " + hash;
        };

        var chartDataTimeout = 60 * 60 * 1000;
        var currentChartDataRefresh = 14 * 60 * 1000;

        //for now were flushing the storage.
        var user = $.jStorage.get('username');
        var pass = $.jStorage.get(user.replace("@", "_"));

        //used by request.js
        basicAuth = make_base_auth(user, pass)
        alert(basicAuth);
        if (user && user.length < 1) {
            window.location.href = "index.html";
        }

        //checking if device is online or offline
        var isOnline = false;

        function checkOnlineStatus() {
            isOnline = window.navigator.onLine;
        };
        //lets get the initial status;
        checkOnlineStatus();


        function getWidth() {
            if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                return document.documentElement.clientWidth;
            } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                return document.body.clientWidth;
            }
            // Browser isn't returning its width, pick a reasonable value.
            return 800;
        }

        function getHeight() {
            if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                return document.documentElement.clientHeight - 180;
            } else
                if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                return document.body.clientHeight - 180;
            }
            // Browser isn't returning its height, pick a reasonable value.
            return 300;
        }

        var initializeDaySlider = function () {
        	var is = '';
            for (var i = 0; i < 60; i++) {
                is += "<li style='display:none'><div><span></span><div class='timeoutimage' style='text-align:center;display:none;'><hr class='tighthr'><label style='padding-top:100px;'>Unable to get data from the server. <br/>Please try again later.</label></div><div class='chartdivimage'><hr class='tighthr'><table cellspacing='0' cellpadding='3' border='0' align='center' style='border-color:White;margin-top:0px;' class='chart-energy'><tbody><tr><td class='legend' style='display:none'><div style='background-color:#7DCA65;' class='legendColor-mobile' ></div></td><td style='font-size:x-small' class='label-mobile productionLabel'></td><td class='legend' style='display:none;'><div style='background-color:#2E5FA2;' class='legendColor-mobile'></div></td><td style='font-size:x-small;display:none;' class='label-mobile consumptionLabel'></td></tr></tbody></table><img src='img/loading.gif' data-rangeType='Day' data-srcloaded='false' data-chartdate=''></div></div></li>";
            }
        	$('#daySlider ul').html(is);
        };

        var initializeWeekSlider = function () {
            var ws = '';
            for (var i = 0; i < 52; i++) {
                ws += "<li style='display:none'><div>Week of <span></span><div class='timeoutimage' style='text-align:center;display:none;'><hr class='tighthr'><label style='padding-top:100px;'>Unable to get data from the server. <br/>Please try again later.</label></div><div class='chartdivimage'><hr class='tighthr'><table cellspacing='0' cellpadding='3' border='0' align='center' style='border-color:White;margin-top:0px;' class='chart-energy'><tbody><tr><td class='legend' style='display:none'><div style='background-color:#7DCA65;' class='legendColor-mobile' ></div></td><td style='font-size:x-small' class='label-mobile productionLabel'></td><td class='legend' style='display:none;'><div style='background-color:#2E5FA2;' class='legendColor-mobile'></div></td><td style='font-size:x-small;display:none' class='label-mobile consumptionLabel'></td></tr></tbody></table><img src='img/loading.gif' data-rangeType='Week' data-srcloaded='false' data-chartdate=''></div></div></li>";
            }
            $('#weekSlider ul').html(ws);
        };

        var initializeMonthSlider = function () {
            var ms = '';
            for (var i = 0; i < 13; i++) {
                ms += "<li style='display:none'><div><span></span><div class='timeoutimage' style='text-align:center;display:none;'><hr class='tighthr'><label style='padding-top:100px;'>Unable to get data from the server. <br/>Please try again later.</label></div><div class='chartdivimage'><hr class='tighthr'><table cellspacing='0' cellpadding='3' border='0' align='center' style='border-color:White;margin-top:0px;' class='chart-energy'><tbody><tr><td class='legend' style='display:none'><div style='background-color:#7DCA65;' class='legendColor-mobile' ></div></td><td style='font-size:x-small' class='label-mobile productionLabel'></td><td class='legend' style='display:none;'><div style='background-color:#2E5FA2;' class='legendColor-mobile'></div></td><td style='font-size:x-small;display:none;' class='label-mobile consumptionLabel'></td></tr></tbody></table></div><img src='img/loading.gif' data-rangeType='Month' data-srcloaded='false' data-chartdate=''></div></div></li>";
            }
            $('#monthSlider ul').html(ms);
        };

        var initializeYearSlider = function () {
            var ys = '';
            for (var i = 0; i < 4; i++) {
                ys += "<li style='display:none'><div><span></span><div class='timeoutimage' style='text-align:center;display:none;'><hr class='tighthr'><label style='padding-top:100px;'>Unable to get data from the server. <br/>Please try again later.</label></div><div class='chartdivimage'><hr class='tighthr'><table cellspacing='0' cellpadding='3' border='0' align='center' style='border-color:White;margin-top:0px;' class='chart-energy'><tbody><tr><td class='legend' style='display:none'><div style='background-color:#7DCA65;' class='legendColor-mobile' ></div></td><td style='font-size:x-small' class='label-mobile productionLabel'></td><td class='legend' style='display:none;'><div style='background-color:#2E5FA2;' class='legendColor-mobile'></div></td><td style='font-size:x-small;display:none;' class='label-mobile consumptionLabel'></td></tr></tbody></table><img src='img/loading.gif' data-rangeType='Year' data-srcloaded='false' data-chartdate=''></div></div></li>";
            }
            $('#yearSlider ul').html(ys);
        };

        var loadTimeoutDiv = function (node) {
            node.find('.chartdivimage').hide();
            node.find('.timeoutimage').show();
            node.find('.timeoutimage').css('height', getHeight());
            node.find('.timeoutimage').css('width', getWidth());
        };

        var loadingProgressDataDiv = function (node) {
            node.find('.chartdivimage').show();
            node.find('.timeoutimage').hide();
            node.find('img').addClass('padimage');
            node.find('img').attr('src', 'img/loading.gif');
            node.find('.productionLabel').text('');
            node.find('.legend').eq(0).hide();
            node.find('.legend').eq(1).hide();
            node.find('.consumptionLabel').hide();
            node.find('.consumptionLabel').text('');
        };

        var loadDataDiv = function (node, data) {
            node.find('img').removeClass('padimage');
            node.find('.chartdivimage').show();
            node.find('.timeoutimage').hide();
            node.find('img').removeClass('padimage');
            node.find('img')
                .attr('src', 'data:image/png;base64,' + data.imageData);
            node.find('.productionLabel').text(data.chartTotalOutputText);
            node.find('.legend').eq(0).show();
            if (data.chartTotalConsumption != '0.0') {
                node.find('.legend').eq(1).show();
                node.find('.consumptionLabel').show();
                node.find('.consumptionLabel').text(data.chartTotalConsumptionText);
            }
        };

        var loadCurrentDay = function (loadDayCallback) {
            var cc = $('#daySlider ul li:nth-child(60) img')
                .attr('data-chartdate');
            loadingProgressDataDiv($('#daySlider ul li:nth-child(60)'));
            var storageKey = user + "-" + "DayData2" + "-" + cc + "-" + getWidth() + "-" + getHeight();
            amplify.request({
                resourceId: 'ajaxGetPVChart',
                data: {
                    rangeType: "Day",
                    chartDate: cc,
                    chartWidth: getWidth(),
                    chartHeight: getHeight(),
                    isMobile: true
                },
                success: function (data, status) {

                    loadDataDiv($('#daySlider ul li:nth-child(60)'), data);
                    //save to storage for 30 days        	
                    $.jStorage.set(storageKey, data, {
                        TTL: chartDataTimeout
                    });
                    //we're loading the dayslider as soon as it's populated.
                    if (loadDayCallback != null) {
                        loadDayCallback();
                    }
                },
                error: function (status, xhr) {
                    if (status === 'fail' && xhr.status === 401) {
                        $.jStorage.set('userloggedout', true, { TTL: 30 * 24 * 60 * 60 * 1000 });
                        window.location.href = 'index.html';
                    } else {
                        //alert('Error fetching chart.  Try again later.');
                        //load from storage
                        var storedData = $.jStorage.get(storageKey);
                        if (storedData) {
                            loadDataDiv($('#daySlider ul li:nth-child(60)'), storedData);
                        } else {
                            loadTimeoutDiv($('#daySlider ul li:nth-child(60)'));
                        }
                        if (loadDayCallback != null) {
                            loadDayCallback();
                        }
                    }
                }
            });

        };

        var loadCurrentWeek = function () {
            var ww = $('#weekSlider ul li:nth-child(52) img')
                .attr('data-chartdate');
            loadingProgressDataDiv($('#weekSlider ul li:nth-child(52)'));
            var storageKey = user + "-" + "WeekData2" + "-" + ww + "-" + getWidth() + "-" + getHeight();
            amplify.request({
                resourceId: 'ajaxGetPVChart',
                data: {
                    rangeType: "Week",
                    chartDate: ww,
                    chartWidth: getWidth(),
                    chartHeight: getHeight(),
                    isMobile: true
                },
                success: function (data, status) {
                    loadDataDiv($('#weekSlider ul li:nth-child(52)'), data);
                    //save to storage for 30 days			
                    $.jStorage.set(storageKey, data, {
                        TTL: chartDataTimeout
                    });
                },
                error: function (status, xhr) {
                    if (status === 'fail' && xhr.status === 401) {
                        $.jStorage.set('userloggedout', true, { TTL: 30 * 24 * 60 * 60 * 1000 });
                        window.location.href = 'index.html';
                    } else {
                        //alert('Error fetching chart.  Try again later.');
                        //load from storage
                        var storedData = $.jStorage.get(storageKey);
                        if (storedData) {
                            loadDataDiv($('#weekSlider ul li:nth-child(52)'), storedData);
                        } else {
                            loadTimeoutDiv($('#weekSlider ul li:nth-child(52)'));
                        }
                    }
                }
            });
        };

        var loadCurrentMonth = function () {
            var mm = $('#monthSlider ul li:nth-child(13) img')
                .attr('data-chartdate');
            loadingProgressDataDiv($('#monthSlider ul li:nth-child(13)'));
            var storageKey = user + "-" + "MonthData2" + "-" + mm + "-" + getWidth() + "-" + getHeight();
            amplify.request({
                resourceId: 'ajaxGetPVChart',
                data: {
                    rangeType: "Month",
                    chartDate: mm,
                    chartWidth: getWidth(),
                    chartHeight: getHeight(),
                    isMobile: true
                },
                success: function (data, status) {
                    loadDataDiv($('#monthSlider ul li:nth-child(13)'), data);
                    //save to storage
                    $.jStorage.set(storageKey, data, {
                        TTL: chartDataTimeout
                    });
                },
                error: function (status, xhr) {
                    if (status === 'fail' && xhr.status === 401) {
                        $.jStorage.set('userloggedout', true, { TTL: 30 * 24 * 60 * 60 * 1000 });
                        window.location.href = 'index.html';
                    } else {
                        //alert('Error fetching chart.  Try again later.');
                        //load from storage
                        var storedData = $.jStorage.get(storageKey);
                        if (storedData) {
                            loadDataDiv($('#monthSlider ul li:nth-child(13)'), storedData);
                        } else {
                            loadTimeoutDiv($('#monthSlider ul li:nth-child(13)'));
                        }
                    }
                }
            });
        };

        var loadCurrentYear = function () {
            var yy = $('#yearSlider ul li:nth-child(4) img')
                .attr('data-chartdate');
            loadingProgressDataDiv($('#yearSlider ul li:nth-child(4)'));
            var storageKey = user + "-" + "YearData2" + "-" + yy + "-" + getWidth() + "-" + getHeight();
            amplify.request({
                resourceId: 'ajaxGetPVChart',
                data: {
                    rangeType: "Year",
                    chartDate: yy,
                    chartWidth: getWidth(),
                    chartHeight: getHeight(),
                    isMobile: true
                },
                success: function (data, status) {
                    loadDataDiv($('#yearSlider ul li:nth-child(4)'), data);
                    //save to storage
                    $.jStorage.set(storageKey, data, {
                        TTL: chartDataTimeout
                    });
                },
                error: function (data, status) {
                    if (status === 'fail' && xhr.status === 401) {
                        $.jStorage.set('userloggedout', true, { TTL: 30 * 24 * 60 * 60 * 1000 });
                        window.location.href = 'index.html';
                    } else {
                        //alert('Error fetching chart.  Try again later.');
                        //load from storage
                        var storedData = $.jStorage.get(storageKey);
                        if (storedData) {
                            loadDataDiv($('#yearSlider ul li:nth-child(4)'), storedData);
                        } else {
                            loadTimeoutDiv($('#yearSlider ul li:nth-child(4)'));
                        }
                    }
                }
            });
        };

        var refreshCurrentValues = function (cb) {
            //reload the current charts
            loadCurrentDay(cb);
            loadCurrentWeek();
            loadCurrentMonth();
            loadCurrentYear();
        };

        var reInitializeDaySlider = function () {
            $('#daySlider ul li').each(function (index) {
                var d = (60 - index - 1)
                    .days()
                    .ago();
                var ds = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
                $(this).find('span').text(d.toString('ddd, MMM dd, yyyy'));
                $(this).find('img').attr('data-chartdate', ds);
                $(this).find('img').attr('data-srcloaded', 'false');
                $(this).find('img').addClass('padimage');
                $(this).find('img').attr('src', 'img/loading.gif');
                $(this).find('.productionLabel').text('');
                $(this).find('.consumptionLabel').text('');
            });

        };

        var reInitializeWeekSlider = function () {
            var weekStartingDate = Date.today()
                .next().sunday();
            $($('#weekSlider ul li').get().reverse()).each(function (index) {
                var w = weekStartingDate
                    .addWeeks(-1);
                var ws = w.getMonth() + 1 + "/" + w.getDate() + "/" + w.getFullYear();
                $(this).find('span').text(w.toString('MMM dd, yyyy'));
                $(this).find('img').attr('data-chartdate', ws);
                $(this).find('img').attr('data-srcloaded', 'false');
                $(this).find('img').attr('src', 'img/loading.gif');
                $(this).find('img').addClass('padimage');
                $(this).find('.productionLabel').text('');
                $(this).find('.consumptionLabel').text('');
            });
        };

        var reInitializeMonthSlider = function () {
            var monthStartingDate = Date.today().addMonths(1)
                .set({
                    day: 1,
                    hour: 1,
                    minute: 0
                });
            $($('#monthSlider ul li').get().reverse()).each(function (index) {
                var m = monthStartingDate.addMonths(-1);
                var ms = m.getMonth() + 1 + "/" + m.getDate() + "/" + m.getFullYear();
                $(this).find('span').text(m.toString('MMM yyyy'));
                $(this).find('img').attr('data-chartdate', ms);
                $(this).find('img').attr('data-srcloaded', 'false');
                $(this).find('img').attr('src', 'img/loading.gif');
                $(this).find('img').addClass('padimage');
                $(this).find('.productionLabel').text('');
                $(this).find('.consumptionLabel').text('');
            });
        };

        var reInitializeYearSlider = function () {
            var yearStartingDate = Date.today().addYears(1)
                 .set({
                     month: 0,
                     day: 1,
                     hour: 1,
                     minute: 0
                 });
            $($('#yearSlider ul li').get().reverse()).each(function (index) {
                var y = yearStartingDate.addYears(-1);
                var ys = y.getMonth() + 1 + "/" + y.getDate() + "/" + y.getFullYear();
                $(this).find('span').text(y.toString('yyyy'));
                $(this).find('img').attr('data-chartdate', ys);
                $(this).find('img').attr('data-srcloaded', 'false');
                $(this).find('img').attr('src', 'img/loading.gif');
                $(this).find('img').addClass('padimage');
                $(this).find('.productionLabel').text('');
                $(this).find('.consumptionLabel').text('');
            });
        };

        var reinitializeSliders = function () {
            //if next day then we recreate the day slider
            var lastDate = Date.parse($('#daySlider ul li:nth-child(60) img')
                .attr('data-chartdate'));
            var dateToday = Date.today();
            if (lastDate.clearTime().toString() != dateToday.clearTime().toString()) {
                //its the next day, so we need to reload the sliders
                reInitializeDaySlider();
                reInitializeWeekSlider();
                reInitializeMonthSlider();
                reInitializeYearSlider();
            }
            //console.log(lastDate.clearTime().toString());
        }
        alert('5');
        initializeDaySlider();
        reInitializeDaySlider();
        initializeWeekSlider();
        reInitializeWeekSlider();
        initializeMonthSlider();
        reInitializeMonthSlider();
        initializeYearSlider();
        reInitializeYearSlider();
        refreshCurrentValues(function () {
        });

        var lastRefreshedDate = Date.today();
        setInterval(function () {
            if (window.navigator.onLine) {
                //triggers every 10 minutes
                reinitializeSliders();
                refreshCurrentValues();
            }
        }, (currentChartDataRefresh));

        var currentRangeType = "Day";

        $('#initialloaddiv').hide();
        $('#mainbodydiv').show();
        loadingProgressDataDiv($('#daySlider ul li:nth-child(60)'));
        
        $('#daySlider')
            .show();
        var swipeSliders = new Swipe(document.getElementById('sliders'), {
            callback: function (e, e1, e2) {
                loadingProgressDataDiv($(e2));
                var cdate = $(e2)
                    .find('img')
                    .attr('data-chartdate');

                var srcloaded = $(e2)
                    .find('img')
                    .attr('data-srcloaded');
                var rType = $(e2).parent().parent().attr('data-rangetype');
                var storageKey = user + "-" + rType + "Data2-" + cdate + "-" + getWidth() + "-" + getHeight();

                if (srcloaded == 'false') {
                    var isLastChild = $(e2).is(':last-child');
                    var isLoadedFromStorage = false;

                    // we attempt to load it from storage first if its NOT the last child (old record).
                    if (!isLastChild) {
                        var storedData = $.jStorage.get(storageKey);
                        if (storedData) {
                            loadDataDiv($(e2), storedData);
                            // not sure if I should set it to loaded, might want to reload it when possible to load.
                            $(e2)
                                .find('img')
                                .attr('srcloaded', 'true');
                            isLoadedFromStorage = true;
                        }
                    }
                    //otherwise its the last child so its the current date and needs to be fetched from the server first.
                    if (!isLoadedFromStorage) {
                        var rType = $(e2)
                            .parent().parent()
                            .attr('data-rangeType');
                        var myRequest1 = amplify.request({
                            resourceId: 'ajaxGetPVChart',
                            data: {
                                email: encodeURIComponent(user),
                                password: encodeURIComponent(pass),
                                rangeType: rType,
                                chartDate: cdate,
                                chartWidth: getWidth(),
                                chartHeight: getHeight(),
                                isMobile: true
                            },
                            success: function (data, status) {
                                loadDataDiv($(e2), data);
                                //its ok to set this to true since we do load the current slides per range
                                $(e2)
                                    .find('img')
                                    .attr('srcloaded', 'true');
                                //save to storage
                                $.jStorage.set(storageKey, data, {
                                    TTL: chartDataTimeout
                                });
                            },
                            error: function (status, xhr) {
                                if (status === 'fail' && xhr.status === 401) {
                                    $.jStorage.set('userloggedout', true, { TTL: 30 * 24 * 60 * 60 * 1000 });
                                    window.location.href = 'index.html';
                                } else {
                                    //alert('Error fetching chart.  Try again later.');
                                    //load from storage
                                    var storedData = $.jStorage.get(storageKey);
                                    if (storedData) {
                                        loadDataDiv($(e2), storedData);
                                    } else {
                                        loadTimeoutDiv($(e2));
                                    }
                                    // not sure if I should set it to loaded, might want to reload it when possible to load.
                                    $(e2)
                                        .find('img')
                                        .attr('srcloaded', 'true');
                                }
                            }
                        });
                    }
                }
            },
            callbackGetData: function (e, e1, e2) {
                var switchRangeType = $(e2)
                    .parent().parent()
                    .attr('data-rangeType');
                if (switchRangeType != currentRangeType) {
                    currentRangeType = switchRangeType;
                    $('div .btn-group a.disabled')
                        .removeClass('disabled');
                    $('#link' + switchRangeType)
                        .addClass('disabled');
                }
            }
        });

        $('div .btn-group a')
            .click(function (event) {
                var a = $('#' + event.target.id);
                var index = $('div .btn-group a')
                    .index(a);
                $('div .btn-group a')
                    .removeClass('disabled');
                //a.addClass('disabled');
                $(this).addClass('disabled');
                swipeSliders.switchSlider(index);
            });

        $('#logoutButton').click(function (e) {
            e.preventDefault();
            $.jStorage.set('userloggedout', true, { TTL: 30 * 24 * 60 * 60 * 1000 });
            window.location.href = 'index.html';
        });

        window.addEventListener("online", function (e) {
            isOnline = true;
            //let's start refreshing the current graphs since we detected that were online
            //we need to be able to scope make sure this doesnt get triggered multiple times 
            if (Date.compare(lastRefreshedDate.addMinutes(10), Date.today()) >= 0) {
                reinitializeSliders();
                refreshCurrentValues();
                lastRefreshedDate = Date.today();
            }
        }, false);
        alert('6');
        window.addEventListener("offline", function (e) {
            isOnline = false;
        }, false);

    });
})();
