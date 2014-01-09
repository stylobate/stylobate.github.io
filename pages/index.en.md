---

layout: default

permalink: /

---

# What is “Stylobate”?

_Stylobate_ is not your usual framework. It is a conception, a methodology, another level of abstraction over CSS.

While the current implementation is based on Stylus CSS-preprocessor, in [the future](draft/) it would be a stand-alone project.

The basic idea is simple: **Separation of the styles from the selectors**.

While in preprocessors you can achieve _something similar_ using placeholder selectors or mixins, Stylobate provides you a framework with a set of rules to make this task easy and powerful.

## What Stylobate Offers

There are two things Stylobate provides:

1. Framework for describing your styles (known as “skins”) — in other words a framework for making your own reusable CSS framework.

2. A number of premade generic styles (known as “kinds”) you can use in your skins or general styles.

## Skins and Kinds

Usually markup can be divided into two parts: generic styles that are used for most of the sites (like resets, lists, layouts, general styles for buttons etc.) and the styles for the specific site, which won't repeat from site to site.

Stylobate was made so you could define your own “namespaces”, and it comes with two such pre-made namespaces: `kind` and `skin`.

Kinds are general-use styles, you can see the [docs for them](kinds/) on this site, as Stylobate comes with them. Skins, on the other hand, is a special namespace for your own styles, they have everything your need to create your own CSS framework.

## Using skins and kinds

You can start already by using the [available kinds](kinds/), or you can [write your own skins] (link coming soon).

Using Stylobate styles is really easy:

    .my-button
      kind: button
      skin: button

Those rules would apply the `button` kind and the `button` skin to the selector `.my-button`. This means Stylobate would take the generic styles for the button from the [button kind](kinds/#kind-button) and the styles for your site's button from the skin you have described. Any kind or skin could have its own params, they're written after the skin's/kind's name, like this:

    .my-button
      kind: button no-reset
      skin: button small

This would make the button kind not to apply the reset for this class, and would tell the skin to use the small modification of the button.

Of course not every element could be made using only one HTML element, more than this, there could be states like hover that could have either default selector `:hover`, or you would like to override it to something different, like `.is-hovered`.

This is done by using “element params”, which consist of the param name and the overriden selector for it.
