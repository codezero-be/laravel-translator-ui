<template>
    <div :id="id" :class="['tab-pane', isActive ? 'active' : '']" v-show="isActive" role="tabpanel">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            title:    { required: true },
            selected: { default: false }
        },

        mounted() {
            this.isActive = this.selected;
        },

        data() {
            return {
                isActive: false
            };
        },

        computed: {
            href() {
                return '#' + this.id;
            },

            id() {
                return 'tab' + this.title.toLowerCase().replace(/ /g, '-');
            }
        }
    };
</script>
