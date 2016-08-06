/***
 *                                 _____ _ _            _   _
 *         /\                     / ____| (_)          | | (_)
 *        /  \   _ __ ___  __ _  | |    | |_  ___ _ __ | |_ _
 *       / /\ \ | '__/ _ \/ _` | | |    | | |/ _ \ '_ \| __| |
 *      / ____ \| | |  __/ (_| | | |____| | |  __/ | | | |_| |
 *     /_/    \_\_|  \___|\__,_|  \_____|_|_|\___|_| |_|\__|_|
 *
 *
 */

var isValidDate = function (dateStr) {
    if (dateStr == undefined)
        return false;
    var dateTime = Date.parse(dateStr);

    if (isNaN(dateTime)) {
        return false;
    }
    return true;
};

var getDateDifference = function (fromDate, toDate) {
    //console.log(Date.parse(toDate) - Date.parse(fromDate));
    return Date.parse(toDate) - Date.parse(fromDate);
};

var isValidDateRange = function (fromDate, toDate) {
    if (fromDate == "" || toDate == "")
        return true;
    if (isValidDate(fromDate) == false) {
        return false;
    }
    if (isValidDate(toDate) == true) {
        var days = getDateDifference(fromDate, toDate);
        if (days < 0) {
            return false;
        }
    }
    return true;
};



/***
 *       _____      _    _____                 _
 *      / ____|    | |  / ____|               (_)
 *     | |  __  ___| |_| (___   ___ _ ____   ___  ___ ___
 *     | | |_ |/ _ \ __|\___ \ / _ \ '__\ \ / / |/ __/ _ \
 *     | |__| |  __/ |_ ____) |  __/ |   \ V /| | (_|  __/
 *      \_____|\___|\__|_____/ \___|_|    \_/ |_|\___\___|
 *
 *
 */
angular.module('get', [], null).
factory('GET', GetService);

function GetService($window){
    var str = $window.location.search;
    str = str.replace(/^\?/, '');
    str = str.replace(/\/?$/, '');
    var params = {};
    var pairs = str.split('&');
    for (var i = 0; i < pairs.length; i++) {
        var parts = pairs[i].split('=', 2);
        if (parts.length === 2) {
            params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
        }
    }
    return params;
}

/***
 *      _                  _____                 _
 *     | |                / ____|               (_)
 *     | |     ___   __ _| (___   ___ _ ____   ___  ___ ___
 *     | |    / _ \ / _` |\___ \ / _ \ '__\ \ / / |/ __/ _ \
 *     | |___| (_) | (_| |____) |  __/ |   \ V /| | (_|  __/
 *     |______\___/ \__, |_____/ \___|_|    \_/ |_|\___\___|
 *                   __/ |
 *                  |___/
 */
angular.module('log', ['get'], null).
factory('log', LogService);

function LogService($location, $window, GET){
    var LEVELS = ['log', 'info', 'warn', 'error'];

    function logToRichConsole(timestamp, level, tag, items) {
        var fmt = '';
        var args = [];

        fmt += '%s ';
        args.push(timestamp);

        if (log.useColors) {
            var style = log.styles[tag] || '';
            fmt += '%c%s%c';
            args = args.concat(['font-weight: bold;' + style, tag, style]);
        } else {
            fmt += '[%s]';
            args.push(tag);
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isString = typeof(item) === 'string';
            fmt += isString ? ' %s' : ' %o';
            args.push(item);
        }

        args.splice(0, 0, fmt);
        $window.console[level].apply(console, args);
    }

    function getPlainTextLog(timestamp, level, tag, items) {
        var str = timestamp  + ' ' + level.toUpperCase() + ' [' + tag + ']';

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isString = typeof(item) === 'string';
            str += ' ' + (isString ? item : JSON.stringify(item));
        }

        return str;
    }

    function addToBuffer(str) {
        if (!log.buffer) {
            log.buffer = '';
        }
        log.buffer += str + '\n';
    }

    function logBase(level, tag) {
        var items = [].slice.call(arguments, 2);
        var timestamp = new Date().toLocaleTimeString();

        var plainTextLog = getPlainTextLog(timestamp, level, tag, items);

        //console.log(plainTextLog);

        if (LEVELS.indexOf(level) < LEVELS.indexOf(log.minLevel)) {
            return;
        }

        addToBuffer(plainTextLog);

        if ($window.console) {
            /* IE 8 does not have apply() on console.log, so just
             log plain text there. */
            if ($window.console[level] && $window.console[level].apply) {
                logToRichConsole(timestamp, level, tag, items);
            } else {
                ($window.console[level] || $window.console.log)(plainTextLog);
            }
        }
    }

    var log = logBase.bind(null, 'log');
    log.info = logBase.bind(null, 'info');
    log.warn = logBase.bind(null, 'warn');
    log.error = logBase.bind(null, 'error');

    log.tagged = function(tag /*, level */) {
        var level = arguments.length > 1 ? arguments[1] : 'log';
        return logBase.bind(null, level, tag);
    };

    log.useColors = false;
    log.styles = [];
    log.minLevel = $location.search()['logLevel'] || GET['logLevel'] || 'info';

    return log;
}

var customersAreaApp =
    angular
        .module('customersAreaApp',
            ['ngResource', 'ngAnimate', 'ui.bootstrap', 'angular-jsonrpc-client', 'get', 'log']
        )
        .config(function (jsonrpcConfigProvider) {

            jsonrpcConfigProvider.set(
                {
                    servers: [
                        {
                            name: 'quote',
                            url: '/rpc/quote'
                        },
                    ]
                });
        });




customersAreaApp.directive('dateLowerThan', ["$filter", function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var validateDateRange = function (inputValue) {
                var fromDate = $filter('date')(inputValue, 'short');
                var toDate = $filter('date')(attrs.dateLowerThan, 'short');
                var isValid = isValidDateRange(fromDate, toDate);
                ctrl.$setValidity('dateLowerThan', isValid);
                return inputValue;
            };

            ctrl.$parsers.unshift(validateDateRange);
            ctrl.$formatters.push(validateDateRange);
            attrs.$observe('dateLowerThan', function () {
                validateDateRange(ctrl.$viewValue);
            });
        }
    };
}]);

customersAreaApp.directive('dateGreaterThan', ["$filter", function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var validateDateRange = function (inputValue) {
                var fromDate = $filter('date')(attrs.dateGreaterThan, 'short');
                var toDate = $filter('date')(inputValue, 'short');
                var isValid = isValidDateRange(fromDate, toDate);
                ctrl.$setValidity('dateGreaterThan', isValid);
                return inputValue;
            };

            ctrl.$parsers.unshift(validateDateRange);
            ctrl.$formatters.push(validateDateRange);
            attrs.$observe('dateGreaterThan', function () {
                validateDateRange(ctrl.$viewValue);

            });
        }
    };
}]);


/***
 *      __  __       _        _____ _        _
 *     |  \/  |     (_)      / ____| |      | |
 *     | \  / | __ _ _ _ __ | |    | |_ _ __| |
 *     | |\/| |/ _` | | '_ \| |    | __| '__| |
 *     | |  | | (_| | | | | | |____| |_| |  | |
 *     |_|  |_|\__,_|_|_| |_|\_____|\__|_|  |_|
 *
 *
 */
function MainCtrl($scope, $rootScope, $resource, $timeout, log){
    log.info('Instancing controller MainCtrl');

    // $rootScope.unreadQuotes = $resource('http://localhost:1337/quote').query(function (elements) {
    //     if (elements.length > 0) {
    //         $('#new-quotes-counter').removeClass('invisible');
    //         $('#new-quotes-counter').html(elements.length)
    //     }
    // });
    //
    //
    // io.socket.get('http://localhost:1337/quote/subscribe', function (data, jwr) {
    //     io.socket.on('new_record', function (entry) {
    //         $('#new-quotes-counter').removeClass('invisible');
    //         $('#new-quotes-counter').addClass('blink');
    //         var counter = parseInt($('#new-quotes-counter').html());
    //         $('#new-quotes-counter').html(++counter);
    //         $timeout(function () {
    //             $rootScope.unreadQuotes.unshift(entry);
    //         });
    //     });
    // });

}

customersAreaApp
    .controller('MainCtrl', MainCtrl);

MainCtrl.$inject =
    [
        '$scope', '$rootScope', '$resource', '$timeout', 'log'
    ];


/***
 *      _____            _ _   _                 ____              _        _____ _        _
 *     |  __ \          | | | (_)               / __ \            | |      / ____| |      | |
 *     | |__) |___  __ _| | |_ _ _ __ ___   ___| |  | |_   _  ___ | |_ ___| |    | |_ _ __| |
 *     |  _  // _ \/ _` | | __| | '_ ` _ \ / _ \ |  | | | | |/ _ \| __/ _ \ |    | __| '__| |
 *     | | \ \  __/ (_| | | |_| | | | | | |  __/ |__| | |_| | (_) | ||  __/ |____| |_| |  | |
 *     |_|  \_\___|\__,_|_|\__|_|_| |_| |_|\___|\___\_\\__,_|\___/ \__\___|\_____|\__|_|  |_|
 *
 *
 */
function RealtimeQuoteCtrl($scope, $rootScope, $resource, $timeout, log){
    log.info('Instancing controller RealtimeQuoteCtrl');
    $scope.global = $rootScope;
    $scope.remove = function( $event ) {
        var effect = $($event.currentTarget).data('effect');
        var quoteId = $($event.currentTarget).data('quoteid');
        $resource('http://localhost:1337/quote/destroy/:id').delete({id: quoteId}, function(){
            $($event.currentTarget).closest('.panel')[effect]();
            var counter = parseInt( $('#new-quotes-counter').html() );
            $('#new-quotes-counter').html( --counter );
            $('#new-quotes-counter').removeClass('blink');
            if ( counter == 0 ){
                $('#new-quotes-counter').addClass('invisible');
            }
        });
    }
}

customersAreaApp
    .controller('RealtimeQuoteCtrl', RealtimeQuoteCtrl);

RealtimeQuoteCtrl.$inject =
    [
        '$scope', '$rootScope', '$resource', '$timeout', 'log'
    ];


/***
 *       _____ _     _      _                 _____ _        _
 *      / ____(_)   | |    | |               / ____| |      | |
 *     | (___  _  __| | ___| |__   __ _ _ __| |    | |_ _ __| |
 *      \___ \| |/ _` |/ _ \ '_ \ / _` | '__| |    | __| '__| |
 *      ____) | | (_| |  __/ |_) | (_| | |  | |____| |_| |  | |
 *     |_____/|_|\__,_|\___|_.__/ \__,_|_|   \_____|\__|_|  |_|
 *
 *
 */
function SidebarCtrl($scope, $rootScope, $resource, $timeout, log){
    log.info('Instancing controller SidebarCtrl');
}

customersAreaApp
    .controller('SidebarCtrl', SidebarCtrl);

SidebarCtrl.$inject =
    [
        '$scope', '$rootScope', '$resource', '$timeout', 'log'
    ];


/***
 *      _____               _               _  ____              _             _____                     _      _____ _        _
 *     |  __ \             (_)             | |/ __ \            | |           / ____|                   | |    / ____| |      | |
 *     | |__) |___  ___ ___ ___   _____  __| | |  | |_   _  ___ | |_ ___  ___| (___   ___  __ _ _ __ ___| |__ | |    | |_ _ __| |
 *     |  _  // _ \/ __/ _ \ \ \ / / _ \/ _` | |  | | | | |/ _ \| __/ _ \/ __|\___ \ / _ \/ _` | '__/ __| '_ \| |    | __| '__| |
 *     | | \ \  __/ (_|  __/ |\ V /  __/ (_| | |__| | |_| | (_) | ||  __/\__ \____) |  __/ (_| | | | (__| | | | |____| |_| |  | |
 *     |_|  \_\___|\___\___|_| \_/ \___|\__,_|\___\_\\__,_|\___/ \__\___||___/_____/ \___|\__,_|_|  \___|_| |_|\_____|\__|_|  |_|
 *
 *
 */
function ReceivedQuotesSearchCtrl($scope, $uibModal, jsonrpc, log){
    log.info('Instancing controller ReceivedQuotesSearchCtrl');
    $scope.format = 'yyyy-MM-dd';

    $scope.dateStartOptions = {
        formatYear: 'yyyy',
        maxDate: moment(angular.element('#startDateDatepickerEl').data('max-date'), 'YYYY-MM-DD').toDate() ,
        minDate: moment(angular.element('#startDateDatepickerEl').data('min-date'), 'YYYY-MM-DD').toDate() ,
        startingDay: 1
    };

    $scope.dateEndOptions = {
        formatYear: 'yyyy',
        maxDate: moment(angular.element('#endDateDatepickerEl').data('max-date'), 'YYYY-MM-DD').toDate() ,
        minDate: moment(angular.element('#endDateDatepickerEl').data('min-date'), 'YYYY-MM-DD').toDate() ,
        startingDay: 1
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };


    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.DateStart = angular.element('#startDateDatepickerEl').val() == ''
        ? moment().subtract(1, 'years').toDate()
        : moment(angular.element('#startDateDatepickerEl').val(), 'YYYY-MM-DD').toDate();

    $scope.DateEnd = angular.element('#endDateDatepickerEl').val() == ''
        ? moment().toDate()
        : moment(angular.element('#endDateDatepickerEl').val(), 'YYYY-MM-DD').toDate();


    $scope.showQuoteDetails = function (url) {

        var modalInstance = $uibModal.open({
            templateUrl: url,
            controller: 'ModalInstanceCtrl'
        });
    };

    $scope.disputeQuote = function (quoteIdIn) {

        var modalInstance = $uibModal.open({
            templateUrl: 'disputeQuote.html',
            controller: 'DisputeQuoteInstanceCtrl',
            resolve: {
                quoteId: function () {
                    return quoteIdIn;
                }
            }
        });

        modalInstance.result.then(function (disputeValues) {
            log.info('Return values for disputing quote: ' + disputeValues.type + '|' + disputeValues.text + '|' + disputeValues.quoteId);
            var jsonrRpcObjectIn = {
                quoteId: disputeValues.quoteId,
                causeId: disputeValues.type,
                text: disputeValues.text
            };
            jsonrpc.request('quote', 'dispute', jsonrRpcObjectIn)
                .then(function(result) {
                    console.log(result);
                    //$scope.result = result;
                })
                .catch(function(error) {
                    //$scope.error = error;
                });

        }, function () {
            log.info('Dispute modal dismissed without proceeding...');
        });
    };
}

customersAreaApp
    .controller('ReceivedQuotesSearchCtrl', ReceivedQuotesSearchCtrl);

ReceivedQuotesSearchCtrl.$inject =
    [
        '$scope', '$uibModal', 'jsonrpc', 'log'
    ];

/***
 *      _____  _                 _        ____              _       _____           _                        _____ _        _
 *     |  __ \(_)               | |      / __ \            | |     |_   _|         | |                      / ____| |      | |
 *     | |  | |_ ___ _ __  _   _| |_ ___| |  | |_   _  ___ | |_ ___  | |  _ __  ___| |_ __ _ _ __   ___ ___| |    | |_ _ __| |
 *     | |  | | / __| '_ \| | | | __/ _ \ |  | | | | |/ _ \| __/ _ \ | | | '_ \/ __| __/ _` | '_ \ / __/ _ \ |    | __| '__| |
 *     | |__| | \__ \ |_) | |_| | ||  __/ |__| | |_| | (_) | ||  __/_| |_| | | \__ \ || (_| | | | | (_|  __/ |____| |_| |  | |
 *     |_____/|_|___/ .__/ \__,_|\__\___|\___\_\\__,_|\___/ \__\___|_____|_| |_|___/\__\__,_|_| |_|\___\___|\_____|\__|_|  |_|
 *                  | |
 *                  |_|
 */
function DisputeQuoteInstanceCtrl($scope, $uibModalInstance, quoteId, log){
    log.info('Instancing controller DisputeQuoteInstanceCtrl');

    var me = $scope;

    me.showTextArea = false;
    me.disputeProceedable = false;
    me.quoteId = quoteId;

    me.disputecause = {
        type : -1,
        text : '',
        quoteId : quoteId
    };

    $scope.ok = function () {
        $uibModalInstance.close(me.disputecause);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

customersAreaApp
    .controller('DisputeQuoteInstanceCtrl', DisputeQuoteInstanceCtrl);

DisputeQuoteInstanceCtrl.$inject =
    [
        '$scope', '$uibModalInstance', 'quoteId', 'log'
    ];






































customersAreaApp.controller('ExcelDownloadCtrl', ['$scope', function($scope) {
    $scope.format = 'yyyy-MM-dd';

    $scope.dateStartOptions = {
        formatYear: 'yyyy',
        maxDate: moment(angular.element('#startDateExcelDatepickerInputEl').data('max-date'), 'YYYY-MM-DD').toDate() ,
        minDate: moment(angular.element('#startDateExcelDatepickerInputEl').data('min-date'), 'YYYY-MM-DD').toDate() ,
        startingDay: 1
    };

    $scope.dateEndOptions = {
        formatYear: 'yyyy',
        maxDate: moment(angular.element('#endDateExcelDatepickerInputEl').data('max-date'), 'YYYY-MM-DD').toDate() ,
        minDate: moment(angular.element('#endDateExcelDatepickerInputEl').data('min-date'), 'YYYY-MM-DD').toDate() ,
        startingDay: 1
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.DateStartExcel =  angular.element('#startDateExcelDatepickerInputEl').val() == ''
        ? moment().subtract(1, 'years').toDate()
        : moment(angular.element('#startDateExcelDatepickerInputEl').val(), 'YYYY-MM-DD').toDate();

    $scope.DateEndExcel = angular.element('#endDateExcelDatepickerInputEl').val() == ''
        ? moment().toDate()
        : moment(angular.element('#endDateExcelDatepickerInputEl').val(), 'YYYY-MM-DD').toDate();

}]);

customersAreaApp.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);




