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