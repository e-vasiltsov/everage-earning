# everage-earning

### How to setup project localy

1. Clone project ```git clone git@github.com:e-vasiltsov/everage-earning.git```

2. setup environemnt variable `ALPHAVANTAGE_API_KEY`
```cp earnings-exchanger/env.example earnings-exchanger/.env```

3. sam build

4. Run localy
   ``` sam local invoke EarningsExchangerFunction --event events/event.json ```

5. Run tests
```cd earnings-exchanger && npm run test```
