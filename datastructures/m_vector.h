#ifndef M_VECTOR_H
#define M_VECTOR_H

#include <cstring>

template <class T>
class v_iterator
{
	private:
		T * v;

	public:

		v_iterator(T * s)
		{
			v = s;
		}

		v_iterator(const v_iterator & source)
		{
			v = source.v;
		}

		v_iterator & operator++()
		{
			v++;
			return *this;
		}

		v_iterator operator++(int p)
		{
			v_iterator t_iter(*this);
			operator++();
			return t_iter;
		}

		v_iterator operator+(int p)
		{
			v_iterator<T> it(v+p);
			return it;
		}

		v_iterator & operator--()
		{
			v--;
			return *this;
		}

		v_iterator operator--(int p)
		{
			v_iterator t_iter(*this);
			operator--();
			return t_iter;
		}

		v_iterator operator-(int p)
		{
			v_iterator<T> it(v-p);
			return it;
		}

		unsigned int operator-(v_iterator<T> p)
		{
			return (v-p.v);
		}

		bool operator==(const v_iterator<T> & source)
		{
			return (v == source.v);
		}

		bool operator!=(const v_iterator<T> & source)
		{
			return (v != source.v);	
		}

		T & operator*()
		{
			return *v;
		}

		v_iterator operator=(const v_iterator<T> & source)
		{
			v = source.v;
			return *this;
		}

};

template <class T>
class m_vector
{
	private:
		T * data;
		unsigned int size;
		unsigned int c_size; // capacity

	public:
		m_vector()
		{
			size = 0;
			data = nullptr;
		}
		m_vector(unsigned int init_size)
		{
			size   = 0;
			c_size = init_size;
			data = new T[init_size];
		}
		m_vector(unsigned int init_size, T init_value)
		{
			size = 0;
			c_size = init_size;
			data = new T[init_size](init_value);
		}
		m_vector(const m_vector & source)
		{
			if(source.size > 0)
			{
				size = source.size;
				c_size = source.c_size;
				data = new T[c_size];
				std::memcpy(data, source.data, sizeof(T)*size);
			}
		}
		~m_vector()
		{
			if(data != nullptr)
				delete [] data;
		}

		T front()
		{
			return data[0];
		}

		T back()
		{
			return data[size-1];
		}

		v_iterator<T> begin()
		{
			return v_iterator<T>(data);
		}

		v_iterator<T> end()
		{
			return v_iterator<T>(data+size);
		}

		void push_back(const T &value);
		void insert(v_iterator<T> iter, T value);

		void pop_back();
		void erase(v_iterator<T> iter);
		void erase(v_iterator<T> start, v_iterator<T> end);

		void reserve(unsigned int init_size);
		void resize(unsigned int init_size);

		unsigned int count()
		{
			return size;
		}

		T empty()
		{
			return (size == 0);
		}

		T & operator[](unsigned int index)
		{
			return data[index];
		}

		m_vector & operator=(m_vector &source)
		{
			if(source.size > 0)
			{
				size = source.size;
				c_size = source.c_size;
				data = new T[c_size];
				std::memcpy(data, source.data, sizeof(T)*size);
			}

			return this;
		}

		typedef v_iterator<T> iterator;
		typedef T value_type;

};

template <class T>
void m_vector<T>::push_back(const T &value)
{
	if(data == nullptr)
	{	c_size = 10;
		data = new T[c_size];
		data[size] = value;
		size++;
	}
	else
	{
		data[size] = value;
		size++;
	}


	if(size == c_size)
	{
		c_size *= c_size; // exponential growth
		T * n_data = new T[c_size];
		std::memcpy(n_data, data, sizeof(T)*size);
		delete [] data;
		data = n_data;
	}
}

template <class T>
void m_vector<T>::insert(v_iterator<T> iter, T value)
{
	if(iter == end())
	{
		push_back(value);
		return;
	}

	resize(size+1);	

	iterator it_last_l(data+size-1);
	iterator it_last = it_last_l--;

	do
	{
		(*it_last) = (*it_last_l);
		it_last--;
		it_last_l--;
	}while(it_last != iter);

	(*iter) = value;

}

template <class T>
void m_vector<T>::pop_back()
{
	if(size > 0)
		size--;
}

template <class T>
void m_vector<T>::erase(v_iterator<T> iter)
{
	iterator it_next = iter+1;

	while(iter != end())
	{
		(*iter) = (*it_next);
		iter++;
		it_next++;
	}
	size--;
}

template <class T>
void m_vector<T>::erase(v_iterator<T> start, v_iterator<T> end)
{
	iterator it = end;
	while(end != start)
	{
		it--;
		erase(it);
		end = it;
	}
}

template <class T>
void m_vector<T>::reserve(unsigned int init_size)
{
	if(init_size > c_size)
	{
		c_size = init_size;
		T * n_data = new T[init_size];
		std::memcpy(n_data, data, sizeof(T)*size);
		delete [] data;
		data = n_data;
	}
	else
	{
		c_size = init_size;
	}
}

template <class T>
void m_vector<T>::resize(unsigned int init_size)
{
	if(init_size > c_size)
	{
		c_size = init_size;
		T * n_data = new T[init_size];
		std::memcpy(n_data, data, sizeof(T)*size);
		delete [] data;
		data = n_data;
		size = init_size;
	}
	else
	{
		size = init_size;
	}
}

#endif