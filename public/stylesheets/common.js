function handleSerializeArrayToObj(arr) {
    return [...arr].reduce((obj, item) => {
        let name = item['name'];
        if(obj.hasOwnProperty(name)) {
            console.log(obj[name], item['value']);
            if(Array.isArray(obj[name])) {
                obj[name] = [...obj[name], item['value']];
            } else {
                let oldVal = obj[name];
                obj[name] = [oldVal, item['value']];
            }
        } else {
            obj[name] = item['value'];
        }
        return obj;
    }, {});
}

function validateFile(file){
    const extensionA = ['doc', 'docx'];
    if(!file) return {
        success: false,
        message: 'Chưa chọn file.'
    };
    const indexDot = file.name.lastIndexOf('.');
    const extFile = file.name.slice(indexDot + 1);
    if(!extensionA.some(ext => ext === extFile)){
        return {
            success: false,
            message: 'Không đúng định dạng file.'
        }
    }
    return {
        success: true,
    }
}

function printFile(data, fileName){
    const blob = converBase64toBlob(data, 'application/msword'); 
    const blobURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobURL;
    a.download = fileName;
    a.click();
    setTimeout(() => {
        window.URL.revokeObjectURL(blobURL);
        document.body.removeChild(a);
    }, 0)
}

function converBase64toBlob(content, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = window.atob(content); //method which converts base64 to binary
    var byteArrays = [
    ];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {
        type: contentType
    }); //statement which creates the blob
    return blob;
}