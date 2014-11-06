<a name="Transr"></a>
#Transr
Transr.js
Minimalistic CSS3 Transitions and translations helper with feature detection and fallback

Juhani Pelli <juhani.pelli@gmail.com>
https://github.com/unkhz/transr.js/

MIT License

**Members**

* [Transr](#Transr)
  * [Transr.getStyleProperty(property)](#Transr.getStyleProperty)
  * [Transr.canTransform(transformFunction)](#Transr.canTransform)
  * [Transr.set(el, property, value, fallBackProperty, value)](#Transr.set)
  * [Transr.transition(options)](#Transr.transition)
  * [Transr.transform(options)](#Transr.transform)
  * [Transr.translate(options)](#Transr.translate)
  * [Transr.rotate(options)](#Transr.rotate)
  * [Transr.scale(options)](#Transr.scale)
  * [Transr.skew(options)](#Transr.skew)
  * [type: Transr.TransrOptions](#Transr.TransrOptions)

<a name="Transr.getStyleProperty"></a>
##Transr.getStyleProperty(property)
Return vendor prefixed version of a style property. I.e. Translate a spec style
property into the form that can be parsed by the current browser.

**Params**

- property `String` - Spec property name in camelCase E.g. transformOrigin  

**Returns**: `String` - Property name with a vendor perfix (if needed) in camelCase E.g. webkitTransformOrigin  
<a name="Transr.canTransform"></a>
##Transr.canTransform(transformFunction)
Check if a speficifc transform function is supported by the current browser

**Params**

- transformFunction `String` - Full string that is a valid value for transform CSS property. E.g. translateX(10px)  

**Returns**: `Boolean` - True if the specified transform function is supported by the current browser  
<a name="Transr.set"></a>
##Transr.set(el, property, value, fallBackProperty, value)
Set any style property value with fallback, but without transition

**Params**

- el `Element` - DOM element to be modified  
- property `String` - The property name to be modified in camelCase E.g. transformOrigin  
- value `String` | `Number` - The value to be set. Can be a valid string E.g. "10px" or a numeric value in which case the unit is analyzed based on the property.  
- fallBackProperty `String` - The fallback property name to be modified in camelCase E.g. transformOrigin. Modification happens only if the actual property cannot be modified.  
- value `String` | `Number` - The fallbackvalue to be set. Can be a valid string E.g. "10px" or a numeric value in which case the unit is analyzed based on the property.  

<a name="Transr.transition"></a>
##Transr.transition(options)
Start a CSS transition for an element

**Params**

- options <code>[TransrOptions](#Transr.TransrOptions)</code> - The options object that defines the transition  

<a name="Transr.transform"></a>
##Transr.transform(options)
Modify CSS transform for an element

**Params**

- options <code>[TransrOptions](#Transr.TransrOptions)</code> - The options object that defines the transition  

<a name="Transr.translate"></a>
##Transr.translate(options)
Modify CSS transform translation for an element

**Params**

- options <code>[TransrOptions](#Transr.TransrOptions)</code> - The options object that defines the transition  

<a name="Transr.rotate"></a>
##Transr.rotate(options)
Modify CSS transform rotation for an element

**Params**

- options <code>[TransrOptions](#Transr.TransrOptions)</code> - The options object that defines the transition  

<a name="Transr.scale"></a>
##Transr.scale(options)
Modify a CSS transform scaling for an element

**Params**

- options <code>[TransrOptions](#Transr.TransrOptions)</code> - The options object that defines the transition  

<a name="Transr.skew"></a>
##Transr.skew(options)
Modify a CSS transform skewing for an element

**Params**

- options <code>[TransrOptions](#Transr.TransrOptions)</code> - The options object that defines the transition  

<a name="Transr.TransrOptions"></a>
##type: Transr.TransrOptions
**Properties**

- el `Element` - The DOM element to be modified  
- duration `String` - CSS rule; defines how long the transition will last  
- timingFunction `String` - CSS rule; defines the easing function to be used. E.g. ease-out will slow down towards the end of the transition  
- delay `String` - CSS rule; defines the delay before the transition is started  
- fallback `function` - Callback to be excecuted if the property is not supported by the current browser  
- complete `function` - Callback to be excecuted after the excecution is completed, whether it was successful or not.  
- fail `Boolean` - If true, forces the operation to fail and the possible fallback to be called. Useful for interruptions and debugging purposes.  
- use3d `Boolean` - If true, 3D transform functions are used when available  
- immediate `Boolean` - If true, transition is skipped entirely. Useful for situations where immediateness is not decided by the caller.  
- resetTransitionAfterTransitionEnd `Boolean` - If true, transition and value are reset after transitionend event is triggered. Useful for situations where transition should not be reset automatically. E.g. acting on touch movement.  
- transitionId `String` - If set, the transition will be handled as a singleton. I.e. if a transition with the same ID already exist for the same DOM element, it will be cleared and/or replaced.  

