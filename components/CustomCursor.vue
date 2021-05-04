<template>
    <div class="cursor-wrapper" :class="{ show: showCursor }">
        <div ref="cursor" class="cursor" />
        <div ref="icon" class="cursor-icon" :class="{ left: iconRotation === 'left' }">
            <Icon :name="cursorIcon" />
        </div>
    </div>
</template>
<script>
import { gsap } from 'gsap';

export default {
    data: () => ({
        cursorRect: null,
        iconRect: null
    }),
    computed: {
        cursorIcon() {
            return this.$store.state.cursor.icon;
        },
        showCursor() {
            return this.$store.state.cursor.showCursor;
        },
        mousePos() {
            return this.$store.state.cursor.mousePos;
        },
        iconRotation() {
            return this.$store.state.cursor.iconRotation;
        }
    },
    watch: {
        mousePos(pos) {
            const p = {
                icon: {
                    x: pos.x - this.iconRect.width / 2,
                    y: pos.y - this.iconRect.height / 2
                },
                cursor: {
                    x: pos.x - this.cursorRect.width / 2,
                    y: pos.y - this.cursorRect.height / 2
                }
            };
            gsap.to(this.$refs.icon, {
                duration: 0.5,
                x: p.icon.x,
                y: p.icon.y,
                ease: 'power4.out'
            });
            gsap.to(this.$refs.cursor, {
                duration: 0.7,
                x: p.cursor.x,
                y: p.cursor.y,
                ease: 'power4.out'
            });
        }
    },
    mounted() {
        this.cursorRect = this.$refs.cursor.getBoundingClientRect();
        this.iconRect = this.$refs.icon.getBoundingClientRect();
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
.cursor-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    user-select: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    z-index: 10;
    &.show {
        opacity: 1;
    }
}
.cursor {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 66px;
    height: 54px;
    border-radius: 50%;
    background: $black;
    border: 1px solid $white;
    box-shadow: 4px 3px 0px $white;
}
.cursor-icon {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0px;
    left: 0px;
    width: 66px;
    height: 54px;
    .icon {
        transform-origin: 50% 50%;
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    }
    &.left .icon {
        transform: rotate(-180deg);
    }
    .icon-arrow-long {
        width: 20px;
        height: 9px;
    }
    .icon-eye {
        width: 19px;
        height: 14px;
    }
}
</style>
