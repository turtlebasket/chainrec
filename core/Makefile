SHELL = /bin/bash
.DEFAULT_GOAL := polar

# NOTE: Use remote node instead

# node:
# 	sudo docker run -it --rm -p 26657:26657 -p 26656:26656 -p 1317:1317 --name secretdev ghcr.io/scrtlabs/localsecret:latest

# node-speedup:
# 	@echo NOTE: node must be running for this to take effect.
# 	sudo docker exec secretdev perl -i -pe 's/^timeout_propose =.*/timeout_propose = "120ms"/' .secretd/config/config.toml
# 	sudo docker exec secretdev perl -i -pe 's/^timeout_propose_delta =.*/timeout_propose_delta = "20ms"/' .secretd/config/config.toml
# 	sudo docker exec secretdev perl -i -pe 's/^timeout_prevote =.*/timeout_prevote = "40ms"/' .secretd/config/config.toml
# 	sudo docker exec secretdev perl -i -pe 's/^timeout_prevote_delta =.*/timeout_prevote_delta = "20ms"/' .secretd/config/config.toml
# 	sudo docker exec secretdev perl -i -pe 's/^timeout_precommit_delta =.*/timeout_precommit_delta = "20ms"/' .secretd/config/config.toml
# 	sudo docker exec secretdev perl -i -pe 's/^timeout_commit =.*/timeout_commit = "200ms"/' .secretd/config/config.toml

# restart:
# 	sudo systemctl restart docker

# fund:
# 	sudo docker exec -it secretdev secretd tx bank send a secret1l0g5czqw7vjvd20ezlk4x7ndgyn0rx5aumr8gk 100000000000000000uscrt -y
# 	sudo docker exec -it secretdev secretd tx bank send b secret1ddfphwwzqtkp8uhcsc53xdu24y9gks2kug45zv 100000000000000000uscrt -y

compile:
	npx polar compile

polar:
	npx polar clean && npx polar compile && npx polar test

polar-test:
	npx polar test

deploy: 
	npx polar run scripts/deploy.js

clean:
	npx polar clean

find-float:
	@wasm2wat ./target/wasm32-unknown-unknown/release/polymer_vault.wasm | grep -B 20 -P 'f(64|32)' > find_floats_grep.txt
