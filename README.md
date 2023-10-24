# everage-earning

### How to setup project localy

1. Clone project
```git clone git@github.com:e-vasiltsov/everage-earning.git```

2. setup environemnt variable

      2.1. Copy env.example
      ```cp earnings-exchanger/env.example earnings-exchanger/.env```

      2.2. Replace `ALPHAVANTAGE_API_KEY` in file `earnings-exchanger/.env`

3. sam build

4. Run localy
   ``` sam local invoke EarningsExchangerFunction --event events/event.json ```

5. install dependencies
```cd earnings-exchanger```
```npm install```

6. Run tests
```npm run test```
