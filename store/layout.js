export const state = () => ({
    showHeader: false,
    showFooter: false,
    showOverlay: true
});

// export const getters = () => {};

export const mutations = {
    setHeader(state, showHeader) {
        state.showHeader = showHeader;
    },
    setFooter(state, showFooter) {
        state.showFooter = showFooter;
    },
    setOverlay(state, showOverlay) {
        state.showOverlay = showOverlay;
    }
};
