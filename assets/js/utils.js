export const map = (num, min1, max1, min2, max2, round = false) => {
    const num1 = (num - min1) / (max1 - min1);
    const num2 = num1 * (max2 - min2) + min2;

    if (round) return Math.round(num2);

    return num2;
};

export const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
};

export const lerp = (start, end, ease) => {
    return start + (end - start) * ease;
};

export const round = (n, d = 6) => {
    const decimal = Math.pow(10, d);
    return Math.round(n * decimal) / decimal;
};

export const debounce = (func, wait, immediate) => {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
