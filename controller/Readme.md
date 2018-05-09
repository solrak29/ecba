# ECBA Controller

### *2018 (c)*

**Introduction**
```
Controller class/module that will provide the controlls to manage
messaging and configuration for different users and aspects of using
the chat bot.

One case scenario is that we have Facebook to Watson interface which
will be the default.

Another case is where facebook will talk to the console applicaton.

To use, configuration will look for enviornment variables to be set:

SOURCE_GEN : initiator of the messaging event (generally facebook in this case).
DESTINATION_GEN : the AI part or console or sms

```


![High Level Design](https://raw.githubusercontent.com/solrak29/ecba/master/controller/NapkinScratchDesign.jpg)
