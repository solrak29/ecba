# ECBA Console Feed

### *2018 (c)*

**Introduction**

Console is one of the destinations that can be send and receive chat messages.

If configured and/or instantiated as Bot
```
    createECBAConsoleBot
```
The module will wait to receive a message either remotely (not supported yet) or
locally (used as part of the controller configuration or coded to have it's callback
called on incoming messages.

```
    createECBAConsoleChat
```
The module will provide bi-direction communication either remotely (not supported yet) or
locally (used as part of the controller class or coded directly).

The user will also have the flexability to use the console side either remotely or
or locally.  Locally, they would have to login into the instance that the application
is running.  Remotely, they would use the client interface (or web) to be on the
which ever side of the conversation that they want to be.

**Testing**

In order to test the console as a single module, the two chat interfaces are used.
Everything is coded local.  The single test process will instantiate both version
to initiate and send communication between the two modules.  The test script shall
verifyt what is sent and received by both sides.

**Notes**

Implemnetd the use of readline functionality.  But in using the two states to test
against each other I found that you can't assign stdin to bot and you need some form
of pip mechanism.  This is where streams come into play.  It would seem that I should
just use streams outright and I may evovle to that but for now I will incorrporate 
the use of streams with the readline module.  These modules are part of node and
are great since we don't need to npm anything here.  

**High Level Design**

![High Level Design](https://raw.githubusercontent.com/solrak29/ecba/master/console/highlevelconsole.jpg)

