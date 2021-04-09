## Contributing Guide

Here you can learn about how you can help make thenewboston-js a robust and simple JavaScript library to use!

### Setup

Make sure you clone the official repository. Here is the command to run if you want to clone with git:

```sh
> git clone https://github.com/thenewboston-developers/thenewboston-js.git
```

After that, you should see a new folder named `thenewboston-js` in your current working directory. Navigate into that project and you're ready to go!

### Development

Before you are able to access any of the npm commands, you must first run `npm install` or `npm i` to get all of the modules loaded into your local project.

### Building

If you are ready to test out your changes, run `npm run build`. After that, you should see the CommonJS module located in the `dist` directory. You can create a `dev.js` file with something like the following code if you want to test out your changes:

```js
const tnb = require("./"); // loads the module from the path in the `package.json`

async function main() {
  /* Code! */
}

main();
```

### Contributing

Create your fork / branch from the development branch, All pull requests to be made to development branch for review.