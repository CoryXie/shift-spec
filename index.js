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

exports.genSpec = function (Maybe, List, Union){
  var SPEC = {};

  var BOOLEAN = { type: "Boolean" };
  var DOUBLE = { type: "Number" };
  var STRING = { type: "String" };

  var VariableDeclarationKind = {
    type: "Enum",
    values: ["var", "let", "const"]
  };

  var AssignmentOperator = {
    type: "Enum",
    values: ["=", "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "|=", "^=", "&="]
  };

  var BinaryOperator = {
    type: "Enum",
    values: ["==", "!=", "===", "!==", "<", "<=", ">", ">=", "in", "instanceof", "<<", ">>", ">>>", "+", "-", "*", "/", "%", ",", "||", "&&", "|", "^", "&"]
  };

  var PrefixOperator = {
    type: "Enum",
    values: ["+", "-", "!", "~", "typeof", "void", "delete", "++", "--"]
  };

  var PostfixOperator = {
    type: "Enum",
    values: ["++", "--"]
  };

  var SourceLocation = SPEC.SourceLocation = {};
  var SourceSpan = SPEC.SourceSpan = {};
  var BindingWithDefault = SPEC.BindingWithDefault = {};
  var BindingIdentifier = SPEC.BindingIdentifier = {};
  var ArrayBinding = SPEC.ArrayBinding = {};
  var ObjectBinding = SPEC.ObjectBinding = {};
  var BindingPropertyIdentifier = SPEC.BindingPropertyIdentifier = {};
  var BindingPropertyProperty = SPEC.BindingPropertyProperty = {};
  var ClassExpression = SPEC.ClassExpression = {};
  var ClassDeclaration = SPEC.ClassDeclaration = {};
  var ClassElement = SPEC.ClassElement = {};
  var Module = SPEC.Module = {};
  var Import = SPEC.Import = {};
  var ImportNamespace = SPEC.ImportNamespace = {};
  var ImportSpecifier = SPEC.ImportSpecifier = {};
  var ExportAllFrom = SPEC.ExportAllFrom = {};
  var ExportFrom = SPEC.ExportFrom = {};
  var Export = SPEC.Export = {};
  var ExportDefault = SPEC.ExportDefault = {};
  var ExportSpecifier = SPEC.ExportSpecifier = {};
  var ArrowExpression = SPEC.ArrowExpression = {};
  var FunctionBody = SPEC.FunctionBody = {};
  var FunctionDeclaration = SPEC.FunctionDeclaration = {};
  var FunctionExpression = SPEC.FunctionExpression = {};
  var ObjectExpression = SPEC.ObjectExpression = {};
  var Method = SPEC.Method = {};
  var Getter = SPEC.Getter = {};
  var Setter = SPEC.Setter = {};
  var DataProperty = SPEC.DataProperty = {};
  var ShorthandProperty = SPEC.ShorthandProperty = {};
  var ComputedPropertyName = SPEC.ComputedPropertyName = {};
  var StaticPropertyName = SPEC.StaticPropertyName = {};
  var LiteralBooleanExpression = SPEC.LiteralBooleanExpression = {};
  var LiteralInfinityExpression = SPEC.LiteralInfinityExpression = {};
  var LiteralNullExpression = SPEC.LiteralNullExpression = {};
  var LiteralNumericExpression = SPEC.LiteralNumericExpression = {};
  var LiteralRegExpExpression = SPEC.LiteralRegExpExpression = {};
  var LiteralStringExpression = SPEC.LiteralStringExpression = {};
  var ArrayExpression = SPEC.ArrayExpression = {};
  var AssignmentExpression = SPEC.AssignmentExpression = {};
  var BinaryExpression = SPEC.BinaryExpression = {};
  var CallExpression = SPEC.CallExpression = {};
  var ComputedMemberExpression = SPEC.ComputedMemberExpression = {};
  var ConditionalExpression = SPEC.ConditionalExpression = {};
  var IdentifierExpression = SPEC.IdentifierExpression = {};
  var NewExpression = SPEC.NewExpression = {};
  var NewTargetExpression = SPEC.NewTargetExpression = {};
  var PostfixExpression = SPEC.PostfixExpression = {};
  var PrefixExpression = SPEC.PrefixExpression = {};
  var StaticMemberExpression = SPEC.StaticMemberExpression = {};
  var TemplateExpression = SPEC.TemplateExpression = {};
  var ThisExpression = SPEC.ThisExpression = {};
  var YieldExpression = SPEC.YieldExpression = {};
  var YieldGeneratorExpression = SPEC.YieldGeneratorExpression = {};
  var BlockStatement = SPEC.BlockStatement = {};
  var BreakStatement = SPEC.BreakStatement = {};
  var ContinueStatement = SPEC.ContinueStatement = {};
  var DebuggerStatement = SPEC.DebuggerStatement = {};
  var DoWhileStatement = SPEC.DoWhileStatement = {};
  var EmptyStatement = SPEC.EmptyStatement = {};
  var ExpressionStatement = SPEC.ExpressionStatement = {};
  var ForInStatement = SPEC.ForInStatement = {};
  var ForOfStatement = SPEC.ForOfStatement = {};
  var ForStatement = SPEC.ForStatement = {};
  var IfStatement = SPEC.IfStatement = {};
  var LabeledStatement = SPEC.LabeledStatement = {};
  var ReturnStatement = SPEC.ReturnStatement = {};
  var SwitchStatement = SPEC.SwitchStatement = {};
  var SwitchStatementWithDefault = SPEC.SwitchStatementWithDefault = {};
  var ThrowStatement = SPEC.ThrowStatement = {};
  var TryCatchStatement = SPEC.TryCatchStatement = {};
  var TryFinallyStatement = SPEC.TryFinallyStatement = {};
  var VariableDeclarationStatement = SPEC.VariableDeclarationStatement = {};
  var WhileStatement = SPEC.WhileStatement = {};
  var WithStatement = SPEC.WithStatement = {};
  var Block = SPEC.Block = {};
  var CatchClause = SPEC.CatchClause = {};
  var Directive = SPEC.Directive = {};
  var Script = SPEC.Script = {};
  var SpreadElement = SPEC.SpreadElement = {};
  var Super = SPEC.Super = {};
  var SwitchCase = SPEC.SwitchCase = {};
  var SwitchDefault = SPEC.SwitchDefault = {};
  var TemplateElement = SPEC.TemplateElement = {};
  var VariableDeclaration = SPEC.VariableDeclaration = {};
  var VariableDeclarator = SPEC.VariableDeclarator = {};

  var Function = Union(ArrowExpression, FunctionDeclaration, FunctionExpression, Method);
  var Class = Union(ClassExpression, ClassDeclaration);
  var BindingProperty = Union(BindingPropertyIdentifier, BindingPropertyProperty);
  var ExportDeclaration = Union(ExportAllFrom, ExportFrom, Export, ExportDefault);
  var ImportDeclaration = Union(Import, ImportNamespace);
  var MethodDefinition = Union(Method, Getter, Setter);
  var NamedObjectProperty = Union(MethodDefinition, DataProperty);
  var ObjectProperty = Union(NamedObjectProperty, ShorthandProperty);
  var PropertyName = Union(ComputedPropertyName, StaticPropertyName);
  var MemberExpression = Union(ComputedMemberExpression, StaticMemberExpression);
  var UnaryExpression = Union(PostfixExpression, PrefixExpression);
  var Expression = Union(UnaryExpression, MemberExpression, ClassExpression, ArrowExpression, FunctionExpression, ObjectExpression, LiteralBooleanExpression, LiteralInfinityExpression, LiteralNullExpression, LiteralNumericExpression, LiteralRegExpExpression, LiteralStringExpression, ArrayExpression, AssignmentExpression, BinaryExpression, CallExpression, ConditionalExpression, IdentifierExpression, NewExpression, NewTargetExpression, TemplateExpression, ThisExpression, YieldExpression, YieldGeneratorExpression);
  var IterationStatement = Union(DoWhileStatement, ForInStatement, ForOfStatement, ForStatement, WhileStatement);
  var Statement = Union(ClassDeclaration, FunctionDeclaration, BlockStatement, BreakStatement, ContinueStatement, DebuggerStatement, EmptyStatement, ExpressionStatement, IfStatement, LabeledStatement, ReturnStatement, SwitchStatement, SwitchStatementWithDefault, ThrowStatement, TryCatchStatement, TryFinallyStatement, VariableDeclarationStatement, WithStatement);
  var Node = Union(Statement, IterationStatement, Expression, PropertyName, ObjectProperty, ImportDeclaration, ExportDeclaration, BindingWithDefault, BindingIdentifier, ArrayBinding, ObjectBinding, BindingProperty, ClassElement, Module, ImportSpecifier, ExportSpecifier, FunctionBody, Block, CatchClause, Directive, Script, SpreadElement, Super, SwitchCase, SwitchDefault, TemplateElement, VariableDeclaration, VariableDeclarator);

  SourceLocation.type ="SourceLocation";
  SourceLocation.line = DOUBLE;
  SourceLocation.column = DOUBLE;
  SourceLocation.offset = DOUBLE;

  SourceSpan.type ="SourceSpan";
  SourceSpan.source = Maybe(STRING);
  SourceSpan.start = SourceLocation;
  SourceSpan.end = SourceLocation;

  BindingWithDefault.type ="BindingWithDefault";
  BindingWithDefault.loc = Maybe(SourceSpan);
  BindingWithDefault.binding = Union(ObjectBinding, ArrayBinding, BindingIdentifier);
  BindingWithDefault.init = Expression;

  BindingIdentifier.type ="BindingIdentifier";
  BindingIdentifier.loc = Maybe(SourceSpan);
  BindingIdentifier.name = STRING;

  ArrayBinding.type ="ArrayBinding";
  ArrayBinding.loc = Maybe(SourceSpan);
  ArrayBinding.elements = List(Maybe(Union(ObjectBinding, ArrayBinding, BindingIdentifier, BindingWithDefault)));
  ArrayBinding.restElement = Maybe(Union(ObjectBinding, ArrayBinding, BindingIdentifier));

  ObjectBinding.type ="ObjectBinding";
  ObjectBinding.loc = Maybe(SourceSpan);
  ObjectBinding.properties = List(BindingProperty);

  BindingPropertyIdentifier.type ="BindingPropertyIdentifier";
  BindingPropertyIdentifier.loc = Maybe(SourceSpan);
  BindingPropertyIdentifier.binding = BindingIdentifier;
  BindingPropertyIdentifier.init = Maybe(Expression);

  BindingPropertyProperty.type ="BindingPropertyProperty";
  BindingPropertyProperty.loc = Maybe(SourceSpan);
  BindingPropertyProperty.name = PropertyName;
  BindingPropertyProperty.binding = Union(ObjectBinding, ArrayBinding, BindingIdentifier, BindingWithDefault);

  ClassExpression.type ="ClassExpression";
  ClassExpression.super = Maybe(Expression);
  ClassExpression.elements = List(ClassElement);
  ClassExpression.loc = Maybe(SourceSpan);
  ClassExpression.name = Maybe(BindingIdentifier);

  ClassDeclaration.type ="ClassDeclaration";
  ClassDeclaration.super = Maybe(Expression);
  ClassDeclaration.elements = List(ClassElement);
  ClassDeclaration.loc = Maybe(SourceSpan);
  ClassDeclaration.name = BindingIdentifier;

  ClassElement.type ="ClassElement";
  ClassElement.loc = Maybe(SourceSpan);
  ClassElement.isStatic = BOOLEAN;
  ClassElement.method = MethodDefinition;

  Module.type ="Module";
  Module.loc = Maybe(SourceSpan);
  Module.items = List(Union(ImportDeclaration, ExportDeclaration, Statement));

  Import.type ="Import";
  Import.loc = Maybe(SourceSpan);
  Import.moduleSpecifier = STRING;
  Import.defaultBinding = Maybe(BindingIdentifier);
  Import.namedImports = List(ImportSpecifier);

  ImportNamespace.type ="ImportNamespace";
  ImportNamespace.loc = Maybe(SourceSpan);
  ImportNamespace.moduleSpecifier = STRING;
  ImportNamespace.defaultBinding = Maybe(BindingIdentifier);
  ImportNamespace.namespaceBinding = BindingIdentifier;

  ImportSpecifier.type ="ImportSpecifier";
  ImportSpecifier.loc = Maybe(SourceSpan);
  ImportSpecifier.name = Maybe(STRING);
  ImportSpecifier.binding = BindingIdentifier;

  ExportAllFrom.type ="ExportAllFrom";
  ExportAllFrom.loc = Maybe(SourceSpan);
  ExportAllFrom.moduleSpecifier = STRING;

  ExportFrom.type ="ExportFrom";
  ExportFrom.loc = Maybe(SourceSpan);
  ExportFrom.namedExports = List(ExportSpecifier);
  ExportFrom.moduleSpecifier = Maybe(STRING);

  Export.type ="Export";
  Export.loc = Maybe(SourceSpan);
  Export.declaration = Union(FunctionDeclaration, ClassDeclaration, VariableDeclaration);

  ExportDefault.type ="ExportDefault";
  ExportDefault.loc = Maybe(SourceSpan);
  ExportDefault.body = Union(FunctionDeclaration, ClassDeclaration, Expression);

  ExportSpecifier.type ="ExportSpecifier";
  ExportSpecifier.loc = Maybe(SourceSpan);
  ExportSpecifier.name = Maybe(STRING);
  ExportSpecifier.exportedName = STRING;

  ArrowExpression.type ="ArrowExpression";
  ArrowExpression.parameters = List(Union(ObjectBinding, ArrayBinding, BindingIdentifier, BindingWithDefault));
  ArrowExpression.restParameter = Maybe(BindingIdentifier);
  ArrowExpression.loc = Maybe(SourceSpan);
  ArrowExpression.body = Union(FunctionBody, Expression);

  FunctionBody.type ="FunctionBody";
  FunctionBody.loc = Maybe(SourceSpan);
  FunctionBody.directives = List(Directive);
  FunctionBody.statements = List(Statement);

  FunctionDeclaration.type ="FunctionDeclaration";
  FunctionDeclaration.parameters = List(Union(ObjectBinding, ArrayBinding, BindingIdentifier, BindingWithDefault));
  FunctionDeclaration.restParameter = Maybe(BindingIdentifier);
  FunctionDeclaration.loc = Maybe(SourceSpan);
  FunctionDeclaration.isGenerator = BOOLEAN;
  FunctionDeclaration.name = BindingIdentifier;
  FunctionDeclaration.body = FunctionBody;

  FunctionExpression.type ="FunctionExpression";
  FunctionExpression.parameters = List(Union(ObjectBinding, ArrayBinding, BindingIdentifier, BindingWithDefault));
  FunctionExpression.restParameter = Maybe(BindingIdentifier);
  FunctionExpression.loc = Maybe(SourceSpan);
  FunctionExpression.isGenerator = BOOLEAN;
  FunctionExpression.name = Maybe(BindingIdentifier);
  FunctionExpression.body = FunctionBody;

  ObjectExpression.type ="ObjectExpression";
  ObjectExpression.loc = Maybe(SourceSpan);
  ObjectExpression.properties = List(ObjectProperty);

  Method.type ="Method";
  Method.parameters = List(Union(ObjectBinding, ArrayBinding, BindingIdentifier, BindingWithDefault));
  Method.restParameter = Maybe(BindingIdentifier);
  Method.loc = Maybe(SourceSpan);
  Method.name = PropertyName;
  Method.body = FunctionBody;
  Method.isGenerator = BOOLEAN;

  Getter.type ="Getter";
  Getter.loc = Maybe(SourceSpan);
  Getter.name = PropertyName;
  Getter.body = FunctionBody;

  Setter.type ="Setter";
  Setter.loc = Maybe(SourceSpan);
  Setter.name = PropertyName;
  Setter.body = FunctionBody;
  Setter.parameter = Union(ObjectBinding, ArrayBinding, BindingIdentifier);

  DataProperty.type ="DataProperty";
  DataProperty.loc = Maybe(SourceSpan);
  DataProperty.name = PropertyName;
  DataProperty.expression = Expression;

  ShorthandProperty.type ="ShorthandProperty";
  ShorthandProperty.loc = Maybe(SourceSpan);
  ShorthandProperty.name = STRING;

  ComputedPropertyName.type ="ComputedPropertyName";
  ComputedPropertyName.loc = Maybe(SourceSpan);
  ComputedPropertyName.expression = Expression;

  StaticPropertyName.type ="StaticPropertyName";
  StaticPropertyName.loc = Maybe(SourceSpan);
  StaticPropertyName.value = STRING;

  LiteralBooleanExpression.type ="LiteralBooleanExpression";
  LiteralBooleanExpression.loc = Maybe(SourceSpan);
  LiteralBooleanExpression.value = BOOLEAN;

  LiteralInfinityExpression.type ="LiteralInfinityExpression";
  LiteralInfinityExpression.loc = Maybe(SourceSpan);

  LiteralNullExpression.type ="LiteralNullExpression";
  LiteralNullExpression.loc = Maybe(SourceSpan);

  LiteralNumericExpression.type ="LiteralNumericExpression";
  LiteralNumericExpression.loc = Maybe(SourceSpan);
  LiteralNumericExpression.value = DOUBLE;

  LiteralRegExpExpression.type ="LiteralRegExpExpression";
  LiteralRegExpExpression.loc = Maybe(SourceSpan);
  LiteralRegExpExpression.pattern = STRING;
  LiteralRegExpExpression.flags = STRING;

  LiteralStringExpression.type ="LiteralStringExpression";
  LiteralStringExpression.loc = Maybe(SourceSpan);
  LiteralStringExpression.value = STRING;

  ArrayExpression.type ="ArrayExpression";
  ArrayExpression.loc = Maybe(SourceSpan);
  ArrayExpression.elements = List(Maybe(Union(SpreadElement, Expression)));

  AssignmentExpression.type ="AssignmentExpression";
  AssignmentExpression.loc = Maybe(SourceSpan);
  AssignmentExpression.operator = AssignmentOperator;
  AssignmentExpression.binding = Union(ObjectBinding, ArrayBinding, BindingIdentifier, MemberExpression);
  AssignmentExpression.expression = Expression;

  BinaryExpression.type ="BinaryExpression";
  BinaryExpression.loc = Maybe(SourceSpan);
  BinaryExpression.operator = BinaryOperator;
  BinaryExpression.left = Expression;
  BinaryExpression.right = Expression;

  CallExpression.type ="CallExpression";
  CallExpression.loc = Maybe(SourceSpan);
  CallExpression.callee = Union(Expression, Super);
  CallExpression.arguments = List(Union(SpreadElement, Expression));

  ComputedMemberExpression.type ="ComputedMemberExpression";
  ComputedMemberExpression.loc = Maybe(SourceSpan);
  ComputedMemberExpression.object = Union(Expression, Super);
  ComputedMemberExpression.expression = Expression;

  ConditionalExpression.type ="ConditionalExpression";
  ConditionalExpression.loc = Maybe(SourceSpan);
  ConditionalExpression.test = Expression;
  ConditionalExpression.consequent = Expression;
  ConditionalExpression.alternate = Expression;

  IdentifierExpression.type ="IdentifierExpression";
  IdentifierExpression.loc = Maybe(SourceSpan);
  IdentifierExpression.name = STRING;

  NewExpression.type ="NewExpression";
  NewExpression.loc = Maybe(SourceSpan);
  NewExpression.callee = Expression;
  NewExpression.arguments = List(Union(SpreadElement, Expression));

  NewTargetExpression.type ="NewTargetExpression";
  NewTargetExpression.loc = Maybe(SourceSpan);

  PostfixExpression.type ="PostfixExpression";
  PostfixExpression.loc = Maybe(SourceSpan);
  PostfixExpression.operand = Expression;
  PostfixExpression.operator = PostfixOperator;

  PrefixExpression.type ="PrefixExpression";
  PrefixExpression.loc = Maybe(SourceSpan);
  PrefixExpression.operand = Expression;
  PrefixExpression.operator = PrefixOperator;

  StaticMemberExpression.type ="StaticMemberExpression";
  StaticMemberExpression.loc = Maybe(SourceSpan);
  StaticMemberExpression.object = Union(Expression, Super);
  StaticMemberExpression.property = STRING;

  TemplateExpression.type ="TemplateExpression";
  TemplateExpression.loc = Maybe(SourceSpan);
  TemplateExpression.tag = Maybe(Expression);
  TemplateExpression.elements = List(Union(Expression, TemplateElement));

  ThisExpression.type ="ThisExpression";
  ThisExpression.loc = Maybe(SourceSpan);

  YieldExpression.type ="YieldExpression";
  YieldExpression.loc = Maybe(SourceSpan);
  YieldExpression.expression = Maybe(Expression);

  YieldGeneratorExpression.type ="YieldGeneratorExpression";
  YieldGeneratorExpression.loc = Maybe(SourceSpan);
  YieldGeneratorExpression.expression = Expression;

  BlockStatement.type ="BlockStatement";
  BlockStatement.loc = Maybe(SourceSpan);
  BlockStatement.block = Block;

  BreakStatement.type ="BreakStatement";
  BreakStatement.loc = Maybe(SourceSpan);
  BreakStatement.label = Maybe(STRING);

  ContinueStatement.type ="ContinueStatement";
  ContinueStatement.loc = Maybe(SourceSpan);
  ContinueStatement.label = Maybe(STRING);

  DebuggerStatement.type ="DebuggerStatement";
  DebuggerStatement.loc = Maybe(SourceSpan);

  DoWhileStatement.type ="DoWhileStatement";
  DoWhileStatement.loc = Maybe(SourceSpan);
  DoWhileStatement.body = Statement;
  DoWhileStatement.test = Expression;

  EmptyStatement.type ="EmptyStatement";
  EmptyStatement.loc = Maybe(SourceSpan);

  ExpressionStatement.type ="ExpressionStatement";
  ExpressionStatement.loc = Maybe(SourceSpan);
  ExpressionStatement.expression = Expression;

  ForInStatement.type ="ForInStatement";
  ForInStatement.loc = Maybe(SourceSpan);
  ForInStatement.body = Statement;
  ForInStatement.left = Union(VariableDeclaration, ObjectBinding, ArrayBinding, BindingIdentifier);
  ForInStatement.right = Expression;

  ForOfStatement.type ="ForOfStatement";
  ForOfStatement.loc = Maybe(SourceSpan);
  ForOfStatement.body = Statement;
  ForOfStatement.left = Union(VariableDeclaration, ObjectBinding, ArrayBinding, BindingIdentifier);
  ForOfStatement.right = Expression;

  ForStatement.type ="ForStatement";
  ForStatement.loc = Maybe(SourceSpan);
  ForStatement.body = Statement;
  ForStatement.init = Maybe(Union(VariableDeclaration, ObjectBinding, ArrayBinding, BindingIdentifier));
  ForStatement.test = Maybe(Expression);
  ForStatement.update = Maybe(Expression);

  IfStatement.type ="IfStatement";
  IfStatement.loc = Maybe(SourceSpan);
  IfStatement.test = Expression;
  IfStatement.consequent = Statement;
  IfStatement.alternate = Maybe(Statement);

  LabeledStatement.type ="LabeledStatement";
  LabeledStatement.loc = Maybe(SourceSpan);
  LabeledStatement.label = STRING;
  LabeledStatement.body = Statement;

  ReturnStatement.type ="ReturnStatement";
  ReturnStatement.loc = Maybe(SourceSpan);
  ReturnStatement.expression = Maybe(Expression);

  SwitchStatement.type ="SwitchStatement";
  SwitchStatement.loc = Maybe(SourceSpan);
  SwitchStatement.discriminant = Expression;
  SwitchStatement.cases = List(SwitchCase);

  SwitchStatementWithDefault.type ="SwitchStatementWithDefault";
  SwitchStatementWithDefault.loc = Maybe(SourceSpan);
  SwitchStatementWithDefault.discriminant = Expression;
  SwitchStatementWithDefault.preDefaultCases = List(SwitchCase);
  SwitchStatementWithDefault.defaultCase = SwitchDefault;
  SwitchStatementWithDefault.postDefaultCases = List(SwitchCase);

  ThrowStatement.type ="ThrowStatement";
  ThrowStatement.loc = Maybe(SourceSpan);
  ThrowStatement.expression = Expression;

  TryCatchStatement.type ="TryCatchStatement";
  TryCatchStatement.loc = Maybe(SourceSpan);
  TryCatchStatement.body = Block;
  TryCatchStatement.catchClause = CatchClause;

  TryFinallyStatement.type ="TryFinallyStatement";
  TryFinallyStatement.loc = Maybe(SourceSpan);
  TryFinallyStatement.body = Block;
  TryFinallyStatement.catchClause = Maybe(CatchClause);
  TryFinallyStatement.finalizer = Block;

  VariableDeclarationStatement.type ="VariableDeclarationStatement";
  VariableDeclarationStatement.loc = Maybe(SourceSpan);
  VariableDeclarationStatement.declaration = VariableDeclaration;

  WhileStatement.type ="WhileStatement";
  WhileStatement.loc = Maybe(SourceSpan);
  WhileStatement.body = Statement;
  WhileStatement.test = Expression;

  WithStatement.type ="WithStatement";
  WithStatement.loc = Maybe(SourceSpan);
  WithStatement.object = Expression;
  WithStatement.body = Statement;

  Block.type ="Block";
  Block.loc = Maybe(SourceSpan);
  Block.statements = List(Statement);

  CatchClause.type ="CatchClause";
  CatchClause.loc = Maybe(SourceSpan);
  CatchClause.binding = Union(ObjectBinding, ArrayBinding, BindingIdentifier);
  CatchClause.body = Block;

  Directive.type ="Directive";
  Directive.loc = Maybe(SourceSpan);
  Directive.rawValue = STRING;

  Script.type ="Script";
  Script.loc = Maybe(SourceSpan);
  Script.body = FunctionBody;

  SpreadElement.type ="SpreadElement";
  SpreadElement.loc = Maybe(SourceSpan);
  SpreadElement.expression = Expression;

  Super.type ="Super";
  Super.loc = Maybe(SourceSpan);

  SwitchCase.type ="SwitchCase";
  SwitchCase.loc = Maybe(SourceSpan);
  SwitchCase.test = Expression;
  SwitchCase.consequent = List(Statement);

  SwitchDefault.type ="SwitchDefault";
  SwitchDefault.loc = Maybe(SourceSpan);
  SwitchDefault.consequent = List(Statement);

  TemplateElement.type ="TemplateElement";
  TemplateElement.loc = Maybe(SourceSpan);
  TemplateElement.rawValue = STRING;

  VariableDeclaration.type ="VariableDeclaration";
  VariableDeclaration.loc = Maybe(SourceSpan);
  VariableDeclaration.kind = VariableDeclarationKind;
  VariableDeclaration.declarators = List(VariableDeclarator);

  VariableDeclarator.type ="VariableDeclarator";
  VariableDeclarator.loc = Maybe(SourceSpan);
  VariableDeclarator.binding = Union(ObjectBinding, ArrayBinding, BindingIdentifier);
  VariableDeclarator.init = Maybe(Expression);

  return SPEC;
};
