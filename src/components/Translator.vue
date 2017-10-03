<template>
    <div>
        <div class="row">
            <div class="col-sm-7">
                <h1>Translator</h1>
            </div>
            <div class="col-sm-5 translator-buttons">
                <button class="btn btn-default" @click="showImporter = true">
                    Import & Sync
                </button>
                <button class="btn btn-default" @click="showExporter = true">
                    Export
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <translation-file-controls
                    :file.sync="selectedFile">
                </translation-file-controls>
                <hr>
                <translation-list
                    :file="selectedFile"
                    :translation.sync="selectedTranslation"
                    :translations.sync="translations">
                </translation-list>
            </div>
            <div :class="['col-sm-8', 'translation-editor', showEditor ? 'active' : '']">
                <translation-editor
                    :file="selectedFile"
                    :translation.sync="selectedTranslation"
                    :translations.sync="translations"
                    :languages="languages">
                </translation-editor>
                <button class="btn btn-default translation-editor-close"
                        @click="closeEditor">
                    Close
                </button>
            </div>
        </div>
        <translation-importer
            v-if="showImporter"
            @canceled="showImporter = false"
            @done="onImportDone">
        </translation-importer>
        <translation-exporter
            v-if="showExporter"
            @canceled="showExporter = false"
            @done="showExporter = false">
        </translation-exporter>
    </div>
</template>

<script>
    import showAlert from 'sweetalert2'
    import TranslationFileControls from './TranslationFileControls';
    import TranslationList from './TranslationList';
    import TranslationEditor from './TranslationEditor';
    import TranslationImporter from './TranslationImporter';
    import TranslationExporter from './TranslationExporter';

    export default {
        components: {
            TranslationFileControls,
            TranslationList,
            TranslationEditor,
            TranslationImporter,
            TranslationExporter,
        },

        props: {
            file:         { default: null },
            translation:  { default: null },
            languages:    { default: ['en'] },
        },

        created() {
            this.selectedFile = this.file || {};
            this.selectedTranslation = this.fileOwnsTranslation ? this.translation : {};

            history.replaceState(null, null, '/translator/app');

            setInterval(() => {
                axios.get('/translator/keep-alive');
            }, 5 * 60 * 1000);
        },

        data() {
            return {
                translations: [],
                selectedFile: {},
                selectedTranslation: {},
                showImporter: false,
                showExporter: false,
            };
        },

        computed: {
            showEditor() {
                return !! this.selectedTranslation.id;
            },

            fileOwnsTranslation() {
                return this.translation && this.translation.file_id === this.selectedFile.id;
            }
        },

        methods: {
            onImportDone() {
                this.showImporter = false;
                window.location.reload();
            },


            closeEditor() {
                if ( ! this.selectedTranslation.isDirty) {
                    return this.selectedTranslation = {};
                }

                this.askToDiscardUnsavedChanges()
                    .then(() => {
                        this.selectedTranslation.isDirty = false;
                        this.selectedTranslation = {};
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
            }
        }
    };
</script>

<style>
    .translator-buttons {
        padding-top: 1.5em;
        text-align: left;
    }

    @media screen and (min-width: 768px) {
        .translator-buttons {
            text-align: right;
        }
        .translation-editor-close {
            display: none;
        }
    }

    @media screen and (max-width: 768px) {
        .translation-editor {
            display:none;
            overflow-y: auto;
        }
        .translation-editor.active {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            overflow-y: auto;
            background: #fff;
            padding: 15px;
            z-index: 2;
        }
        .translation-editor-close {
            display: block;
            width: 100%;
        }
    }
</style>
