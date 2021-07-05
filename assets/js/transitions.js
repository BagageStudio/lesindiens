import { gsap } from 'gsap';

export const basic = {
    name: 'basic',
    appear: true,
    mode: 'out-in',
    css: false,
    beforeLeave(el) {},
    leave(el, done) {
        done();
    },
    afterLeave(el) {},
    beforeEnter(el) {},
    enter(el, done) {
        done();
    },
    afterEnter(el) {}
};
