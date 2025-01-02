const convert = require("xml-js");

const xmlToJsonArray = (clients) => {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  xmlArray.forEach(client => {
    let clientString = serializer.serializeToString(client);
    let clientJson = JSON.parse(convert.xml2json(clientString, {compact: false, spaces: 4}));
    parsedXml.push(clientJson.elements[0].attributes);
  });

  return parsedXml;
}

export {
  xmlToJsonArray,
};