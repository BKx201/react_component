class Thermostat {
  public fahrenheit: number;
  constructor(num: number) {
    this.fahrenheit = num;
  }
  get temperature() {
    let x = (5 / 9) * (this.fahrenheit - 32);
    return x;
  }
  set temperature(num) {
    this.fahrenheit = (5 / 9) * (num - 32);
  }
}

export const thermostat = new Thermostat(60);
