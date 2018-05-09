# ECBA Messaging

### *2018 (c)*

**Introduction**

Messaging is the standard object that will be used for passing messages around.

**Design**

The initial thought here is to use strategy design pattern  This way we can dynamically
create message objects and change the message strategy in real time.  Where with the template
desing pattern you not have an object that can dynamically change.

An example would be as follows:

FacbookMessageStrategy is passed into the Message object as the stragy to be used to extract
messaging.  The message object goes to the Console component, but now the Console component
will then create it's ConsoleMessageStrategy that will now replace the FacebookMessageStategy.
The Messae object will again extract the messaging accordingly.

*Data Points*
* msgTxt - the text that is in the message that is used heavily here
* to - the id of who or where this is from (this will be used for authentication)
* from - the id of who or where this data is from (this will be used for authentication).
* timestamp - date and time (to milisencond) so we can track any messaging and sequences.

*old idea*
> The idea here is store the concrete message object from the particular source, but
> extract that data from the source to the core data items in the standard messaging.
>
> Thus, when the user passes their concrete message (say a facebook message), then the
> process will call a series of funciton to fully construct the message object.
> 
> Another thought, since we are dealing with this "object" is to just iterate throught
> the object and store all the items as we see fit and dynamically have these items
> exported...for now...I am going to just use the template patter to extract the core
> data points.

