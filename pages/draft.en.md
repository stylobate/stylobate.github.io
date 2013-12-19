---

layout: default

permalink: /draft/

---

# Drafts of the Future

## Goals and ideas

### Independance

The main idea: **separation of the styles from the selectors**.

We need to create each block in such way, the resulting styles would be independant from the HTML, and the first step to it is removing the selectors glued to the styles.

If we would separate the styles from the selectors, we could then use those styles for any blocks. We wouldn't depend on any “implementation” of our blocks. The library containing such styles could be used with any site, with any web app, in any context and for almost any markup. You won't need to use any specific code style, you could use only BEM-like classnames, or use the cascade, element and attribute selectors, or anything else you want. And most of the updates to the library won't mean you'll need to fix your markup.asd

### Separation of the visual styles from the base layout

The second thing that would be easily achievable with this concept: **separation of the visual styles from the base layout styles**.

This means that in most cases the layouts and base behaviours would be the same for each and any project. Any button would need the same reset, any inline-block would need its extras for IE, any grid could be made using some of the few approaches. But the *visual styles* of those blocks would be different in those different projects, so our tool should be able to create both styles that could be used across many project (*sdlib*-like), and to create styles individual for a given project, maybe hidden under the namespace (so you could then mix buttons from different projects in one stylesheet).

## Implementation

The implementation could be divided into two parts: declaration of the “blocks” and their “mapping”.

I propose to use the CSS syntax for both declaration and mapping. Arguments:

1. We won't need to invent a new language for those stuff, so we could use existing parsers and tools ([CSSO](gh:css/csso), [CSSComb.js](gh:csscomb/csscomb.js), etc.): there are a lot of preprocessors making things like variables, conditions, iterations etc. — we don't need to repeat it in our tool, we could just chain it with those preprocessors.

2. The extension of the CSS syntax should be “safe”: we shouldn't create things exotic to CSS, so any tool parsing our stylesheets with declarations and mappings won't break and could pass everything to the next steps.

3. What could fit better to describe styles than CSS? Using this syntax it would be easy to nest blocks of CSS code inside our declarations. Also, as this would be based on native CSS syntax, anyone who uses preprocessor could write the declarations using it, all the syntax highlighters would work, and you just won't need to learn a new syntax (well, only the stuff used for mappings and declarations).

### Style declarations

*__Important:__ The syntax descibed there is just a draft, it could change in the future, and you’re welcomed to propose any of those changes.*

#### Block

The base block would look like this:

    @stylobate foo {
        @css {
            display: block;
            width: 10px;
        }
    }

*Questions:*

1. Should we allow to write CSS right inside the block? Maybe not.

2. Should those stylobate-specific “selectors” be with `@` or we could omit it, as in `css {…}`?

3. Should we add an extra namespace to all the extras — like `@stylobate-css`? This could remove the possibility of conflicts with preprocessors.

4. Should we use `@stylobate-block` for block? Or we could just use `@stylobate`?


#### Element

Any nested entity would be an `element` of this block. however, it is not and element as in BEM terminology, this element couldn’t be represented in the DOM as an actual element, but could just provide some extra styles for the block.

The style for an element could be written as an addition to the block:

    @stylobate foo {
        @stylobate-css {}

        @stylobate-element colors {
            @stylobate-css {
                color: #000;
                background: #FFF;
            }
        }
    }

Or there should be a possibility to write it separately, attaching to the block manually:

    @stylobate-element colors (block: foo) {
        @stylobate-css {
            color: #000;
            background: #FFF;
        }
    }

##### Defaulted elements

By default the styles for elements wouldn’t apply to anything. For calling them you would need to use the `selector` param:

    @stylobate-element colors (selector: "&") {
        @stylobate-css {
            color: #000;
            background: #FFF;
        }
    }

This selector could be either an absolute selector, or a relative one, using a “parent reference”, a term known from the preprocessors. This selector would be in the context of its block’s selector, so the `"&_theme_bright"` would mean this element would be a modifier. Actually, Stylobate don’t make a difference between modifiers and elements — the only difference is in the naming of the classes, as we don’t depend on any selectors.

But for our convenience we would name extra static styles “elements” and any elements that could have one key and more values would be called “modifiers”.

#### Modifiers

“Modifiers” are named params that could have more than one possible value, each of which could have its own template.

    @stylobate foo {
        @stylobate-modifier theme (default: normal) {
            @value normal {
                color: #000;
                background: #FFF;
            }
            @value bright {
                color: lime;
                background: yellow;
            }
            @value inverted {
                color: #FFF;
                background: #000;
            }
        }
    }

As you can see, you can write your styles right inside modifiers, without `@stylobate-css`. There is also an optional param `default`, that makes that value to be used as default. As with elements, you can add a `selector` param to set the selector to apply the styles. It is defaulted to `&`.

#### Inheritance

In some cases basic modifiers wouldn’t be enough, like when they intersect and mix. In those cases it is better to create a new block that would inherit all the styles from the parent one and then only redefine the styles you need.

To make it so you’ll need to use `extends` param on decraration.

All the elements and modifiers would be inherited too, and by nesting new elements and modifiers they would be there for a new block, but they won’t be there at the parent.

So, if we have such block:

    @stylobate foo {
        @css {
            display: block;
            width: 10px;
        }
        @stylobate-element colors{
            @stylobate-css {
                color: #000;
                background: #FFF;
            }
        }
        @stylobate-modifier theme (default: normal) {
            @value normal {
                color: #000;
                background: #FFF;
            }
        }
    }

We can extend it by another:

    @stylobate bar (extends: foo) {}

If we wouldn’t write anything else, it would be just an alias to the `foo`.

Any nested entities would be _added_ to the new block, so

    @stylobate bar (extends: foo) {
        @css {
            height: 10px;
        }
        @stylobate-modifier theme {
            @value normal {
                padding: 10px;
            }
            @value crazy {
                position: absolute;
            }
        }
    }

Would add the given CSS to the styles this block inherited from the parent and its `normal` param, more than this, `bar` would have a new value for a modifier `theme` — `crazy`, which the parent lacks. Any params you didn’t mention would be taken from the parent, so the default value for the `theme` would be still `normal`.

##### Replacement instead of iheritance

If you’d need to replace all the styles from the parental element or modifier, you could use a `replaces` flag, like this:

    @stylobate bar (extends: foo) {
        @css (replaces: true) {
            height: 10px;
        }
    }

This way `bar` wouldn’t have CSS from the parent, as it would be replaced by the new one.

## Steps to implementation

Here is just some plan on how to implement all this stuff.

1. On first run divide the stylobate declarations from all other things. It won't rewrite the input, but it would output two things:

    - AST of input with removed Stylobate declarations.
    - The Stylobate declarations object.

    During this process we both find the declarations and mappings to props/values.

2. Now we take the processed AST and iterate through it with the mission to find all the Stylobate calls. At this moment we know which props map to which stylobate entities, so we just expand them there based on the options given.

    * Somewhere we must expand nested Stylobate calls. I think we should do it in the second phase, as we would have all declarations at this moment. We do it recursively, but without allowing any recursion: we shouldn't allow nesting of declarations, i.e. we cannot call `kind-display` inside `kind-display`. When we would see this we should just pass by without giving anything (warnings possible?).

    * So when we would insert anything, we would run the second step on the thing we insert (that was found and moved from input to declarations).


    And that's it.

The hardest things seem to be mappings and getters/setters.

We should have nice ways of rewriting selectors, properties etc. This seems like a need for a nice chainable jq-like API for Gonzales.

Actually, this api should make it possible to do most of the things in the stylobte, as well as in csscomb.