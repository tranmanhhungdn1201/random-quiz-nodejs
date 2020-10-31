function handleSerializeArrayToObj(arr) {
    return arr.reduce((obj, item) => {
        let name = item['name'];
        obj[name] = item['value'];
        return obj;
    }, {});
}