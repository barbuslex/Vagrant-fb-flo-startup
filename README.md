Vagrant-fb-flo-startup
======================

How to install fb-flo on startup in vagrant virtual machine

**Tested on Linux Debian (x64)**

- Step 1: Install your vagrant machine (recommanded with: https://puphpet.com/)
- Step 2: Launch your VM: ``vagrant up``
- Step 3: Launch vagrant ssh: ``vagrant ssh``
- Step 4: Install "forever" npm package in global mode: ``$ sudo npm install forever -g``
- Step 5: Install "initd-forever" npm package in global mode: ``$ sudo npm install initd-forever -g``
- Step 6: Go to you parent source folder (In my case, my sources folder is /var/www/local.dev/, the parent source folder is /var/www/): ``cd /var/www/``
- Step 7: Create new file with vim and put this content inside : ``sudo vim flo.js``
```javascript
var flo = require('fb-flo'),
    path = require('path'),
    fs = require('fs');

var server = flo(
  './',
  {
    port: 8888,
    host: 'local.dev', /* YOUR MACHINE NAME */
    verbose: false,
    glob: [
      '**/*.js',
      '**/*.css',
      '**/*.html'
    ],
    useFilePolling: true,
    pollingInterval: 500
  },
  function resolver(filepath, callback) {
    callback({
      resourceURL: filepath,
      reload: !filepath.match(/\.(css|js)$/),
      contents: fs.readFileSync(filepath),
      update: function(_window, _resourceURL) {
        console.log("Resource " + _resourceURL + " has just been updated with new content");
      }
    });
  }
);
```
- Step 8: Save file with this vim command : ``:wq``
- Step 9: Create init.d service script with initd-forever package: ``sudo initd-forever -a /var/www/flo.js -l /var/www/flo.log -n flo``
- Step 10: Edit flo script with vim: ``sudo vim flo``
- Step 11: Make it look like this :
```
#!/bin/bash
#
# initd a node app
# Based on a script posted by https://gist.github.com/jinze at https://gist.github.com/3748766
#

# Source function library.
. /lib/lsb/init-functions

pidFile=/var/run/flo.pid
logFile=/var/www/flo.log

nodeApp=flo.js

start() {
   echo "Starting $nodeApp"
   cd /var/www/
   sudo forever start --pidFile $pidFile -l $logFile -a -d $nodeApp
   RETVAL=$?
}

restart() {
	echo -n "Restarting $nodeApp"
	sudo forever restart $nodeApp
	RETVAL=$?
}

stop() {
   echo -n "Shutting down $nodeApp"
   sudo forever stop $nodeApp
   RETVAL=$?
}

status() {
   echo -n "Status $nodeApp"
   sudo forever list
   RETVAL=$?
}

case "$1" in
   start)
        start
        ;;
    stop)
        stop
        ;;
   status)
        status
       ;;
   restart)
   	restart
        ;;
	*)
       echo "Usage:  {start|stop|status|restart}"
       exit 1
        ;;
esac
exit $RETVAL
```
- Step 12: Move flo script in /etc/init.d/ folder: ``sudo mv flo /etc/init.d/flo``
- Step 13: Change flo chmod: ``sudo chmod 755 /etc/init.d/flo``
- Step 14: Put flo in startup with this command: ``sudo update-rc.d flo defaults``
- Step 15: Exit ssh: ``exit``
- Step 16: Restart your vagrant machine: ``vagrant reload``
- Step 17: Enjoy !
