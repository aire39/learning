#ifndef M_HEAP_H
#define M_HEAP_H

template <class Container>
class m_heap
{
	public:
		typedef typename Container::iterator iterator;

	protected:
		typedef typename Container::value_type value_type;
		Container c;

		void make_heap(iterator start, iterator end);
		void adjust_heap(unsigned int size, unsigned int position);
		void push_heap(iterator start, iterator end);

		void swap(value_type  &a, value_type &b);

	public:

		m_heap() {}

		m_heap(const value_type * data, unsigned int size)
		{
			for(int i=0; i<size; i++)
				c.push_back(data[i]);
			make_heap(c.begin(), c.end());
		}

		iterator begin()
		{
			return c.begin();
		}

		iterator end()
		{
			return c.end();
		}

		value_type front()
		{
			return c.front();
		}

		value_type back()
		{
			return c.back();
		}

		unsigned int count()
		{
			return c.count();
		}

		void push(value_type value);
		void remove(iterator it);

		value_type & operator[](unsigned int p)
		{
			return c[p];
		}

};


template <class Container>
void m_heap<Container>::make_heap(iterator start, iterator end)
{
	unsigned int heap_size = (end - start) - 1;
	unsigned int center = (heap_size-1)/2;

	for(int i=center; i>=0; i--)
		adjust_heap(heap_size, i);
}

template <class Container>
void m_heap<Container>::adjust_heap(unsigned int size, unsigned int position)
{
	unsigned int child = 0;

	while(position < count())
	{
		child  = 2*position+1;
		if(child < count())
		{
			if((child+1) < count() && c[child] < c[child+1])
				child++;

			if(c[position] > c[child])
				return;
			else
				swap(c[position], c[child]);
		}

		position = child;
	}
}

template <class Container>
void m_heap<Container>::push_heap(iterator start, iterator end)
{
	unsigned int position = (end - start) - 1;
	unsigned int parent = (position-1)/2;

	while( position > 0 && c[position] > c[parent] )
	{
		swap(c[position], c[parent]);
		position = parent;
		parent = (position/2) - 1;
	}
}

template <class Container>
void m_heap<Container>::swap(value_type &a, value_type &b)
{
	value_type t = a;
	a = b;
	b = t;
}

template <class Container>
void m_heap<Container>::push(value_type value)
{
	c.push_back(value);
	push_heap(c.begin(), c.end());
}

template <class Container>
void m_heap<Container>::remove(iterator start)
{
	unsigned int position = start - begin();

	swap(c[position], c[c.count()-1]);
	c.pop_back();

	adjust_heap(c.count(), position);
}

#endif