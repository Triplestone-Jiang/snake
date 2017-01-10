(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var size = 50;
var interval = 100;
var init = [59, 58, 57, 56, 55, 54];
var state = { dir: 1, nextDir: 1 };
var map = { 37: -1, 38: -size, 39: 1, 40: size };
var divs = Array.apply(null, new Array(size * size)).map(function () {
    return '<div class="grid"></div>';
}).join('');
document.querySelector('.container').innerHTML = divs;
var nodes = document.querySelectorAll('.grid');
var marks = document.querySelector('.marks');
var timer = void 0;
function step() {
    var copy = Array.from(state.snake);
    state.dir = state.nextDir;
    copy.unshift(copy[0] + state.dir) && copy.pop();
    var next = checkNext(copy, state.dir, state.food, size);
    if (!next) return stop() || alert('Game Over') || (state.snake = init) && (state.nextDir = 1);
    if (typeof next == 'number') copy.unshift(next + state.dir) && (state.food = food(copy, size));
    state.snake = copy;
    timer = setTimeout(step, interval);
}
function food(arr, size) {
    var newFood = Math.floor(Math.random() * size * size);
    return arr.includes(newFood) ? food(arr, size) : newFood;
}
function checkNext(array, dir, food, size) {
    if (array[0] < 0 || array[0] > size * size - 1) return false;
    if (dir == 1 && array[0] % size == 0) return false;
    if (dir == -1 && array[0] % size == size - 1) return false;
    if (array[0] == food) return food;
    return new Set(array).size == array.length;
}
function defineReactive(obj, key, val, before, after) {
    after(val);
    Object.defineProperty(obj, key, {
        get: function get() {
            return val;
        },
        set: function set(newVal) {
            return before && before(val) || after && after(val = newVal);
        }
    });
}
var before = function before(indices) {
    return indices.forEach(function (i) {
        var list = nodes[i].classList;
        list.remove('head') || list.remove('food') || list.remove('snake');
    });
};
var after = function after(indices) {
    marks.textContent = indices.length - init.length;
    indices.forEach(function (i, j) {
        var list = nodes[i].classList;
        if (j == 0) return list.add('head');
        list.remove('food') || list.add('snake');
    });
};
var stop = function stop() {
    return clearInterval(timer) || (timer = null);
};
defineReactive(state, 'snake', init, before, after);
defineReactive(state, 'food', food(init, size), null, function (idx) {
    return nodes[idx].classList.add('food');
});
document.body.addEventListener('keyup', function (e) {
    var code = e.keyCode;
    if (code == 83) return timer ? stop() : step();
    if (!Object.keys(map).includes(code.toString())) return;
    state.nextDir = state.dir == -map[code] ? -map[code] : map[code];
});

},{}]},{},[1]);
