<template>
    <div class="module-numbered-list">
        <div class="container">
            <div class="container-small">
                <div class="wrapper-numered-list">
                    <div class="wrapper-cols">
                        <div class="col-small content-pad">
                            {{ data.title }}
                        </div>
                        <div class="col-large content-pad">content</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Object, required: true }
    },
    data: () => ({}),
    computed: {},
    watch: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.wrapper-numered-list {
    position: relative;
    padding: 30px 0 50px;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: $gutter;
        right: $gutter;
        border-top: 1px solid $grey-5;
    }
}
</style>
