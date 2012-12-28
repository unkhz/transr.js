transr.js
=========

CSS3 Transitions and translations helper with feature detection and fallback


Features
--------

  * Detects vendor specific CSS properties and uses only one
  * Provides fallback method for failed feature detection cases
  * Transparent, no additional layer of property names


Examples
--------

Basic properties can be transitioned with Transr.transition method.

    Transr.transition({
        el:document.body,
        property:'opacity'
        value:'0.5',
        duration:'0.2s',
        timingFunction:'ease',
        fallback:function(){
            console.log("your browser does not support transitions");
        },
        complete:function(){
            console.log("transition was completed, either with fallback or normal method");
        }
    });

There's also a convenience method for translate3d transforms, in which only the transitioning dimension needs to be defined.

    Transr.translate({
        el:document.body,
        x:'50%',
        duration:'0.2s',
        timingFunction:'ease',
        fallback:function(){
            console.log("browser does not support transitions, we could do a jQuery animate here");

            // if this function is not defined, the default fallback would be like this
            if ( document.body.style.position == 'static' ) {
                document.body.style.position = 'relative'
            }
            document.body.style.left = '50%';
        },
        complete:function(){
            console.log("transition was completed, either with fallback or normal method");
        }
    });

There's a method for (re)setting properties immediately without transition. No hash here, to save space.

    Transr.set(
        document.body,              // element
        'transform',                // property
        'translate3d(0, 0, 0)',     // value
        'left',                     // fallback property
        '0%'                        // fallback value
    );

And if the methods are not enough, you can just get the property and the sky will be the limit.

    var prop = Transr.getStyleProperty('transform');


