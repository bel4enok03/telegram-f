import React, { useState } from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
import { useCallback, useEffect } from 'react';

const products = [
	{ id: '1', title: 'Смартфон realme C33 3/32 ГБ, черный', price: 5390, description: 'Смартфон, кабель microUSB, адаптер питания 10W, ключ для лота SIM, инструкция, буклет с информацией и гарантийным сертификатом', img:'https://ir.ozone.ru/s3/multimedia-h/wc700/6510286337.jpg' },
	{ id: '2', title: 'Ritter Sport Лесной орех шоколад молочный с обжаренным орехом лещины, 100 г', price: 128, description: 'Дробленных орех в молочном шоколаде.', img:'https://ir.ozone.ru/s3/multimedia-q/wc700/6622453562.jpg'  },
	{ id: '3', title: 'TRESemmé шампунь beauty-full volume плотность и объем, с коллагеном, бережное очищение без силиконов 400 мл', price: 277, description: 'Головокружительный объем от самых корней? Попробуй и убедись сама.', img:'https://ir.ozone.ru/s3/multimedia-h/wc700/6539382473.jpg' },
	{ id: '4', title: 'Сухой корм для кошек Pro Plan Sterilised для поддержания здоровья почек после стерилизации, с лососем, 1,5 кг', price: 1393, description: 'лосось высокого качества (включая головы, кости, филе) (20%) , сухой белок птицы, рис, кукуруза, соевый протеиновый порошок, пшеничный глютен, пшеничная крупка, белок гороха, яичный порошок, минеральные вещества, животные жиры, высушенная мякоть свеклы, аминокислоты, гидролизат белка животного происхождения, дрожжи, консерванты, витамины, рыбий жир, антиоксиданты.', img:'https://ir.ozone.ru/s3/multimedia-t/wc700/6286696973.jpg' },
	{ id: '5', title: 'Джинсы 3', price: 5000, description: 'Синего цвета, прямые' },
	{ id: '6', title: 'Куртка 7', price: 600, description: 'Зеленого цвета, теплая' },
	{ id: '7', title: 'Джинсы 4', price: 5500, description: 'Синего цвета, прямые' },
	{ id: '8', title: 'Куртка 5', price: 12000, description: 'Зеленого цвета, теплая' },
];

const getTotalPrice = (items = []) => {
	return items.reduce((acc, item) => {
		return (acc += item.price);
	}, 0);
};

const ProductList = () => {
	const [addedItems, setAddedItems] = useState([]);
	const { tg, queryId } = useTelegram();

	const onSendData = useCallback(() => {
		const data = {
			products: addedItems,
			totalPrice: getTotalPrice(addedItems),
			queryId,
		};
		fetch('https://telegram-b.onrender.com/web-data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
	}, [addedItems]);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData);
		return () => {
			tg.offEvent('mainButtonClicked', onSendData);
		};
	}, [onSendData]);

	const onAdd = (product) => {
		const alreadyAdded = addedItems.find((item) => item.id === product.id);
		let newItems = [];

		if (alreadyAdded) {
			newItems = addedItems.filter((item) => item.id !== product.id);
		} else {
			newItems = [...addedItems, product];
		}

		setAddedItems(newItems);

		if (newItems.length === 0) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: `Купить ${getTotalPrice(newItems)}`,
			});
		}
	};

	return (
		<div className={'list'}>
			{products.map((item) => (
				<ProductItem key={item.id} product={item} onAdd={onAdd} className={'item'} />
			))}
		</div>
	);
};

export default ProductList;
