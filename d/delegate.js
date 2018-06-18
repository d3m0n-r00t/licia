/* Event delegation.
 *
 * ### add
 *
 * Add event delegation.
 *
 * |Name    |Type    |Desc          |
 * |--------|--------|--------------|
 * |el      |element |Parent element|
 * |type    |string  |Event type    |
 * |selector|string  |Match selector|
 * |cb      |function|Event callback|
 *
 * ### remove
 *
 * Remove event delegation.
 *
 * ```javascript
 * var container = document.getElementById('container');
 * function clickHandler()
 * {
 *     // Do something...
 * }
 * delegate.add(container, 'click', '.children', clickHandler);
 * delegate.remove(container, 'click', '.children', clickHandler);
 * ```
 */

/* module
 * env: browser
 * test: browser
 */

_('Class contain');

function retTrue() {
    return true;
}
function retFalse() {
    return false;
}

function trigger(e) {
    var handlers = this.events[e.type],
        handler,
        handlerQueue = formatHandlers.call(this, e, handlers);

    e = new exports.Event(e);

    var i = 0,
        j,
        matched,
        ret;

    while ((matched = handlerQueue[i++]) && !e.isPropagationStopped()) {
        e.curTarget = matched.el;
        j = 0;
        while (
            (handler = matched.handlers[j++]) &&
            !e.isImmediatePropagationStopped()
        ) {
            ret = handler.handler.apply(matched.el, [e]);

            if (ret === false) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }
}

function formatHandlers(e, handlers) {
    var current = e.target,
        ret = [],
        delegateCount = handlers.delegateCount,
        selector,
        matches,
        handler,
        i;

    if (current.nodeType) {
        for (; current !== this; current = current.parentNode || this) {
            matches = [];
            for (i = 0; i < delegateCount; i++) {
                handler = handlers[i];
                selector = handler.selector + ' ';
                if (matches[selector] === undefined) {
                    matches[selector] = contain(
                        this.querySelectorAll(selector),
                        current
                    );
                }
                if (matches[selector]) matches.push(handler);
            }
            if (matches.length) ret.push({ el: current, handlers: matches });
        }
    }

    if (delegateCount < handlers.length) {
        ret.push({
            el: this,
            handlers: handlers.slice(delegateCount)
        });
    }

    return ret;
}

exports = {
    add: function(el, type, selector, fn) {
        var handler = {
                selector: selector,
                handler: fn
            },
            handlers;

        if (!el.events) el.events = {};

        if (!(handlers = el.events[type])) {
            handlers = el.events[type] = [];
            handlers.delegateCount = 0;
            el.addEventListener(
                type,
                function() {
                    trigger.apply(el, arguments);
                },
                false
            );
        }

        selector
            ? handlers.splice(handlers.delegateCount++, 0, handler)
            : handlers.push(handler);
    },
    remove: function(el, type, selector, fn) {
        var events = el.events;

        if (!events || !events[type]) return;

        var handlers = events[type],
            i = handlers.length,
            handler;

        while (i--) {
            handler = handlers[i];

            if (
                (!selector || handler.selector == selector) &&
                handler.handler == fn
            ) {
                handlers.splice(i, 1);
                if (handler.selector) {
                    handlers.delegateCount--;
                }
            }
        }
    },
    Event: Class({
        className: 'Event',
        initialize: function Event(e) {
            this.origEvent = e;
        },
        isDefaultPrevented: retFalse,
        isPropagationStopped: retFalse,
        isImmediatePropagationStopped: retFalse,
        preventDefault: function() {
            var e = this.origEvent;

            this.isDefaultPrevented = retTrue;
            if (e && e.preventDefault) e.preventDefault();
        },
        stopPropagation: function() {
            var e = this.origEvent;

            this.isPropagationStopped = retTrue;
            if (e && e.stopPropagation) e.stopPropagation();
        },
        stopImmediatePropagation: function() {
            var e = this.origEvent;

            this.isImmediatePropagationStopped = retTrue;
            if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
            this.stopPropagation();
        }
    })
};
