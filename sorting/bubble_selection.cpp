#include <iostream>
#include <fstream>


void swap(int list[], int a, int b);
void bubblesort(int list[], int count);
void selectionsort(int list[], int count);


int main(int argc, char const *argv[]) {
  
  const int list_size = 14;

  int number_list[list_size];
  int k = 0;
  bool sort_type = false;

  std::cout << "Unsorted numbers:"  << std::endl;
  while (std::cin >> number_list[k] && k<list_size)
  {
    std::cout << number_list[k] << " ";
    k++;
  }
  std::cout << std::endl;

  std::cout << "sort type:\n0: bubblesort\n1:selectionsort" << std::endl;
  std::cin >> sort_type;

  std::cout << "\nSorting..." << std::endl;

  if(sort_type == false)
    bubblesort(number_list, list_size);
  else
    selectionsort(number_list, list_size);

  std::cout << "Done!" << std::endl;

  std::cout << "\nSorted numbers:" << std::endl;
  for (size_t i = 0; i < list_size; i++) {
    /* code */
    std::cout << number_list[i] << " ";
  }
  std::cout << std::endl;

  return 0;
}


void swap(int list[], int a, int b)
{
  int temp = list[a];
  list[a] = list[b];
  list[b] = temp;
}

void bubblesort(int list[], int count)
{
  for (size_t i = count-1; i > 0; i--) {
    /* code */
    for (size_t j = 0; j < i; j++) {
      /* code */
      if(list[j] > list[j+1])
        swap(list, j, j+1);
    }
  }
}

void selectionsort(int list[], int count)
{
  for (size_t top = count-1; top > 0; top--) {
    /* code */
    int largest = 0;
    for (size_t j = 1; j <= top; j++) {
      /* code */
      if(list[j] > list[largest])
        largest = j;
    }

    if(largest != top)
      swap(list, largest, top);
  }
}