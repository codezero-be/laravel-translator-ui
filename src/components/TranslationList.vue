<template>
    <div>
        <h3>
            Translation Keys<br>
            <small v-if="hasTranslationFile">&raquo; {{ translationKeyPrefix }}</small>
        </h3>
        <div class="translation-list list-group">
            <a v-for="translation in sortedTranslations"
               v-text="translation.key"
               :key="translation.id"
               :href="getTranslationUrl(translation)"
               :class="getTranslationClasses(translation)"
               @click.prevent="setSelectedTranslation(translation)"></a>
            <div class="list-group-item" v-if="!hasTranslationFile">
                There is no translations file selected.
            </div>
            <div class="list-group-item" v-else-if="!hasTranslationList">
                There are no translations in the selected file.
            </div>
        </div>
        <div class="input-group">
            <input class="form-control"
                    placeholder="Add new key"
                    v-model="createForm.key"
                    @keypress.enter="createTranslation"
                    @keypress="createForm.errors.clear()"
                    :disabled="!hasTranslationFile">
            <div class="input-group-btn">
                <button class="btn btn-success"
                        @click="createTranslation"
                        :disabled="!hasTranslationFile">
                    Add
                </button>
            </div>
        </div>
        <p class="text-danger"
            v-if="createForm.errors.has('key')"
            v-text="createForm.errors.get('key')">
        </p>
        <p class="help-block">
            <strong>Note:</strong> don't include the package and file name in the new key.
        </p>
    </div>
</template>

<script>
    import showAlert from 'sweetalert2';
    import Form from 'form-backend-validation';

    export default {
        props: ['file', 'translation', 'translations'],

        created() {
            this.fetchTranslationList();
            this.selectedTranslation = this.translation;
        },

        data() {
            return {
                translationList: [],
                selectedTranslation: {},
                createForm: new Form({
                    key: '',
                })
            };
        },

        watch: {
            file() {
                this.createForm.reset();
                this.selectedTranslation = {};
                this.fetchTranslationList();
            },

            translations: {
                handler(translations) {
                    this.translationList = translations || [];
                },
                deep: true
            },

            translation: {
                handler(translation) {
                    this.selectedTranslation = translation || {};
                },
                deep: true
            },

            selectedTranslation(translation) {
                this.$emit('update:translation', translation);
            }
        },

        computed: {
            hasTranslationFile() {
                return !! this.file.id;
            },

            hasTranslationList() {
                return this.translationList.length > 0;
            },

            sortedTranslations() {
                return this.translationList.sort((a, b) => {
                    if (a.key < b.key) return -1;
                    if (a.key > b.key) return 1;
                    return 0;
                });
            },

            translationKeyPrefix() {
                return this.file.package
                    ? this.file.package + '::' + this.file.name
                    : this.file.name;
            },

        },

        methods: {
            fetchTranslationList() {
                if ( ! this.file.id) {
                    this.translationList = [];
                    return;
                }

                axios.get('/translator/files/' + this.file.id).then(response => {
                    this.translationList = response.data;
                    this.$emit('update:translations', this.translationList);
                });
            },

            setSelectedTranslation(translation) {
                if ( ! this.selectedTranslation.isDirty) {
                    return this.selectedTranslation = translation;
                }
                
                this.askToDiscardUnsavedChanges()
                    .then(() => {
                        this.selectedTranslation.isDirty = false;
                        this.selectedTranslation = translation;
                    }).catch(() => {});
            },

            askToDiscardUnsavedChanges() {
                return showAlert({
                    type: "warning",
                    title: "You have unsaved changes!",
                    html: "Do you want to discard the changes you made?",
                    showConfirmButton: true,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Discard Changes',
                    showCancelButton: true,
                    cancelButtonColor: '#212121',
                    cancelButtonText: 'Cancel',
                    reverseButtons: false,
                    focusConfirm: false,
                    focusCancel: true,
                });
            },

            createTranslation() {
                this.createForm.post('/translator/files/' + this.file.id)
                    .then(this.onSuccess)
                    .catch(errors => {});
            },

            onSuccess(translation) {
                this.translationList.push(translation);
                this.$emit('update:translations', this.translationList);
                this.setSelectedTranslation(translation);
            },

            getTranslationUrl(translation) {
                return '/translator/translationList/' + translation.id;
            },

            getTranslationClasses(translation) {
                let classes = ['list-group-item'];

                if (translation.id === this.selectedTranslation.id) {
                    classes.push('active');
                }

                return classes;
            }
        }
    };
</script>

<style>
    @media screen and (min-width: 768px) {
        .translation-list {
            max-height: 390px;
            overflow-y: auto;
        }
    }
</style>
