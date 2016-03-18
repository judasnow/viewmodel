'use strict'


function Observer() {
    this._handlers = {}
}

Observer.prototype.subscribe = function(eventName, callback) {
    this._handlers[eventName] = callback
}

Observer.prototype.unsubscribe = function(eventName) {
    delete (this._handlers[eventName])
}


Observer.prototype.trigger = function(eventName, thisObj) {
    if (this._handlers[eventName]) {
        this._handlers[eventName].call(thisObj)
    }
}


function Viewmodel(data, observer) {
    this._data = data || {}
    this._observer = observer
    this._initData()
}
// data 中的属性会自动代理到 vm 对象中
Viewmodel.prototype._initData = function() {
    if (this._data) {
        for (var key in this._data) {
            this._observer.subscribe(key, this._renderView)

            Object.defineProperty(this, key, {
                get: function() {
                    return this._data[key]
                },
                set: function(newData) {
                    if (newData !== this._data[key]) {
                        this._data[key] = newData
                        this._observer.trigger(key, this)
                    }
                }
            })
        }

    } else {
        return
    }
}
Viewmodel.prototype._renderView = function() {
    console.log('view will be rerender')
}


function appInit() {
    var observer = new Observer()

    var vm = new Viewmodel({
        name: '1024'
    }, observer)
    vm.name = 123
}
appInit()
