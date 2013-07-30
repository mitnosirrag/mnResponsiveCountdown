/*
* Author: Tim Garrison
* URI: http://mitnosirrag.tumblr.com
* GitHub: https://github.com/mitnosirrag
* License: Apache License Version 2
*
* jQuery extension for responsive updating to human readable value of expiration
* timestamps in data attributes.
*
* jQuery( data ).mnResponsiveTimestamps
* @param jQuery Object data: Element with data attribute with value of expiration timestamp. 
* @return Void
*/
(function($) {
    $.fn.mnResponsiveTimestamps = function(opts) {


        /* Defaults */
        var defaults = {
            expired_message: 'This has expired'
        }
    
        /* Combine user defined options with defaults */
        var opts = $.extend(defaults,options);

        /* Assign `this` so that so we can access it when out of scope */
        var that = $(this);

        /* default loop speed, 5 seconds */
        var timeout = 5000;

        /*
        * Convert a timestamp of the remaining seconds of visibility to an 
        * object of different formats.
        *
        * getRemainingTime
        *
        * @param Int expiration_seconds: timestamp for expiration, can be past
        * @return Object time: contains keys for getting different time formats
        */
        function getRemainingTime(expiration_seconds) {
            if ( 'number' != typeof expiration_seconds )
                expiration_seconds = new Date;

            var exp_date = new Date(expiration_seconds * 1000);
            var remaining_seconds = ( exp_date - new Date ) / 1000;

            /* convert remaining_seconds to different formats */
            var time = {
                seconds: parseInt(remaining_seconds),
                minutes: parseInt(remaining_seconds / 60),
                hours  : parseInt(remaining_seconds / 60 / 60),
                days   : parseInt(remaining_seconds / 60 / 60 / 24)
            }

            /* generate human_readable string */
            if ( 1 > time.seconds ) {
                time.human_readable = opts.expired_message;
            } else {
                var hr_num      = 0,
                    hr_interval = 'seconds';
                if ( 0 < time.days ) {
                    hr_num      = time.days;
                    hr_interval = 'day';
                } else if ( 0 < time.hours ) {
                    hr_num      = time.hours;
                    hr_interval = 'hour';
                } else if ( 0 < time.minutes ) {
                    hr_num      = time.minutes;
                    hr_interval = 'minute';
                } else if ( 0 < time.seconds ) {
                    hr_num      = time.seconds;
                    hr_interval = 'second';
                }
                if ( 1 !== hr_num ) {
                    hr_interval += 's';
                }
                time.human_readable = 'In ' + hr_num + ' ' + hr_interval;;
            }

            return time;
        }

        /*
        * Initiate the plugin, looking through user-assigned jQuery objects
        * of expiration timestamps and display human readable strings in their
        * place.  If there are any timers that expire within a minute, speed
        * up the timeout and give more accurate feedback to the user.
        * 
        * init
        * @return Void
        */
        function init() {
            /* loop through each jQuery object */
            var delayed = true; // delayed only checks every 5 seconds
            that.each(function() {
                var seconds = $(this).data('expiration');
                var time = getRemainingTime(seconds);
                if ( 60 > time.seconds && 0 < time.seconds ) {
                    delayed = false; // start final countdown
                }
                if ( !delayed ) {
                    timeout = 1000;
                } else {
                    timeout = 5000;
                }
                $(this).text(time.human_readable);

            });
            return setTimeout(function() {
                init();
            }, timeout);
        }

        /* Start the plugin */
        return init();
    }
})(jQuery);
