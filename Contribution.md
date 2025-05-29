## Project Struction

The module is at the root, for npm publish. Dev stuffs are excluded from publishing in sub-folders:
- /lib - code and unit tests
- /pages - demo app, hosted on github
- /tests - e2e tests leveraging /pages


## Code paths

1. parse form data (optionally hold in form object)
2. when rendering, start from the root of form specifications:
    1. create form node using spec node's properties
    2. attach event handlers (onSubmit, onShange, onNext)
    3. render with selected UI lib (React/HTML/...)
    4. recursively look at `fields` property to render child nodes

