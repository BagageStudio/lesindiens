<template>
    <a href="#">
        <span class="text">
            <slot />
        </span>
        <Icon v-if="icon" name="arrow" />
    </a>
</template>

<script>
export default {
    props: {
        icon: {
            required: false,
            default: false,
            type: Boolean
        }
    }
};
</script>

<style lang="scss" scoped>
.icon {
    height: 9px;
    width: 14px;
}

.primary {
    position: relative;
    text-decoration: none;
    font-size: 1.5rem;
    padding: 7px 17px;
    .text {
        margin-right: 20px;
    }
    &::after {
        position: absolute;
        content: '';
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 10px;
        border: 1px solid $grey-1;
        background-color: $black;
        box-shadow: 4px 3px 0px 0px $grey-1;
        z-index: -1;
    }
}
</style>
