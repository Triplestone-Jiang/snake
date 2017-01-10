const size = 50
const interval = 100
const init = [59, 58, 57, 56, 55, 54]
const state = {dir: 1, nextDir: 1}
const map = {37: -1, 38: -size, 39: 1, 40: size}
const divs = Array.apply(null, new Array(size * size)).map(() => '<div class="grid"></div>').join('')
document.querySelector('.container').innerHTML = divs
const nodes = document.querySelectorAll('.grid')
const marks = document.querySelector('.marks')
let timer
function step() {
    const copy = Array.from(state.snake)
    state.dir = state.nextDir
    copy.unshift(copy[0] + state.dir) && copy.pop()
    const next = checkNext(copy, state.dir, state.food, size)
    if (!next) return stop() || alert('Game Over') || (state.snake = init) && (state.nextDir = 1)
    if (typeof next == 'number') copy.unshift(next + state.dir) && (state.food = food(copy, size))
    state.snake = copy
    timer = setTimeout(step, interval)
}
function food(arr, size) {
    const newFood = Math.floor(Math.random() * size * size)
    return arr.includes(newFood) ? food(arr, size) : newFood
}
function checkNext(array, dir, food, size) {
    if (array[0] < 0 || array[0] > size * size - 1) return false
    if (dir == 1 && array[0] % size == 0) return false
    if (dir == -1 && array[0] % size == size - 1) return false
    if (array[0] == food) return food
    return new Set(array).size == array.length
}
function defineReactive(obj, key, val, before, after) {
    after(val)
    Object.defineProperty(obj, key, {
        get: () => val,
        set: newVal => (before && before(val)) || (after && after(val = newVal))
    })
}
const before = indices => indices.forEach(i => {
    const list = nodes[i].classList
    list.remove('head') || list.remove('food') || list.remove('snake')
})
const after = indices => {
    marks.textContent = indices.length - init.length
    indices.forEach((i, j) => {
        const list = nodes[i].classList
        if (j == 0) return list.add('head')
        list.remove('food') || list.add('snake')
    })
}
const stop = () => clearInterval(timer) || (timer = null)
defineReactive(state, 'snake', init, before, after)
defineReactive(state, 'food', food(init, size), null, idx => nodes[idx].classList.add('food'))
document.body.addEventListener('keyup', function (e) {
    const code = e.keyCode
    if (code == 83) return timer ? stop() : step()
    if (!Object.keys(map).includes(code.toString())) return
    state.nextDir = state.dir == -map[code] ? -map[code] : map[code]
})