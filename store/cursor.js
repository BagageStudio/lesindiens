export const state = () => ({
    hasMouse: false,
    showCursor: false,
    mousePos: {
        x: 0,
        y: 0
    },
    icon: 'arrow'
});

// export const getters = () => {};

export const mutations = {
    setHasMouse(state, hasMouse) {
        state.hasMouse = hasMouse;
    },
    setShowCursor(state, showCursor) {
        state.showCursor = showCursor;
    },
    setMousePos(state, mousePos) {
        state.mousePos = mousePos;
    },
    setIcon(state, icon) {
        state.icon = icon;
    }
};
