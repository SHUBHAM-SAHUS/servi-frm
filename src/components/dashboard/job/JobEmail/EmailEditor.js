import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw } from 'draft-js';


const emailEditor = ({ editorState, onEditorStateChange }) => {

    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                    options: ['history', 'blockType', 'inline', 'textAlign', 'list'],
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
