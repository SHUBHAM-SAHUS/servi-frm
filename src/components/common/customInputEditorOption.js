import { EditorState, Modifier } from 'draft-js';
import React, { Component } from 'react';

export class CustomOption extends Component {

    addStar = () => {
        const { editorState, onChange } = this.props;
        const contentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            '{input}',
            editorState.getCurrentInlineStyle(),
        );
        onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    };

    render() {
        return (
            <div className="rdw-option-wrapper" onClick={this.addStar}><span class="material-icons">
            input
            </span></div>
        );
    }
}