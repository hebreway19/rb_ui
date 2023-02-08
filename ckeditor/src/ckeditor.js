/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import UploadAdapter from "@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder";
import EasyImage from "@ckeditor/ckeditor5-easy-image/src/easyimage";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";

import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";
import { toWidget } from "@ckeditor/ckeditor5-widget/src/utils";
import Command from "@ckeditor/ckeditor5-core/src/command";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";


class InsertContentCommandFactory {
  static createCommand({modelName, executeCallback}) {
    return class extends Command {
      execute(props) {
        executeCallback({editor: this.editor, ...props});
      }

      refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), modelName);
        this.isEnabled = allowedIn !== null;
      }
    };
  }
}

class ToolbarButtonPluginFactory {
  static createPlugin({buttonName}) {
    return class extends Plugin {
      init() {
        const editor = this.editor;
        const config = editor.config.get(buttonName);
        const {buttonView, onClick} = config || {};

        editor.ui.componentFactory.add(buttonName, locale => {
          const view = new ButtonView(locale);
          view.set(buttonView);

          view.on("execute", () => {
            onClick && onClick();
          });

          return view;
        });
      }
    }
  }
}

class ContentPluginFactory {
  static createInlinePlugin({
                              pluginName,
                              modelName,
                              schemaParams = {
                                allowWhere: "$text",
                              },
                              containerTagName = "span",
                              commandName,
                              command,
                              configName,
                              className,
                              label
                            }) {
    return class extends Plugin {
      static get pluginName() {
        return pluginName;
      }

      static get requires() {
        return [Widget];
      }

      init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add(commandName, new command(this.editor));
      }

      _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register(modelName, {
          isObject: true,
          allowAttributes: ["data-id", "word"],
          ...schemaParams
        });
      }

      _defineConverters() {
        const editor = this.editor;
        const conversion = editor.conversion;
        const pluginConfig = editor.config.get(configName);
        const renderCallback = pluginConfig && pluginConfig.renderer;

        conversion.for("upcast").elementToElement({
                                                    view: {
                                                      name: containerTagName,
                                                      classes: className
                                                    },
                                                    model: (viewElement, {writer: modelWriter}) => {
                                                      const word = viewElement.getChild(0).data;
                                                      const id = viewElement.getAttribute("data-id");
                                                      return modelWriter.createElement(modelName,
                                                                                       {word, "data-id": id});
                                                    }
                                                  });

        conversion.for("editingDowncast").elementToElement({
                                                             model: modelName,
                                                             view: (modelItem, {writer: viewWriter}) => {
                                                               const id = modelItem.getAttribute("data-id");
                                                               const word = modelItem.getAttribute("word");
                                                               const section = viewWriter.createContainerElement(
                                                                 containerTagName,
                                                                 {
                                                                   class: className,
                                                                   "data-id": id,
                                                                   word
                                                                 });
                                                               const reactWrapper = viewWriter.createRawElement(
                                                                 containerTagName,
                                                                 {
                                                                   class: className
                                                                 },
                                                                 (domElement) => {
                                                                   renderCallback && renderCallback({
                                                                                                      id,
                                                                                                      word,
                                                                                                      remove: () => deleteSection(
                                                                                                        modelItem)
                                                                                                    },
                                                                                                    domElement);
                                                                 });
                                                               viewWriter.insert(viewWriter.createPositionAt(section,
                                                                                                             0),
                                                                                 reactWrapper);
                                                               return toWidget(section,
                                                                               viewWriter,
                                                                               {label});
                                                             }
                                                           });

        conversion.for("dataDowncast").elementToElement({
                                                          model: modelName,
                                                          view: (modelItem,
                                                                 {writer: viewWriter}) => {
                                                            const id = modelItem.getAttribute("data-id");
                                                            const word = modelItem.getAttribute("word");
                                                            const placeholderView = viewWriter.createContainerElement(
                                                              containerTagName,
                                                              {
                                                                class: className,
                                                                "data-id": id,
                                                                word
                                                              });
                                                            const innerText = viewWriter.createText(word);
                                                            viewWriter.insert(viewWriter.createPositionAt(
                                                              placeholderView,
                                                              0), innerText);
                                                            return placeholderView;
                                                          }
                                                        });

        const deleteSection = (section) => {
          const selection = this.editor.model.createSelection(section, "on");
          this.editor.model.deleteContent(selection);
        };
      }
    }
  }

  static createPlugin({
                        pluginName,
                        modelName,
                        schemaParams = {
                          allowWhere: "$block",
                        },
                        containerTagName = "div",
                        commandName,
                        command,
                        configName,
                        className,
                        label
                      }) {
    return class extends Plugin {
      static get pluginName() {
        return pluginName;
      }

      static get requires() {
        return [Widget];
      }

      init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add(commandName, new command(this.editor));
      }

      _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register(modelName, {
          isObject: true,
          allowAttributes: ["data-id"],
          ...schemaParams
        });
      }

      _defineConverters() {
        const editor = this.editor;
        const conversion = editor.conversion;
        const pluginConfig = editor.config.get(configName);
        const renderCallback = pluginConfig && pluginConfig.renderer;

        conversion.for("upcast").elementToElement({
                                                    view: {
                                                      name: "section",
                                                      classes: className
                                                    },
                                                    model: (viewElement, {writer}) => {
                                                      return writer.createElement(modelName, {
                                                        "data-id": viewElement.getAttribute("data-id")
                                                      });
                                                    }
                                                  });

        conversion.for("dataDowncast").elementToElement({
                                                          model: modelName,
                                                          view: (modelElement,
                                                                 {writer}) => {
                                                            return writer.createEmptyElement("section", {
                                                              class: className,
                                                              "data-id": modelElement.getAttribute("data-id")
                                                            });
                                                          }
                                                        });
        conversion.for("editingDowncast").elementToElement({
                                                             model: modelName,
                                                             view: (modelElement, {writer}) => {
                                                               const id = modelElement.getAttribute("data-id");
                                                               const section = writer.createContainerElement("section",
                                                                                                             {
                                                                                                               class: className,
                                                                                                               "data-id": id
                                                                                                             });
                                                               const reactWrapper = writer.createRawElement(
                                                                 containerTagName,
                                                                 {
                                                                   class: className
                                                                 },
                                                                 (domElement) => {
                                                                   renderCallback && renderCallback({id}, domElement);
                                                                 });
                                                               writer.insert(writer.createPositionAt(section, 0),
                                                                             reactWrapper);
                                                               return toWidget(section,
                                                                               writer,
                                                                               {label});
                                                             }
                                                           });
      };
    }
  }
}


class ClassicEditor extends ClassicEditorBase {
}

// Plugins to include in the build.
const InsertContentImageCommand = InsertContentCommandFactory.createCommand({
                                                                              modelName: "contentImage",
                                                                              executeCallback: ({editor, id}) => {
                                                                                editor.model.change(writer => {
                                                                                  editor.model.insertContent(writer.createElement(
                                                                                    "contentImage",
                                                                                    {"data-id": id}));
                                                                                });
                                                                              }
                                                                            });
const InsertContentAudioCommand = InsertContentCommandFactory.createCommand({
                                                                              modelName: "contentAudio",
                                                                              executeCallback: ({editor, id}) => {
                                                                                editor.model.change(writer => {
                                                                                  editor.model.insertContent(writer.createElement(
                                                                                    "contentAudio",
                                                                                    {"data-id": id}));
                                                                                });
                                                                              }
                                                                            });

const InsertContentFootnoteCommand = InsertContentCommandFactory.createCommand({
                                                                                 modelName: "contentFootnote",
                                                                                 executeCallback: ({
                                                                                                     editor,
                                                                                                     id,
                                                                                                     word
                                                                                                   }) => {
                                                                                   editor.model.change(writer => {
                                                                                     const insertedElement = writer.createElement(
                                                                                       "contentFootnote",
                                                                                       {"data-id": id, word});
                                                                                     editor.model.insertContent(
                                                                                       insertedElement);
                                                                                     writer.setSelection(insertedElement,
                                                                                                         "on");
                                                                                   });
                                                                                 }
                                                                               });

ClassicEditor.builtinPlugins = [
  ContentPluginFactory.createPlugin({
                                      pluginName: "ContentImage",
                                      className: "image",
                                      commandName: "insertImage",
                                      modelName: "contentImage",
                                      configName: "contentImages",
                                      command: InsertContentImageCommand,
                                      label: "Content Image",
                                    }),
  ContentPluginFactory.createPlugin({
                                      pluginName: "ContentAudio",
                                      className: "audio",
                                      commandName: "insertAudio",
                                      modelName: "contentAudio",
                                      configName: "contentAudios",
                                      command: InsertContentAudioCommand,
                                      label: "Content Audio",
                                    }),
  ContentPluginFactory.createInlinePlugin({
                                            pluginName: "ContentFootnote",
                                            className: "footnote",
                                            schemaParams: {
                                              allowWhere: "$text",
                                              isInline: true,
                                              allowedAttributes: ["data-id", "word"]
                                            },
                                            containerTagName: "span",
                                            commandName: "insertFootnote",
                                            modelName: "contentFootnote",
                                            configName: "contentFootnotes",
                                            command: InsertContentFootnoteCommand,
                                            label: "Content Footnote",
                                          }),
  ToolbarButtonPluginFactory.createPlugin({buttonName: "insertContentImage"}),
  ToolbarButtonPluginFactory.createPlugin({buttonName: "insertContentAudio"}),
  ToolbarButtonPluginFactory.createPlugin({buttonName: "insertContentFootnote"}),
  Essentials,
  UploadAdapter,
  Autoformat,
  Bold,
  Italic,
  BlockQuote,
  CKFinder,
  EasyImage,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  TextTransformation
]
;

// Editor configuration.
ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "indent",
      "outdent",
      "|",
      "imageUpload",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "copy",
      "paste",
      "pasteText",
      "pasteFromWord",
      "undo",
      "redo",
    ]
  },
  image: {
    toolbar: [
      "imageStyle:full",
      "imageStyle:side",
      "|",
      "imageTextAlternative"
    ]
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells"
    ]
  },
  // This value must be kept in sync with the language defined in webpack.config.js.
  language: "en"
};

 export default ClassicEditor;