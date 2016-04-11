#include "m_vector.h"
#include "m_heap.h"
#include <iostream>
#include <iomanip>

void printArr(m_vector<int> & v);
void printArr(const m_vector<int>::iterator & start, const m_vector<int>::iterator & end);

int main(int argc, char const *argv[])
{
	
	m_vector<int> v;
	v.push_back(15);
	v.push_back(25);
	v.push_back(35);
	v.push_back(45);

	printArr(v);

	v.pop_back();
	v.pop_back();

	printArr(v);

	m_vector<int>::iterator it = v.begin();

	++it;
	v.insert(it, 5);

	printArr(v.begin(), v.end());

	v.push_back(25);
	v.push_back(35);

	printArr(v.begin(), v.end());

	v.erase(v.begin()+2, v.begin()+4);

	printArr(v.begin(), v.end());

	v.erase(v.begin()+1);

	printArr(v.begin(), v.end());

	std::cout << std::endl;

	m_heap< m_vector<int> > heap;

	heap.push(16);
	heap.push(14);
	heap.push(9);

	heap.push(10);
	heap.push(12);
	heap.push(7);
	heap.push(8);

	heap.push(5);
	heap.push(2);
	heap.push(11);
	heap.push(3);

	printArr(heap.begin(), heap.end());

	m_heap< m_vector<int> >::iterator h_iter = heap.begin();
	++h_iter;

	std::cout << (*h_iter) << std::endl;
	heap.remove(h_iter);
	heap.remove(heap.begin());

	printArr(heap.begin(), heap.end());

	return 0;
}

void printArr(m_vector<int> & v)
{
	for(int i=0; i<v.count(); i++)
		std::cout << v[i] << " ";
	std::cout << std::endl;
}

void printArr(const m_vector<int>::iterator & start, const m_vector<int>::iterator & end)
{
	m_vector<int>::iterator it = start;
	for(;it != end; ++it)
		std::cout << (*it) << " ";
	std::cout << std::endl;
}