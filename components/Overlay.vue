<template>
    <div class="overlay" />
</template>
<script>
import { gsap } from 'gsap';
export default {
    computed: {
        show() {
            return this.$store.state.layout.showOverlay;
        }
    },
    watch: {
        show(show) {
            if (show) {
                gsap.to(this.$el, {
                    duration: 0.5,
                    autoAlpha: 1
                });
            } else {
                gsap.to(this.$el, {
                    autoAlpha: 0
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.overlay {
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--primary);
    transition: background-color 0.2s ease-in-out;
    position: fixed;
    z-index: 10;
}
</style>
