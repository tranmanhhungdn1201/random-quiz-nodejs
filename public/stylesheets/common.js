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