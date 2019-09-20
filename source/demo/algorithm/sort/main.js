
var SortAlgorithm = {
  /**
   * 冒泡排序
   * @param {*} arr 
   */
  bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - i - 1; j++) {
        if (arr[i] > arr[j + 1]) {
          var tmp = arr[i];
          arr[i] = arr[j + 1];
          arr[j + 1] = tmp;
        }
      }
    }
    return arr;
  },

  selectSort(arr) {
    var len = arr.length;
    if (!len) {
      return arr;
    }

    for (var i = 0; i < len; i++) {
      var minIndex = i;
      for (var j = i; j < len; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      var tmp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = tmp;
    }
    return arr;
  },

  insertSort(arr) {
    var len = arr.length;
    for(var i = 1; i < len; i++) {
      var currentIndex = i;

      while (currentIndex >= 1 && arr[currentIndex] < arr[currentIndex - 1]) {
        var tmp = arr[currentIndex - 1];
        arr[currentIndex - 1] = arr[currentIndex];
        arr[currentIndex] = tmp;
        currentIndex--;
      }
    }

    return arr;
  },

  quickSort(arr) {
    if (arr.length <= 1) {
      return arr;
    }
    var pivot = arr.shift();
    var centerArray = [pivot];
    var left = [];
    var right = [];
    while (arr.length) {
      var currentElement = arr.shift();
      if (currentElement === pivot) {
        centerArray.push(currentElement);
      } else if (currentElement < pivot) {
        left.push(currentElement);
      } else {
        right.push(currentElement);
      }
    }
    var leftSorted = quickSort(left);
    var rightSorted = this.quickSort(right);

    return leftSorted.concat(centerArray, rightSorted);
  }
}