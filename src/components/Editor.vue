<template>
    <div :id="id" class="editor">
        <ckeditor
            v-model="htmlContent"
            v-show="isUsingHtmlEditor"
            :name="id + '-html'"
            :id="id + '-html'"
            :config="ckeditorConfig">
        </ckeditor>
        <textarea
            v-model="textContent"
            v-show="!isUsingHtmlEditor"
            :name="id + '-text'"
            :id="id + '-text'"
            :disabled="disabled">
        </textarea>
    </div>
</template>

<script>
    import ckeditor from 'vue-ckeditor2';

    export default {
        components: { ckeditor },

        props: {
            id: {
                type: String,
                default: 'editor'
            },

            disabled: {
                type: Boolean,
                default: false
            },

            html: {
                type: Boolean,
                default: false
            },

            value: {
                type: String,
                default: ''
            },
        },

        mounted() {
            this.setContent(this.value);
        },

        data() {
            return {
                htmlContent: '',
                textContent: '',
                ckeditorConfig: {
                    height: 'auto',
                    toolbarGroups: [
                        {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
                        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                        {name: 'links', groups: ['links']},
                        {name: 'tools', groups: ['tools']},
                        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
                        {name: 'insert', groups: ['insert']},
                        {name: 'styles', groups: ['styles']},
                        {name: 'forms', groups: ['forms']},
                        {name: 'document', groups: ['mode', 'document', 'doctools']},
                        {name: 'others', groups: ['others']},
                        {name: 'colors', groups: ['colors']},
                        {name: 'about', groups: ['about']}
                    ],
                    removeButtons: 'Underline,Subscript,Superscript,Scayt,Anchor,Image,Maximize,SpecialChar,Source,Outdent,Indent,Blockquote,Styles,About'
                }
            };
        },

        watch: {
            html(isUsingHtmlEditor) {
                const currentValue = isUsingHtmlEditor ? this.textContent : this.htmlContent;
                this.setContent(currentValue);
            },

            value(value) {
                this.setContent(value);
            },

            htmlContent(value) {
                if (this.isUsingHtmlEditor) {
                    this.$emit('input', value);
                }
            },

            textContent(value) {
                if ( ! this.isUsingHtmlEditor) {
                    this.$emit('input', value);
                }
            }
        },

        computed: {
            isUsingHtmlEditor() {
                return this.html;
            }
        },

        methods: {
            setContent(value) {
                if (this.isUsingHtmlEditor) {
                    this.htmlContent = value;
                    this.textContent = '';
                } else {
                    this.textContent = value;
                    this.htmlContent = '';
                }
            }
        }
    };
</script>

<style lang="scss">
    .editor {
        min-height: 400px;

        &,
        .ckeditor,
        .cke,
        .cke_inner,
        .cke_contents,
        .cke_wysiwyg_frame {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            flex-grow: 1;
        }

        > textarea {
            flex-grow: 1;
            resize: vertical;
        }
    }
</style>
