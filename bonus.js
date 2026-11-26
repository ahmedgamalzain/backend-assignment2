function findKthPositive(arr, k) {
    var missing = 0;
    var current = 1;
    var i = 0;
    while (true) {
        if (i < arr.length && arr[i] === current) {
            i++;
        } else {
            missing++;
            if (missing === k) {
                return current;
            }
        }
        current++;
    }
}

console.log(findKthPositive([2, 3, 4, 7, 11], 5));
console.log(findKthPositive([1, 2, 3, 4], 2));