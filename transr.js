/*global define*/
/**
 * Transr.js
 * Minimalistic CSS3 Transitions and translations helper with feature detection and fallback
 *
 * Juhani Pelli <juhani.pelli@gmail.com>
 * https://github.com/unkhz/transr.js/
 *
 * MIT License
 * @namespace Transr
 */

;(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        //Allow using this built library as an AMD module
        //in another project. That other project will only
        //see this AMD call, not the internal modules in
        //the closure below.
        define([], factory);
    } else {
        //Browser globals case. Just assign the
        //result to a property on the global.
        root.Transr = factory(root);
    }
}(this, function (root) {

    var
        // minification optimization
        arraySlice = Array.prototype.slice,

        // default properties for transition
        globalDefaults = {
            el:null,
            duration:"0.5s",
            timingFunction:"ease",
            delay:"0s",
            fallback:null,          // method to excecute if tests fail
            complete:null,          // method to execute upon completion of transition
            fail:false,             // force transition to fail
            // translate specific settings
            use3d:true,             // use translate3d if possible
            immediate:false,        // skip transition entirely for faster response
            // resets the transition and value after transitionend. sometimes
            // transition should not be reset automatically (e.g. touch movement)
            resetTransitionAfterTransitionEnd: true,
            transitionId:false          // Unique Id for the transition, can be used to clear the complete listener
        },
        testEl = document.createElement('div'),
        properties = {},
        possibleTransforms = {},
        transitionCollection = {};

    function isValid(value) {
        return value !== undefined && value !== null;
    }

    // object helper method, copied from Mirin.js
    function extend() {
        var dest = arguments[0],
            rest = arraySlice.call(arguments,1),
            i,j,len;
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

    /**
     * Return vendor prefixed version of a style property. I.e. Translate a spec style
     * property into the form that can be parsed by the current browser.
     *
     * @param {String} property Spec property name in camelCase E.g. transformOrigin
     * @return {String} Property name with a vendor perfix (if needed) in camelCase E.g. webkitTransformOrigin
     * @memberOf Transr
     */
    function getStyleProperty(property) {
        if ( properties[property] ) { return properties[property]; }

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

    /**
     * Return vendor prefixed version of a style property in the dash notation used in
     * DOM element attributes.
     *
     * @param {String} property Spec property name in camelCase E.g. backgroundColor
     * @return {String} Property name with a vendor perfix (if needed) in dash-notation E.g. background-color
     * @private
     * @memberOf Transr
     */
    function getStyleCssProperty(property) {
        var p = getStyleProperty(property);
        if ( p !== property ) {
            return '-' + p.replace(/([A-Z])/g, '-' + '$1').toLowerCase();
        } else {
            return p;
        }
    }

    /**
     * Check if a speficifc transform function is supported by the current browser
     *
     * @param  {String} transformFunction Full string that is a valid value for transform CSS property. E.g. translateX(10px)
     * @return {Boolean} True if the specified transform function is supported by the current browser
     * @memberOf Transr
     */
    function canTransform(transformFunction) {
        var transformProp = getStyleProperty('transform');

        if ( !transformProp ) { return false; }

        if ( possibleTransforms[transformFunction] !== undefined ) { return possibleTransforms[transformFunction]; }

        var el = document.createElement('div');
        el.style[transformProp] = "";
        el.style[transformProp] = transformFunction;

        document.body.appendChild(el);
        var compiledTransform = el.style[transformProp],
            has = typeof compiledTransform === typeof "" && compiledTransform.length > 0;
        document.body.removeChild(el);


        return possibleTransforms[transformFunction] = has;
    }

    function buildDimensionString(val, aMethod) {
        var method = aMethod || 'translate',
            map = {
                translate:'px',
                rotate:'deg',
                scale:'',
                skew:'deg'
            }, suffix = map[method];
        // undefined == 0, null == null
        if ( val === undefined ) { val = "0" + suffix; }
        return typeof val ===  typeof 1 ? val.toString() + suffix : val;
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

    function removeEventListeners(options) {
        if ( options ) {
            unbindTransitionEnd(options.el, options.onTransitionEnd);
            clearTimeout(options.endTimeoutId);
        }
    }

    function asMS(str) {
        return Number(str.replace(/[^0-9.]/g,'')) * 1000;
    }

    // set any style property value with transition and fallback
    function transition(options) {
        var transitionShorthandProperty = getStyleProperty("transition"),
            transitionProperty = getStyleProperty("transitionProperty"),
            transitionDuration = getStyleProperty("transitionDuration"),
            transitionTimingFunction = getStyleProperty("transitionTimingFunction"),
            transitionDelay = getStyleProperty("transitionDelay"),
            vendorSpecificProperty = getStyleProperty(options.property),
            enabled = transitionProperty && transitionDuration && transitionTimingFunction && vendorSpecificProperty ? true : false,
            endTimeoutId;

        if ( !enabled || options.fail ) {
            // fallback
            if ( options.fallback ) {
                options.fallback();
            } else {
                options.el.style[vendorSpecificProperty] = options.value;
            }
            if (options.complete) { options.complete(options.el, options.property); }
        } else {
            var el = options.el,
                vendor = transitionProperty.replace(/Transition.*$/, ''),
                vendorCSSProperty = getStyleCssProperty(options.property),
                transitionValue = vendorCSSProperty + " " + options.duration + " " + options.timingFunction + " " + options.delay,
                durationInMS = asMS(options.duration) + asMS(options.delay),
                fallbackDurationInMS = durationInMS + 1500,
                transitionEnded = false;

            options.onTransitionEnd = function(e){
                //console.log("Transr onTransitionEnd", e ? e.target : 'no event', transitionShorthandProperty, vendorSpecificProperty, transitionValue, el.id, fallbackDurationInMS);

                // check that we react on the correct element and property
                if ( e.target !== el || e.propertyName !==  vendorCSSProperty ) { return; }

                if ( transitionEnded ) { return; }
                transitionEnded = true;

                removeEventListeners(options);
                if ( options.transitionId ) {
                    delete transitionCollection[options.transitionId];
                }

                //console.log("Transr reset transition", el.id, transformValue);
                if  ( options.resetTransitionAfterTransitionEnd ) {
                    el.style[transitionShorthandProperty] = "";
                    el.style[vendorSpecificProperty] = options.value;
                }

                // make sure all possible fallback timeouts get cleared
                clearTimeout(endTimeoutId);

                if (options.complete) { options.complete(options.el, options.property); }
            };

            /*console.log("Transr", "transition", el.id ? el.id : el.nodeName,
                "|", transitionShorthandProperty, transitionValue,
                "|", "el.style."+vendorSpecificProperty, "=", options.value
            );*/

            //console.log(transitionShorthandProperty, transitionValue);
            options.el.style[transitionShorthandProperty] = transitionValue;

            //console.log(options.el.style[vendorSpecificProperty], options.value);

            // if we're already there, transitionend won't fire, so we need to complete asap
            if ( options.el.style[vendorSpecificProperty] === options.value ) {
                fallbackDurationInMS = 1;
            } else {
                options.el.style[vendorSpecificProperty] = options.value;
                // listen to transitionend event on real browsers, unless the duration is 0
                if ( durationInMS === 0 ) {
                    fallbackDurationInMS = 1;
                } else {
                    bindTransitionEnd(options.el, options.onTransitionEnd);
                }

            }

            // fallback a little later, make sure old timeout is cleared when new transition is issued
            clearTimeout(options.endTimeoutId);
            options.endTimeoutId = setTimeout(options.onTransitionEnd, fallbackDurationInMS, {
                target:options.el,
                propertyName:vendorCSSProperty
            });

            if ( options.transitionId ) {
                removeEventListeners(transitionCollection[options.transitionId]);
                transitionCollection[options.transitionId] = options;
            }
        }
    }

    function buildTransformFunctionString(options, transformProp) {
        var i,j,ilen,jlen,k,v,
            methods = ['translate','rotate','scale','skew'],
            axes = ['X','Y','Z'],
            str = options.el.style[transformProp] + " ";
        for ( i=0, ilen=methods.length;i<ilen;i++ ) {
            for ( j=0, jlen=axes.length;j<jlen;j++ ) {
                k=methods[i]+axes[j];
                v=options[k];
                if ( isValid(v) ) {
                    str = str.replace(new RegExp(k+'\\([^\\)]*\\)\\s+'), ' ');
                    str += k + '(' + buildDimensionString(v,methods[i]) + ') ';
                }
            }
        }
        return str.replace(/\s+$/,'');
    }

    function transform(options) {
        var parentFallback = options.fallback,
            transformProp = getStyleProperty('transform'),
            transformValue = (options.value ?
                (options.value.join ?
                    options.value.join(' ') :
                    options.value) :
                buildTransformFunctionString(options, transformProp)),
            needs3d = !!transformValue.match(/Z/);

        if ( options.use3d && canTransform('translate3d(0,0,0)') ) {
            // 3d works
        } else if ( canTransform('translate(0,0)') && !needs3d ) {
            // 2d transform can only be used if Z was not defined
        } else {
            options.fail = true;
        }

        if ( options.immediate && transformProp && !options.fail ) {
            // always reset if transitionId is used
            if ( options.transitionId ) {
                removeEventListeners(transitionCollection[options.transitionId]);
            }

            // skip timeouts and whatnot if we are not going to fail
            set(
                options.el,
                transformProp,
                transformValue
            );
            if ( options.complete ) { options.complete(options.el, 'transform'); }
        } else {
            transition(extend(options,{
                property:"transform",
                value:transformValue,
                fallback:function(){
                    if ( parentFallback ) {
                        // falls back if transition failed, even if transform works, e.g IE9
                        parentFallback();
                    } else if ( transformProp && transformValue ) {
                        set(options.el, transformProp, transformValue);
                    } else {
                        // if nothing works and we don't even have fallback
                        // defined, try fixing the situation with left/top
                        // even though it will most likely break
                        if ( (options.translateX !== undefined || options.translateY !== undefined) &&
                            ( !options.el.style.position || options.el.style.position === 'static' )
                        ) {
                            options.el.style.position = 'relative';
                        }

                        if ( isValid(options.translateX) ) { options.el.style.left = options.translateX; }
                        if ( isValid(options.translateY) ) { options.el.style.top = options.translateY; }
                    }
                }
            }));
        }
    }

    function transformWithPoint(options, methodName) {
        if ( isValid(options.x) ) { options[methodName+'X'] = options.x; }
        if ( isValid(options.y) ) { options[methodName+'Y'] = options.y; }
        if ( isValid(options.z) ) { options[methodName+'Z'] = options.z; }
        transform(options);
    }


    /**
     * Set any style property value with fallback, but without transition
     *
     * @param {Element} el DOM element to be modified
     * @param {String} property The property name to be modified in camelCase E.g. transformOrigin
     * @param {String|Number} value The value to be set. Can be a valid string E.g. "10px" or a numeric value in which case the unit is analyzed based on the property.
     * @param {String} fallBackProperty The fallback property name to be modified in camelCase E.g. transformOrigin. Modification happens only if the actual property cannot be modified.
     * @param {String|Number} value The fallbackvalue to be set. Can be a valid string E.g. "10px" or a numeric value in which case the unit is analyzed based on the property.
     * @memberOf Transr
     */
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

    // process possibly multiple sets of parameters with single method
    function process(method, params, callSpecificDefaults, transformMethodName) {
        if ( Object.prototype.toString.call(params) !== '[object Array]' ) { params = [params]; }
        for ( var i=0, len=params.length; i<len; i++ ) {
            method(extend({}, globalDefaults, callSpecificDefaults, params[i]), transformMethodName);
        }
    }


    return {
        getStyleProperty:getStyleProperty,
        canTransform:canTransform,
        set:set,
        /**
         * Start a CSS transition for an element
         *
         * @param {Transr.TransrOptions} options The options object that defines the transition
         * @param {Transr.TransrOptions} options Another options object that is extended to the initial one
         * @memberOf Transr
         */
        transition:function(options, defaults) {
            process(transition, options, defaults);
        },

        /**
         * Modify CSS transform for an element
         *
         * @param {Transr.TransrOptions} options The options object that defines the transition
         * @param {Transr.TransrOptions} options Another options object that is extended to the initial one
         * @memberOf Transr
         */
        transform:function(options, defaults) {
            process(transform, options, defaults);
        },

        /**
         * Modify CSS transform translation for an element
         *
         * @param {Transr.TransrOptions} options The options object that defines the transition
         * @param {Transr.TransrOptions} options Another options object that is extended to the initial one
         * @memberOf Transr
         */
        translate:function(options,defaults) {
            process(transformWithPoint, options, defaults, 'translate');
        },

        /**
         * Modify CSS transform rotation for an element
         *
         * @param {Transr.TransrOptions} options The options object that defines the transition
         * @param {Transr.TransrOptions} options Another options object that is extended to the initial one
         * @memberOf Transr
         */
        rotate:function(options,defaults) {
            process(transformWithPoint, options, defaults, 'rotate');
        },

        /**
         * Modify a CSS transform scaling for an element
         *
         * @param {Transr.TransrOptions} options The options object that defines the transition
         * @param {Transr.TransrOptions} options Another options object that is extended to the initial one
         * @memberOf Transr
         */
        scale:function(options,defaults) {
            process(transformWithPoint, options, defaults, 'scale');
        },

        /**
         * Modify a CSS transform skewing for an element
         *
         * @param {Transr.TransrOptions} options The options object that defines the transition
         * @param {Transr.TransrOptions} options Another options object that is extended to the initial one
         * @memberOf Transr
         */
        skew:function(options,defaults) {
            process(transformWithPoint, options, defaults, 'skew');
        }
    };

}));
