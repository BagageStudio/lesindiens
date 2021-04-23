export const state = () => ({
    firstScrollTop: 0,
    scrollTop: 0,
    scrollDirection: 0
});

export const mutations = {
    setFirstScrollTop(state, firstScrollTop) {
        state.firstScrollTop = firstScrollTop;
        state.scrollTop = firstScrollTop;
    },
    setScrollTop(state, scrollTop) {
        state.scrollDirection = Math.sign(scrollTop - state.scrollTop);
        state.scrollTop = scrollTop;
    }
};
