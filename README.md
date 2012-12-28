transr.js
=========

Minimalistic CSS3 Transitions and translations helper with feature detection and fallback


Features
--------

  * Detects vendor specific CSS properties and uses only one
  * Provides fallback method for failed feature detection cases
  * Transparent, no additional layer of property names
  * Resets transition style properties after completion, lingering transition 
    settings tend to cause issues in some Android devices


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
        y:'10%',
        duration:'0.2s',
        timingFunction:'ease',
        fallback:function(){
            console.log("browser does not support transitions, we could do a jQuery animate here");

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