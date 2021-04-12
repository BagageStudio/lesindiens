<template>
    <div v-show="isActive" class="grid">
        <div class="container">
            <div v-for="columnIndex in columnsNumber" :key="columnIndex" class="column-block">
                <div class="column-text" />
            </div>
            <!-- <div class="container-small" /> -->
        </div>
    </div>
</template>

<script>
import { BREAKPOINTS } from '~/assets/js/constants.js';

export default {
    data: () => ({
        columnsData: {
            xs: 4,
            m: 8,
            xl: 12
        },
        isActive: true,
        columnsNumber: 0
    }),
    computed: {
        windowWidth() {
            if (!this.$store.state.superWindow) return Infinity;
            return this.$store.state.superWindow.width;
        }
    },
    watch: {
        windowWidth() {
            this.computeColumns();
        }
    },
    beforeMount() {
        this.computeColumns();
        document.addEventListener('keydown', this.toggleGrid, false);
    },
    beforeDestroy() {
        // NOTE: Avoiding memory leaks
        document.removeEventListener('keydown', this.toggleGrid, false);
    },
    methods: {
        toggleGrid({ isComposing, keyCode }) {
            if (isComposing || keyCode === 229) return;
            // Letter G for grid
            if (keyCode !== 71) return;
            this.isActive = !this.isActive;
        },
        computeColumns() {
            const selectedBreakpoint = Object.entries(this.columnsData).reduce(
                (previousBreakpoint, [breakpoint]) =>
                    this.windowWidth >= BREAKPOINTS[breakpoint] &&
                    BREAKPOINTS[breakpoint] > BREAKPOINTS[previousBreakpoint]
                        ? breakpoint
                        : previousBreakpoint,
                'xs'
            );
            this.columnsNumber = this.columnsData[selectedBreakpoint];
        }
    }
};
</script>

<style lang="scss" scoped>
.grid {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 999;
}

.container {
    &:first-child {
        position: fixed;
    }
    &:last-child {
        position: absolute;
    }
    display: flex;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    z-index: 999;
}

.column-block {
    flex: 1 0 auto;
    padding: 0 $gutter;
    outline: 1px solid blue;
}

.column-text {
    width: 100%;
    height: 100%;
    outline: 1px solid blue;
}

.rows {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.row {
    margin: $line-height - 1px 0 0;
}

.container-small {
    outline: 1px solid orange;
}

// ↔️ Horizontal breakpoint
@media (min-width: $phone) {
    .column-block {
        padding: 0 $gutter;
    }
}
</style>
