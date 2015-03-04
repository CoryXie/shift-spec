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

var baseDir = "/Users/u689/src/shift-java/src/main";
var header =
  "/*\n\
  | * Copyright 2015 Shape Security, Inc.\n\
  | *\n\
  | * Licensed under the Apache License, Version 2.0 (the \"License\");\n\
  | * you may not use this file except in compliance with the License.\n\
  | * You may obtain a copy of the License at\n\
  | *\n\
  | *     http://www.apache.org/licenses/LICENSE-2.0\n\
  | *\n\
  | * Unless required by applicable law or agreed to in writing, software\n\
  | * distributed under the License is distributed on an \"AS IS\" BASIS,\n\
  | * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n\
  | * See the License for the specific language governing permissions and\n\
  | * limitations under the License.\n\
  | */\n\n".replace(/^\s*\|/mg, "");

var parse = require("./parser").parse;

var fs = require('fs');

var specSource = fs.readFileSync(__dirname + '/../spec.idl', 'utf-8');

var declarations = parse(specSource);

var database = Object.create(null);

// Step 1. know all the types
declarations.forEach(function (declaration) {
  switch (declaration.type) {
    case "typedef":
    case "enum":
    case "interface":
      database[declaration.name] = declaration;
      break;
  }
});

function validName(operator) {
  return (operator
    .replace(/^[a-z]/, function (a) {
      return a.toUpperCase();
    })
    .replace(/===/g, "StrictEq")
    .replace(/!==/g, "StrictNeq")
    .replace(/==/g, "Eq")
    .replace(/!=/g, "Neq")
    .replace(/!/g, "Not")
    .replace(/~/g, "BitwiseNot")
    .replace(/=/g, "Assign")
    .replace(/\+\+/g, "Inc")
    .replace(/\-\-/g, "Dec")
    .replace(/\+/g, "Add")
    .replace(/\-/g, "Sub")
    .replace(/\*/g, "Mul")
    .replace(/\//g, "Div")
    .replace(/%/g, "Mod")
    .replace(/\|\|/g, "Or")
    .replace(/&&/g, "And")
    .replace(/,/g, "Comma")
    .replace(/\|/g, "BitwiseOr")
    .replace(/&/g, "BitwiseAnd")
    .replace(/\^/g, "BitwiseXor")
    .replace(/<</g, "ShiftLeft")
    .replace(/>>>/g, "UnsignedShiftRight")
    .replace(/>>/g, "ShiftRight")
    .replace(/>=/g, "GreaterThanEqual")
    .replace(/<=/g, "LessThanEqual")
    .replace(/>/g, "GreaterThan")
    .replace(/</g, "LessThan")
  );
}

function isPrimitive(t) {
  switch (t.type) {
    case "unsigned long":
    case "double":
    case "boolean":
      return true;
  }
  return false;
}

function renderType(t, imports) {
  t = expandType(t);
  switch (t.type) {
    case "union":
      var either = "Either" + (t.ts.length !== 2 ? t.ts.length.toString() : "");
      imports[either] = true;
      return either + "<" + t.ts.map(function (t) {
          return renderType(t, imports);
        }).join(", ") + ">";
      break;
    case "ref":
      imports[t.name] = true;
      return t.name;
    case "nullable":
      imports["Maybe"] = true;
      return "Maybe<" + renderType(t.t, imports) + ">";
    case "array":
      imports["ImmutableList"] = true;
      return "ImmutableList<" + renderType(t.t, imports) + ">";
    case "string":
      return "String";
    case "unsigned long":
      return "int";
    case "double":
      return "double";
    case "boolean":
      return "boolean";
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
      if (database[t.name] && database[t.name].type === "typedef") {
        return expandUnion(database[t.name].t);
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


function render() {
  var importRegistry = {
    "Maybe": "com.shapesecurity.functional.data.Maybe",
    "Type": "com.shapesecurity.shift.ast.types.Type",
    "ImmutableList": "com.shapesecurity.functional.data.ImmutableList",
    "Either": "com.shapesecurity.functional.data.Either",
    "Either3": "com.shapesecurity.functional.data.Either3",
    "Either4": "com.shapesecurity.functional.data.Either4",
  };

  var isMixin = {};
  var isParent = {};

  function determinePackage(declaration) {
    var name = declaration.name;
    if (declaration.type === "enum") {
      importRegistry[name] = "com.shapesecurity.shift.ast.enums." + name;
    } else if (name) {
      var imp = "com.shapesecurity.shift.ast.";
      if (name === "VariableDeclaration" || name === "VariableDeclarator") {
      } else if (name === "TemplateElement" || name === "Super" || name !== "Expression" && name.slice(-"Expression".length) === "Expression") {
        imp += "expression.";
      } else if (name !== "Statement" && name.slice(-"Statement".length) === "Statement") {
        imp += "statement.";
      } else if (name.slice(-"Declaration".length) === "Declaration") {
        imp += "declaration.";
      } else if (name.slice(-"Declarator".length) === "Declarator") {
        imp += "declaration.";
      } else if (name.indexOf("Binding") !== -1) {
        imp += "binding.";
      } else if (name === "Getter" || name === "Setter" || name.indexOf("Method") !== -1 || name.indexOf("Property") !== -1) {
        imp += "property.";
      } else if (name.indexOf("Import") !== -1 || name.indexOf("Export") !== -1) {
        imp += "module.";
      }
      importRegistry[name] = imp + name;
    }
  }

  function hasEA(member, name) {
    for (var i = 0; i < member.ea.length; i++) {
      if (member.ea[i].name === name) {
        return true;
      }
    }
    return false;
  }

  function hasPre(member) {
    return hasEA(member, "Pre");
  }

  function hasNoPre(member) {
    return !hasEA(member, "Pre");
  }

  function mixIn(declaration) {
    var pre, post;

    if (declaration.type === "impl") {
      isMixin[declaration.parent] = true;

      pre = database[declaration.parent].members.filter(hasPre);

      post = database[declaration.parent].members.filter(hasNoPre);

      database[declaration.name].members =
        pre.concat(database[declaration.name].members.filter(hasPre)).concat(post).concat(database[declaration.name].members.filter(hasNoPre));

    } else if (declaration.type === "interface") {
      if (declaration.inherit) {
        isParent[declaration.inherit] = isParent[declaration.inherit] || [];
        isParent[declaration.inherit].push(declaration.name);
        post = database[declaration.inherit].members.map(function (m) {
          m = Object.create(m);
          m.isInherited = true;
          return m;
        });
        pre = post.filter(hasPre);
        post = post.filter(hasNoPre);
        database[declaration.name].members = pre.concat(database[declaration.name].members.filter(hasPre)).concat(post).concat(database[declaration.name].members.filter(hasNoPre));
      }
    }
  }

  function renderConstructor(declaration, name, members) {
    var content = "  public " + name + "(" + members.map(function (m) {
        return (m[3] ? "" : "@NotNull ") + m[0] + " " + m[1];
      }).join(", ") + ") {\n";

    if (declaration.inherit) {

      var args = [];
      members.forEach(function (m) {
        if (m[2].isInherited) {
          args.push(m[1]);
        }
      });

      content += "    super(";
      content += args.join(", ");
      content += ");\n";
    }

    members.forEach(function (m) {
      if (!m[2].isInherited) {
        content += "    this." + m[1] + " = " + m[1] + ";\n";
      }
    });
    content += "  }\n";

    return content;
  }

  function memberInfo(declaration, imports) {
    var members = [];
    declaration.members.forEach(function (value) {
      if (value.member.name === "loc") return;
      var isTypeIndicator = false;
      if (value.ea.length > 0) {
        value.ea.forEach(function (ea) {
          isTypeIndicator = ea.name === "TypeIndicator";
        });
      }
      if (!isTypeIndicator) {
        members.push([
          renderType(value.member.t, imports),
          value.member.name.replace(/^_*/, ""),
          value,
          isPrimitive(value.member.t)
        ]);
      }
    });
    return members;
  }

  function renderInterface(declaration, name, packageName) {
    if (isMixin[declaration.name]) {
      return;
    }
    var imports = {};

    var content = "";
    content += "public " + (isParent[name] ? "abstract" : "final") + " class " + name + (declaration.inherit ? " extends " + declaration.inherit : "") + " {\n";
    if (declaration.inherit) {
      imports[declaration.inherit] = true;
    }


    var members = memberInfo(declaration, imports);
    members.forEach(function (m) {
      if (!m[2].isInherited) {
        if (!m[3]) {
          content += "  @NotNull\n";
        }
        content += "  public final " + m[0] + " " + m[1] + ";\n";
      }
    });

    content += "\n";
    content += renderConstructor(declaration, name, members);

    // type method
    if (!isParent[name]) {
      content += "\n  @NotNull\n  @Override\n  public Type type() {\n    return Type." + name + ";\n  }\n";
      imports["Type"] = true;
    }

    // TODO: equality

    // getters
    members.forEach(function (m) {
      if (m[2].isInherited) {
        return;
      }
      content += "\n";
      if (!m[3]) {
        content += "  @NotNull\n";
      }
      content += "  public " + m[0] + " get" + m[1][0].toUpperCase() + m[1].slice(1) + "() {\n";
      content += "    return this." + m[1] + ";\n";
      content += "  }\n"
    });

    if (!isParent[name]) {
      // setters
      members.forEach(function (m, i) {
        content += "\n  @NotNull\n";
        content += "  public " + name + " set" + m[1][0].toUpperCase() + m[1].slice(1) + "(";
        if (!m[3]) {
          content += "@NotNull ";
        }
        content += m[0] + " " + m[1];
        content += ") {\n";

        var args = members.map(function (mem, j) {
          if (i === j) {
            return m[1];
          } else {
            return "this." + mem[1];
          }
        });

        content += "    return new " + name + "(" + args.join(", ") + ");\n";
        content += "  }\n"
      });
    }

    content += "}\n";
    var importsText = [];
    for (var key in imports) {
      if (packageName !== importRegistry[key].slice(0, -key.length - 1)) {
        importsText.push("import " + importRegistry[key] + ";");
      }
    }
    importsText.sort();
    importsText.push("", "import org.jetbrains.annotations.NotNull;");
    fs.writeFileSync(
      baseDir + "/java/" + importRegistry[name].replace(/\./g, "/") + ".java",
      header +
      "package " + packageName + ";\n\n" +
      (importsText.length > 0 ? importsText.join("\n") + "\n" : "") + "\n" + content,
      "utf-8");
  }

  function renderEnum(declaration, name, packageName) {
    var content = header + "package " + packageName + ";\n\n";
    content += "public enum " + name + " {\n";
    declaration.values.forEach(function (value) {
      content += "  " + validName(value.slice(1, -1)) + "(" + value + "),\n";
    });
    content += "  ;\n";
    content += "  public final String name;\n\n";
    content += "  private " + name + "(String name) {\n";
    content += "    this.name = name;\n";
    content += "  }\n";
    content += "}\n";
    fs.writeFileSync(baseDir + "/java/com/shapesecurity/shift/ast/enums/" + declaration.name + ".java", content, "utf-8");
  }

  declarations.forEach(determinePackage);
  declarations.forEach(mixIn);
  declarations.forEach(function (declaration) {
    var name = declaration.name;
    if (name === "Node")return;
    var packageName = importRegistry[name].slice(0, -name.length - 1);
    if (declaration.type === "enum") {
      renderEnum(declaration, name, packageName);
    } else if (declaration.type === "interface") {
      renderInterface(declaration, name, packageName);
    }
  });

  var sinkTypes = {};

  function toSet(array) {
    var result = {};
    array.forEach(function (obj) {
      result[obj] = true;
    });
    return result;
  }

  function enumerateSinkTypes(t) {
    if (t.name === "SourceLocation" || t.name === "SourceSpan") {
      return;
    }
    t = expandType(t);
    switch (t.type) {
      case "union":
        t.ts.forEach(enumerateSinkTypes);
        break;
      case "ref":
        if (database[t.name] && database[t.name].type !== "enum") {
          sinkTypes[t.name] = true;
        }
        break;
      case "nullable":
      case "array":
        enumerateSinkTypes(t.t);
        break;
    }
  }

  function expandSubtypes(object) {
    for (var key in object) {
      if (!sinkTypes[key]) {
        if (object[key] !== true) {
          object[key] = expandSubtypes(object[key]);
          for (var subKey in object[key]) {
            object[subKey] = expandSubtypes(object[key][subKey]);
          }
          delete object[key];
        }
      } else {
        object[key] = expandSubtypes(object[key]);
      }
    }
    return object;
  }


  declarations.forEach(function (declaration) {
    if (declaration.name === "SourceLocation" || declaration.name === "SourceSpan") {
      return;
    }
    if (declaration.type === "interface") {
      declaration.members.forEach(function (m) {
        enumerateSinkTypes(m.member.t);
      })
    }
  });

  expandSubtypes(sinkTypes);
  console.log(sinkTypes);
}

function mkdirs(dirs, callback) {
  if (dirs.length === 0) {
    return callback();
  }
  var dir = dirs.shift();
  fs.mkdir(baseDir + "/" + dir, function () {
    mkdirs(dirs, callback);
  });
}

mkdirs([
  "/java",
  "/java/com",
  "/java/com/shapesecurity",
  "/java/com/shapesecurity/shift",
  "/java/com/shapesecurity/shift/ast",
  "/java/com/shapesecurity/shift/ast/enums",
  "/java/com/shapesecurity/shift/ast/expression",
  "/java/com/shapesecurity/shift/ast/statement",
  "/java/com/shapesecurity/shift/ast/binding",
  "/java/com/shapesecurity/shift/ast/property",
  "/java/com/shapesecurity/shift/ast/module",
  "/java/com/shapesecurity/shift/ast/declaration",
  "/java/com/shapesecurity/shift/reducer",
], render);
