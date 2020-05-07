import React, { useState } from 'react';
import { thermostat } from 'components/newclass';

const TestPage: React.FC = () => {
  const [tem, setTem] = useState<number>(thermostat.temperature);
  const change = (num: number) => {
    thermostat.temperature = num;
    setTem(thermostat.temperature);
    console.log(thermostat.temperature);
  };

  return (
    <div className="page">
      <div>{tem}</div>
      <button onClick={() => change(40)}>改变</button>
    </div>
  );
};

export { TestPage };
