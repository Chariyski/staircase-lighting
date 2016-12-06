# Staircase lighting with ws2811 led strip.

## Demo
Coming soon

## How to use it
- download the repo
- edit src/models/staircase.js according your stairs and preferences
- require staircase-lighting/src/index.js file in your code
- create new instance:
```
const staircase = new StaircaseLight({
  color: '#ededed'
});
```
- Turn on the lights: `staircase.start();`

You can change the work mode with: `staircase.workMode = 'on';` and the animation with: `staircase.animationMode = 'endToMiddle';`
The avalable options can be found in [options](./src/models/staircase.js) file.

## License

Attribution-NonCommercial-NoDerivatives 4.0 International - [![Attribution-NonCommercial-NoDerivatives 4.0 International](https://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png)](./LICENSE.md)
