
/**
 * 冒泡
 * @param {*} arr Array
 */
function bubbleSort(arr) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    for (var j = i + 1; j < len; j++) {
      if (arr[i] < arr[j]) {
        var tmp = arr[j];
        arr[j] = arr[i];
        arr[i] = tmp;
      }
    }
  }
  return arr;
}

/**
 * 选择排序
 * @param {*} arr 
 */
function selectionSort(arr) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    var minIndex = i;
    for (var j = i + 1; j < len; j++) {
      if (arr[i] > arr[j]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      var item = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = item;
    }
  }

  return arr;
}