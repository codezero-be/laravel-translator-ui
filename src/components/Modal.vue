<template>
    <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="title">
                        <h4 class="modal-title" v-text="title"></h4>
                    </slot>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <button type="button" class="btn btn-link" @click="cancel" v-text="cancelButton"></button>
                        <button type="button" class="btn btn-success" @click="confirm" v-text="confirmButton"></button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title:         { default: '' },
            confirmButton: { default: 'OK' },
            cancelButton:  { default: 'Cancel' }
        },

        methods: {
            cancel() {
                this.$emit('canceled');
            },

            confirm() {
                this.$emit('confirmed');
            }
        }
    };
</script>

<style>
    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, .7);
    }
</style>
