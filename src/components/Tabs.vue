<template>
    <div>
        <ul :class="['nav', pills ? 'nav-pills' : 'nav-tabs']">
            <li v-for="tab in tabs" :class="{ 'active': tab.isActive }" :key="tab.id" role="presentation">
                <a v-text="tab.title" :href="tab.href" @click.prevent="selectTab(tab)"></a>
            </li>
        </ul>
        <div class="tab-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            pills: { default: false }
        },

        created() {
            this.tabs = this.$children;
        },

        data() {
            return {
                tabs: [],
            };
        },

        methods: {
            selectTab(tab) {
                this.tabs.forEach(t => {
                    t.isActive = (t.href == tab.href);
                });
            }
        }
    };
</script>

<style>
    .nav-pills {
        margin-bottom: 1em;
    }
</style>
