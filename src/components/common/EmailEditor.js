import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw } from 'draft-js';
import { reject } from 'lodash';


const emailEditor = ({ editorState, onEditorStateChange, toolbarCustomButtons, callBackUpload,
    options = callBackUpload?['history', 'blockType', 'inline', 'textAlign', 'list', 'image']:
    ['history', 'blockType', 'inline', 'textAlign', 'list'] }) => {

    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                toolbarCustomButtons={toolbarCustomButtons}
                toolbar={{
                    options: options,
                    history: {
                        inDropdown: false,
                        className: undefined,
                        component: undefined,
                        dropdownClassName: undefined,
                        options: ['undo', 'redo'],
                    },
                    blockType: {
                        inDropdown: true,
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                        className: undefined,
                        component: undefined,
                        dropdownClassName: undefined,
                    },
                    inline: {
                        options: ['bold', 'italic']
                    },
                    textAlign: {

                    },
                    list: {

                    },
                    image: {
                        icon: '/images/attach-icon.png',
                        uploadEnabled: true,
                        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg,.docx,.png',
                        urlEnabled: false,
                        alignmentEnabled: false,
                        uploadCallback: (file) => {
                            if (callBackUpload) {
                                callBackUpload(file);
                            }
                            return new Promise((resolve, reject) => {
                                resolve({ data: {} })
                            })
                        },
                        previewImage: false,
                        alt: false,
                        defaultSize: false,
                    }

                    // undo: true,
                    // redo: true,
                    // inline: { inDropdown: true },
                    // list: { inDropdown: true },
                    // textAlign: { inDropdown: true },
                    // link: { inDropdown: true },
                    // history: { inDropdown: true },
                }}
            />
        </div>
    )
}

export default emailEditor 
