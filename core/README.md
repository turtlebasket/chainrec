# Core Smart Contracts for ChainRec

Rust/CosmWasm, deployable only on Secret Network due to privacy features.

## Development

### Setting things up

1. Make sure `yarn` and `cargo` (Rust 1.55.0)
2. Set up a [`localsecret`](https://docs.scrt.network/dev/LocalSecret.html#install-localsecret) container on a remote host:
```
sudo docker run -it --rm -p 26657:26657 -p 26656:26656 -p 1317:1317 --name secretdev ghcr.io/scrtlabs/localsecret:latest --net=host
sudo docker exec -it secretdev secretd tx bank send a secret1l0g5czqw7vjvd20ezlk4x7ndgyn0rx5aumr8gk 100000000000000000uscrt -y
sudo docker exec -it secretdev secretd tx bank send b secret1ddfphwwzqtkp8uhcsc53xdu24y9gks2kug45zv 100000000000000000uscrt -y
```
3. Copy `example.env` to `.env`, and specify the address of the dev chain.

### Commands

Clear the build cache (strongly recommended between builds), then compile contracts to wasm:
```
polar clean && polar compile 
```

Deploy the contract to default specified network:
```
polar deploy
```

Run integration tests against contracts
```
polar tests
```
