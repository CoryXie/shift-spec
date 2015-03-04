/**
 * Copyright 2015 Shape Security, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var parse = require("./parser").parse;

var specSource = require('fs').readFileSync(__dirname + '/../spec.idl', 'utf-8');

var declarations = parse(specSource);

var database = Object.create(null);

function renderType(t) {
  switch (t.type) {
    case "union":
      t = expandType(t);
      return "Union(" + t.ts.map(renderType).join(", ") + ")";
    case "array":
      return "List(" + renderType(t.t) + ")";
    case "ref":
      t = expandType(t);
      if (t.type === "ref") {
        return t.name;
      }
      return renderType(t);
    case "string":
      return "STRING";
    case "unsigned long":
    case "double":
      return "DOUBLE";
    case "boolean":
      return "BOOLEAN";
    case "nullable":
      return "Maybe(" + renderType(t.t) + ")";
    default:
      throw new Error("Not implemented");
  }
}

function expandType(t) {
  var tex = expandUnion(t);
  return tex.length === 1 ? tex[0] : {type: "union", ts: tex};
}

function expandUnion(t) {
  switch (t.type) {
    case "union":
      return [].concat.apply([], t.ts.map(expandUnion));
    case "ref":
      if (database["$" + t.name] && !Array.isArray(database["$" + t.name]) && typeof database["$" + t.name] !== "string") {
        return expandUnion(database["$" + t.name]);
      }
      return [t];
    case "array":
      return [{type: "array", t: expandType(t.t)}];
    case "nullable":
      return [{type: "nullable", t: expandType(t.t)}];
    default:
      return [t];
  }
}

// Step 1. know all the types
declarations.forEach(function (declaration) {
  switch (declaration.type) {
    case "typedef":
      database["$" + declaration.name] = declaration.t;
      break;
    case "enum":
      database["$" + declaration.name] = "ENUM";
      break;
    case "interface":
      database["$" + declaration.name] = declaration.members;
      break;
  }
});

var notFinal = {};

function inherits(name, parent) {
  if (!Array.isArray(database["$" + parent])) {
    throw new Error("Inheriting non-interface");
  }
  notFinal["$" + parent] = notFinal["$" + parent] || [];
  notFinal["$" + parent].push(name);
  database["$" + name] = database["$" + parent].concat(database["$" + name]);
}
// Step 2. process inheritance
declarations.forEach(function (declaration) {
  switch (declaration.type) {
    case "interface":
      if (declaration.inherit) {
        inherits(declaration.name, declaration.inherit);
      }
      break;
    case "impl":
      if (declaration.parent) {
        inherits(declaration.name, declaration.parent);
      }
      break;
  }
});

var content = "\
/**\n\
 * Copyright 2015 Shape Security, Inc.\n\
 *\n\
 * Licensed under the Apache License, Version 2.0 (the \"License\")\n\
 * you may not use this file except in compliance with the License.\n\
 * You may obtain a copy of the License at\n\
 *\n\
 *     http://www.apache.org/licenses/LICENSE-2.0\n\
 *\n\
 * Unless required by applicable law or agreed to in writing, software\n\
 * distributed under the License is distributed on an \"AS IS\" BASIS,\n\
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n\
 * See the License for the specific language governing permissions and\n\
 * limitations under the License.\n\
 */\n\
\n\
exports.genSpec = function (Maybe, List, Union){\n\
  var SPEC = {};\n\
\n\
  var BOOLEAN = { type: \"Boolean\" };\n\
  var DOUBLE = { type: \"Number\" };\n\
  var STRING = { type: \"String\" };\n\
\n";


function renderEnum(declaration) {
  var name = declaration.name;
  var result = ["  var " + declaration.name + " = {\n    type: \"Enum\",\n    values: [" + declaration.values.join(", ") + "]\n  };\n"];
  return result.join("\n") + "\n";
}


declarations.forEach(function (declaration) {
  switch (declaration.type) {
    case "enum":
      content += renderEnum(declaration);
      break;
  }
});

declarations.forEach(function (declaration) {
  switch (declaration.type) {
    case "interface":
      if (!{}.hasOwnProperty.call(notFinal, "$" + declaration.name)) {
        content += "  var " + declaration.name + " = SPEC." + declaration.name + " = {};\n";
      }
      break;
  }
});

content += "\n";

declarations.reverse();
declarations.forEach(function (declaration) {
  if ({}.hasOwnProperty.call(notFinal, "$" + declaration.name)) {
    content += "  var " + declaration.name + " = Union(" + notFinal["$" + declaration.name].join(", ") + ");\n";
  }
});

content += "\n";


function renderInterface(name, members) {
  var result = [];
  if ({}.hasOwnProperty.call(notFinal, "$" + name)) {
    return "";
  } else {
    result.push("  " + name + ".type =\"" + name + "\";");
    if (members.length > 0) {
      members.forEach(function (member) {
        var isTypeIndicator = false;
        if (member.ea.length != 0) {
          member.ea.forEach(function (ea) {
            if (ea.name === "TypeIndicator") {
              isTypeIndicator = true;
            }
          });
        }
        if (!isTypeIndicator) {
          result.push("  " + name + "." + member.member.name.replace(/^_*/, "") + " = " + renderType(member.member.t) + ";");
        } else {
          // result.push(name + ".type = \"" + name + "\";");
        }
      });
    }
  }
  result.push("", "");

  return result.join("\n");
}

declarations.reverse();
declarations.forEach(function (declaration) {
  switch (declaration.type) {
    case "interface":
      content += renderInterface(declaration.name, database["$" + declaration.name]);
      break;
  }
});

content += "  return SPEC;\n";
content += "};\n";

require("fs").writeFileSync(__dirname + "/../index.js", content, "utf-8");
