import Vue from 'vue';

Vue.filter('split', function (value) {
    const chars = value.split('');
    const charsWithSpans = chars.map(c => `<span class="letter">${c.replace(' ', '&nbsp;')}</span>`);

    return charsWithSpans.join('');
});

Vue.filter('splitInWords', function (value) {
    const words = value.split(' ');
    const wordsWithSpans = words.map(word => `<span class="word">${word}&nbsp;</span>`);

    return wordsWithSpans.join('');
});
