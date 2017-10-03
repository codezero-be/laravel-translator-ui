<template>
    <modal title="Import & Synchronize">
        <p>
            This will import Laravel's language files from "<code>resources/lang</code>" into the database.<br>
            Published package translation files will also be included.<br>
            This operation may take some time.
        </p>
        <hr>
        <h5>Choose your import strategy:</h5>
        <hr>
        <form>
            <div class="form-group">
                <p>
                    <label>
                        <input type="radio" name="strategy" @click="strategy = 'import'" :disabled="isLoading">
                        Import translations
                    </label>
                </p>
            </div>
            <div class="form-group">
                <p>
                    <label>
                        <input type="radio" name="strategy" @click="strategy = 'sync'" :disabled="isLoading">
                        Synchronize translations
                    </label>
                </p>
                <div v-show="strategy === 'sync'">
                    <p>
                        <label>
                            <input type="checkbox" v-model="syncForm.database_wins" :disabled="isLoading">
                            Do not overwrite any existing database translations
                        </label>
                    </p>
                </div>
                <hr>
                <p class="alert alert-danger" v-show="strategy === 'import'">
                    All database translations will be deleted before import!
                </p>
                <p class="alert alert-danger" v-show="strategy === 'sync' && !syncForm.database_wins">
                    Duplicate database translations will be overwritten!
                </p>
                <p class="alert alert-success" v-show="strategy === 'sync' && syncForm.database_wins">
                    Duplicate database translations will not be overwritten!
                </p>
            </div>
        </form>
        <div slot="footer">
            <button type="button" class="btn btn-link" @click="cancel" :disabled="isLoading">Cancel</button>
            <button type="button" class="btn btn-success" @click="importFiles" :disabled="!strategy || isLoading">
                <span v-if="isLoading">{{ strategy === 'sync' ? 'Synchronizing...' : 'Importing...' }}</span>
                <span v-if="!isLoading">{{ strategy === 'sync' ? 'Synchronize' : 'Import' }}</span>
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
                strategy: null,
                isLoading: false,
                importForm: new Form(),
                syncForm: new Form({
                    database_wins: false,
                })
            };
        },

        methods: {
            importFiles() {
                this.isLoading = true;
                if (this.strategy === 'import') {
                    this.importForm.post('/translator/import').then(this.done).catch(this.onError);
                }
                if (this.strategy === 'sync') {
                    this.syncForm.patch('/translator/sync').then(this.done).catch(this.onError);
                }
            },

            onError() {
                this.isLoading = false;
            },

            done() {
                let message = this.strategy === 'import'
                    ? "Translation files were successfully imported!"
                    :"Translation files were successfully synchronized!";

                showAlert({
                    type: "info",
                    title: "Done!",
                    html: message,
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
