<template>
    <div>
        <h3>Translations</h3>
        <div class="form-group">
            <label>Key: <code v-if="translation.id">{{ translationKeyPrefix + editForm.key }}</code></label>
            <div class="input-group col-xs-12">
                <input class="form-control"
                       v-model="editForm.key"
                       @input="markDirty"
                       :readonly="!canEditKey"
                       :disabled="!translation.id">
                <div class="input-group-btn" v-if="translation.id">
                    <button class="btn btn-primary" @click="canEditKey = ! canEditKey">
                        {{ canEditKey ? 'Lock' : 'Unlock' }}
                    </button>
                </div>
            </div>
        </div>
        <div class="form-group">
            <p class="text-danger"
               v-if="editForm.errors.has('key')"
               v-text="editForm.errors.get('key')">
            </p>
        </div>
        <div class="form-group">
            <p class="text-muted">
                <strong>Warning!</strong>
                Changing a translation key will result in translations not being shown on the website once exported.
            </p>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox"
                       v-model="editForm.is_html"
                       @click="markDirty"
                       :disabled="!translation.id">
                Use HTML editor
            </label>
        </div>
        <tabs class="form-group" :pills="true">
            <tab v-for="language in languages" :key="language" :title="language.toUpperCase()" :selected="language === 'nl'">
                <editor
                    v-model="editForm.body[language]"
                    @input="markDirty"
                    :id="'translation-editor-' + language"
                    :html="isHTML"
                    :disabled="!translation.id">
                </editor>
                <span class="text-danger"
                      v-if="editForm.errors.has('body.' + language)"
                      v-text="editForm.errors.get('body.' + language)">
                </span>
            </tab>
        </tabs>
        <div class="translation-editor-buttons form-group">
            <button class="btn btn-success" @click="saveTranslation" :disabled="!translation.isDirty">
                {{ translation.isDirty ? 'Save' : 'Saved &check;' }}
            </button>
            <button class="btn btn-warning" @click="resetEditForm" :disabled="!translation.isDirty">
                Reset
            </button>
            <button class="btn btn-danger" @click="deleteTranslation" :disabled="!translation.id">
                Delete
            </button>
        </div>
    </div>
</template>

<script>
    import showAlert from 'sweetalert2';
    import Form from 'form-backend-validation';
    import Tabs from './Tabs';
    import Tab from './Tab';
    import Editor from './Editor';

    export default {
        components: {
            Tabs,
            Tab,
            Editor,
        },

        props: {
            file:         { default: () => {} },
            translation:  { default: () => {} },
            translations: { default: () => [] },
            languages:    { default: () => ['en'] },
        },

        created() {
            this.resetEditForm();
        },

        data() {
            return {
                canEditKey: false,
                editForm: new Form({
                    is_html: false,
                    key: '',
                    body: {},
                }, {
                    resetOnSuccess: false,
                }),
                deleteForm: new Form()
            };
        },

        watch: {
            translation() {
                this.resetEditForm();
            }
        },

        computed: {
            isHTML() {
                return this.editForm.is_html;
            },

            translationKeyPrefix() {
                return this.file.package
                    ? this.file.package + '::' + this.file.name + '.'
                    : this.file.name + '.';
            }
        },

        methods: {
            resetEditForm() {
                const body = this.translation.body || [];

                this.editForm.is_html = this.translation.is_html;
                this.editForm.key = this.translation.key;
                this.editForm.body = {};

                this.languages.forEach(language => {
                    // Need to use Vue.set because of an issue with v-model and array values:
                    // https://vuejs.org/v2/guide/list.html#Caveats
                    Vue.set(this.editForm.body, language, body[language] || '');
                });

                this.markDirty();
            },

            markDirty() {
                const translation = this.translation;
                translation.isDirty = this.translationHasChanges();
                this.$emit('update:translation', translation);
            },

            translationHasChanges() {
                const current = this.editForm;
                const original = this.translation;
                original.body = this.translation.body || [];

                if (original.is_html !== current.is_html || original.key !== current.key) {
                    return true;
                }

                for (const language of this.languages) {
                    const originalBody = (original.body[language] || '').trim();
                    const currentBody = (current.body[language] || '').trim();

                    if (originalBody !== currentBody) {
                        return true;
                    }
                }

                return false;
            },

            saveTranslation() {
                this.editForm.patch('/translator/translations/' + this.translation.id)
                    .then(this.onSaveSuccess)
                    .catch(this.onError);
            },

            onSaveSuccess(translation) {
                const translations = this.translations;

                translation.isDirty = false;
                translations.splice(this.getTranslationIndex(translation), 1, translation);

                this.$emit('update:translation', translation);
                this.$emit('update:translations', translations);
            },

            deleteTranslation() {
                showAlert({
                    type: "warning",
                    title: "Are you sure?",
                    html: "You are about to delete this translation.",
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
                this.deleteForm.delete('/translator/translations/' + this.translation.id)
                    .then(this.onDeleteSuccess)
                    .catch(this.onError);
            },

            onDeleteSuccess(translation) {
                this.removeTranslation(translation);
                this.$emit('update:translation', {});
            },

            removeTranslation(translation) {
                let translations = this.translations;
                translations.splice(this.getTranslationIndex(translation), 1);
                this.$emit('update:translations', translations);
                this.selectedTranslation = {};
            },

            onError() {
                showAlert({
                    type: "error",
                    title: "Woops!",
                    html: "There was an error...<br>Please double check and try again!",
                    confirmButtonColor: '#212121'
                });
            },

            getTranslationIndex(translation) {
                return this.translations.findIndex(t => t.id === translation.id);
            }
        }
    };
</script>

<style lang="scss">
    .translation-editor-buttons {
        display: flex;
        flex-direction: row;

        button {
            flex-grow: 1;

            + button {
                margin-left: 10px;
            }
        }
    }
</style>
