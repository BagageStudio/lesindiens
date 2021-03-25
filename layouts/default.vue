<template>
    <div>
        <div ref="glWrapper" class="gl-wrapper" />
        <Nuxt />
    </div>
</template>
<script>
export default {
    mounted() {
        this.$webgl.init({
            dom: this.$refs.glWrapper
        });
    }
};
</script>
<style lang="scss" scoped>
.gl-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
}
</style>
