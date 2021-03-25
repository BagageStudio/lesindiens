<template>
    <div ref="glWrapper" class="gl-wrapper" />
</template>
<script>
export default {
    data() {},
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
