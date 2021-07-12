import { wait } from '~/assets/js/utils';

export const basic = {
    name: 'basic',
    appear: true,
    mode: 'out-in',
    css: false,
    beforeLeave(el) {},
    async leave(el, done) {
        this.$store.commit('layout/setOverlay', true);
        // Wait for the overlay transition
        await wait(300);
        this.$store.commit('layout/setHeader', false);
        this.$store.commit('layout/setFooter', false);
        done();
    },
    afterLeave(el) {},
    beforeEnter(el) {},
    enter(el, done) {
        done();
    },
    afterEnter(el) {}
};
