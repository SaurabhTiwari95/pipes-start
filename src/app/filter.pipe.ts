import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure:false,

})
export class FilterPipe implements PipeTransform {

  transform(value: any, filterString: string, propName: string): any {
    // propName is the shortHand naming convention for propertyName
    if(value.length === 0 || filterString === ''){
       return value;
    }
    // value here is the array from which we have to search it doesn't have to be a string
    // it can be any data we output in the end
    // if the value.length is zero then there is nothing to search and we will return the value
    // now we loop through all my value array and compare it with the filterString
    // and if it is equal with the filterString, then only we take a new array and 
    // push the result to this new array and return that new array just outside the comparison
    // now add pipe to the HTML file using pipe with the property(filter in this case) in the *ngFor loop and 
    // it will take two params there where the first param is the filteredStatus which holds the
    // the string which we want to filter and the second param is the propName 
    // which will be the string and this string will be the status because we want to filter the status property 
    // we should return and declare the new array which will be reurned after 
    // the filter,outside the scope of the *ngFor loop.


    const resultArray = [];
    for (const item of value){
      if(item[propName] === filterString){
        resultArray.push(item);
      }
      
    }
    return resultArray; 
  }

}
