# ECBA Messaging

### *2018 (c)*

**Introduction**

Messaging is the standard object that will be used for passing messages around.

**Design**

The initial thought here is to use strategy design pattern  This way we can dynamically
create message objects and we can contain the message components to their moduels.  For
example, in the facebook module I will use a facebook message component, but that that
component will stay with my facebook module and not other component will rely or
care about this piece.  But to pass any details to other compponents then you pass
the this message module using the facebook message component as the stategy at which
we will extract data points.

Plus other operatoins maybe required for the concrete type...

I would use Template pattern here, but I'd rather not have a type coupleing to the
the components where I would be derriving from this module's class.

Thus, we are only passing around these Message objects and arbtrary objects which
allows our checks for the appropiate objects.  This is where polymorphasim is a
question in node for me right now - 4/2018

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

