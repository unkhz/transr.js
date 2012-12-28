transr.js
=========

CSS3 Transitions and translations helper with feature detection and fallback


Features
--------
  * Detects vendor specific CSS properties and uses only one
  * Provides fallback method for failed feature detection cases
  * Transparent, no additional layer of property names

Example
-------
    // begin transition
    Transr.translate({
        el:document.body,
        x:'50%',
        duration:'0.2s',
        timingFunction:'ease',
        fallback:function(){
            console.log("your browser does not support transitions");
        },
        complete:function(){
            console.log("operation was completed, either with fallback or normal method");
        }
    });