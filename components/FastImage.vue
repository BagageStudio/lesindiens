<template>
    <picture class="fast-image" :class="{ loaded, cover, contains, 'full-width': fullWidth }">
        <source type="image/webp" :srcset="transformImage(image.filename, 'filters:format(webp)')" />
        <img
            ref="fitImage"
            :src="transformImage(image.filename, '')"
            :alt="resolveAlt(image)"
            :loading="loading"
            class="image"
        />
    </picture>
</template>

<script>
import { isSafari } from '@stereorepo/sac';

export default {
    props: {
        image: {
            type: Object,
            required: true
        },
        loading: {
            type: String,
            default: 'lazy'
        },
        contains: {
            type: Boolean,
            default: false
        },
        cover: {
            type: Boolean,
            default: false
        },
        fullWidth: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loaded: false
        };
    },
    mounted() {
        this.$refs.fitImage.addEventListener('load', this.loadedListener, false);

        if (isSafari()) this.loaded = true;
    },
    beforeDestroy() {
        this.$refs.fitImage.removeEventListener('load', this.loadedListener, false);
    },
    methods: {
        loadedListener() {
            this.loaded = true;
        },
        transformImage(image, option) {
            if (!image) return '';

            const imageService = 'https://img2.storyblok.com/';
            const path = image.replace('https://a.storyblok.com', '');
            return imageService + option + path;
        },
        resolveAlt({ alt }) {
            return alt ? alt.replace(/"/g, '&quot;') : '';
        }
    }
};
</script>

<style lang="scss" scoped>
.fast-image {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(0.95);
    transition: 0.2s ease-out;
    &.loaded {
        opacity: 1;
        transform: scale(1);
    }
    &.cover {
        .image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    &.contains {
        .image {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
    &.full-width {
        .image {
            width: 100%;
        }
    }
}
</style>
