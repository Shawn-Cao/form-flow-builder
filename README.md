## form-builder
Trying to generalize something out of a few projects using dynamic forms

1. I need something like the famous react-jsonschema-form. But with more support for view changes.
2. I feel complying with JSON-schema makes view transition harder, but something similar is still needed, prob lighter.
3. More on the schema language, I should prob make it nested, with top level defining the form data structure.
4. The basic features should be easy to use and learn.
5. Careful with bundle size. Must support tree shaking with good examples
6. Especially these days with AI assisted development, this form lib should focus on intentions, similar to instructions to LLMs.


# New (current) prologue
## NOTE: Proposing new headline: Data driven form with builder, super fast and small footprint. No virtual DOM diffing, compatibal/convertible to use React & other frameworks' components

(should be extended here)
From what I learned, I do believe that a form can be expressed with rigorous and normalized language, so that programmes based on the form specification behavies determinitsically. But, in reality, the expression easily becomes lengthy and uncomprehendable to humans. Given that IRS 1040 takes 100+ pages to explain, which still requires experts interpreation. So, we take in the fact that human perceptions are vague, and iterational with different focus levels. Hence a practical expression should also leverage both normalized language as well as liberal but less accurate expressions.

I think this is the best way to describe a form:

1. Form data itself is normalized, including data type (validation), required/optional, default value, and hence branching.
    1. This library should just work with only the form data itself defined. With sensable defaults. This lowers learning curve to improve adoption. Also makes demo more smooth.
    2. It's just plain data, so JSON serves as the most convenient way.
2. Navigation as human readable expressions. hopefully can be normalized.
3. Presentational demands should be more liberal. We should offer more options. (premium services?)
4. Form behaviors (eg. fetch) can be normalized, but why not just use plain programming languages of choice?
5. Toolings should provide:
    1. Usability validation: eg. field name uniqueness, routing navigable to the end
    2. Automated testing. Enforce above, plus configurable tests, edge cases. (again may not be fully normalizable)
6. Server-side processing should be based on above. And be a premium service possibility. Also because of this, we should borrow ideas from relevant servers-side works, like Protocol Buffers. (Same way because SOAP/XML is dead, we should avoid their mistakes)


## implementation notes
### supported features
1. Built-in components: React (TODO: HTML, Svelte?) (try out HTML import and plain JS for pages/base)
2. State management using plain state hooks
3. runtime validation: onChange, onSubmit
4. Multi-page UI with dynamic routing

### planned features
2. Mirror React-hook-form behavior since we take full responsibility. Support all through options
3. hold form def/value/error object and importable from anywhere (helps with validation) (React needs to useEffect?)
    - For this to work, we add tentative input when error comes, and block(?) nagivation on error
4. integration test helpers (where own tests can't cover. eg, accept URL params and localStorage)
5. build-time form spec/schema validation
6. field annotations: pristine, prepopulated, reviewed, ...