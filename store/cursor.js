export const state = () => ({
    hasMouse: false,
    showCursor: false,
    mousePos: {
        x: 0,
        y: 0
    },
    icon: 'arrow-long',
    image: null,
    size: ['135px', '110px'],
    iconRotation: 0,
    style: 'icon',
    inverted: false
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
        if (state.style !== 'icon') state.style = 'icon';
        state.icon = icon;
        state.size = ['66px', '54px'];
    },
    setIconRotation(state, iconRotation) {
        state.iconRotation = iconRotation;
    },
    setImage(state, { image, size }) {
        if (state.style !== 'image') state.style = 'image';
        state.image = image;
        state.size = size;
    },
    setInverted(state, isInverted) {
        state.inverted = isInverted;
    }
};
