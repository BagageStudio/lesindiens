<template functional>
    <svg v-bind="parent.attrs" :class="`icon-${props.name}`" class="icon" :style="data.staticStyle">
        <use :href="`#icon-${props.name}`" />
    </svg>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        }
    }
};
</script>
