import Vue from 'vue';

Vue.filter('split', function (value) {
    const chars = value.split('');
    const charsWithSpans = chars.map(c => `<span class="letter">${c}</span>`);

    return charsWithSpans.join('');
});
