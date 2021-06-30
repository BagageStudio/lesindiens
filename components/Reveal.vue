<template>
    <component :is="tag" :class="classReveal">
        <slot />
    </component>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        hook: {
            type: Boolean,
            required: false,
            default: false
        },
        offset: {
            type: Object,
            required: false,
            default() {
                return {
                    top: 220,
                    bottom: 120
                };
            }
        },
        tag: {
            type: String,
            required: false,
            default: 'div'
        },
        once: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            pos: null,
            isIn: null,
            isInit: false,
            alreadyIn: false,
            classReveal: ''
        };
    },
    computed: {
        scroll() {
            return this.$store.state.scroll.scrollTop;
        },
        w() {
            return this.$store.state.superWindow;
        }
    },
    watch: {
        scroll() {
            this.onScroll();
        },
        isIn(val) {
            if (this.alreadyIn && this.once) return;
            if (!this.alreadyIn && this.isInit) this.alreadyIn = true;
            if (!this.isInit) this.isInit = true;
            if (this.hook) {
                this.triggerHooks(val);
            } else {
                this.triggerClasses(val);
            }
        }
    },
    mounted() {
        this.onScroll();
    },
    methods: {
        triggerHooks(val) {
            if (val) {
                this.$parent[this.name + 'In']();
            } else if (!this.once) {
                this.$parent[this.name + 'Out']();
            }
        },
        triggerClasses(val) {
            if (val) {
                this.classReveal = `${this.name}-in`;
            } else if (!this.once || !this.alreadyIn) {
                this.classReveal = `${this.name}-out`;
            }
        },
        onScroll() {
            this.pos = this.$el.getBoundingClientRect();
            if (
                this.pos.top - this.w.height + this.offset.bottom < 0 &&
                this.pos.top + this.pos.height - this.offset.top > 0
            ) {
                this.isIn = true;
            } else if (
                this.pos.top + this.pos.height - this.offset.top < 0 ||
                this.pos.top - this.w.height + this.offset.bottom > 0
            ) {
                this.isIn = false;
            }
        }
    }
};
</script>
