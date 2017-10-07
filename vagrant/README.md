# node-shack dev server

Vagrant is a system that lets you easily configure and share virtual machine
setups. This repo contains a configuration that will run the database and redis.

## Getting started
Install vagrant, virtualbox, git

 - [Vagrant](https://www.vagrantup.com/downloads.html)
 - [Virtualbox](https://www.virtualbox.org/wiki/Downloads)
 - [Git](https://git-scm.com/downloads)

Make sure the vagrant and node-shack repos are checked out side-by side. The
latter *must* be in a directory called `shack`. It doesn't matter what this one is
called.

CD into the directory this readme file is in and run this command to start
the virtual machine:

```
vagrant up
```

If you need to stop the server, run `vagrant halt`. If you need do destroy and
reinstall it all, run `vagrant destroy` followed by `vagrant up`. To log in to
the machine via ssh, run `vagrant ssh`.

## Test data
The user in the test database has the following credentials:

| **Email**    | `test@example.com` | `test2@example.com`
| **password** | `test`             | `test`



vagrant-redis
=============

Simple vagrant script for creating a development environment for redis development.

Checks out the source code to /vagrant.

Uses the ubuntu/trusty64 box (which you may already have)

Watch it in [action](https://www.youtube.com/watch?v=1pkikXchQfo) on YouTube

To use
------

vagrant up

vagrant halt

vagrant up --no-provision


Thanks
------

Thanks to JasonPunyon, Jeese at JREAM, [gulyasm](https://github.com/gulyasm)
