@echo off

CD C:/code/coinflip/coinflip

FOR /F "tokens=*" %%g IN ('flow scripts execute ./cadence/scripts/get_collection_length.cdc 0x9582fcd59741438c --network=testnet -o inline') do (SET VAR=%%g)
SET /A VAR_NUM=%VAR%

echo %VAR_NUM%

if %VAR_NUM% GTR 0 (
	echo "coincount is GREATER THAN 0"
	flow transactions send ./cadence/transactions/flip_coins.cdc --network=testnet --signer=testnet-account
) else (
	echo "coincount is 0"
)