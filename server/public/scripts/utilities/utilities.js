// takes in an array and reduces the nesting level by one
// begin unNestArray()
function unNestArray(array) {
  let unNestedArray = [];
  for (var i = 0; i < array.length; i++) {
    array[i].forEach(item => unNestedArray.push(item));
  }
  return unNestedArray;
} // end unNestArray()

// removes duplicates from an array of objects based on the property passed in
// begin removeDups()
function removeDups(arr, prop) {
    return arr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
} // end removeDups()

// takes in two arrays, a master array, and an array with no duplicate objects
// and sorts like objects into their own array based on the property passed in
// begin sortByProp()
function sortByProp(originalArray, noDuplicates, property) {
  let sortedArray = [];
  for (let i = 0; i < noDuplicates.length; i++) {
    sortedArray.push(originalArray.filter((item) => item[property] == noDuplicates[i][property]));
  }
  return sortedArray;
} // end sortByProp()
