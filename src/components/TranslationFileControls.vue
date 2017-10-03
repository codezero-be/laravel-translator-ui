<template>
    <div>
        <h3>Translation Files</h3>
        <label class="control-label">Select Translation File:</label>
        <select class="form-control" v-model="selectedFile">
            <option v-for="file in sortedFiles"
                    v-text="getFullName(file)"
                    :key="file.id"
                    :value="file">
            </option>
        </select>
        <div class="translation-file-actions">
            <button class="btn btn-primary"
                    type="button"
                    @click="showEditForm = true"
                    :disabled="!hasSelectedFile">
                Edit
            </button>
            <button class="btn btn-danger"
                    type="button"
                    @click="deleteSelectedFile"
                    :disabled="!hasSelectedFile">
                Delete
            </button>
            <button class="btn btn-success"
                    type="button"
                    @click="showCreateForm = true">
                New
            </button>
        </div>
        <translation-file-create-form
            v-if="showCreateForm"
            @canceled="showCreateForm = false"
            @created="onTranslationFileCreated">
        </translation-file-create-form>
        <translation-file-edit-form
            v-if="showEditForm"
            :file="selectedFile"
            @canceled="showEditForm = false"
            @updated="onTranslationFileUpdated">
        </translation-file-edit-form>
    </div>
</template>

<script>
    import showAlert from 'sweetalert2';
    import Form from "form-backend-validation";
    import TranslationFileCreateForm from './TranslationFileCreateForm';
    import TranslationFileEditForm from './TranslationFileEditForm';

    export default {
        components: {
            TranslationFileCreateForm,
            TranslationFileEditForm,
        },

        props: ['file'],

        created() {
            this.selectedFile = this.file || {};
            this.fetchTranslationFiles();
        },

        data() {
            return {
                files: [],
                selectedFile: {},
                showCreateForm: false,
                showEditForm: false,
                deleteForm: new Form(),
            };
        },

        watch: {
            selectedFile: {
                handler(file) {
                    this.$emit('update:file', file);
                },
                deep: true
            }
        },

        computed: {
            hasSelectedFile() {
                return !! this.selectedFile.id;
            },

            sortedFiles() {
                return this.files.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });
            }
        },

        methods: {
            fetchTranslationFiles() {
                axios.get('/translator/files').then(response => {
                    this.files = response.data;
                });
            },

            getFullName(file) {
                return file.package
                    ? file.package + '::' + file.name
                    : file.name;
            },

            getIndex(file) {
                return this.files.map(f => f.id).indexOf(file.id);
            },

            deleteSelectedFile() {
                showAlert({
                    type: "warning",
                    title: "Are you sure?",
                    html: "You are about to delete the selected translation file.",
                    showConfirmButton: true,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Delete',
                    showCancelButton: true,
                    cancelButtonColor: '#212121',
                    cancelButtonText: 'Cancel',
                    reverseButtons: false,
                    focusConfirm: false,
                    focusCancel: true,
                }).then(this.onDeleteConfirm).catch(() => {});
            },

            onDeleteConfirm() {
                this.deleteForm.delete('/translator/files/' + this.selectedFile.id)
                    .then(this.onTranslationFileDeleted)
                    .catch(this.onDeleteError);
            },

            onDeleteError() {
                showAlert({
                    type: "error",
                    title: "Woops!",
                    html: "There was an error...<br>The translation file could not be deleted!",
                    confirmButtonColor: '#212121'
                });
            },

            onTranslationFileCreated(file) {
                this.files.push(file);
                this.selectedFile = file;
                this.showCreateForm = false;
            },

            onTranslationFileUpdated(file) {
                this.files.splice(this.getIndex(file), 1, file);
                this.selectedFile = file;
                this.showEditForm = false;
            },

            onTranslationFileDeleted(file) {
                this.files.splice(this.getIndex(file), 1);
                this.selectedFile = {};
            }
        }
    };
</script>

<style lang="scss">
    .translation-file-actions {
        display: flex;
        width: 100%;

        .btn {
            flex-grow: 1;
            margin: 5px 0;

            + .btn {
                margin-left: 5px;
            }
        }
    }
</style>
