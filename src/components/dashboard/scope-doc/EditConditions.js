import React from "react";
import { Field } from "redux-form";
import emailEditor from "../../common/EmailEditor";
import draftToHtml from "draftjs-to-html";
import { convertToRaw, ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

const EditConditions = ({ formValues, change }) => {
  const onEditorStateChange = (editorState) => {
    change(`conditions_temp`, editorState);
    change(
      `conditions`,
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  };
  const editorState = () => {
    var body = formValues && formValues.conditions ? formValues.conditions : "";

    const html = body;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      return editorState;
    }
  };
  return (
    <div className="sf-card-body int-notes">
      <div className="add-notes-row">
        <fieldset className="form-group sf-form">
          <Field
            name={`conditions`}
            id="notesssssssss"
            placeholder={"Conditions to be conveyed to client"}
            type="text"
            component={emailEditor}
            editorState={
              formValues && formValues.conditions_temp
                ? formValues.conditions_temp
                : editorState()
            }
            onEditorStateChange={(editorState) =>
              onEditorStateChange(editorState)
            }
          />
        </fieldset>
      </div>
    </div>
  );
};

export default EditConditions;
