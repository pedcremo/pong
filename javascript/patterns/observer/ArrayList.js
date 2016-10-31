//http://www.codeproject.com/Articles/13914/Observer-Design-Pattern-Using-JavaScript
"use strict";

function ArrayList()
{
   this.aList = []; //initialize with an empty array
}

ArrayList.prototype.Count = function()
{
   return this.aList.length;
};

ArrayList.prototype.Add = function( object )
{
   //Object are placed at the end of the array
   return this.aList.push( object );
};

ArrayList.prototype.GetAt = function( index ) //Index must be a number
{
   if( index > -1 && index < this.aList.length )
      return this.aList[index];
   else
      return undefined; //Out of bound array, return undefined
};

ArrayList.prototype.Clear = function()
{
   this.aList = [];
};

ArrayList.prototype.RemoveAt = function ( index ) // index must be a number
{
   var m_count = this.aList.length;

   if ( m_count > 0 && index > -1 && index < this.aList.length )
   {
      switch( index )
      {
         case 0:
            this.aList.shift();
            break;
         case m_count - 1:
            this.aList.pop();
            break;
         default:
            var head   = this.aList.slice( 0, index );
            var tail   = this.aList.slice( index + 1 );
            this.aList = head.concat( tail );
            break;
      }
   }
};

ArrayList.prototype.Insert = function ( object, index )
{
   var m_count       = this.aList.length;
   var m_returnValue = -1;

   if ( index > -1 && index <= m_count )
   {
      switch(index)
      {
         case 0:
            this.aList.unshift(object);
            m_returnValue = 0;
            break;
         case m_count:
            this.aList.push(object);
            m_returnValue = m_count;
            break;
         default:
            var head      = this.aList.slice(0, index - 1);
            var tail      = this.aList.slice(index);
            this.aList    = this.aList.concat(tail.unshift(object));
            m_returnValue = index;
            break;
      }
   }

   return m_returnValue;
};

ArrayList.prototype.IndexOf = function( object, startIndex )
{
   var m_count       = this.aList.length;
   var m_returnValue = - 1;

   if ( startIndex > -1 && startIndex < m_count )
   {
      var i = startIndex;

      while( i < m_count )
      {
         if ( this.aList[i] == object )
         {
            m_returnValue = i;
            break;
         }

         i++;
      }
   }

   return m_returnValue;
};


ArrayList.prototype.LastIndexOf = function( object, startIndex )
{
   var m_count       = this.aList.length;
   var m_returnValue = - 1;

   if ( startIndex > -1 && startIndex < m_count )
   {
      var i = m_count - 1;

      while( i >= startIndex )
      {
         if ( this.aList[i] == object )
         {
            m_returnValue = i;
            break;
         }

         i--;
      }
   }

   return m_returnValue;
};

module.exports = ArrayList;
