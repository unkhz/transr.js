transr.js
=========

Minimalistic CSS3 Transitions and translations helper with feature detection and fallback


Features
--------

  * Detects vendor specific CSS properties and uses only one
  * Provides fallback method for unsupported style properties
  * Provides complete callback for operations after completion of transition
  * Resets transition style properties after completion, because lingering transition 
    settings tend to cause issues in some Android devices
  * Transparent, no additional layer of property names
  * Pure JavaScript, no library dependencies


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

There's also a convenience method for translate transforms, in which only the transitioning dimension needs to be defined. Support for 3D and 2D translate transforms is detected automatically.

    Transr.translate({
        el:document.body,
        x:'50%',
        y:'10%',
        duration:'0.2s',
        timingFunction:'ease',
        use3d:true,
        fallback:function(){
            console.log("browser does not support transitions or transform:translate, we could do a jQuery animate here");

            // if this function is not defined, the default fallback would be like this
            if ( document.body.style.position == 'static' ) {
                document.body.style.position = 'relative';
            }
            document.body.style.left = '50%';
            document.body.style.top = 0;
        },
        complete:function(){
            console.log("transition was completed, either with fallback or normal method");
        }
    });

When translating on touchmove/pointer event or on an animation frame, the speed of the operation is crucial. A few milliseconds can be saved by skipping the transition entirely (in contrast to using 0s duration).

    Transr.translate({
        el:document.body,
        x:touch.diffX,
        use3d:true,
        immediate:true,
        complete:function(){
            console.log("Transform was immediately set and completed without going to event loop");
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


License
-------

MIT License

Copyright (C) 2012 Juhani Pelli

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.