<template>
    <modal title="Create New Translation File"
           confirm-button="Save"
           @canceled="cancel"
           @confirmed="save">
        <div class="translation-file-create-form form-horizontal" @keypress="form.errors.clear()">
            <div class="form-group">
                <label class="control-label col-sm-3">File Name:</label>
                <div class="col-sm-9">
                    <div class="input-group">
                        <input class="form-control" v-model="form.name" v-focus>
                        <div class="input-group-addon">.php</div>
                    </div>
                    <p class="text-danger" v-if="form.errors.has('name')" v-text="form.errors.get('name')"></p>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-3">Package Name:</label>
                <div class="col-sm-9">
                    <input class="form-control" placeholder="Optional" v-model="form.package">
                    <p class="text-danger" v-if="form.errors.has('package')" v-text="form.errors.get('package')"></p>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
    import Form from 'form-backend-validation';
    import Modal from './Modal';

    export default {
        components: { Modal },

        directives: {
            focus: {
                inserted: function (el) {
                    el.focus();
                }
            }
        },

        data() {
            return {
                form: new Form({
                    name: '',
                    package: '',
                })
            };
        },

        methods: {
            save() {
                this.form.post('/translator/files')
                    .then(file => this.$emit('created', file))
                    .catch(errors => {});
            },

            cancel() {
                this.$emit('canceled');
            }
        }
    };
</script>

<style>
    .translation-file-create-form input {
        text-transform: lowercase;
    }
</style>
