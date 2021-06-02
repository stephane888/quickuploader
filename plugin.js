CKEDITOR.plugins.add("quickuploader", {
  requires: "filetools,dialog",
  icons: "quickuploader,quickuploaderUpload",
  init: function(editor) {
    //configs*
    console.log("CKEDITOR.config : ", CKEDITOR.config);
    const baseUrl = CKEDITOR.config.quickuploaderUploadUrl
      ? CKEDITOR.config.quickuploaderUploadUrl
      : "";
    //
    CKEDITOR.dialog.add(
      "quickuploaderDialog",
      this.path + "dialogs/quickuploader.js"
    );
    editor.addCommand(
      "quickuploader",
      new CKEDITOR.dialogCommand("quickuploaderDialog")
    );

    //
    editor.addCommand("quickuploaderUpload", {
      exec: function() {
        function getBase64(file) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            //reader.onload = () => resolve(reader.result);
            reader.onloadend = () => {
              var fileArray = reader.result.split(",");
              resolve({src: reader.result, base64: fileArray[1]});
            };
            reader.onerror = error => reject(error);
          });
        }

        function postFileXhrV2(file) {
          return new Promise(resolv => {
            getBase64(file).then(fileBase64 => {
              var dataToPost = {
                _links: {
                  type: {
                    href: this.baseUrl + "/rest/type/file/image"
                  }
                },
                filename: [{value: file.name}],
                filemime: [{value: file.type}],
                uri: [{value: "public://ckeditor-images/" + file.name}],
                type: [{target_id: "image"}],
                data: [{value: fileBase64.base64}]
              };
              var invocation = new XMLHttpRequest();
              invocation.open(
                "POST",
                baseUrl + "/entity/file?_format=hal_json",
                true
              );
              invocation.onreadystatechange = handler;
              invocation.send(dataToPost);
              function handler(reponse) {
                console.log("FileXhr reponse : ", reponse);
              }
              resolv("ok");
            });
          });
        }
        //
        function postFileXhr(file) {
          return new Promise(resolv => {
            getBase64(file).then(fileEncode => {
              var invocation = new XMLHttpRequest();
              invocation.open("POST", baseUrl + "/filesmanager/post", true);
              invocation.onreadystatechange = handler;
              invocation.send(fileEncode);
              function handler(reponse) {
                console.log("FileXhr reponse : ", reponse);
              }
              resolv("ok");
            });
          });
        }
        ///

        function postFile(file) {
          return new Promise(resolv => {
            getBase64(file).then(fileEncode => {
              //console.log("fileEncode : ", fileEncode);
              var headers = new Headers();
              var fileCompose = file.name.split(".");
              var myInit = {
                method: "POST",
                headers: headers,
                mode: "cors",
                body: JSON.stringify({
                  upload: fileEncode.base64,
                  filename: fileCompose[0],
                  id: 88,
                  ext: fileCompose[1]
                }),
                cache: "default"
              };
              fetch(baseUrl + "/filesmanager/post", myInit).then(function(
                response
              ) {
                response.json().then(function(json) {
                  console.log("response json : ", json);
                  resolv({
                    status: true,
                    reponse: json,
                    url: json.url
                  });
                });
              });
            });
          });
        }
        /**/
        //

        // hiddenUploadElement is not attached to DOM, but it is still possible to `virtually` click into it.
        var hiddenUploadElement = CKEDITOR.dom.element.createFromHtml(
          '<input type="file" multiple="multiple">'
        );
        hiddenUploadElement.once("change", function(evt) {
          console.log("fileTools : ", CKEDITOR.fileTools);
          var targetElement = evt.data.getTarget();
          if (targetElement.$.files.length) {
            // Simulate paste event, to support all nice stuff from imagebase (e.g. loaders) (#1730).
            console.log("targetElement ", targetElement);
            targetElement.$.files.forEach(file => {
              /*
              //////////////////////////////////////////////
              var loader = editor.uploadRepository.create(file);
              loader.loadAndUpload(
                baseUrl+"/filesmanager/post"
              );
              //loader.url=""
              loader.on("update", function() {

                //document.getElementById("uploadProgress").innerHTML =
                //loader.status;

              });
              loader.on("error", function() {
                console.log("Error!");
              });
              //
              if (loader.isFinished()) {
                console.log("Execution file is finnish : ", loader.status);
              }
              /**/
              //////////////////////////////////////////
              postFile(file).then(response => {
                if (response.status) {
                  console.log("response : ", response);
                  var img = editor.document.createElement("img");
                  img.setAttribute("src", response.url);
                  img.setAttribute("class", "img-fluid");
                  editor.insertElement(img);
                }
              });
            });

            /*
            editor.fire("paste", {
              method: "paste",
              dataValue: "",
              dataTransfer: new CKEDITOR.plugins.clipboard.dataTransfer({
                files: targetElement.$.files
              })
            });
            /**/
          }
        });
        hiddenUploadElement.$.click();
      }
    });
    //
    editor.ui.addButton("QuickUploader", {
      label: "Permet d'inserer rapidement les images.",
      command: "quickuploader",
      toolbar: "insert"
    });
    //
    editor.ui.addButton("QuickUploaderUpload", {
      label: "Permet d'inserer rapidement les images. 2",
      command: "quickuploaderUpload",
      toolbar: "insert"
    });
  }
});
