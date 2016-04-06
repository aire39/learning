#ifndef M_QUEUE_H
#define M_QUEUE_H

// Normal Queue

template <class T>
class m_queue
{
	private:
		T * data;
		unsigned int adjusted_size;
		unsigned int size;
		unsigned int pos;

	public:
		m_queue()
		{
			adjusted_size = 10;
			size = 0;
			pos  = 0;
			data = nullptr;
		}

		~m_queue()
		{
			delete [] data;
		}

		void push(T value);
		bool pop();

		T top();

		unsigned int count()
		{
			return size;
		}

};

template <class T>
void m_queue<T>::push(T value)
{
	if(size == 0)
	{
		if(data == nullptr)
		{
			data = new T[adjusted_size];
			data[pos] = value;
		}
		else
			data[pos] = value;

		size++;
	}
	else
	{
		pos++;
		size++;

		if(size > adjusted_size)
		{
			adjusted_size *= 2;
			auto * tmp = new T[adjusted_size];

			for(unsigned int i=0; i<size; i++)
				tmp[i] = data[i];

			delete [] data;
			data = tmp;
		}

		data[pos] = value;
	}

}

template <class T>
bool m_queue<T>::pop()
{
	if(size > 0)
	{
		size--;
		pos--;
		return true;
	}

	return false;
}

template <class T>
T m_queue<T>::top()
{
	if(size > 0)
		return data[pos];

	return 0;
}


// Queue ring

template <class T>
class m_queue_ring
{
	private:
		T * data;
		unsigned int adjusted_size;
		unsigned int size;
		unsigned int pos;
		unsigned int first;

	public:
		m_queue_ring(unsigned int n)
		{
			adjusted_size = n;
			first = 0;
			size  = 0;
			pos   = 0;
			data  = nullptr;
		}

		~m_queue_ring()
		{
			delete [] data;
		}

		bool push(T value);
		T pop();
		T top();

		unsigned int count()
		{
			return size;
		}

};

template <class T>
bool m_queue_ring<T>::push(T value)
{
	if(size == 0)
	{
		if(data == nullptr)
		{
			data = new T[adjusted_size];
			data[pos] = value;
		}
		else
			data[pos] = value;

		size++;

		return true;
	}
	else if(size < adjusted_size)
	{
			pos++;
			size++;

			if(pos >= adjusted_size)
				pos = 0;

			data[pos] = value;

			return true;
	}

	return false;
}

template <class T>
T m_queue_ring<T>::pop()
{
	T value = data[first];

	if(size > 0)
	{
		data[first] = 0;

		first++;
		if(first >= adjusted_size)
			first = 0;

		size--;

		return value;
	}

	return 0;
}

template <class T>
T m_queue_ring<T>::top()
{
	return data[pos];
}

#endif