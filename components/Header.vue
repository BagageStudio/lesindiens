<template>
    <div class="header">
        <div class="container">
            <div class="container-small">
                <nuxt-link class="content-pad" to="/">
                    <Logo />
                </nuxt-link>
                <Button icon class="primary"> hello@lesindiens.fr </Button>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 116px;
    z-index: 10;
    // &::after {
    //     position: absolute;
    //     content: '';
    //     bottom: 0;
    //     width: 100%;
    //     height: 1px;
    //     background-color: red;
    // }
}
.container,
.container-small {
    height: 100%;
}

.container-small {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.logo {
    height: 20px;
    width: 131px;
}
</style>
