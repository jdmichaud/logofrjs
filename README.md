# What is it ?

Logofrgs is a front-end you can use to write simple logo program in french for the [mirobot](http://mirobot.io/).
You can either use it in the browser or directly in the command line.

# Installation

Pre-requisites: node and npm shall be installed.

Clone the repository:
```git clone https://github.com/jdmichaud/logofrjs
```

Download the necessary modules and components
```
npm install grunt-cli -g
npm install bower -g
npm install
bower install
```

Logofrjs uses PEGjs as a compiler compiler. PEGjs has recently fixed a bug ([475215a](https://github.com/pegjs/pegjs/commit/475215aa523d9fcc0c62b1eda8a4f25155d0b086)) which is not yet released in the PEGjs bower component. So before using logofrjs, you must do this:
```
cp patch/peg-0.9.0.js bower_components/pegjs/
```

# In the browser

Then launch the web server powered by grunt-connect:
```
grunt serve
```

You can then open `http://localhost:9042` in your browser.

# In the command line

To execute a program called prg.logo, just do the following (assuming 192.168.1.2 is the mirobot's address):

```
node app/js/main.js prg.logo 192.168.1.2
```

