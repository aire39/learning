#include <iostream>
#include "m_queue.h"

int main(int argc, char const *argv[])
{
	bool valid_pop = false;
	m_queue<int> q0;
	q0.push(20);

	std::cout << q0.top() << std::endl;

	q0.push(45);

	std::cout << q0.top() << std::endl;

	q0.push(64);

	std::cout << q0.top() << std::endl;

	valid_pop = q0.pop();

	std::cout << q0.top() << " " << valid_pop << std::endl;

	valid_pop = q0.pop();

	std::cout << q0.top() << " " << valid_pop << std::endl;

	valid_pop = q0.pop();

	std::cout << q0.top() << " " << valid_pop << std::endl;

	valid_pop = q0.pop();

	std::cout << q0.top() << " " << valid_pop << std::endl;


	std::cout << std::endl;
	m_queue_ring<int> cq(3);
	int value = 0;

	cq.push(12);
	std::cout << cq.top() << std::endl;

	cq.push(15);
	std::cout << cq.top() << std::endl;

	cq.push(21);
	std::cout << cq.top() << std::endl;

	cq.push(68);
	std::cout << cq.top() << std::endl;

	std::cout << std::endl;

	value = cq.pop();
	std::cout << value << std::endl;

	return 0;
}