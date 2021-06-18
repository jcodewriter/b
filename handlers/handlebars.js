var Handlebars = require('handlebars');

Handlebars.registerHelper('ifeq', (a, b, options) => {
  if (a === b) {
    return options.fn(this)
  }
  return options.inverse(this)
});

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});