<template>
    <modal title="Export">
        <p>
            This will export the translations from the database to language files in "<code>resources/lang</code>".<br>
            This operation may take some time.
        </p>
        <hr>
        <p class="alert alert-danger">
            Existing translation files will be deleted before export!
        </p>
        <div slot="footer">
            <button type="button" class="btn btn-link" @click="cancel" :disabled="isLoading">Cancel</button>
            <button type="button" class="btn btn-success" @click="exportFiles" :disabled="isLoading">
                {{ isLoading ? 'Exporting...' : 'Export' }}
            </button>
        </div>
    </modal>
</template>

<script>
    import showAlert from 'sweetalert2';
    import Form from 'form-backend-validation';
    import Modal from './Modal';

    export default {
        components: { Modal },

        data() {
            return {
                isLoading: false,
                exportForm: new Form(),
            };
        },

        methods: {
            exportFiles() {
                this.isLoading = true;
                this.exportForm.post('/translator/export').then(this.done).catch(this.onError);
            },

            onError() {
                this.isLoading = false;

                showAlert({
                    type: 'error',
                    title: 'Woops!',
                    html: 'There was an error!',
                    confirmButtonColor: '#212121'
                });
            },

            done() {
                showAlert({
                    type: 'info',
                    title: 'Done!',
                    html: 'Translation files were successfully exported!',
                    confirmButtonColor: '#2ab27b'
                }).then(() => {
                    this.isLoading = false;
                    this.$emit('done');
                });
            },

            cancel() {
                this.$emit('canceled');
            }
        }
    };
</script>
