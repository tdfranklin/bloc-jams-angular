(function() {
    function seekBar($document) {

        /**
         * @function calculatePercent
         * @desc Calculates horizontal percent on seek bar where event occurred
         * @param {Object} seekBar 
         * @param {Event} event 
         */
        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        };

        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: {
                onChange: '&'
            },
            link: function(scope, element, attributes) {

                /**
                 * @desc Holds current value of seek bars - default 0
                 * @type {Number}
                 */
                scope.value = 0;

                /**
                 * @desc Holds max value of seek bars - default 100
                 * @type {Number}
                 */
                scope.max = 100;

                /**
                 * @desc Holds element that matches directive to call methods on
                 * @type {Object}
                 */
                var seekBar = $(element);

                attributes.$observe('value', function(newValue) {
                    scope.value = newValue;
                });

                attributes.$observe('max', function(newValue) {
                    scope.max = newValue;
                });

                /**
                 * @function percentString
                 * @desc Calculates percent based on value and max value of a seek bar
                 */
                var percentString = function() {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };

                /**
                 * @function scope.fillStyle
                 * @desc Contols seek bar fill
                 */
                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                /**
                 * @function scope.thumbStyle
                 * @desc Controls thumb button position
                 */
                scope.thumbStyle = function() {
                    return {left: percentString()};
                };

                /**
                 * @function scope.onClickSeekBar
                 * @desc Updates seek bar value based on user's click
                 * @param {event} event
                 */
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                    notifyOnChange(scope.value);
                };

                /**
                 * @function scope.trackThumb
                 * @desc Updates seek bar based on moving thumb element
                 */
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                            notifyOnChange(scope.value);
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };

                /**
                 * @function notifyOnChange
                 * @desc Sends notification to onChange that scope.value has changed
                 * @param {Number} newValue 
                 */
                var notifyOnChange = function(newValue) {
                    if (typeof scope.onChange === 'function') {
                        scope.onChange({value: newValue});
                    }
                };
            }
        };
    }

    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();