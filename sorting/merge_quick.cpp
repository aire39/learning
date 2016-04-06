#include <iostream>
#include <fstream>


void inplacemerge(int list[], const int low, const int center, const int high);
void mergesort(int list[], int low, int high);

int partition(int list[], int left, int right);
void quicksort(int list[], int left, int right);


int main(int argc, char const *argv[]) {
  
  const int list_size = 10;

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

  std::cout << "sort type:\n0: quicksort\n1:mergsort" << std::endl;
  std::cin >> sort_type;

  std::cout << "\nSorting..." << std::endl;

  if(sort_type == false)
    quicksort(number_list, 0, list_size-1);
  else
    mergesort(number_list, 0, list_size-1);

  std::cout << "Done!" << std::endl;

  std::cout << "\nSorted numbers:" << std::endl;
  for (size_t i = 0; i < list_size; i++) {
    /* code */
    std::cout << number_list[i] << " ";
  }
  std::cout << std::endl;

  return 0;
}


void inplacemerge(int list[], const int low, const int center, const int high)
{

  int a=low, b=center+1, c=low;
  int t_arr[10] = {0};

  while( (a <= center) && (b <= high))
  {
    if(list[a] < list[b])
    {
      t_arr[c] = list[a];
      a++;
    }
    else
    {
      t_arr[c] = list[b];
      b++;
    }
    c++;
  }

  while(a <= center)
  {
    t_arr[c] = list[a];
    a++;
    c++;
  }

  while(b <= high)
  {
    t_arr[c] = list[b];
    b++;
    c++;
  }

  for(int i=low; i<c; i++)
    list[i] = t_arr[i];

}

void mergesort(int list[], int low, int high)
{
  if(low+1 < high)
  {
    int center = (low+high) / 2;
    mergesort(list, low, center);
    mergesort(list, center+1, high);
    inplacemerge(list, low, center, high);
  }
}

int partition(int list[], int left, int right)
{
  int x = list[left];
  int i = left-1;
  int j = right+1;
  int temp = 0;

  while(i<j)
  {

    do
    {
      j--;
    }
    while(x < list[j]);

    do
    {
      i++;
    }
    while(x > list[i]);

    if(i<j)
    {
      temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }


  }

  return j;
}

void quicksort(int list[], int left, int right)
{
  int middle = 0;
  if(left < right)
  {
    middle = partition(list, left, right);
    quicksort(list, left, middle);
    quicksort(list, middle+1, right);
  }
}