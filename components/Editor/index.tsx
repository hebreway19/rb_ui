import ClassicEditor from "custom_ckeditor/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const Editor = (props) => {
  return (<CKEditor editor={ClassicEditor} {...props}/>);
};

export default Editor;