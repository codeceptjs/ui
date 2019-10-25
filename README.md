# CodeceptUI

An interactive, graphical test runner for CodeceptJS. 

![codepress video](./codepress.gif)

## Quickstart

Install CodeceptUI in a project where CodeceptJS is already used

```
npm i @codecept-js/ui#master --save
```

Execute it:

```
npx codepress
```

## Development Mode

See [CONTRIBUTING.md](https://github.com/codecept-js/ui/blob/master/.github/CONTRIBUTING.md)


## Start CodeceptUI with debug output

codepress uses the debug package to output debug information. This is useful to troubleshoot problems or just to see what codepress is doing. To turn on debug information do

```
  # verbose: get all debug information
  DEBUG=codepress:* npx codepress 

  # just get debug output of one module
  DEBUG=codepress:codeceptjs-factory npx codepress
```

# Credits

- Originally created by Stefan Huber @hubidu27
- Maintained my @davertmik
- Icons/Logos <a href="https://iconscout.com/icon/code-280" target="_blank">Code Icon</a> by <a href="https://iconscout.com/contributors/elegant-themes">Elegant Themes</a> on <a href="https://iconscout.com">Iconscout</a>