import { encode, decode } from 'js-base64';

export function vmessParseToJson(str) {
    return JSON.parse(decode(str))
}

export function vlessParseToJson(str) {
    const [id, addressAndOptions] = str.split('@');
    const [address, optionsAndTag] = addressAndOptions.split('?');
    const [options, tag] = optionsAndTag.split('#');

    const optionsArray = options.split('&');
    const optionsObject = {};
    optionsArray.forEach((option) => {
        const [key, value] = option.split('=');
        optionsObject[key] = value;
    });

    const parseAddress = address.split(':')

    if (parseAddress.length !== 2) return

    return {
        id,
        address: parseAddress[0],
        port: parseAddress[1],
        options: optionsObject,
        tag,
    };
}

export function createVmessString(jsonObject) {
    return encode(JSON.stringify(jsonObject, null, 2))
}

export function createVlessString(jsonObject) {
    let optionsString = '';
    for (const key in jsonObject.options) {
        optionsString += `${key}=${jsonObject.options[key]}&`;
    }
    optionsString = optionsString.slice(0, -1);

    return `${jsonObject.id}@${jsonObject.address}:${jsonObject.port}?${optionsString}#${jsonObject.tag}`;
};