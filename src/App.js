import './App.css';
import { useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList/ProductList';
import Form from './components/Form/Form';
import Header from './components/Header/Header';

function App() {
	const { tg } = useTelegram();

	useEffect(() => {
		tg.ready();
	}, [tg]);

	return (
		<div className="App">
			<Header/>
			<Routes>
				<Route index element={<ProductList/>} />
				<Route path={'form'} element={<Form />} />
			</Routes>
		</div>
	);
}

export default App;
