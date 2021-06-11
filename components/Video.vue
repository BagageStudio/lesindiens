<template>
    <video autoplay loop muted playsinline :class="{ 'full-width': fullWidth }">
        <source :src="video.webm_file.filename" type="video/webm" />
        <source :src="video.mp4_file.filename" type="video/mp4" />
    </video>
</template>

<script>
export default {
    props: {
        video: {
            type: Object,
            required: true
        },
        fullWidth: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style lang="scss" scoped>
.video {
    &.full-width {
        width: 100%;
    }
}
</style>
