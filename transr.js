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
        }),
        
        // minification optimization
        arraySlice = Array.prototype.slice,
        
        // default properties for transition
        transitionDefaults = {
            el:null,
            duration:"0.5s",
            timingFunction:"ease",
            fallback:null,          // method to excecute if tests fail
            complete:null,          // method to execute upon completion of transition
            fail:false,             // force transition to fail
            // translate specific settings
            use3d:true,             // use translate3d if possible
            immediate:false         // skip transition entirely for faster response
        },
        testEl = document.createElement('div');

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

    var properties = {},
        transforms = {};
    function getStyleProperty(property) {
        if ( properties[property] ) return properties[property];

        var returnProperty;
        if ( testEl.style[property] !== undefined ) {
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

    function hasTransform(transformFunction) {
        var transformProp = getStyleProperty('transform');
        
        if ( !transformProp ) return false;

        if ( transforms[transformFunction] !== undefined ) return transforms[transformFunction];

        var el = document.createElement('div');
        el.style[transformProp] = "";
        el.style[transformProp] = transformFunction;

        document.body.appendChild(el);
        var compiledTransform = el.style[transformProp],
            has = typeof compiledTransform == 'string' && compiledTransform.length > 0;
        document.body.removeChild(el);

        //console.log(transformProp + ', ' + transformFunction + ', ' + has);
        
        return transforms[transformFunction] = has;
    }

    function buildDimensionString(val) {
        if ( val === undefined ) val = "0px";
        return typeof val == "number" ? val.toString() + "px" : val;
    }

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


    // set any style property value with transition and fallback

    function transition(aOptions) {
        var options = extend({},transitionDefaults,aOptions),
            transitionShorthandProperty = getStyleProperty("transition"),
            transitionProperty = getStyleProperty("transitionProperty"),
            transitionDuration = getStyleProperty("transitionDuration"),
            transitionTimingFunction = getStyleProperty("transitionTimingFunction"),
            vendorSpecificProperty = getStyleProperty(options.property),
            enabled = transitionProperty && transitionDuration && transitionTimingFunction && vendorSpecificProperty ? true : false;

        if ( !enabled || options.fail ) {
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

            /* console.log("Transr", "transition", el.id ? el.id : el.nodeName,
                "|", transitionShorthandProperty, transitionValue,
                "|", "el.style."+vendorSpecificProperty, "=", options.value
            ); */


            options.el.style[transitionShorthandProperty] = transitionValue;

            //console.log(options.el.style[vendorSpecificProperty], options.value);

            // if we're already there, transitionend won't fire, so we need to complete asap
            if ( options.el.style[vendorSpecificProperty] == options.value ) {
                fallbackDurationInMS = 1;
            } else {
                options.el.style[vendorSpecificProperty] = options.value;
                // listen to transitionend event on real browsers, unless the duration is 0 
                if ( durationInMS === 0 ) {
                    fallbackDurationInMS = 1;
                } else {
                    // FIXME: this does not actually unbind the earlier transitions since the function is always new
                    unbindTransitionEnd(options.el, onTransitionEnd);
                    bindTransitionEnd(options.el, onTransitionEnd);
                }

            }

            // fallback a little later, make sure old timeout is cleared when new transition is issued
            // FIXME: is this ok? setting a custom property on an element breaks its hidden class
            // but then again using data-attribute would be terribly slow
            clearTimeout(options.el.timeoutId);
            options.el.timeoutId = setTimeout(onTransitionEnd, fallbackDurationInMS);

        }
    }


    // set transform:translate3d value with transition and fallback

    function translate(aOptions) {

        var options = extend({},transitionDefaults,aOptions),
            dimensions = [
                buildDimensionString(options.x),
                buildDimensionString(options.y),
                buildDimensionString(options.z)
            ],
            parentFallback = options.fallback,
            transformProp = getStyleProperty('transform'),
            translateFunc = null;

        if ( options.use3d && hasTransform('translate3d(0,0,0)') ) {
            translateFunc = "translate3d(" + dimensions.join(", ") + ")";
        } else if ( hasTransform('translate(0,0)') && dimensions[2] === "0px" ) {
            // 2d translate can only be used if z was not defined
            dimensions.pop();
            translateFunc = "translate(" + dimensions.join(", ") + ")";
        }

        if ( options.immediate && transformProp && translateFunc ) {
            // skip timeouts and whatnot if we are not going to fail
            set(
                options.el,
                transformProp,
                translateFunc
            );
            if ( options.complete ) options.complete(options.el);
        } else {
            transition(extend(options,{
                property:"transform",
                value:translateFunc,
                fallback:function(){
                    if ( parentFallback ) {
                        // falls back if transition failed, even if translate works, e.g IE9
                        parentFallback();
                    } else if ( transformProp && translateFunc ) {
                        set(options.el, transformProp, translateFunc);
                    } else {
                        if ( (options.x !== undefined || options.y !== undefined) && ( !options.el.style.position || options.el.style.position == 'static' ) ) {
                            options.el.style.position = 'relative';
                        }

                        if ( options.x !== undefined ) options.el.style.left = dimensions[0];
                        if ( options.y !== undefined ) options.el.style.top = dimensions[1];
                    }
                }
            }));
        }

    }


    // set any style property value with fallback, but without transition

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


    // public api methods

    var self = window.Transr = {
        getStyleProperty:getStyleProperty,
        set:set,
        transition:transition,
        translate:translate,
        hasTransform:hasTransform,
        transforms:transforms
    };

}());