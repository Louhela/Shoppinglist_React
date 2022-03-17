import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios'

const URL = 'http://localhost/shoppinglist/';

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('')

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error)
      });
  }, [])

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:item,amount:amount});
    axios.post(URL + 'add.php',json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      setItems(items => [...items,response.data]);
      setAmount(response.data.amount);
      setItem('');
      setAmount('');
    }).catch(error => {
      alert(error.response ? error.response.data.error : error)
    })
  }

  function remove(id){
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php', json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      const newListwitouthRemoved = items.filter((item) => item.id !== id);
      setItems(newListwitouthRemoved);
    }).catch(error => {
      alert(error.respnse ? error.response.data.error : error)
    })
  }

  return (
    <div className='container'>
      <h3>Shopping list</h3>
        <form onSubmit={save}>
          <label>New item</label>
          <input value={item} onChange={e => setItem(e.target.value)} placeholder='type description'/>
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='type amount'/>
          <button>Add</button>
        </form>
      <ul>
        {items?.map(item => (
          <li key={item.id}>
            {item.description} {item.amount}
            <a href='#' className='delete' onClick={() => remove(item.id)}>&nbsp;Delete</a>
            </li>
        ))}
      </ul>
    </div>
  );
}

export default App;