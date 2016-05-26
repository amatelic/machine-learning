//Baisc expresion for changing text from true to false example -> Hi {condtion}!
var expresion = /{condition}/g;
function createResponse(text, conditon) {
  conditon = (Array.isArray(conditon)) ? CheckValues(conditon) : conditon;
  if (conditon) {
    return returnRespones(text.replace(expresion, 'was'), 'success');
  } else {
    return returnRespones(text.replace(expresion, 'wasn\'t'), 'warning');
  }
}

function CheckValues(array) {
  return array.every(val => val !== undefined || val != null);
}

function returnRespones(title, type) {
  return {
    title,
    type,
  };
}

module.exports = {
  createResponse,
};
