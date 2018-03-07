"format cjs";

var wrap = require('word-wrap');
var map = require('lodash.map');
var longest = require('longest');
var rightPad = require('right-pad');

var filter = function(array) {
  return array.filter(function(x) {
    return x;
  });
};

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function (options) {

  var types = options.types;
  var preferredOrder = ['refactor', 'feat', 'fix'];

  var length = longest(Object.keys(types)).length + 1;
  var choices = map(types, function (type, key) {
    return {
      name: rightPad(key + ':', length) + ' ' + type.description,
      value: key
    };
  }).sort(function(opt1, opt2) {
    return preferredOrder.indexOf(opt2.value) - preferredOrder.indexOf(opt1.value);
  });

  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit) {
      console.log('\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n');

      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Select the type of change that you\'re committing:\n',
          choices: choices
        }, {
          type: 'input',
          name: 'issue',
          message: 'Add issue reference number (press enter to skip)\n'
        }, {
          type: 'input',
          name: 'scope',
          message: 'What is the scope of this change (e.g. component or file name)? (press enter to skip)\n'
        }, {
          type: 'input',
          name: 'subject',
          message: 'Write imperative tense description of the change:\n'
        }
      ]).then(function(answers) {
        var subject;
        if (answers.issue) {
          subject = '[#' + answers.issue + '] ' + answers.subject;
        } else {
          subject = answers.subject;
        }

        commit(answers.type + '(' + answers.scope + '): ' + subject);
      });
    }
  };
};
