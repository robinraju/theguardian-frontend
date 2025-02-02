package form

import views.html.helper.FieldConstructor
import views.html.fragments.form.fieldConstructors.{frontendFieldConstructor, multiInputFieldConstructor}
import play.api.data.Field

object IdFormHelpers {
  implicit val fields = FieldConstructor(frontendFieldConstructor.f)

  val nonInputFields = FieldConstructor(multiInputFieldConstructor.f)

  def Password(field: Field, args: (Symbol, Any)*): Input = {
    val updatedArgs =
      updateArgs(
        args,
        Symbol("autocomplete") -> "off",
        Symbol("autocapitalize") -> "off",
        Symbol("autocorrect") -> "off",
      )
    new Input("password", field, updatedArgs: _*)
  }

  def Email(field: Field, args: (Symbol, Any)*): Input = {
    val updatedArgs =
      updateArgs(
        args,
        Symbol("autocomplete") -> "on",
        Symbol("autocapitalize") -> "off",
        Symbol("autocorrect") -> "off",
      )
    new Input("email", field, updatedArgs: _*)
  }

  def Username(field: Field, args: (Symbol, Any)*): Input = {
    val updatedArgs =
      updateArgs(
        args,
        Symbol("autocomplete") -> "off",
        Symbol("autocapitalize") -> "off",
        Symbol("autocorrect") -> "off",
      )
    new Input("text", field, updatedArgs: _*)
  }

  def Input(field: Field, args: (Symbol, Any)*): Input = {
    new Input("text", field, args: _*)
  }

  def Phone(field: Field, args: (Symbol, Any)*): Input = {
    new Input("phone", field, args: _*)
  }

  def Checkbox(field: Field, args: (Symbol, Any)*): Input = {
    new Input("checkbox", field, args: _*)
  }

  def Radio(field: Field, values: List[String], args: (Symbol, Any)*): Input = {
    new Input("radio", field, (Symbol("_values") -> values :: args.toList): _*)
  }

  def Textarea(field: Field, args: (Symbol, Any)*): Input = {
    new Input("textarea", field, args: _*)
  }

  private def updateArgs(args: Seq[(Symbol, Any)], defaults: (Symbol, Any)*): Seq[(Symbol, Any)] = {
    val argsMap = collection.mutable.Map(args: _*)
    defaults.foreach {
      case (symbol, default) =>
        if (!argsMap.contains(symbol)) argsMap.put(symbol, default)
    }
    argsMap.toSeq
  }
}

class Input(val inputType: String, val field: Field, initialArgs: (Symbol, Any)*) {
  val cls = "text-input " + getArgOrElse(Symbol("class"), "", initialArgs)
  val autocomplete = getArgOrElse(Symbol("autocomplete"), "on", initialArgs)
  val autocapitalize = getArgOrElse(Symbol("autocapitalize"), "on", initialArgs)
  val autocorrect = getArgOrElse(Symbol("autocorrect"), "on", initialArgs)
  val spellcheck = getArgOrElse(Symbol("spellcheck"), "false", initialArgs)
  val autofocus = getArgOrElse(Symbol("autofocus"), false, initialArgs)
  val required = field.constraints.exists(constraint => constraint._1 == "constraint.required")

  val args = initialArgs.filter(_._1 != Symbol("type")) ++ Seq(Symbol("_showConstraints") -> false)

  private def getArgOrElse[T](property: Symbol, default: T, args: Seq[(Symbol, Any)]): T =
    args.toMap.get(property).map(_.asInstanceOf[T]).getOrElse(default)
}
