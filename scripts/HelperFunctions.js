export { rand }

function rand(min, max) {
    return min + Math.random() * (max - min);
}