import { gsap } from 'gsap';

export const basic = {
    name: 'basic',
    appear: true,
    mode: 'out-in',
    css: false,
    beforeLeave(el) {},
    async leave(el, done) {
        const loading = el.querySelector('.overlay');
        await gsap.to(loading, {
            duration: 0.5,
            autoAlpha: 1
        });
        this.$store.commit('layout/setHeader', false);
        this.$store.commit('layout/setFooter', false);
        done();
    },
    afterLeave(el) {},
    beforeEnter(el) {},
    enter(el, done) {
        const loading = el.querySelector('.overlay');
        gsap.set(loading, {
            autoAlpha: 0
        });
    },
    afterEnter(el) {}
};
