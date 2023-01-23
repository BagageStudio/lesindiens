<template>
    <div class="services">
        <Service v-for="service in data" :key="service._uid" :data="service" :global="global" />
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Array, required: true },
        global: { type: Object, required: true }
    }
};
</script>

<style lang="scss" scoped></style>
