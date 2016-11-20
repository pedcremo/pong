//http://www.codeproject.com/Articles/13914/Observer-Design-Pattern-Using-JavaScript
"use strict";
/*jslint node:true */

/**
 * Subject module.
 * @module Subject
 * @see module:Subject
 */

var arraylist = require('./ArrayList');

function Subject()
{
   this.observers = new arraylist();
}

// Context represents an object instance (Ball in our case)
Subject.prototype.Notify = function( context )
{
   var m_count = this.observers.Count();

   for( var i = 0; i < m_count; i++ )
      this.observers.GetAt(i).Update( context );
};

/*Subject.prototype.getCountRajoles = function(  )
{
   var m_count = this.observers.Count();
   var cont=0;
   for( var i = 0; i < m_count; i++ ){
      if (this.observers.GetAt(i) instanceof Rajola) cont++;
   		//alert(this.observers.GetAt(i).getClass());
   }
   return cont;
};*/

Subject.prototype.AddObserver = function( observer )
{
   if( !observer.Update )
      throw 'Wrong parameter';

   this.observers.Add( observer );
};

Subject.prototype.RemoveObserver = function( observer )
{
   if( !observer.Update )
      throw 'Wrong parameter';

   this.observers.RemoveAt(this.observers.IndexOf( observer, 0 ));
};

module.exports = Subject;
