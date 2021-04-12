import Vue from 'vue';
import { useSacVue, useSuperWindowVue, useSuperScrollVue } from '@stereorepo/sac';

export default (ctx, inject) => {
    // Set Vue.use here
    Vue.use(useSacVue);
    Vue.use(useSuperWindowVue);
    Vue.use(useSuperScrollVue);
};
