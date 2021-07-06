import Vue from 'vue';

Vue.filter('split', function (value) {
    const chars = value.split('');
    const charsWithSpans = chars.map(c => `<span class="letter">${c.replace(' ', '&nbsp;')}</span>`);

    return charsWithSpans.join('');
});

Vue.filter('splitInWords', function (value) {
    if (value.includes('<br />')) {
        const text = value.replace('</p>', '').replace('<p>', '');
        return text
            .split('<br />')
            .map(line => {
                const words = line.split(' ');
                const wordsWithSpans = words.map(word => `<span class="word">${word}&nbsp;</span>`);
                return wordsWithSpans.join('');
            })
            .join('<br />');
    }

    const words = value.split(' ');
    const wordsWithSpans = words.map(word => `<span class="word">${word}&nbsp;</span>`);

    return wordsWithSpans.join('');
});
