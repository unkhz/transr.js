transr.js
=========

Minimalistic CSS3 Transitions and transforms helper with feature detection and fallback


Features
--------

  * Provides a convenient JavaScript interface for defining CSS transitions for a DOM element
  * Detects vendor specific CSS properties and uses only one
  * Provides fallback method for unsupported style properties
  * Provides complete callback for operations after completion of transition
  * Resets transition style properties after completion, because lingering transition
    settings tend to cause issues in some Android devices
  * Transparent, no additional layer of property names
  * Pure JavaScript, no library dependencies
  * Optimized for speed


Examples
--------

Basic properties can be transitioned with Transr.transition method.

```javascript
Transr.transition({
  el:document.body,
  property:'opacity'
  value:'0.5',
  duration:'0.2s',
  delay:'0.1s',
  timingFunction:'ease',
  fallback:function(){
    console.log("browser does not support transitions");
  },
  complete:function(element, propertyName){
    console.log("transition was completed," +
      "either with fallback or normal method");
  }
});
```

There's also a convenience method for transforms, in which only the transitioning dimension needs to be defined. Support for 3D and 2D transforms is detected automatically.

```javascript
Transr.translate({
  el:document.body,
  x:'50%',
  y:'10%',
  duration:'0.2s',
  delay:'0.1s',
  timingFunction:'ease',
  use3d:true,
  fallback:function(){
    console.log("browser does not support transitions or"+
      "transform:translate, we could do a jQuery animate here");

    // if this function is not defined, the default fallback would be like this
    if ( document.body.style.position == 'static' ) {
      document.body.style.position = 'relative';
    }
    document.body.style.left = '50%';
    document.body.style.top = 0;
  },
  complete:function(element, propertyName){
    console.log("transition was completed,"+
      "either with fallback or normal method");
  }
});
```

When transforming on touchmove/pointer event or on an animation frame, the speed of the operation is crucial. A few milliseconds can be saved by skipping the transition entirely (in contrast to using 0s duration).

```javascript
Transr.translate({
  el:document.body,
  x:touch.diffX,
  use3d:true,
  immediate:true,
  complete:function(element, propertyName){
    console.log("Transform was immediately set and"+
      "completed without going to event loop");
  }
});
```

All the other transform functions are available and work with the same parameters as the translate method.

```javascript
Transr.translate({el:document.body, x:'50deg', y:40});
Transr.rotate({el:document.body, x:'50deg', y:40});
Transr.scale({el:document.body, x:0.5, y:'1.2'});
Transr.skew({el:document.body, x:10, y:'50deg'});
```

The transforms can also be set with a more generic transform method. You can use the string value parameter to save some clock cycles, but in that case the values need to have units specified.

```javascript
Transr.transform({el:document.body, translateX:'50px', translateY:40});
Transr.transform({el:document.body, rotateX:'50deg', rotateY:40});
Transr.transform({el:document.body, scaleX:0.5, scaleY:'1.2'});
Transr.transform({el:document.body, skewX:10, rotateY:'50deg', translateZ:200});
Transr.transform({el:document.body, value: "rotateY(50deg) translateZ(200px)"});
```

There's a method for (re)setting properties immediately without transition. No hash here, to save space.

```javascript
Transr.set(
  document.body,              // element
  'transform',                // property
  'translate3d(0, 0, 0)',     // value
  'left',                     // fallback property
  '0%'                        // fallback value
);
```

And if the methods are not enough, you can just get the property and the sky will be the limit.

```javascript
var prop = Transr.getStyleProperty('transform');
```

Multiple transitions
--------------------

All methods can take an array as parameter, which means that multiple separate transitions will be started at the same time. This is useful in complex animation situations. In this case the second parameter will be a default set of options that is applied to all of the transitions (overridden by the options in the first parameter).

```javascript
Transr.transform([
  {translateX:'50px'},
  {translateY:40}
], {
  el:document.body,
  duration:'1s'
});

Transr.transition([
  {property:'opacity', value:0.33},
  {property:'background-color', value:black}
], {
  el:document.body,
  duration:'1s'
});
```

All options
-----------

[See API documentation](http://transr.khz.fi/jsdoc)


Changelog
---------

 Version  | Date         | Changes
--------- | ------------ | ----------------------------
    0.3.6 | Nov 7, 2014  | Add API documentation, dist files in repo and Grunt build
    0.3.4 | Jan 29, 2014 | Also reset immediate transitions when transitionId is used
    0.3.3 | Jan 28, 2014 | Added possibility to reset old event listeners by using transitionId parameter
    0.3.2 | Dec 22, 2013 | Added option for enabling or disabling reset of transition after transitionend
    0.3.1 | Dec 20, 2013 | Fix duplicate transition functions issue
    0.3.0 | Oct 19, 2013 | Multiple transition support, delay and additional helpers
    0.2.0 | Sep 10, 2013 | Added AMD module definition
    0.1.1 | May 15, 2013 | Test for availability of 3d transforms; Immediate parameter for speeding up drag
    0.1.0 | Jan 2, 2013  | Initial release

License
-------

MIT License

Copyright (C) 2012-2014 Juhani Pelli

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.