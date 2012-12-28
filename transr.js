/*
 * Transr.js
 * Minimalistic CSS3 Transitions and translations helper with feature detection and fallback
 *
 * Juhani Pelli <juhani.pelli@gmail.com>
 * https://github.com/unkhz/transr.js/
 *
 * MIT License
 *
 */

;(function(){

    // IE detection, https://gist.github.com/527683
    var ie = (function(){
        var undef, v = 3, div = document.createElement('div');
        while (
            div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
            div.getElementsByTagName('i')[0]
        ){};
        return v > 4 ? v : undef;
    });

    // object helper method, copied from Mirin.js
    function extend() {
        var dest = arguments[0],
            rest = arraySlice.call(arguments,1),
            i,j;
        for ( i=0,len=rest.length;i<len;i++ ) {
            var src = rest[i];
            if ( src ) {
                for ( j in src ) {
                    dest[j] = src[j];
                }
            }
        }
        return dest;
    }

    /* Transr handles project specific style property testing and stuff */
    var properties = {};
    function getStyleProperty(property) {
        if ( properties[property] ) return properties[property];
        
        var returnProperty;
        if ( document.body.style[property] !== undefined ) {
          returnProperty = property;
        }
        for ( var i=0,prefixes=["webkit","moz","o","ms"],len=prefixes.length; i<len; i++ ) {
          var prefixedProperty = prefixes[i]+property.charAt(0).toUpperCase()+property.slice(1);
          if ( document.body.style[prefixedProperty] !== undefined ) {
            returnProperty = prefixedProperty;
          }
        }
        return properties[property] = returnProperty;
    }

    function getStyleCssProperty(property) {
        var p = getStyleProperty(property);
        if ( p !== property ) {
            return '-' + p.replace(/([A-Z])/g, '-' + '$1').toLowerCase();
        } else {
            return p;
        }
    }

    function buildDimensionString(val) {
        if ( val === undefined ) val = "0px";
        return typeof val == "number" ? val.toString() + "px" : val;
    }

    /* Modify element with transition and fallback */
    var transitionDefaults = {
        el:null,
        duration:"0.5s",
        timingFunction:"ease",
        fallback:null,
        complete:null,
        fail:false
    };

    function unbindTransitionEnd(el, listener) {
        try {
            el.removeEventListener("webkitTransitionEnd", listener);
            el.removeEventListener("transitionend", listener);
            el.removeEventListener("oTransitionEnd", listener);
        } catch(ee) {

        }
    }

    function bindTransitionEnd(el, listener) {
        try {
            el.addEventListener("webkitTransitionEnd", listener);
            el.addEventListener("transitionend", listener);
            el.addEventListener("oTransitionEnd", listener);
        } catch(ee) {

        }
    }

    function transition(aOptions) {
        var options = extend({},transitionDefaults,aOptions),
            transitionShorthandProperty = getStyleProperty("transition"),
            transitionProperty = getStyleProperty("transitionProperty"),
            transitionDuration = getStyleProperty("transitionDuration"),
            transitionTimingFunction = getStyleProperty("transitionTimingFunction"),
            vendorSpecificProperty = getStyleProperty(options.property),
            enabled = transitionProperty && transitionDuration && transitionTimingFunction && vendorSpecificProperty ? true : false;

        if ( (ie && ie < 10) || !enabled || options.fail ) {
            // fallback
            if ( options.fallback ) {
                options.fallback();
            } else {
                options.el.style[vendorSpecificProperty] = options.value;
            }
            if (options.complete) options.complete(options.el);
        } else {
            var el = options.el,
                vendor = transitionProperty.replace(/Transition.*$/, ''),
                transitionValue = getStyleCssProperty(options.property) + " " + options.duration + " " + options.timingFunction,
                durationInMS = Number(options.duration.replace(/[^0-9.]/g,'')) * 1000,
                fallbackDurationInMS = durationInMS + 1500,
                transitionEnded = false,

                onTransitionEnd = function(){
                    //console.log("Transr onTransitionEnd", transitionShorthandProperty, vendorSpecificProperty, transitionValue, el.id, fallbackDurationInMS);

                    if ( transitionEnded ) return;
                    transitionEnded = true;

                    unbindTransitionEnd(options.el, onTransitionEnd);

                    //console.log("Transr reset transition", el.id, transformValue);
                    el.style[transitionShorthandProperty] = "";
                    el.style[vendorSpecificProperty] = options.value;

                    // make sure all possible fallback timeouts get cleared
                    clearTimeout(el.timeoutId);

                    if (options.complete) options.complete(options.el);
                };

            /*console.log("Transr", "transition", el.id ? el.id : el.nodeName,
                "|", transitionShorthandProperty, transitionValue,
                "|", "el.style."+vendorSpecificProperty, "=", options.value
            );*/


            options.el.style[transitionShorthandProperty] = transitionValue;

            //console.log(options.el.style[vendorSpecificProperty], options.value);
            
            // if we're already there, transitionend won't fire, so we need to complete asap
            if ( options.el.style[vendorSpecificProperty] == options.value ) {
                fallbackDurationInMS = 1;
            } else {
                options.el.style[vendorSpecificProperty] = options.value;
                // listen to transition on real browsers
                unbindTransitionEnd(options.el, onTransitionEnd);
                bindTransitionEnd(options.el, onTransitionEnd);

            }

            // fallback a little later, make sure old timeout is cleared when new transition is issued
            // FIXME: is this ok? setting a custom property on an element breaks its hidden class
            // but then again using data-attribute would be terribly slow
            clearTimeout(options.el.timeoutId);
            options.el.timeoutId = setTimeout(onTransitionEnd, fallbackDurationInMS);

        }
    }

    /* Move element with transition and fallback */
    function translate(aOptions) {

        var dimensions = [
                buildDimensionString(aOptions.x),
                buildDimensionString(aOptions.y),
                buildDimensionString(aOptions.z)
            ],
            parentFallback = aOptions.fallback;

        transition(extend(aOptions,{
            property:"transform",
            value:"translate3d(" + dimensions.join(", ") + ")",
            fallback:function(){
                if ( parentFallback ) {
                    parentFallback();
                } else {
                    if ( (aOptions.x !== undefined || aOptions.y !== undefined) && ( !aOptions.el.style.position || aOptions.el.style.position == 'static' ) ) {
                        aOptions.el.style.position = 'relative';
                    }

                    if ( aOptions.x !== undefined ) aOptions.el.style.left = dimensions[0];
                    if ( aOptions.y !== undefined ) aOptions.el.style.top = dimensions[1];
                }
            }
        }));
    }

    function set(el, property, value, fallbackProperty, fallbackValue) {
        var transitionProperty = getStyleProperty("transition"),
            vendorSpecificProperty = getStyleProperty(property);

        if ( !vendorSpecificProperty ) {
            // fallback
            if ( fallbackProperty ) {
                el.style[fallbackProperty] = fallbackValue !== undefined ? fallbackValue : value;
            }
        } else {
            if ( transitionProperty && el.style[transitionProperty] ) {
                // force no transition
                var oldVal = el.style[transitionProperty];
                el.style[transitionProperty] = "";
                el.style[vendorSpecificProperty] = value;
                //el.style[transitionProperty] = oldVal;
            } else {
                el.style[vendorSpecificProperty] = value;
            }
            //console.log("Transr set", vendorSpecificProperty, value);
        }
    }

    // public api
    var self = window.Transr = {
        getStyleProperty:getStyleProperty,
        set:set,
        transition:transition,
        translate:translate,
        translateY:translate,
        translateX:translate
    };

}());