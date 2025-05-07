## form-builder
Trying to generalize something out of a few projects using dynamic forms

1. I need something like the famous react-jsonschema-form. But with more support for view changes.
2. I feel complying with JSON-schema makes view transition harder, but something similar is still needed, prob lighter.
3. More on the schema language, I should prob make it nested, with top level defining the form data structure.
4. The base features should be easy to use and learn. Must support tree shaking with good examples


# New (current) prologue
(should be extended)
In my heart, I do believe that a form can be express with rigorous and normalized language, so that programming on the form behavies determinitsically. But in reality, the express becomes unprehendable to humans, given that IRS 1040 takes 100+ pages to explain, which still requires experts interpreation. So, we take in the fact that human perceptions are layered(?), with different focus levels. Hence a practical expression should also leverage both normalized language as well as liberal but less accurate expressions.

I think this is the best way to describe a form:

1. Form data itself is normalized, including data type (validation), required/optional, default value, and hence branching.
    1. This library should just work with only the form data itself defined. With sensable defaults. This lowers learning curve to improve adoption. Also makes demo more smooth.
    2. We can try JSON as the most convenient way.
2. Navigation as human readable expressions. hopefully can be normalized.
3. Presentational demands are more liberal. We should offer more options. (premium services?)
4. Form behaviors (eg. fetch) can be normalized, but why not just use plain programming languages of choice?
5. Toolings should provide:
    1. Useability validation: eg. field name uniqueness, routing navigable to the end
    2. Automated testing. Enforce above, plus configurable tests, edge cases. (again may not be fully normalizable)
6. Server-side processing should be based on above. And be a premium service possibility. Also because of this, we should borrow ideas from relevant servers-side works, like Protocol Buffers. (Same way because SOAP/XML is dead, we should avoid their mistakes)
