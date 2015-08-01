RoboPaint!
=============

Software for drawing robots, and your
[friendly painting robot kit, the WaterColorBot](http://watercolorbot.com)!

## Downloads / Install
[Click here](https://github.com/evil-mad/robopaint/releases/latest) for the
latest release, then click the green button below the release notes that matches
your operating system to download the install package.

*Linux users: Simply copy folder from zip file to your desktop or other folder,
then run the executable inside.
[System installer in the works](https://github.com/evil-mad/robopaint/issues/73)!*


## Features
 * Real-time SVG preview and shape tracing, with fully automatic path filling,
color similarity chooser, and outline manager. Load your SVG and just click to
paint automatically!
 * Single path based tracing for fills, allowing for an infinite array of
creative path based crosshatches.
 * Built-in SVG editor and importer from the open-source project
[Method-Draw](https://github.com/duopixel/Method-Draw)
 * Optional visual path position checking, ensuring that overlapping or
invisible portions of paths aren't drawn.
 * Centralized codebase for all platforms allows for easy hacking.
 * [Scratch](http://scratch.mit.edu/) and [Snap](http://snap.berkeley.edu)
support via [WaterColorBlocks](https://github.com/evil-mad/WaterColorBlocks).
 * Modular code addition via
[RoboPaint Modes](https://github.com/evil-mad/robopaint/blob/master/resources/modes/README.md):
Control your bot with a simple web app leveraging everything already written for
RoboPaint!


## Problems?
***Stuck on something?*** Submit an issue! Click the
[issues tab](https://github.com/evil-mad/robopaint/issues) and see if someone
is covering your question or problem, if not, ask away! Someone will be around
to help soon.

***Know how to fix a problem? Or want to add a new feature??*** Submit a pull
request! Just fork the repo using the button on the
[RoboPaint github homepage](https://github.com/evil-mad/robopaint), and
this will give you your own version of RoboPaint. Make your change in a few
commits to your branch, then click the pull request button at the top! Talk
about what changes you made and submit. A maintainer of the project will check
your work, possibly ask you to fix a few more things, and then if all is well,
your work will be merged into the project!

## Contributing to the Project
Want to help be a part of RoboPaint? Maybe spruce it up, or hack it to bits into
your own thing? Here's a rough and tumble guide to getting set up:

### Pre-requisites
#### Electron (v0.30.x)
RoboPaint is an HTML5/Node.js application that runs in
[electron](https://electron.atom.io/). Though the main.html
code may somewhat render in a regular browser window, it's still a node.js
application that requires its low level file access and other APIs.

#### Install Io.js (2.4.x+) for node & npm
Required for automated builds and installation content. Electron uses Node.js'
little brother fork, io.js. See [iojs.org](http://iojs.org) for installation for
your operating system. `npm` is installed along with it. If you already have
node installed, you can probably go without switching to io.js as electron
provides its own io.js implementation built in.

#### Install Electron
After node/io.js is installed, just run from your terminal/console
`npm install -g electron-prebuilt` to install Electron on your path. When
complete, just run `electron -v` to see the installed app version.

#### Build Tools!
* CNC Server uses the node-serialport module, a low-level partially native
module that needs to be built/compiled for every OS.
* These are pre-compiled for each release in
the [robopaint-build](https://github.com/evil-mad/robopaint-build/) repository,
which you can easily use to replace the node_modules folder within
`cncserver/node_modules/serialport/
* *BUT*, if you're experimenting with new versions of modules, you're going to
need to be able to build your own, so continue on.

##### Windows
* You'll need the free download version of
[Visual Studio Express 2013](http://www.microsoft.com/visualstudio/eng/2013-downloads#d-2013-express)
which will have the command line tools required for builds.

##### OSX
* Install Xcode and the CLI Developer tools.
* You _might_ be able to [skip installing Xcode to get the GCC tools alone](http://osxdaily.com/2012/07/06/install-gcc-without-xcode-in-mac-os-x/).

##### Linux
* This is the easiest, as most [FOSS](http://en.wikipedia.org/wiki/FOSS) ships
as source to be built on the target machines, so you shouldn't have to install
anything new for this at all.

#### Building natively for Electron with `node-pre-gyp`
 0. Run `npm install node-gyp node-pre-gyp -g` to install globally the node
native builder. (ignore this if you already have them)
 1. Pull down/clone your fork of the RoboPaint repository with git (or just
download a zip of the files).
 2. In your terminal/command line interface, go to that folder and run
`npm install`
   * This will run through all the required module dependencies and install/build
them to the best of its ability.
   * This will have built the node-serialport for io.js, but we actually need
the binary created with electron headers, soo..
   * Follow [Jed's instructions here](https://gist.github.com/jedthehumanoid/a7f8278e0a37d259adca)
to build the binary correctly.
4. That's it! You should now be installed and ready to hack. To update CNC server
just run `npm install cncserver` from the project root and it should pull from
the latest master.

### Running RoboPaint from source
* Once Electron prebuilt is installed, just run `electron path/to/robopaint`,
or `electron ./` if you're working directory is the root of the repo.
* Remember: Alt+Ctrl+I to open the debug console, Ctl+R will reload if the
console is open, and a reload only reloads the contents of the window, and will
_**not**_ reload the application main process.

## ETC.

This open source project is built on top of the
[CNC server project](http://github.com/techninja/cncserver) which provides
a speedy framework of API calls to interact with serial connected drawing
robots, while RoboPaint is the clean interface in an easy to install app!

All code MIT licensed. Created by [TechNinja](https://github.com/techninja),
with support and collaboration from
[Evil Mad Scientist](http://evilmadscientist.com). Don't forget, you can
discover more crazy maker fun with
[Sylvia's Super-Awesome Maker Show](http://sylviashow.com)!
