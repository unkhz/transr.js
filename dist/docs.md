<a name="Transr"></a>

## Transr : <code>object</code>
**Kind**: global namespace  

* [Transr](#Transr) : <code>object</code>
    * [.getStyleProperty(property)](#Transr.getStyleProperty) ⇒ <code>String</code>
    * [.canTransform(transformFunction)](#Transr.canTransform) ⇒ <code>Boolean</code>
    * [.set(el, property, value, fallBackProperty, value)](#Transr.set)
    * [.transition(options)](#Transr.transition)
    * [.transform(options)](#Transr.transform)
    * [.translate(options)](#Transr.translate)
    * [.rotate(options)](#Transr.rotate)
    * [.scale(options)](#Transr.scale)
    * [.skew(options)](#Transr.skew)
    * [.CSSValue](#Transr.CSSValue)
    * [.TransrOptions](#Transr.TransrOptions)

<a name="Transr.getStyleProperty"></a>

### Transr.getStyleProperty(property) ⇒ <code>String</code>
Return vendor prefixed version of a style property. I.e. Translate a spec style
property into the form that can be parsed by the current browser.

**Kind**: static method of <code>[Transr](#Transr)</code>  
**Returns**: <code>String</code> - Property name with a vendor perfix (if needed) in camelCase E.g. webkitTransformOrigin  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>String</code> | Spec property name in camelCase E.g. transformOrigin |

<a name="Transr.canTransform"></a>

### Transr.canTransform(transformFunction) ⇒ <code>Boolean</code>
Check if a speficifc transform function is supported by the current browser

**Kind**: static method of <code>[Transr](#Transr)</code>  
**Returns**: <code>Boolean</code> - True if the specified transform function is supported by the current browser  

| Param | Type | Description |
| --- | --- | --- |
| transformFunction | <code>String</code> | Full string that is a valid value for transform CSS property. E.g. translateX(10px) |

<a name="Transr.set"></a>

### Transr.set(el, property, value, fallBackProperty, value)
Set any style property value with fallback, but without transition

**Kind**: static method of <code>[Transr](#Transr)</code>  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | DOM element to be modified |
| property | <code>String</code> | The property name to be modified in camelCase E.g. transformOrigin |
| value | <code>[CSSValue](#Transr.CSSValue)</code> | The value to be set |
| fallBackProperty | <code>String</code> | The fallback property name to be modified in camelCase E.g. transformOrigin. Modification happens only if the actual property cannot be modified. |
| value | <code>[CSSValue](#Transr.CSSValue)</code> | The fallbackvalue to be set |

<a name="Transr.transition"></a>

### Transr.transition(options)
Start a CSS transition for an element

**Kind**: static method of <code>[Transr](#Transr)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>[TransrOptions](#Transr.TransrOptions)</code> | The options object that defines the transition |

<a name="Transr.transform"></a>

### Transr.transform(options)
Modify CSS transform for an element

**Kind**: static method of <code>[Transr](#Transr)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>[TransrOptions](#Transr.TransrOptions)</code> | The options object that defines the transition |

<a name="Transr.translate"></a>

### Transr.translate(options)
Modify CSS transform translation for an element

**Kind**: static method of <code>[Transr](#Transr)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>[TransrOptions](#Transr.TransrOptions)</code> | The options object that defines the transition |

<a name="Transr.rotate"></a>

### Transr.rotate(options)
Modify CSS transform rotation for an element

**Kind**: static method of <code>[Transr](#Transr)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>[TransrOptions](#Transr.TransrOptions)</code> | The options object that defines the transition |

<a name="Transr.scale"></a>

### Transr.scale(options)
Modify a CSS transform scaling for an element

**Kind**: static method of <code>[Transr](#Transr)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>[TransrOptions](#Transr.TransrOptions)</code> | The options object that defines the transition |

<a name="Transr.skew"></a>

### Transr.skew(options)
Modify a CSS transform skewing for an element

**Kind**: static method of <code>[Transr](#Transr)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>[TransrOptions](#Transr.TransrOptions)</code> | The options object that defines the transition |

<a name="Transr.CSSValue"></a>

### Transr.CSSValue
Transr CSS value can be defined as a valid string E.g. "10px" or a numeric value
in which case the unit is analyzed based on the property. E.g. rotation defaults
to "deg", dimensions default to "px"

**Kind**: static typedef of <code>[Transr](#Transr)</code>  
<a name="Transr.TransrOptions"></a>

### Transr.TransrOptions
**Kind**: static typedef of <code>[Transr](#Transr)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| el | <code>Element</code> |  | The DOM element to be modified |
| duration | <code>String</code> | <code>&quot;0.5s&quot;</code> | CSS rule; defines how long the transition will last |
| timingFunction | <code>String</code> | <code>&quot;ease&quot;</code> | CSS rule; defines the easing function to be used. E.g. ease-out will slow down towards the end of the transition |
| delay | <code>String</code> | <code>&quot;0s&quot;</code> | CSS rule; defines the delay before the transition is started |
| fallback | <code>function</code> |  | Callback to be excecuted if the property is not supported by the current browser |
| complete | <code>function</code> |  | Callback to be excecuted after the excecution is completed, whether it was successful or not. |
| fail | <code>Boolean</code> | <code>false</code> | If true, forces the operation to fail and the possible fallback to be called. Useful for interruptions and debugging purposes. |
| use3d | <code>Boolean</code> | <code>true</code> | If true, 3D transform functions are used when available |
| immediate | <code>Boolean</code> | <code>true</code> | If true, transition is skipped entirely. Useful for situations where immediateness is not decided by the caller. |
| resetTransitionAfterTransitionEnd | <code>Boolean</code> | <code>true</code> | If true, transition and value are reset after transitionend event is triggered. Useful for situations where transition should not be reset automatically. E.g. acting on touch movement. |
| transitionId | <code>String</code> |  | If set, the transition will be handled as a singleton. I.e. if a transition with the same ID already exist for the same DOM element, it will be cleared and/or replaced. |
| x | <code>[CSSValue](#Transr.CSSValue)</code> |  | Value for a CSS property defined by the function call. E.g. Transr.translate({x:10}) will modify the X translation position. |
| y | <code>[CSSValue](#Transr.CSSValue)</code> |  | Value for a CSS property defined by the function call. E.g. Transr.translate({y:10}) will modify the Y translation position. |
| z | <code>[CSSValue](#Transr.CSSValue)</code> |  | Value for a CSS property defined by the function call. E.g. Transr.translate({z:10}) will modify the Z translation position. |
| translateX | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| translateY | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| translateZ | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| rotateX | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| rotateY | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| rotateZ | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| scaleX | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| scaleY | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| scaleZ | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| skewX | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| skewY | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |
| skewZ | <code>[CSSValue](#Transr.CSSValue)</code> |  |  |

