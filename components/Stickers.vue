<template>
    <div class="stickers content-pad">
        <div ref="sticker" class="sticker" @mousemove="mouseMove" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
            <svg
                ref="stickerContent"
                class="sticker-content"
                width="189"
                height="228"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g filter="url(#filter0_d)">
                    <rect width="185" height="225" rx="10" fill="#101011" />
                    <rect
                        x=".5"
                        y=".5"
                        width="184"
                        height="224"
                        rx="9.5"
                        stroke="#fff"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </g>
                <g clip-path="url(#clip0)" stroke="#fff" stroke-miterlimit="10" stroke-linejoin="round">
                    <path
                        d="M74.943 122.071c27.611 0 49.994-22.413 49.994-50.06 0-27.648-22.383-50.061-49.994-50.061S24.949 44.363 24.949 72.01c0 27.648 22.383 50.061 49.994 50.061z"
                        fill="#fff"
                        stroke-width="2"
                    />
                    <path
                        d="M94.295 28.6l15.653 2.184 21.629 32.772-17.265 13.299 6.261 44.741-27.131 3.8-2.182.379-27.132 3.8-6.26-44.74-20.302-8.075 11.763-37.427 14.42-6.46L94.295 28.6z"
                        fill="#13110C"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path d="M55.685 58.047l54.642-7.695" stroke-width="2" stroke-linecap="round" />
                    <path
                        d="M70.104 26.605l-5.407 4.274-1.044 9.31 12.048-1.71-5.597-11.874z"
                        fill="#13110C"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M75.701 38.478s3.13 1.33 3.51 3.99c.38 2.66 1.518 11.019 1.518 11.019"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M86.896 24.23l6.356 2.66 3.51 8.644-11.953 1.71 2.087-13.014z"
                        fill="#13110C"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M84.808 37.243s-2.656 2.09-2.276 4.75c.38 2.66 1.518 11.02 1.518 11.02"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <path
                        d="M75.701 68.126l4.27-3.705 1.517 10.734M90.328 73.969c1.608-.227 2.57-2.853 2.146-5.867-.424-3.013-2.07-5.272-3.679-5.046-1.608.227-2.569 2.853-2.146 5.867.424 3.013 2.07 5.272 3.679 5.046z"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                    <path
                        d="M114.217 76.855l-2.656-18.713M57.677 84.834l-2.656-18.713M42.783 78.28l3.7-12.35M126.834 65.171l-8.538-9.5"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                </g>
                <path
                    d="M25.566 173.999h8.613l.157-17.555h9.206l.055-6.072H16.57l-.055 6.072h9.207l-.156 17.555zm30.525.528c4.554 0 8.92-1.023 11.243-2.508l-2.112-3.696c-1.758.99-5.164 1.716-8.53 1.716-3.2 0-6.164-.792-7.037-2.772h17.82c.17-.561.242-1.287.247-1.782.049-5.477-5.034-9.074-12.79-9.074-7.887 0-13.43 3.729-13.478 9.041-.05 5.544 5.86 9.075 14.637 9.075zm-6.538-10.593c.314-1.913 2.47-3.266 5.276-3.266 2.739 0 4.97 1.32 5.053 3.266h-10.33zm27.855 10.593c4.686 0 8.43-1.617 10.136-4.224h.033l1.023 3.696h6.765l.098-11.022c.037-4.19-4.892-6.566-12.383-6.566-5.379 0-10.738 1.452-14.058 3.696l2.01 4.058c3.253-2.078 7.884-3.398 12.01-3.398 2.87 0 4.746.627 4.739 1.452-.003.33-.435.593-1.161.659l-6.507.594c-7.067.66-11.213 2.97-11.243 6.369-.027 2.97 3.126 4.686 8.538 4.686zm2.813-4.62c-2.31 0-3.526-.495-3.519-1.353.008-.891 1.365-1.386 3.908-1.584l7.002-.627v.066c-.02 2.079-2.969 3.498-7.39 3.498zm17.502 4.092h7.821l.07-7.821c.026-3.003 1.792-4.817 4.762-4.817 2.409 0 3.848 1.418 3.827 3.794l-.079 8.844h7.788l.07-7.821c.026-3.003 1.792-4.817 4.762-4.817 2.442 0 3.848 1.418 3.827 3.794l-.079 8.844h7.821l.089-9.999c.041-4.553-2.902-7.589-7.951-7.589-3.762 0-7.244 1.848-8.855 4.95h-.033c-.93-3.036-3.52-4.95-7.48-4.95-3.894 0-7.112 1.881-8.69 4.884h-.033l-.984-4.323h-6.501l-.152 17.027zM23.74 204.998h8.283l5.41-10.989h.066l5.182 10.989h8.383l8.038-17.028h-8.085l-4.62 11.121h-.033l-5.313-11.121h-7.029l-5.542 10.923h-.033l-4.424-10.923h-8.052l7.768 17.028zm48.454.528c8.283 0 13.727-3.564 13.775-9.042.05-5.478-5.33-9.074-13.614-9.074-8.25 0-13.694 3.596-13.743 9.074-.048 5.478 5.332 9.042 13.582 9.042zm.04-4.554c-3.563 0-5.858-1.782-5.834-4.488.025-2.706 2.35-4.488 5.914-4.488 3.564 0 5.859 1.782 5.835 4.488-.025 2.706-2.35 4.488-5.914 4.488zm30.548-13.562c-3.069 0-5.856 1.715-7.135 4.487h-.033l-1.021-3.927h-6.501l-.151 17.028h7.82l.068-7.59c.029-3.234 1.367-5.28 3.578-5.28 1.617 0 2.725 1.617 2.834 4.158l7.14-1.386c-.223-4.554-2.804-7.49-6.599-7.49zm8.136 17.588h7.821l.045-5.082 2.226-1.65 5.253 6.732h8.943l-8.684-10.56 8.671-6.468h-9.669l-6.645 5.049h-.033l.112-12.638h-7.821l-.219 24.617z"
                    fill="#fff"
                />
                <defs>
                    <clipPath id="clip0">
                        <path fill="#fff" transform="translate(24 21)" d="M0 0h109v110H0z" />
                    </clipPath>
                    <filter
                        id="filter0_d"
                        x="0"
                        y="0"
                        width="189"
                        height="228"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dx="4" dy="3" />
                        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                </defs>
            </svg>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';
import { round } from '~/assets/js/utils';

export default {
    data: () => ({
        stickerRect: null,
        percentageX: 0,
        percentageY: 0,
        rotX: 0,
        rotY: 0
    }),
    computed: {
        scrollTop() {
            return this.$store.state.scroll.scrollTop;
        }
    },
    watch: {
        scrollTop() {
            this.computeRect();
        }
    },
    mounted() {
        this.computeRect();
    },
    methods: {
        mouseMove(e) {
            this.tilt(e.pageX, e.pageY);
        },
        mouseEnter() {
            gsap.to(this.$refs.stickerContent, {
                duration: 0.2,
                scale: 1.05
            });
        },
        mouseLeave() {
            gsap.to(this.$refs.stickerContent, {
                duration: 0.5,
                rotationX: 0,
                rotationY: 0,
                scale: 1
            });
        },
        tilt(cx, cy) {
            this.percentageX = round(
                ((cx - this.stickerRect.left - this.stickerRect.width / 2) / this.stickerRect.width) * 2
            );
            this.percentageY = round(
                ((cy - this.stickerRect.top - this.scrollTop - this.stickerRect.height / 2) / this.stickerRect.height) *
                    2
            );
            this.rotX = -this.percentageY * 20;
            this.rotY = this.percentageX * 20;
            gsap.to(this.$refs.stickerContent, {
                duration: 0.2,
                rotationX: this.rotX,
                rotationY: this.rotY
            });
        },
        computeRect() {
            this.stickerRect = this.$refs.sticker.getBoundingClientRect();
        }
    }
};
</script>

<style lang="scss" scoped>
.sticker {
    width: 189px;
    height: 228px;
    perspective: 500px;
}
.sticker-content {
    transform-origin: 50% 50% -20px;
}
.class {
    transform-origin: 50% 50%;
}
</style>
