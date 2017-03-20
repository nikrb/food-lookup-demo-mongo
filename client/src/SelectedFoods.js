import React from 'react';

export default function SelectedFoods(props) {
  const { foods } = props;

  const foodRows = foods.map((food, idx) => (
    <tr
      key={idx}
      onClick={() => props.onFoodClick(idx)}
    >
      <td>{food.Shrt_Desc}</td>
      <td className='right aligned'>{food.Energ_Kcal}</td>
      <td className='right aligned'>{food['Protein_(g)']}</td>
      <td className='right aligned'>{food['FA_Sat_(g)']}</td>
      <td className='right aligned'>{food['Carbohydrt_(g)']}</td>
    </tr>
  ));

  return (
    <table className='ui selectable structured large table'>
      <thead>
        <tr>
          <th colSpan='5'>
            <h3>Selected foods</h3>
          </th>
        </tr>
        <tr>
          <th className='eight wide'>Description</th>
          <th>Kcal</th>
          <th>Protein (g)</th>
          <th>Fat (g)</th>
          <th>Carbs (g)</th>
        </tr>
      </thead>
      <tbody>
        {foodRows}
      </tbody>
      <tfoot>
        <tr>
          <th>Total</th>
          <th
            className='right aligned'
            id='total-kcal'
          >
            {sum(foods, 'Energ_Kcal')}
          </th>
          <th
            className='right aligned'
            id='total-protein_g'
          >
            {sum(foods, 'Protein_(g)')}
          </th>
          <th
            className='right aligned'
            id='total-fat_g'
          >
            {sum(foods, 'FA_Sat_(g)')}
          </th>
          <th
            className='right aligned'
            id='total-carbohydrate_g'
          >
            {sum(foods, 'Carbohydrt_(g)')}
          </th>
        </tr>
      </tfoot>
    </table>
  );
}

function sum(foods, prop) {
  return foods.reduce((memo, food) => (
    parseInt(food[prop], 10) + memo
  ), 0.0).toFixed(2);
}
