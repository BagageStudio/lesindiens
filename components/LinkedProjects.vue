<template>
    <div class="wrapper-linked-projects">
        <div class="container">
            <div class="container-small">
                <nuxt-link
                    v-for="project in projects"
                    :key="project.id"
                    :to="'/' + project.full_slug"
                    class="linked-project"
                >
                    <h3 class="linked-project-title content-pad">{{ project.content.song_title }}</h3>
                    <span class="linked-project-info content-pad">
                        <span class="info-title">Client</span>
                        <span class="info-content">{{ project.content.name }}</span>
                    </span>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        projects: { type: Array, required: true }
    }
};
</script>

<style lang="scss" scoped>
.wrapper-linked-projects {
    padding: 20px 0 90px;
}
.linked-project {
    position: relative;
    display: block;
    padding: 60px 0 25px;
    text-decoration: none;
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: $gutter;
        right: $gutter;
        border-bottom: 1px solid $grey-2;
    }
}
.linked-project-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 3.5rem;
    line-height: 42px;
}
.linked-project-info {
    display: flex;
    flex-direction: column;
    margin-top: 25px;
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 20px;
}
.info-title {
    color: $grey-3;
    margin: 0 0 5px;
}

@media (min-width: $tablet) {
    .linked-project {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
    .linked-project-title {
        width: percentage(3/8);
    }
    .linked-project-info {
        width: percentage(4/8);
        padding-bottom: 5px;
    }
}
@media (min-width: $desktop) {
    .linked-project-title {
        width: percentage(4/10);
    }
    .linked-project-info {
        width: percentage(5/10);
    }
}
@media (min-width: $desktop-large) {
    .linked-project {
        padding: 110px 0 25px;
    }
    .linked-project-info {
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;
    }
    .info-title {
        margin: 0 20px 0 0;
    }
}
</style>
