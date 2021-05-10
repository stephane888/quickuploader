CKEDITOR.dialog.add("quickuploaderDialog", function(editor) {
  //
  function uploadFiles(file) {
    if (CKEDITOR.fileTools.isTypeSupported(file, "/image/png/")) {
      var loader = editor.uploadRepository.create(file);
      loader.on("update", function() {
        document.getElementById("uploadProgress").innerHTML = loader.status;
      });
      loader.on("error", function() {
        alert("Error!");
      });
      loader.loadAndUpload("http://upload.url/");
      // evt.data.dataValue += "loading...";
    }
  }
  //

  //
  const currentDate = new Date();
  const time = currentDate.getTime();
  return {
    // Doc : https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_dialog_definition.html
    title: " Ajoute une image " + time,
    minWidth: 500,
    minHeight: 400,
    contents: [
      {
        id: "tab3",
        label: "Upload file",
        title: "Upload file Title",
        accessKey: "Q",
        elements: [
          {
            type: "file",
            id: "upload",
            label: "Selectionner un fichier",
            size: 38,
            onChange: function() {
              // var dialog = this;
              // console.log("Change : ", file, "\n ", this.getValue());
              // uploadFiles(file)
              // console.log("onChange :: ", e1, "\n", e2);
            },
            onClick: function() {
              // this = CKEDITOR.ui.dialog.radio
              // alert("Current value: " + this.getValue());
            }
          }
        ]
      }
    ],
    onOk: function() {
      var dialog = this;
      var abbr = editor.document.createElement("abbr");
      abbr.setAttribute("title", dialog.getValueOf("tab1", "testText1"));
      abbr.setText(dialog.getValueOf("tab2", "testText2"));
      // var id = dialog.getValueOf("tab-adv", "id");
      // if (id) abbr.setAttribute("id", id);
      editor.insertElement(abbr);
    }
  };
});
